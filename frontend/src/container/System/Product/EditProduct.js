import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';
import './AddProduct.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { getDetailProductByIdService, UpdateProductService } from '../../../services/userService';
import { uploadImage } from '../../../services/upload';
import Loading from '../../../component/Loading';

const EditProduct = () => {
    const mdParser = new MarkdownIt();
    const { id } = useParams();
    const { data: dataBrand } = useFetchAllcode('BRAND');
    const { data: dataCategory } = useFetchAllcode('CATEGORY');
    const [loading, setLoading] = useState(false);
    const [inputValues, setInputValues] = useState({
        brandId: '',
        categoryId: '',
        name: '',
        contentHTML: '',
        contentMarkdown: '',
        originalPrice: '',
        discountPrice: '',
        image: '', // Lưu URL hoặc File object
        imageReview: '', // URL để hiển thị ảnh
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let res = await getDetailProductByIdService(id);
                if (res && res.errCode === 0) {
                    setStateProduct(res.data);
                }
            } catch (error) {
                toast.error("Lỗi khi tải thông tin sản phẩm");
            }
        };
        fetchProduct();
    }, [id]);

    const setStateProduct = (data) => {
        setInputValues({
            ...inputValues,
            brandId: data.brandId,
            categoryId: data.categoryId,
            name: data.name,
            contentMarkdown: data.contentMarkdown,
            contentHTML: data.contentHTML,
            originalPrice: data.originalPrice,
            discountPrice: data.discountPrice,
            image: data.image, // Lưu URL ảnh hiện tại
            imageReview: data.image, // Hiển thị ảnh hiện tại
        });
    };

    const handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file?.size > 31312281) {
            toast.error("Dung lượng file phải nhỏ hơn 30MB");
        } else if (file) {
            let objectUrl = URL.createObjectURL(file);
            setInputValues({
                ...inputValues,
                image: file, // Lưu File object
                imageReview: objectUrl, // Hiển thị ảnh mới
            });
        }
    };

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const validateInputs = () => {
        const { name, brandId, categoryId, originalPrice, discountPrice, contentMarkdown } = inputValues;

        if (!name || !brandId || !categoryId || !originalPrice || !discountPrice || !contentMarkdown) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return false;
        }

        if (Number(originalPrice) < 0 || Number(discountPrice) < 0) {
            toast.error("Giá gốc và giá khuyến mãi không được là số âm!");
            return false;
        }

        if (!inputValues.image) {
            toast.error("Vui lòng chọn hình ảnh sản phẩm!");
            return false;
        }

        return true;
    };

    const handleSaveProduct = async () => {
        if (!validateInputs()) return;
        setLoading(true);

        let imageUrl = inputValues.image;
        // Nếu image là File object, tải lên server
        if (typeof inputValues.image !== 'string') {
            const formData = new FormData();
            formData.append("image", inputValues.image);
            try {
                const uploadRes = await uploadImage(formData);
                if (uploadRes?.url) {
                    imageUrl = uploadRes.url; // Lấy URL từ server
                } else {
                    toast.error("Lỗi khi tải ảnh lên");
                    setLoading(false);
                    return;
                }
            } catch (error) {
                toast.error("Lỗi khi tải ảnh lên");
                setLoading(false);
                return;
            }
        }

        try {
            let res = await UpdateProductService({
                name: inputValues.name,
                originalPrice: inputValues.originalPrice,
                discountPrice: inputValues.discountPrice,
                brandId: inputValues.brandId,
                categoryId: inputValues.categoryId,
                contentHTML: inputValues.contentHTML,
                contentMarkdown: inputValues.contentMarkdown,
                image: imageUrl, // Gửi URL ảnh
                id: id,
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                toast.error(res?.errMessage || "Lỗi khi cập nhật sản phẩm");
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật sản phẩm");
        }
        setLoading(false);
    };

    const handleEditorChange = ({ html, text }) => {
        setInputValues({
            ...inputValues,
            contentMarkdown: text,
            contentHTML: html,
        });
    };

    return (
        <>
            {loading && <Loading />}

            <div className="container-fluid px-4">
                <h1 className="mt-4">Quản lý sản phẩm</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Cập nhật sản phẩm
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputEmail4">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        value={inputValues.name}
                                        name="name"
                                        onChange={handleOnChange}
                                        className="form-control"
                                        id="inputEmail4"
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputEmail4">Giá gốc</label>
                                    <input
                                        type="number"
                                        value={inputValues.originalPrice}
                                        name="originalPrice"
                                        onChange={handleOnChange}
                                        className="form-control"
                                        id="inputEmail4"
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputPassword4">Giá khuyến mãi</label>
                                    <input
                                        type="number"
                                        value={inputValues.discountPrice}
                                        name="discountPrice"
                                        onChange={handleOnChange}
                                        className="form-control"
                                        id="inputPassword4"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail4">Danh mục sản phẩm</label>
                                    <select
                                        value={inputValues.categoryId}
                                        name="categoryId"
                                        onChange={handleOnChange}
                                        id="inputState"
                                        className="form-control"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {dataCategory && dataCategory.length > 0 &&
                                            dataCategory.map((item, index) => (
                                                <option key={index} value={item.code}>
                                                    {item.value}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputPassword4">Nhãn hàng</label>
                                    <select
                                        value={inputValues.brandId}
                                        name="brandId"
                                        onChange={handleOnChange}
                                        id="inputState"
                                        className="form-control"
                                    >
                                        <option value="">Chọn nhãn hàng</option>
                                        {dataBrand && dataBrand.length > 0 &&
                                            dataBrand.map((item, index) => (
                                                <option key={index} value={item.code}>
                                                    {item.value}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group col-md-4">
                                <label htmlFor="previewImg">Chọn hình ảnh</label>
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
                                        backgroundColor: "#eee",
                                        borderRadius: "5px",
                                        padding: "6px",
                                        cursor: "pointer",
                                    }}
                                    className="label-upload"
                                    htmlFor="previewImg"
                                >
                                    Tải ảnh <i className="fas fa-upload"></i>
                                </label>
                                {inputValues.imageReview && (
                                    <div
                                        style={{
                                            backgroundImage: `url(${inputValues.imageReview})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '150px',
                                            height: '150px',
                                            marginTop: '10px',
                                        }}
                                        className="box-image"
                                    ></div>
                                )}
                            </div>

                            <div className="form-group" style={{ marginTop: "10px" }}>
                                <label htmlFor="inputAddress" style={{ marginTop: "-20px" }}>
                                    Mô tả sản phẩm
                                </label>
                                <MdEditor
                                    style={{ height: "400px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={handleEditorChange}
                                    value={inputValues.contentMarkdown}
                                />
                            </div>

                            <button
                                onClick={handleSaveProduct}
                                type="button"
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

export default EditProduct;