import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemCartStart } from '../../action/ShopCartAction';
import { toast } from 'react-toastify';
import CommonUtils from '../../utils/CommonUtils';
import './ItemProduct.scss';
import favoriteService from '../../services/favorite';



// API cho yêu thích sản phẩm
const toggleFavorite = async (userId, productId) => {
    try {
        const result = await favoriteService.addToFavorites(userId, productId)
        return result
    } catch (error) {
        toast.error('Có lỗi khi thêm yêu thích!');
        console.error(error);
    }
};

function ItemProduct(props) {
    const [isFavorited, setIsFavorited] = useState(false);  // Trạng thái yêu thích
    const dispatch = useDispatch();
    const [favorite, setFavorite] = useState([])
    //

    const handleAddToCart = () => {
        dispatch(addItemCartStart(props.id));
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');
    };

    // Hàm xử lý yêu thích
    const handleFavoriteToggle = async () => {
        const user = JSON.parse(localStorage.getItem("userData"));
        if (!user) {
            toast.warning("Bạn cần đăng nhập để thêm yêu thích.")
            return;
        }

        try {
            if (isFavorited) {
                const result = await favoriteService.removeFromFavorites(user.id, props.id);
                console.log("delete", result);
                if (result) {
                    setIsFavorited(false);
                    toast.success('Đã xóa yêu thích!');
                }
            } else {
                const result = await favoriteService.addToFavorites(user.id, props.id);
                if (result) {
                    setIsFavorited(true);
                    toast.success('Đã thêm vào yêu thích!');
                }
            }
        } catch (error) {
            toast.error('Có lỗi khi xử lý yêu thích!');
            console.error(error);
        }
    };
    useEffect(() => {
        const checkIfFavorited = async () => {
            try {
                let user = localStorage.getItem("userData")
                console.log(user)
                if (user) {
                    let result = await favoriteService.getAllFavoritesByUser(JSON.parse(user).id)
                    console.log(result);
                    if (result && result.length > 0) {

                        setFavorite(result.map((item) => item.productId))
                        if (result.filter((item) => item.productId == props.id)[0]) {
                            setIsFavorited(true);
                        }
                    }
                }
            } catch (error) {

            }

        };

        checkIfFavorited();
    }, [props.id]);


    return (
        <div className={`product-item ${props.type}`}>
            <div className="single-product">

                <div className="product-img">
                    <Link to={`/detail-product/${props.id}`}>
                        <img className="img-fluid w-100" src={props.img} alt={props.name} />
                    </Link>
                    <div className="p_icon">
                        <Link to={`/detail-product/${props.id}`}>
                            <a>
                                <i className="ti-eye" />
                            </a>
                        </Link>
                        <Link to={`/detail-product/${props.id}`}>

                            <a >
                                <i className="ti-shopping-cart" />
                            </a>
                        </Link>
                        <a onClick={handleFavoriteToggle} style={{ cursor: "pointer" }} className="favorite-icon">
                            <i className={isFavorited ? "ti-heart" : "ti-heart-broken"} />
                        </a>
                    </div>
                </div>
                <Link to={`/detail-product/${props.id}`}>
                    <div className="product-btm" style={{ height: '99px' }}>
                        <a className="d-block">
                            <h4>{props.name}</h4>
                        </a>
                        <div className="mt-3">
                            <span className="mr-4">{CommonUtils.formatter.format(props.discountPrice)}</span>
                            <del>{CommonUtils.formatter.format(props.price)}</del>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}

export default ItemProduct;
