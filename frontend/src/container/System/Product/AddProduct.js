import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Lightbox from 'react-image-lightbox';
import 'react-toastify/dist/ReactToastify.css';
import 'react-markdown-editor-lite/lib/index.css';
import 'react-image-lightbox/style.css';
import './AddProduct.scss';
import Loading from '../../../component/Loading';
import { useFetchAllcode } from '../../customize/fetch';
import CommonUtils from '../../../utils/CommonUtils';
import { CreateNewProduct, getAllProducts } from '../../../services/userService';
import { uploadImage } from '../../../services/upload';
import productVariantService from '../../../services/product_variant';
import colorService from '../../../services/color';
import sizeService from '../../../services/size';

const AddProduct = () => {
  const mdParser = new MarkdownIt();
  const { id } = useParams();
  const { data: dataBrand } = useFetchAllcode('BRAND');
  const { data: dataCategory } = useFetchAllcode('CATEGORY');
  const [isActionADD, setIsActionADD] = useState(true);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [products, setProducts] = useState([]);

  const [inputValues, setInputValues] = useState({
    brandId: '',
    categoryId: '',
    name: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    image: '',
    imageReview: '',
    isOpen: false,
    contentMarkdown: '',
    contentHTML: '',
  });

  const [variants, setVariants] = useState([
    {
      colorId: '',
      sizeId: '',
      stock: '',
      imageUrls: [],
      hexCode: '#000000',
    },
  ]);

  // Initialize brandId and categoryId
  useEffect(() => {
    if (
      dataBrand &&
      dataBrand.length > 0 &&
      inputValues.brandId === '' &&
      dataCategory &&
      dataCategory.length > 0 &&
      inputValues.categoryId === ''
    ) {
      setInputValues({
        ...inputValues,
        brandId: dataBrand[0].code,
        categoryId: dataCategory[0].code,
      });
    }
  }, [dataBrand, dataCategory]);

  // Fetch colors, sizes, products, and product details (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch colors and sizes
        const colorRes = await colorService.getAllColor(true);
        const sizeRes = await sizeService.getAllSizes(true);
        setColors(colorRes);
        setSizes(sizeRes);

        // Fetch products
        const productRes = await getAllProducts();
        if (productRes.errCode === 0) {
          setProducts(productRes.data);
        }

        // Fetch product and variants if editing
        if (id) {
          setIsActionADD(false);
          // Mock service to fetch product details (replace with actual service)
          const productRes = await getAllProducts(); // Adjust to fetch single product by ID
          const product = productRes.data.find((p) => p.id === id);
          if (product) {
            setInputValues({
              brandId: product.brandId,
              categoryId: product.categoryId,
              name: product.name,
              description: product.description,
              originalPrice: product.originalPrice,
              discountPrice: product.discountPrice,
              image: product.image,
              imageReview: product.image,
              isOpen: false,
              contentMarkdown: product.contentMarkdown,
              contentHTML: product.contentHTML,
            });
          }

          // Fetch variants
          const variantRes = await productVariantService.getProductVariantsByProductId(id);
          if (variantRes && variantRes.length > 0) {
            setVariants(
              variantRes.map((v) => ({
                id: v.id,
                colorId: v.colorId,
                sizeId: v.sizeId,
                stock: v.stock,
                imageUrls: JSON.parse(v.imageUrl) || [],
                hexCode: v.hexCode,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu!');
      }
    };
    fetchData();
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file?.size > 31312281) {
      toast.error('Dung lượng file bé hơn 30mb');
    } else {
      let objectUrl = URL.createObjectURL(file);
      setInputValues({
        ...inputValues,
        image: file,
        imageReview: objectUrl,
      });
    }
  };

  const openPreviewImage = () => {
    if (!inputValues.imageReview) return;
    setInputValues({ ...inputValues, isOpen: true });
  };

  const handleEditorChange = ({ html, text }) => {
    setInputValues({
      ...inputValues,
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;

    // Check for duplicates when colorId or sizeId changes
    if (field === 'colorId' || field === 'sizeId') {
      const { colorId, sizeId } = updatedVariants[index];
      if (colorId && sizeId) {
        const isDuplicate = variants.some(
          (v, i) =>
            i !== index &&
            v.colorId === colorId &&
            v.sizeId === sizeId
        );
        if (isDuplicate) {
          toast.error('Biến thể với màu và size này đã tồn tại!');
          return; // Prevent updating state
        }
      }
    }

    setVariants(updatedVariants);
  };
  const handleVariantImageChange = (index, event) => {
    const files = Array.from(event.target.files);
    const totalImages = files.length + variants[index].imageUrls.length;
    if (totalImages <= 5) {
      const updatedVariants = [...variants];
      updatedVariants[index].imageUrls = [...updatedVariants[index].imageUrls, ...files];
      setVariants(updatedVariants);
    } else {
      toast.error('Bạn chỉ có thể tải tối đa 5 ảnh cho mỗi biến thể.');
    }
  };

  const handleRemoveVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].imageUrls = updatedVariants[variantIndex].imageUrls.filter(
      (_, idx) => idx !== imageIndex
    );
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        colorId: '',
        sizeId: '',
        stock: '',
        imageUrls: [],
        hexCode: '#000000',
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      toast.error('Phải có ít nhất một biến thể!');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const validateProductInputs = () => {
    const {
      name,
      description,
      brandId,
      categoryId,
      originalPrice,
      discountPrice,
      image,
      contentMarkdown,
    } = inputValues;

    if (
      !name ||
      !description ||
      !brandId ||
      !categoryId ||
      !originalPrice ||
      !discountPrice ||
      !image ||
      !contentMarkdown
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm bắt buộc!');
      return false;
    }

    if (Number(originalPrice) < 0 || Number(discountPrice) < 0) {
      toast.error('Giá gốc và giá khuyến mãi không được là số âm!');
      return false;
    }

    return true;
  };

  const validateVariantInputs = () => {
    for (let i = 0; i < variants.length; i++) {
      const { colorId, sizeId, stock } = variants[i];
      if (!colorId) {
        toast.error(`Vui lòng chọn màu sắc cho biến thể ${i + 1}.`);
        return false;
      }
      if (!sizeId) {
        toast.error(`Vui lòng chọn size cho biến thể ${i + 1}.`);
        return false;
      }
      if (stock === '' || isNaN(stock)) {
        toast.error(`Vui lòng nhập số lượng cho biến thể ${i + 1}.`);
        return false;
      }
      if (parseInt(stock) < 0) {
        toast.error(`Số lượng không được âm cho biến thể ${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const uploadImages = async (files) => {
    const uploadedUrls = [];
    for (let file of files) {
      if (typeof file === 'string') {
        uploadedUrls.push(file); // Keep existing URLs
        continue;
      }
      const formData = new FormData();
      formData.append('image', file);
      try {
        const uploadRes = await uploadImage(formData);
        if (uploadRes?.url) {
          uploadedUrls.push(uploadRes.url);
        }
      } catch (error) {
        toast.error('Lỗi khi tải ảnh lên');
        return null;
      }
    }
    return uploadedUrls;
  };

  const handleSaveProduct = async () => {
    if (!validateProductInputs() || !validateVariantInputs()) {
      return;
    }

    setLoading(true);
    try {
      let productId = id;
      let productImageUrl = inputValues.image;

      // Upload product image if it's a file
      if (typeof inputValues.image !== 'string') {
        const formData = new FormData();
        formData.append('image', inputValues.image);
        const upload = await uploadImage(formData);
        if (!upload.url) {
          toast.error('Lỗi khi tải ảnh sản phẩm!');
          setLoading(false);
          return;
        }
        productImageUrl = upload.url;
      }

      // Create or update product
      if (isActionADD) {
        const res = await CreateNewProduct({
          name: inputValues.name,
          description: inputValues.description,
          categoryId: inputValues.categoryId,
          brandId: inputValues.brandId,
          originalPrice: inputValues.originalPrice,
          discountPrice: inputValues.discountPrice,
          image: productImageUrl,
          contentHTML: inputValues.contentHTML,
          contentMarkdown: inputValues.contentMarkdown,
        });

        if (res && res.errCode === 0) {
          productId = res.id; // Assume CreateNewProduct returns the new product ID
          toast.success('Tạo mới sản phẩm thành công!');
        } else {
          toast.error(res?.errMessage || 'Tạo sản phẩm thất bại!');
          setLoading(false);
          return;
        }
      } else {
        // Update product (mock service, replace with actual update service)
        const res = await CreateNewProduct({
          id,
          name: inputValues.name,
          description: inputValues.description,
          categoryId: inputValues.categoryId,
          brandId: inputValues.brandId,
          originalPrice: inputValues.originalPrice,
          discountPrice: inputValues.discountPrice,
          image: productImageUrl,
          contentHTML: inputValues.contentHTML,
          contentMarkdown: inputValues.contentMarkdown,
        });
        if (res && res.errCode === 0) {
          toast.success('Cập nhật sản phẩm thành công!');
        } else {
          toast.error(res?.errMessage || 'Cập nhật sản phẩm thất bại!');
          setLoading(false);
          return;
        }
      }

      // Handle variants
      for (let variant of variants) {
        const uploadedUrls = await uploadImages(variant.imageUrls);
        if (!uploadedUrls || uploadedUrls.length !== variant.imageUrls.length) {
          toast.error('Lỗi khi tải ảnh biến thể!');
          setLoading(false);
          return;
        }

        const variantData = {
          productId,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          stock: variant.stock,
          price: 0, // As per original AddProductVariant
          hexCode: variant.hexCode,
          imageUrl: JSON.stringify(uploadedUrls),
        };

        let res;
        if (variant.id) {
          // Update existing variant
          res = await productVariantService.updateProductVariant(variant.id, variantData);
        } else {
          // Create new variant
          res = await productVariantService.createProductVariant(variantData);
        }

        if (res && res.code === 200) {
          toast.success(`Lưu biến thể ${variant.colorId}-${variant.sizeId} thành công!`);
        } else {
          toast.error(res?.message || 'Lưu biến thể thất bại!');
        }
      }

      // Reset form on add
      if (isActionADD) {
        setInputValues({
          brandId: dataBrand[0]?.code || '',
          categoryId: dataCategory[0]?.code || '',
          name: '',
          description: '',
          originalPrice: '',
          discountPrice: '',
          image: '',
          imageReview: '',
          isOpen: false,
          contentMarkdown: '',
          contentHTML: '',
        });
        setVariants([
          {
            colorId: '',
            sizeId: '',
            stock: '',
            imageUrls: [],
            hexCode: '#000000',
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="container-fluid px-4">
        <h1 className="mt-4">Quản lý sản phẩm</h1>

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1" />
            {isActionADD ? 'Thêm mới sản phẩm' : 'Cập nhật sản phẩm'}
          </div>
          <div className="card-body">
            <form>
              <h3>Thông tin sản phẩm</h3>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="name">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={inputValues.name}
                    name="name"
                    onChange={handleOnChange}
                    className="form-control"
                    id="name"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="categoryId">Danh mục sản phẩm</label>
                  <select
                    value={inputValues.categoryId}
                    name="categoryId"
                    onChange={handleOnChange}
                    id="categoryId"
                    className="form-control"
                  >
                    {dataCategory &&
                      dataCategory.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="brandId">Nhãn hàng</label>
                  <select
                    value={inputValues.brandId}
                    name="brandId"
                    onChange={handleOnChange}
                    id="brandId"
                    className="form-control"
                  >
                    {dataBrand &&
                      dataBrand.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="originalPrice">Giá gốc</label>
                  <input
                    type="number"
                    value={inputValues.originalPrice}
                    name="originalPrice"
                    onChange={handleOnChange}
                    className="form-control"
                    id="originalPrice"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="discountPrice">Giá khuyến mãi</label>
                  <input
                    type="number"
                    value={inputValues.discountPrice}
                    name="discountPrice"
                    onChange={handleOnChange}
                    className="form-control"
                    id="discountPrice"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description" >Mô tả chi tiết</label>
                <textarea
                  rows="4"
                  value={inputValues.description}
                  name="description"
                  onChange={handleOnChange}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="image">Chọn hình ảnh</label>
                  <input
                    type="file"
                    id="previewImg"
                    accept=".jpg,.png"
                    hidden
                    onChange={handleOnChangeImage}
                  />
                  <br />
                  <label
                    style={{
                      backgroundColor: '#eee',
                      borderRadius: '5px',
                      padding: '6px',
                      cursor: 'pointer',
                    }}
                    className="label-upload"
                    htmlFor="previewImg"
                  >
                    Tải ảnh <i className="fas fa-upload"></i>
                  </label>
                  <div
                    style={{
                      backgroundImage: `url(${inputValues.imageReview})`,
                    }}
                    onClick={openPreviewImage}
                    className="box-image"
                  ></div>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label htmlFor="contentMarkdown" style={{marginTop:"-10px"}}>Mô tả sản phẩm</label>
                <MdEditor
                  style={{ height: '400px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  value={inputValues.contentMarkdown}
                />
              </div>

              <h3>Biến thể sản phẩm</h3>
              {variants.map((variant, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor={`colorId-${index}`}>Màu sắc</label>
                        <select
                          value={variant.colorId}
                          onChange={(e) => handleVariantChange(index, 'colorId', e.target.value)}
                          className="form-control"
                          id={`colorId-${index}`}
                        >
                          <option value="">Chọn màu</option>
                          {colors &&
                            colors.map((color) => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor={`sizeId-${index}`}>Size</label>
                        <select
                          value={variant.sizeId}
                          onChange={(e) => handleVariantChange(index, 'sizeId', e.target.value)}
                          className="form-control"
                          id={`sizeId-${index}`}
                        >
                          <option value="">Chọn size</option>
                          {sizes &&
                            sizes.map((size) => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor={`stock-${index}`}>Số lượng</label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          className="form-control"
                          id={`stock-${index}`}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor={`imageUrls-${index}`}>Ảnh biến thể</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleVariantImageChange(index, e)}
                          className="form-control"
                          id={`imageUrls-${index}`}
                        />
                        <small>Tải lên tối đa 5 ảnh</small>
                      </div>
                      <div className="form-group col-md-12">
                        <div className="d-flex flex-wrap">
                          {variant.imageUrls.map((image, imgIndex) => (
                            <div key={imgIndex} className="position-relative me-3 mb-3">
                              <img
                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                alt={`variant-image-${imgIndex}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover',borderRadius:"5px" }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => handleRemoveVariantImage(index, imgIndex)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger mr-3"
                      onClick={() => removeVariant(index)}
                    >
                      Xóa biến thể
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addVariant}
                    >
                      Thêm biến thể
                    </button>
                  </div>
                </div>
              ))}

              <br />
              <button
                type="button"
                onClick={handleSaveProduct}
                className="btn btn-primary"
              >
                Lưu thông tin
              </button>
            </form>
          </div>
        </div>
        {inputValues.isOpen && (
          <Lightbox
            mainSrc={inputValues.imageReview}
            onCloseRequest={() => setInputValues({ ...inputValues, isOpen: false })}
          />
        )}
      </div>
    </>
  );
};

export default AddProduct;