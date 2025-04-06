import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section company-info">
            <div className="footer-logo">
              <img src="resources/img/logo.png" alt="Sneaker Hubs Logo" />
            </div>
            <p> Chất lượng tạo nên thương hiệu. Chúng tôi cam kết mang đến những sản phẩm và dịch vụ xuất sắc, giúp khách hàng trải nghiệm sự hoàn hảo.</p>
            <div className="contact-info">
              <p><i className="fas fa-phone"></i> +84 868 986 239</p>
              <p><i className="fas fa-envelope"></i> Sneakerhubs@gmail.com</p>
              <p><i className="fas fa-map-marker-alt"></i> 299 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Về Chúng Tôi</h4>
            <ul>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Tầm nhìn & Sứ mệnh</a></li>
              <li><a href="#">Đội ngũ</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sản Phẩm</h4>
            <ul>
              <li><a href="#">Mới nhất</a></li>
              <li><a href="#">Bán chạy</a></li>
              <li><a href="#">Khuyến mãi</a></li>
              <li><a href="#">Sắp ra mắt</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Vận chuyển</a></li>
              <li><a href="#">Đổi trả</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Theo Dõi</h4>
            <div className="social-links">
              <a href="#" className="social-btn facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-btn instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-btn twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-btn youtube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <img src="resources/img/visa.svg" alt="Visa" />
            <img src="resources/img/Mastercard.png" alt="Mastercard" />
            <img src="resources/img/paypal.svg" alt="PayPal" />
          </div>
          <p>&copy; 2025 Your Company Sneakerhubs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;