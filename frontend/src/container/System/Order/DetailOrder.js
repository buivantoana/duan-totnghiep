import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDetailOrder, updateStatusOrderService } from '../../../services/userService';
import './../../Order/OrderHomePage.scss';
import { toast } from 'react-toastify';
import storeVoucherLogo from '../../../../src/resources/img/storeVoucher.png';
import ShopCartItem from '../../../component/ShopCart/ShopCartItem';
import CommonUtils from '../../../utils/CommonUtils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function DetailOrder(props) {
    const { id } = useParams();
    const [DataOrder, setDataOrder] = useState({});
    const [imgPreview, setimgPreview] = useState('');
    const [isOpen, setisOpen] = useState(false);
    const [showSuccessShipModal, setShowSuccessShipModal] = useState(false);
    let price = 0;
    const [priceShip, setpriceShip] = useState(0);

    useEffect(() => {
        loadDataOrder();
    }, []);

    let openPreviewImage = (url) => {
        setimgPreview(url);
        setisOpen(true);
    };

    let loadDataOrder = () => {
        if (id) {
            let fetchOrder = async () => {
                let order = await getDetailOrder(id);
                if (order && order.errCode === 0) {
                    setDataOrder(order.data);
                    setpriceShip(order.data.typeShipData.price);
                }
            };
            fetchOrder();
        }
    };

    let totalPriceDiscount = (price, discount) => {
        try {
            if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
                if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {
                    return price - discount.typeVoucherOfVoucherData.maxValue;
                } else {
                    return price - ((price * discount.typeVoucherOfVoucherData.value) / 100);
                }
            } else {
                return price - discount.typeVoucherOfVoucherData.maxValue;
            }
        } catch (error) { }
    };

    let handleAcceptOrder = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,
            statusId: 'S4'
        });
        if (res && res.errCode === 0) {
            toast.success("Xác nhận đơn hàng thành công");
            loadDataOrder();
        }
    };

    let handleSendProduct = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,
            statusId: 'S5'
        });
        if (res && res.errCode === 0) {
            toast.success("Xác nhận gửi hàng thành công");
            loadDataOrder();
        }
    };

    let handleShowSuccessShipModal = () => {
        setShowSuccessShipModal(true);
    };

    let handleCloseSuccessShipModal = () => {
        setShowSuccessShipModal(false);
    };

    let handleSuccessShip = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,
            statusId: 'S6'
        });
        if (res && res.errCode === 0) {
            toast.success("Đã giao hàng thành công");
            loadDataOrder();
        }
        handleCloseSuccessShipModal();
    };

    let handleCancelOrder = async (data) => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,
            statusId: 'S7',
            dataOrder: data
        });
        if (res && res.errCode === 0) {
            toast.success("Hủy đơn hàng thành công");
            loadDataOrder();
        }
    };

    return (
        <>
            <div className="wrap-order">
                <div className="wrap-heading-order">
                    <NavLink to="/" className="navbar-brand logo_h">
                        <img src="/resources/img/logo.png" alt="" style={{ width: '70px', height: 'auto' }} />
                    </NavLink>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="wrap-address-order">
                    <div className="border-top-address-order"></div>
                    <div className="wrap-content-address">
                        <div className="content-up">
                            <div className="content-left">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Địa Chỉ Nhận Hàng</span>
                            </div>
                        </div>
                        <div className="content-down">
                            {DataOrder && DataOrder.addressData && (
                                <>
                                    <div className="content-left">
                                        <span>{DataOrder.addressData.shipName} ({DataOrder.addressData.shipPhonenumber})</span>
                                    </div>
                                    <div className="content-center">
                                        <span>{DataOrder.addressData.shipAdress}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="wrap-order-item">
                    <section className="cart_area">
                        <div className="container">
                            <div className="cart_inner">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sản phẩm</th>
                                                <th scope="col">Size</th>
                                                <th scope="col">Màu</th>
                                                <th scope="col">Giá</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Số lượng</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Tổng tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DataOrder.OrderDetails && DataOrder.OrderDetails.length > 0 &&
                                                DataOrder.OrderDetails.map((item, index) => {
                                                    price += item.quantity * item.realPrice;
                                                    let name = `${item.productOrder.name}  - ${item.size}`;
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="media">
                                                                    <div className="d-flex">
                                                                        <img
                                                                            style={{ width: '147px', height: '100px', objectFit: 'cover' }}
                                                                            src={item.image}
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    {name}
                                                                </div>
                                                            </td>
                                                            <td>{item.size}</td>
                                                            <td>
                                                                <div
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        borderRadius: "5px",
                                                                        background: item.color
                                                                    }}
                                                                ></div>
                                                            </td>
                                                            <td>{CommonUtils.formatter.format(item.realPrice)}</td>
                                                            <td align='right'>
                                                                <span>{item.quantity}</span>
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <h5 style={{ color: '#ee4d2d' }}>
                                                                    {CommonUtils.formatter.format(item.quantity * item.realPrice)}
                                                                </h5>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="box-shipping">
                                <h6>Đơn vị vận chuyển</h6>
                                <div>
                                    {DataOrder && DataOrder.typeShipData && (
                                        <label className="form-check-label">
                                            {DataOrder.typeShipData.type} - {CommonUtils.formatter.format(DataOrder.typeShipData.price)}
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="box-shopcart-bottom">
                                <div className="content-left">
                                    <div className="wrap-voucher">
                                        <img width="20px" height="20px" style={{ marginLeft: "-3px" }} src={storeVoucherLogo}></img>
                                        <span className="name-easier">Easier voucher</span>
                                        <span className="choose-voucher">
                                            Mã voucher: {DataOrder && DataOrder.voucherData && DataOrder.voucherData.codeVoucher}
                                        </span>
                                    </div>
                                    <div className="wrap-note">
                                        <span>Lời Nhắn:</span>
                                        <input value={DataOrder.note} type="text" placeholder="Lưu ý cho Người bán..." />
                                    </div>
                                </div>
                                <div className="content-right">
                                    <div className="wrap-price">
                                        <span className="text-total">Tổng thanh toán {DataOrder && DataOrder.orderDetail && DataOrder.orderDetail.length} sản phẩm: </span>
                                        <span className="text-price">
                                            {DataOrder && DataOrder.dataVoucher ? CommonUtils.formatter.format(((totalPriceDiscount(price, DataOrder.dataVoucher)) > 0 ? (totalPriceDiscount(price, DataOrder.dataVoucher) + priceShip) : 0) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="wrap-payment">
                    <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                        <span>Phương Thức Thanh Toán</span>
                        <div className='box-type-payment active'>
                            {DataOrder.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}
                        </div>
                    </div>
                    <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                        <span>Trạng Thái Đơn Hàng</span>
                        <div className='box-type-payment active'>{DataOrder.statusOrderData && DataOrder.statusOrderData.value}</div>
                    </div>
                    <div className="content-bottom">
                        {DataOrder && DataOrder.addressData && (
                            <div className="wrap-bottom">
                                <div className="box-flex">
                                    <div className="head">Tên khách hàng</div>
                                    <div>{DataOrder.addressData.shipName}</div>
                                </div>
                                <div className="box-flex">
                                    <div className="head">Số điện thoại</div>
                                    <div>{DataOrder.addressData.shipPhonenumber}</div>
                                </div>
                                <div className="box-flex">
                                    <div className="head">Địa chỉ email</div>
                                    <div>{DataOrder.addressData.shipEmail}</div>
                                </div>
                            </div>
                        )}
                        <div className="wrap-bottom">
                            <div className="box-flex">
                                <div className="head">Tổng tiền hàng</div>
                                <div>{CommonUtils.formatter.format(price)}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Tổng giảm giá</div>
                                <div>
                                    {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                                        ? CommonUtils.formatter.format(price - totalPriceDiscount(price, DataOrder.voucherData))
                                        : CommonUtils.formatter.format(0)}
                                </div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Phí vận chuyển</div>
                                <div>{CommonUtils.formatter.format(priceShip)}</div>
                            </div>
                            {DataOrder.points > 0 && (
                                <div className="box-flex">
                                    <div className="head">Áp dụng điểm thưởng</div>
                                    <div>{CommonUtils.formatter.format(DataOrder.points)}</div>
                                </div>
                            )}
                            <div className="box-flex">
                                <div className="head">Tổng thanh toán:</div>
                                <div className="money">{CommonUtils.formatter.format(DataOrder.total)}</div>
                            </div>
                            <div className="box-flex">
                                {DataOrder && DataOrder.statusId == 'S3' && (
                                    <a onClick={() => handleAcceptOrder()} className="main_btn">Xác nhận đơn</a>
                                )}
                                {DataOrder && DataOrder.statusId == 'S4' && (
                                    <a onClick={() => handleSendProduct()} className="main_btn">Gửi hàng</a>
                                )}
                                {DataOrder && DataOrder.statusId == 'S5' && (
                                    <a onClick={() => handleShowSuccessShipModal()} className="main_btn">Đã giao hàng</a>
                                )}
                            </div>
                            {DataOrder && DataOrder.statusId == 'S3' && DataOrder.isPaymentOnlien == 0 && (
                                <a
                                    onClick={() => handleCancelOrder(DataOrder)}
                                    style={{ marginLeft: '30px', background: '#cd2b14', border: '1px solid #cd2b14', width: '213px' }}
                                    className="main_btn"
                                >
                                    Hủy đơn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>

            {isOpen === true && (
                <Lightbox
                    mainSrc={imgPreview}
                    onCloseRequest={() => setisOpen(false)}
                />
            )}

            {/* Modal xác nhận đã giao hàng */}
            {showSuccessShipModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận đã giao hàng</h5>
                                    <button type="button" className="close" onClick={handleCloseSuccessShipModal}>
                                        <span>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn đơn hàng này đã được giao thành công không?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseSuccessShipModal}>
                                        Không
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSuccessShip}>
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}

export default DetailOrder;