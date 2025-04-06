import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getItemCartStart } from '../../action/ShopCartAction';
import { listRoomOfUser } from '../../services/userService';
import favoriteService from '../../services/favorite'; // Giả sử bạn có một service để lấy yêu thích
import './Header.scss';
import TopMenu from './TopMenu';
import socketIOClient from "socket.io-client";
import { toast } from 'react-toastify';
require('dotenv').config();

const Header = props => {
    const [quantityMessage, setquantityMessage] = useState('');
    const [user, setUser] = useState({});
    const [favorites, setFavorites] = useState([]);  // Danh sách sản phẩm yêu thích
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);  // Trạng thái mở/đóng danh sách yêu thích
    const dispatch = useDispatch();
    let dataCart = useSelector(state => state.shopcart.listCartItem);
    const host = process.env.REACT_APP_BACKEND_URL;
    const socketRef = useRef();
    const [id, setId] = useState();

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host);
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData);
        if (userData) {
            dispatch(getItemCartStart(userData.id));
            socketRef.current.on('getId', data => {
                setId(data);
            });
            fetchListRoom(userData.id);
            socketRef.current.on('sendDataServer', () => fetchListRoom(userData.id));
            socketRef.current.on('loadRoomServer', () => fetchListRoom(userData.id));
            return () => {
                socketRef.current.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        // Khi component mounted, thêm event listener cho click ngoài
        const handleClickOutside = (event) => {
            const popup = document.querySelector('.favorites-popup');
            if (popup && !popup.contains(event.target)) {
                setIsFavoritesOpen(false); // Đóng popup khi click ngoài
            }
        };

        // Lắng nghe sự kiện click
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup khi component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hàm lấy danh sách yêu thích
    const fetchFavorites = async () => {
        try {
            const result = await favoriteService.getAllFavoritesByUser(user.id); // Lấy danh sách yêu thích
            setFavorites(result);  // Cập nhật danh sách yêu thích
        } catch (error) {
            console.error("Không thể tải danh sách yêu thích", error);
        }
    };

    // Mở/đóng popup danh sách yêu thích
    const handleFavoritesToggle = () => {
        setIsFavoritesOpen(prevState => !prevState);
        if (!isFavoritesOpen) {
            fetchFavorites();  // Gọi API khi mở danh sách yêu thích
        }
    };

    // Hàm bỏ yêu thích
    // const handleRemoveFavorite = async (productId) => {
    //     try {
    //         await favoriteService.removeFavorite(user.id, productId); // Gọi API để bỏ yêu thích sản phẩm
    //         setFavorites(prevFavorites => prevFavorites.filter(item => item.productId !== productId));  // Cập nhật lại danh sách
    //     } catch (error) {
    //         console.error("Không thể bỏ yêu thích", error);
    //     }
    // };

    let scrollHeader = () => {
        window.addEventListener("scroll", function () {
            var header = document.querySelector(".main_menu");
            if (header) {
                header.classList.toggle("sticky", window.scrollY > 0);
            }
        });
    };

    let fetchListRoom = async (userId) => {
        let res = await listRoomOfUser(userId);
        if (res && res.errCode == 0) {
            let count = 0;
            if (res.data && res.data.length > 0 && res.data[0].messageData && res.data[0].messageData.length > 0) {
                res.data[0].messageData.forEach((item) => {
                    if (item.unRead === 1 && item.userId !== userId) count = count + 1;
                });
            }
            setquantityMessage(count);
        }
    };

    scrollHeader();
    const [searchTerm, setSearchTerm] = useState("");
    const history = useHistory();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Ví dụ chuyển đến trang tìm kiếm đơn hàng, bạn có thể tuỳ chỉnh
            history.push(`/search-order?value=${encodeURIComponent(searchTerm)}`);
        }
    };
    const handleRemoveFavorite = async (id) => {
        const result = await favoriteService.removeFromFavorites(user.id, id);
        console.log("delete", result);
        if (result) {
            fetchFavorites()
            toast.success('Đã xóa yêu thích!');
        }
    }
    return (
        <header className="header_area">
            <TopMenu user={user && user} />
            <div className="main_menu">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light w-100">
                        <NavLink to="/" className="navbar-brand logo_h">
                            <img src="/resources/img/logo.png" alt="" style={{ width: '70px', height: 'auto', borderRadius: "10px" }} />
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <div className="collapse navbar-collapse offset w-100" id="navbarSupportedContent">
                            <div className="row w-100 mr-0">
                                <div className="col-lg-9 pr-0" style={{ width: "80%" }}>
                                    <ul className="nav navbar-nav center_nav pull-right">
                                        <li className="nav-item">
                                            <NavLink exact to="/" style={{ fontWeight: "bold" }} className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#ee4d2d' }}>
                                                Trang chủ
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/shop" style={{ fontWeight: "bold" }} className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#ee4d2d' }}>
                                                Cửa hàng
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/blog" style={{ fontWeight: "bold" }} className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#ee4d2d' }}>
                                                Tin tức
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/voucher" style={{ fontWeight: "bold" }} className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#ee4d2d' }}>
                                                Giảm giá
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/about" style={{ fontWeight: "bold" }} className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#ee4d2d' }}>
                                                Về chúng tôi
                                            </NavLink>
                                        </li>

                                        {/* Search input + button */}
                                        <li style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
                                            <form onSubmit={handleSearch} style={{ display: "flex", gap: "5px" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm đơn hàng..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                                />
                                                <button
                                                    type="submit"
                                                    style={{
                                                        padding: "4px 12px",
                                                        backgroundColor: "#ee4d2d",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Search
                                                </button>
                                            </form>
                                        </li>
                                    </ul>
                                </div>

                                <div className="col-lg-3 pr-0" style={{ width: "20%" }}>

                                    <ul className="nav navbar-nav navbar-right right_nav pull-right">

                                        {/* Icon yêu thích */}
                                        <li className="nav-item heart-wrapper" style={{ display: "flex", alignItems: "center", cursor: 'pointer' }} onClick={handleFavoritesToggle}>
                                            <i style={{ fontWeight: "bold" }} className="ti-heart" />
                                            {/* Popup danh sách yêu thích */}
                                            {isFavoritesOpen && (
                                                <div className={`favorites-popup ${isFavoritesOpen ? 'open' : ''}`}>
                                                    <h4>Sản phẩm yêu thích</h4>
                                                    <ul style={{ margin: "0 !important" }}>
                                                        {favorites.length > 0 ? (
                                                            favorites.map((item) => (
                                                                <li key={item.id} className="favorite-item" style={{ cursor: "pointer", margin: 0 }}>
                                                                    <img src={item.product.image} alt={item.product.name} />
                                                                    <div className="product-info">
                                                                        <span>{item.product.name}</span>
                                                                    </div>
                                                                    <button
                                                                        className="remove-btn"
                                                                        onClick={() => handleRemoveFavorite(item.product.id)}
                                                                    >
                                                                        <i className="ti-close" />
                                                                    </button>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="empty-message">Không có sản phẩm yêu thích nào.</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                        {/* Giỏ hàng */}
                                        <li className="nav-item">
                                            <Link to={"/shopcart"} className="icons">
                                                <i style={{ fontWeight: "bold" }} className="ti-shopping-cart" />
                                            </Link>
                                            <span className="box-quantity-cart">{dataCart && dataCart.length}</span>
                                        </li>
                                        {/* Người dùng */}
                                        <li className="nav-item">
                                            <Link to={`/user/detail/${user && user.id ? user.id : ''}`} className="icons">
                                                <i style={{ fontWeight: "bold" }} className="ti-user" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>


        </header>
    );
};

export default Header;
