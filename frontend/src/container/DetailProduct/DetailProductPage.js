import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { getDetailProductByIdService, getProductRecommendService } from '../../services/userService';
import ImgDetailProduct from '../../component/Product/ImgDetailProduct';
import InfoDetailProduct from '../../component/Product/InfoDetailProduct';
import CommentProduct from '../../component/Product/CommentProduct';
import ProfileProduct from '../../component/Product/ProfileProduct';
import ReviewProduct from '../../component/Product/ReviewProduct';
import DescriptionProduct from '../../component/Product/DescriptionProduct';
import NewProductFeature from "../../component/HomeFeature/NewProductFeature";
import ProductFeature from '../../component/HomeFeature/ProductFeature';
import Footer from '../Footer/Footer';



function DetailProductPage(props) {
    const [dataProduct, setDataProduct] = useState({});
    const [dataDetailSize, setDataDetailSize] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [dataProductRecommend, setDataProductRecommend] = useState([]);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true);
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData) {
                    await Promise.all([
                        fetchProductFeature(userData.id),
                        fetchDetailProduct()
                    ]);
                    setUser(userData);
                } else {
                    await fetchDetailProduct();
                }
                window.scrollTo(0, 0);
            } catch (err) {
                setError(err.message);
                console.error('Error loading product details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [id]);

    const sendDataFromInforDetail = (data) => {
        setDataDetailSize(data);
    };

    const fetchDetailProduct = async () => {
        try {
            const res = await getDetailProductByIdService(id);
            if (res && res.errCode === 0) {
                setDataProduct(res.data);
            } else {
                throw new Error('Failed to fetch product details');
            }
        } catch (err) {
            throw err;
        }
    };

    const fetchProductFeature = async (userId) => {
        try {
            const res = await getProductRecommendService({
                limit: 20,
                userId: userId
            });
            if (res && res.errCode === 0) {
                setDataProductRecommend(res.data);
            } else {
                throw new Error('Failed to fetch product recommendations');
            }
        } catch (err) {
            throw err;
        }
    };

    if (isLoading) return (
        <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
    if (error) return (
        <div className="error-container">
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        </div>
    );

    return (
        <div className="product-detail-wrapper">
            <section className="banner-area" style={{ padding: "30px 0 0 0", background: "#f6f6f6" }}>
                <div className="banner-inner">
                    <div className="container">
                        <div className="banner-content">
                            <div className="banner-title">
                                <h5>Chi tiết sản phẩm</h5>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                        <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">{dataProduct.name}</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="product-content-area">
                <div className="container">
                    <div className="product-main-content">
                        <InfoDetailProduct
                            userId={user?.id || ''}
                            dataProduct={dataProduct}
                            sendDataFromInforDetail={sendDataFromInforDetail}
                        />
                    </div>
                </div>
            </div>

            {user && dataProductRecommend?.length > 0 && (
                <div className="recommend-section">
                    <ProductFeature
                        title="Sản phẩm bạn quan tâm"
                        data={dataProductRecommend}
                    />
                </div>
            )}

            <section className="product-details-tabs">
                <div className="container">
                    <div className="tabs-wrapper">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="pills-description-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-description" type="button" role="tab">
                                    Mô tả sản phẩm
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="pills-reviews-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-reviews" type="button" role="tab">
                                    Đánh giá sản phẩm
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-description" role="tabpanel">
                                <DescriptionProduct data={dataProduct.contentHTML} />
                            </div>

                            <div className="tab-pane fade" id="pills-reviews" role="tabpanel">
                                <ReviewProduct />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .product-detail-wrapper {
                    background-color: #f8f9fa;
                }
                .banner-area {
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    padding: 80px 0;
                    color: white;
                }
                .banner-title h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .breadcrumb {
                    background: transparent;
                }
                .breadcrumb-item a {
                    color: black;
                }
                .breadcrumb-item.active {
                    color: black;
                }
                .product-content-area {
                    padding:  0;
                }
                .product-main-content {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.05);
                    padding: 30px;
                }
                .recommend-section {
                    padding: 40px 0;
                    background: white;
                }
                .product-details-tabs {
                    padding: 60px 0;
                }
                .tabs-wrapper {
                    background: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.05);
                }
                .nav-pills .nav-link {
                    color: #495057;
                    border-radius: 30px;
                    padding: 10px 30px;
                    margin: 0 10px;
                    transition: all 0.3s ease;
                }
                .nav-pills .nav-link.active {
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    color: white;
                }
                .tab-content {
                    padding: 30px 0;
                }
                .loading-container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .error-container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
            `}</style>
        </div>
    );
}

export default DetailProductPage;