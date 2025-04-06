import React, { useState, useEffect } from 'react';
import './AboutPage.css';

function AboutPage() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.querySelector('.stats-section');
            if (element) {
                const position = element.getBoundingClientRect();
                if (position.top < window.innerHeight && position.bottom >= 0) {
                    setAnimate(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="about-page">
            <div className="banner-section">
                <img src="resources/img/contact_img.jpg" alt="About Us Banner" className="banner-image" />
            </div>
            <div className="hero-section">
                <div className="container">
                    <h1>Về Chúng Tôi</h1>
                    <p className="lead">Sneaker Hubs giúp bạn định hình phong cách riêng! 👟🔥</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row mb-5">
                    <div className="col-md-6">
                        <h3 className="section-title">Câu chuyện của chúng tôi</h3>
                        <p>Từ niềm đam mê sneaker, Sneaker Hubs ra đời với sứ mệnh mang đến những đôi giày chất lượng, phong cách và đẳng cấp. Không chỉ là một cửa hàng, chúng tôi là nơi hội tụ của những tín đồ sneaker, nơi mỗi bước chân kể một câu chuyện riêng.

Chúng tôi tin rằng một đôi giày tốt không chỉ giúp bạn di chuyển, mà còn giúp bạn tỏa sáng. Hãy để Sneaker Hubs đồng hành cùng bạn trên mọi hành trình! 🚀👟</p>
                        <p>Với đội ngũ nhân viên nhiệt tình và chuyên nghiệp, chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.</p>
                    </div>
                    <div className="col-md-6">
                        <img src="resources/img/contact_img.jpg" alt="Cửa hàng của chúng tôi" className="img-fluid rounded shadow" />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-md-4">
                        <div className="value-box">
                            <h4>Tầm nhìn</h4>
                            <p>Trở thành thương hiệu giày sneaker hàng đầu tại Việt Nam</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="value-box">
                            <h4>Sứ mệnh</h4>
                            <p>Mang đến những trải nghiệm mua sắm tốt nhất cho khách hàng</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="value-box">
                            <h4>Giá trị cốt lõi</h4>
                            <p>Chất lượng - Tận tâm - Sáng tạo</p>
                        </div>
                    </div>
                </div>

                <div className="team-section mb-5">
                    <h3 className="section-title text-center mb-5">Đội Ngũ Của Chúng Tôi</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="team-member">
                                <img src="resources/img/member.png" alt="Team Member" />
                                <h4>Lê Hoàng Nam</h4>
                                <p>Nhân viên</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="team-member">
                                <img src="resources/img/member.png" alt="Team Member" />
                                <h4>Trần Văn Công</h4>
                                <p>Nhân viên</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="team-member">
                                <img src="resources/img/member.png" alt="Team Member" />
                                <h4>Lê Đình Sang</h4>
                                <p>Nhân viên</p>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>

                <div className="stats-section text-center">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className={animate ? 'animate-number' : ''}>1000+</h3>
                                <p>Khách hàng hài lòng</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className={animate ? 'animate-number' : ''}>500+</h3>
                                <p>Sản phẩm</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className={animate ? 'animate-number' : ''}>10+</h3>
                                <p>Thương hiệu</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className={animate ? 'animate-number' : ''}>24/7</h3>
                                <p>Hỗ trợ khách hàng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
