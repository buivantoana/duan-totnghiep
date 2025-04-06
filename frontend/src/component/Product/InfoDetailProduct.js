import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addItemCartStart } from '../../action/ShopCartAction';
import './InfoDetailProduct.scss';
import CommonUtils from '../../utils/CommonUtils';
import Slider from 'react-slick';

function InfoDetailProduct(props) {
    const { dataProduct } = props;
    const dispatch = useDispatch();

    // State
    const [selectedSize, setSelectedSize] = useState(dataProduct.variants[0].size);
    const [selectedVariant, setSelectedVariant] = useState(dataProduct.variants[0]);
    const [quantityProduct, setQuantityProduct] = useState(1);
    const [activeImage, setActiveImage] = useState(
        JSON.parse(dataProduct.variants[0].imageUrl)[0] || dataProduct.image
    );

    // Lấy danh sách màu theo size đang chọn (lọc trùng)
    const colorsForSelectedSize = Array.from(
        new Map(
            dataProduct.variants
                .filter(variant => variant.size.id === selectedSize.id)
                .map(variant => [variant.color.id, variant.color]) // key: color.id -> loại bỏ trùng
        ).values()
    );

    // Hàm xử lý khi chọn size
    const handleSizeChange = (e) => {
        const selectedSizeName = e.target.value;
        const foundVariant = dataProduct.variants.find(variant => variant.size.name === selectedSizeName);
        if (foundVariant) {
            setSelectedSize(foundVariant.size);
            setSelectedVariant(foundVariant);
            const images = JSON.parse(foundVariant.imageUrl);
            setActiveImage(images.length > 0 ? images[0] : dataProduct.image);
        }
    };

    // Hàm xử lý khi chọn màu
    const handleColorChange = (colorId) => {
        const matchedVariant = dataProduct.variants.find(
            v => v.size.id === selectedSize.id && v.color.id === colorId
        );
        if (matchedVariant) {
            setSelectedVariant(matchedVariant);
            const images = JSON.parse(matchedVariant.imageUrl);
            setActiveImage(images.length > 0 ? images[0] : dataProduct.image);
        }
    };

    const handleQuantityChange = (e) => {
        setQuantityProduct(e.target.value);
    };

    const handleAddShopCart = () => {
        if (selectedVariant.stock < quantityProduct) {
            toast.warning("Bạn đã đặt quá số lượng hàng trong kho")
            return
        }
        if (props.userId) {
            dispatch(addItemCartStart({
                userId: props.userId,
                productdetailsizeId: selectedSize.name,
                productdetailcolor: selectedVariant.color.hexCode,
                quantity: quantityProduct,
                productId: dataProduct.id
            }));
            toast.success("Bạn đã đặt hàng thành công");
        } else {
            toast.error("Đăng nhập để thêm vào giỏ hàng");
        }
    };

    const settings = {
        customPaging: function (i) {
            return (
                <a>
                    <img
                        src={JSON.parse(selectedVariant.imageUrl)[i] || dataProduct.image}
                        alt={`Thumbnail ${i + 1}`}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: "5px" }}
                    />
                </a>
            );
        },
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <div className="row s_product_inner">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="product-main-image" style={{ width: "80%", height: '500px', marginTop: "-50px" }}>
                            <Slider {...settings}>
                                {JSON.parse(selectedVariant.imageUrl).map((image, index) => (
                                    <div key={index} style={{ borderRadius: "10px", overflow: "hidden" }}>
                                        <img
                                            src={image}
                                            className="d-block w-100"
                                            alt="Product"
                                            style={{ height: '500px', objectFit: 'cover', borderRadius: "10px" }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                    <div className="col-md-6" style={{ height: "500px" }}>
                        <h2>{dataProduct.name}</h2>
                        <p className="text-muted">{dataProduct.categoryData.value}</p>
                        <p className="text-muted">Brand: {dataProduct.brandData.value}</p>
                        <p>{dataProduct.description}</p>
                        <div className="price">
                            <h6 style={{ color: "red", textDecoration: "line-through" }}>
                                Giá gốc : {CommonUtils.formatter.format(dataProduct.originalPrice)}
                            </h6>
                            <h6>
                                Giá khuyến mãi : {CommonUtils.formatter.format(dataProduct.discountPrice)}
                            </h6>
                        </div>

                        {/* Size selection */}
                        <div className='row'>

                            <div className="sizes mt-3 col-md-6">
                                <h6>Chọn kích thước</h6>
                                <select
                                    className="form-select"
                                    onChange={handleSizeChange}
                                    value={selectedSize.name}
                                >
                                    {Array.from(new Map(dataProduct.variants.map(v => [v.size.id, v.size])).values()).map((size, index) => (
                                        <option key={index} value={size.name}>
                                            Size {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-3 col-md-6">
                                <h6>Số lượng</h6>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max={selectedVariant.stock}
                                    value={quantityProduct}
                                    onChange={handleQuantityChange}
                                />
                            </div>
                        </div>
                        <p style={{ margin: "8px 0", }}>Kho hàng: {selectedVariant.stock != 0 ? selectedVariant.stock : "Hết hàng"}</p>

                        {/* Color selection */}
                        <div className="colors mt-3">
                            <h6>Chọn màu</h6>
                            <div className="d-flex">
                                {colorsForSelectedSize.map((color) => {
                                    const isSelected = selectedVariant.color.id === color.id;
                                    return (
                                        <button

                                            key={color.id}
                                            className="btn"
                                            style={{
                                                backgroundColor: color.hexCode,
                                                width: '30px',
                                                height: '30px',
                                                marginRight: '10px',
                                                border: isSelected ? "4px solid green" : "none",
                                                opacity: 1
                                            }}
                                            onClick={() => handleColorChange(color.id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity */}


                        {/* Add to cart */}
                        <div className="mt-4">
                            <button disabled={selectedVariant.stock == 0} onClick={handleAddShopCart} className="btn btn-primary">
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoDetailProduct;
