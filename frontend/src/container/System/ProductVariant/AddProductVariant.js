import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import productVariantService from '../../../services/product_variant';
import colorService from '../../../services/color';
import sizeService from '../../../services/size';
import { getAllProducts } from '../../../services/userService';
import { uploadImage } from '../../../services/upload';
import Loading from '../../../component/Loading';

const AddProductVariant = () => {
    const [isActionADD, setIsActionADD] = useState(true);
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        productId: '',
        colorId: '',
        sizeId: '',
        stock: '',
        price: '',
        imageUrls: [], // Will store both URLs (for existing images) and File objects (for new images)
        hexCode: '#000000',
    });
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchColorsAndSizes = async () => {
            const colorRes = await colorService.getAllColor(true);
            const sizeRes = await sizeService.getAllSizes(true);
            setColors(colorRes);
            setSizes(sizeRes);
        };

        const fetchProducts = async () => {
            const productRes = await getAllProducts();
            if (productRes.errCode === 0) {
                setProducts(productRes.data);
            }
        };

        if (id) {
            let fetchDetailVariant = async () => {
                setIsActionADD(false);
                let variantData = await productVariantService.getDetailProductVariant(id);
                if (variantData) {
                    // Parse imageUrl string to array if it's a JSON string
                    let images = [];
                    try {
                        images = JSON.parse(variantData.imageUrl) || [];
                    } catch (e) {
                        images = variantData.imageUrl || [];
                    }
                    setInputValues({
                        productId: variantData.productId,
                        colorId: variantData.colorId,
                        sizeId: variantData.sizeId,
                        stock: variantData.stock,
                        price: variantData.price,
                        imageUrls: images, // Store URLs as strings
                        hexCode: variantData.hexCode,
                    });
                }
            };
            fetchDetailVariant();
        }

        fetchColorsAndSizes();
        fetchProducts();
    }, [id]);

    const validateForm = () => {
        const { productId, colorId, sizeId, stock } = inputValues;

        if (!productId) {
            toast.error("Vui lòng chọn sản phẩm.");
            return false;
        }
        if (!colorId) {
            toast.error("Vui lòng chọn màu sắc.");
            return false;
        }
        if (!sizeId) {
            toast.error("Vui lòng chọn size.");
            return false;
        }

        if (stock === '' || isNaN(stock)) {
            toast.error("Vui lòng nhập số lượng.");
            return false;
        }

        if (parseInt(stock) < 0) {
            toast.error("Số lượng không được âm.");
            return false;
        }

        return true;
    };

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const totalImages = files.length + inputValues.imageUrls.length;
        if (totalImages <= 5) {
            setInputValues({
                ...inputValues,
                imageUrls: [...inputValues.imageUrls, ...files],
            });
        } else {
            toast.error("Bạn chỉ có thể tải tối đa 5 ảnh.");
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = inputValues.imageUrls.filter((_, idx) => idx !== index);
        setInputValues({ ...inputValues, imageUrls: updatedImages });
    };

    const handleColorChange = (event) => {
        setInputValues({ ...inputValues, colorId: event.target.value });
    };

    const handleSizeChange = (event) => {
        setInputValues({ ...inputValues, sizeId: event.target.value });
    };

    const handleProductChange = (event) => {
        setInputValues({ ...inputValues, productId: event.target.value });
    };

    const uploadImages = async (files) => {
        const uploadedUrls = [];
        for (let file of files) {
            if (typeof file === 'string') {
                uploadedUrls.push(file); // Keep existing URLs
                continue;
            }
            const formData = new FormData();
            formData.append("image", file);
            try {
                const uploadRes = await uploadImage(formData);
                if (uploadRes?.url) {
                    uploadedUrls.push(uploadRes.url);
                }
            } catch (error) {
                toast.error("Lỗi khi tải ảnh lên");
                return null;
            }
        }
        return uploadedUrls;
    };

    const handleSaveVariant = async () => {
        if (!validateForm()) {
            setLoading(false);
            return;
        }
        setLoading(true);
        let data = {
            productId: inputValues.productId,
            colorId: inputValues.colorId,
            sizeId: inputValues.sizeId,
            stock: inputValues.stock,
            price: 0,
            hexCode: inputValues.hexCode,
        };

        let res;
        if (isActionADD) {
            // Add new variant
            const uploadedUrls = await uploadImages(inputValues.imageUrls);
            if (uploadedUrls && uploadedUrls.length === inputValues.imageUrls.length) {
                data['imageUrl'] = JSON.stringify(uploadedUrls);
                res = await productVariantService.createProductVariant(data);
                if (res && res.code === 200) {
                    toast.success("Thêm biến thể sản phẩm thành công");
                } else {
                    toast.error(res.message);
                }
            } else {
                toast.error("Lỗi khi tải ảnh lên");
            }
        } else {
            // Update existing variant
            const uploadedUrls = await uploadImages(inputValues.imageUrls);
            if (uploadedUrls) {
                data['imageUrl'] = JSON.stringify(uploadedUrls);
                res = await productVariantService.updateProductVariant(id, data);
                if (res && res.code === 200) {
                    toast.success("Cập nhật biến thể sản phẩm thành công");
                } else {
                    toast.error(res.message);
                }
            } else {
                toast.error("Lỗi khi tải ảnh lên");
            }
        }
        setLoading(false);
    };

    return (
        <>
            {loading && <Loading />}

            <div className="container-fluid px-4">
                <h1 className="mt-4">Quản lý Biến Thể Sản Phẩm</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-boxes me-1" />
                        {isActionADD ? 'Thêm mới Biến Thể Sản Phẩm' : 'Cập nhật thông tin Biến Thể Sản Phẩm'}
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="productId">Sản Phẩm</label>
                                    <select
                                        value={inputValues.productId}
                                        name="productId"
                                        onChange={handleProductChange}
                                        className="form-control"
                                        id="productId"
                                    >
                                        <option value="">Chọn sản phẩm</option>
                                        {products && products.length > 0 &&
                                            products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="colorId">Màu Sắc</label>
                                    <select
                                        value={inputValues.colorId}
                                        name="colorId"
                                        onChange={handleColorChange}
                                        className="form-control"
                                        id="colorId"
                                    >
                                        <option value="">Chọn màu</option>
                                        {colors && colors.length > 0 &&
                                            colors.map((color) => (
                                                <option key={color.id} value={color.id}>
                                                    {color.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="sizeId">Size</label>
                                    <select
                                        value={inputValues.sizeId}
                                        name="sizeId"
                                        onChange={handleSizeChange}
                                        className="form-control"
                                        id="sizeId"
                                    >
                                        <option value="">Chọn size</option>
                                        {sizes && sizes.length > 0 &&
                                            sizes.map((size) => (
                                                <option key={size.id} value={size.id}>
                                                    {size.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="stock">Số Lượng</label>
                                    <input
                                        type="number"
                                        value={inputValues.stock}
                                        name="stock"
                                        onChange={handleOnChange}
                                        className="form-control"
                                        id="stock"
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="imageUrls">Ảnh Sản Phẩm</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-control"
                                        id="imageUrls"
                                    />
                                    <small>Tải lên tối đa 5 ảnh</small>
                                </div>

                                <div className="form-group col-md-12">
                                    <label>Ảnh Đã Tải Lên</label>
                                    <div className="d-flex flex-wrap">
                                        {inputValues.imageUrls.map((image, index) => (
                                            <div key={index} className="position-relative me-3 mb-3">
                                                <img
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                    alt={`image-${index}`}
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    onClick={() => handleRemoveImage(index)}
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
                                onClick={handleSaveVariant}
                                className="btn btn-primary"
                            >
                                Lưu thông tin
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProductVariant;