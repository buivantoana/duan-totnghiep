import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import productVariantService from '../../../services/product_variant'; // Giả sử dịch vụ này dùng để thao tác với ProductVariant
import colorService from '../../../services/color'; // Dịch vụ lấy danh sách màu sắc từ API
import sizeService from '../../../services/size'; // Dịch vụ lấy danh sách size từ API
import productService, { getAllProductAdmin, getAllProducts } from '../../../services/userService'; // Giả sử dịch vụ này dùng để thao tác với Product
import { uploadImage } from '../../../services/upload';
import { JSON } from 'persist/lib/type';
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
        imageUrls: [],
        hexCode: '#000000',

    });
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchColorsAndSizes = async () => {
            const colorRes = await colorService.getAllColor();
            const sizeRes = await sizeService.getAllSizes();
            setColors(colorRes);
            setSizes(sizeRes);
        };

        const fetchProducts = async () => {
            const productRes = await getAllProducts();
            if (productRes.errCode == 0) {
                setProducts(productRes.data);
            }
        };

        if (id) {
            let fetchDetailVariant = async () => {
                setIsActionADD(false);
                let variantData = await productVariantService.getDetailProductVariant(id);
                if (variantData) {
                    setInputValues({
                        productId: variantData.productId,
                        colorId: variantData.colorId,
                        sizeId: variantData.sizeId,
                        stock: variantData.stock,
                        price: variantData.price,
                        imageUrls: variantData.imageUrls,
                        hexCode: variantData.hexCode,
                    });
                }
            };
            fetchDetailVariant();
        }

        fetchColorsAndSizes(); // Lấy danh sách màu sắc và size
        fetchProducts(); // Lấy danh sách sản phẩm
    }, [id]);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + inputValues.imageUrls.length <= 5) {
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

    const uploadImages = async () => {
        const uploadedUrls = [];
        for (let i = 0; i < inputValues.imageUrls.length; i++) {
            const file = inputValues.imageUrls[i];
            const formData = new FormData();
            formData.append("image", file);
            try {
                const uploadRes = await uploadImage(formData); // Upload ảnh và nhận URL
                if (uploadRes?.url) {
                    uploadedUrls.push(uploadRes.url); // Thêm URL vào mảng
                }
            } catch (error) {
                toast.error("Lỗi khi tải ảnh lên");
                return [];
            }
        }
        return uploadedUrls;
    };
    const handleSaveVariant = async () => {
        setLoading(true)
        let data = {
            productId: inputValues.productId,
            colorId: inputValues.colorId,
            sizeId: inputValues.sizeId,
            stock: inputValues.stock,
            price: 0,
            hexCode: inputValues.hexCode,
        }
        let res;
        if (!id) {
            const uploadedUrls = await uploadImages();
            if (uploadedUrls.length == inputValues.imageUrls.length) {
                data['imageUrl'] = uploadedUrls.reduce((acc, item, index) => {
                    acc += `"${item}"`;
                    if (index < uploadedUrls.length - 1) acc += ', '; // Thêm dấu phẩy giữa các phần tử
                    return acc;
                }, '[') + ']'




                if (isActionADD) {
                    res = await productVariantService.createProductVariant(data);
                    if (res && res.code == 200) {
                        toast.success("Thêm biến thể sản phẩm thành công");
                    } else {
                        toast.error(res.message);
                    }
                }
            }

        } else {
            data['imageUrl'] = inputValues.imageUrls
            res = await productVariantService.updateProductVariant(id, data);
            if (res && res.code === 200) {
                toast.success("Cập nhật biến thể sản phẩm thành công");
            } else {
                toast.error(res.message);
            }
        }
        setLoading(false)
    };

    return (
        <>
            {loading && <Loading />}

            <div className="container-fluid px-4">
                <h1 className="mt-4">Quản lý Biến Thể Sản Phẩm</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-boxes me-1" />
                        {isActionADD === true ? 'Thêm mới Biến Thể Sản Phẩm' : 'Cập nhật thông tin Biến Thể Sản Phẩm'}
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
                                                <option key={color.id} value={color.id} >
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
                                {!id &&
                                    <>
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
                                                            src={URL.createObjectURL(image)}
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

                                    </>}
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
