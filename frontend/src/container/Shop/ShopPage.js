import React, { useState, useRef, useEffect } from 'react';
import MainShop from '../../component/Shop/MainShop';
import Category from '../../component/Shop/Category';
import Brand from '../../component/Shop/Brand';
import Pagination from '../../component/Shop/Pagination';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Size from '../../component/Shop/Size';
import Color from '../../component/Shop/Color';



function ShopPage(props) {

    useEffect(async () => {
        window.scrollTo(0, 0);
    }, [])


    const [categoryId, setcategoryId] = useState('')
    const [brandId, setbrandId] = useState('')
    const [SizeId, setSizeId] = useState('')
    const [colorId, setColorId] = useState('')
    const myRef = useRef(null)
    let handleRecevieDataCategory = (code) => {
        setcategoryId(code)
    }
    let handleRecevieDataBrand = (code) => {

        setbrandId(code)
    }
    let handleRecevieDataSize = (code) => {

        setSizeId(code)
    }
    let handleRecevieDataColor = (code) => {

        setColorId(code)
    }

    return (
        <div>
            <section ref={myRef} className="banner_area animate__animated animate__fadeIn" style={{ minHeight: "100px" }}>
                <div className="banner_inner d-flex align-items-center parallax-background" style={{ minHeight: "100px" }}>
                    <div className="container">
                        <div className="banner_content d-md-flex justify-content-between align-items-center glass-effect rainbow-bg">
                            <div className="mb-3 mb-md-0 text-content">
                                <h2 className="animate__animated animate__slideInLeft rainbow-text">Danh mục cửa hàng</h2>
                                <p className="animate__animated animate__slideInLeft animate__delay-1s glow-text">Hãy lựa chọn sản phẩm phù hợp cho chính mình</p>
                            </div>
                            <div className="page_link animate__animated animate__slideInRight">
                                <Link to={"/"} className="hover-effect rainbow-link">Trang chủ</Link>
                                <Link to={"/shop"} className="hover-effect rainbow-link">Cửa hàng</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="cat_product_area section_gap animate__animated animate__fadeIn" style={{ padding: "20px 0" }}>
                <div className="container gradient-bg">
                    <div className="row flex-row-reverse card-container">
                        <MainShop categoryId={categoryId} brandId={brandId} myRef={myRef} colorId={colorId} SizeId={SizeId} />
                        <div className="col-lg-3">
                            <div className="left_sidebar_area sidebar-animation glass-effect">
                                <Category handleRecevieDataCategory={handleRecevieDataCategory} />
                                <Brand handleRecevieDataBrand={handleRecevieDataBrand} />
                                <Size handleRecevieDataSize={handleRecevieDataSize} />
                                <Color handleRecevieDataColor={handleRecevieDataColor} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ShopPage;