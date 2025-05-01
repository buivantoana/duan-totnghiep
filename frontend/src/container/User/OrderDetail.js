import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import './OrderUser.scss';
import CommonUtils from '../../utils/CommonUtils';
import { updateStatusOrderService } from '../../services/userService';

function OrderDetail({ DataOrder, loadDataOrder, isSearch }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleShowCancelModal = (order) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setSelectedOrder(null);
        setShowCancelModal(false);
    };

    const handleShowReceiveModal = (order) => {
        setSelectedOrder(order);
        setShowReceiveModal(true);
    };

    const handleCloseReceiveModal = () => {
        setSelectedOrder(null);
        setShowReceiveModal(false);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;

        let res = await updateStatusOrderService({
            id: selectedOrder.id,
            statusId: 'S7',
            dataOrder: selectedOrder
        });

        if (res && res.errCode === 0) {
            toast.success("Hủy đơn hàng thành công");
            loadDataOrder();
        }

        handleCloseCancelModal();
    };

    const handleReceivedOrder = async () => {
        if (!selectedOrder) return;

        let res = await updateStatusOrderService({
            id: selectedOrder.id,
            statusId: 'S6'
        });

        if (res && res.errCode === 0) {
            toast.success("Đã nhận đơn hàng");
            loadDataOrder();
        }

        handleCloseReceiveModal();
    };

    return (
        <div className="rounded mb-2">
            <div className="row">
                <div className="col-md-12">
                    {DataOrder && DataOrder.length > 0 &&
                        DataOrder.map((order, index) => {
                            let totalPrice = 0;
                            let statusHistory = order.statusHistory ? JSON.parse(order.statusHistory) : [];
                            return (
                                <div key={index}>
                                    <div className='box-list-order'>
                                        {order.statusId === 'S7' ? (
                                            <div className="order-status text-danger mt-1 mb-2">
                                                <strong>Đơn hàng đã bị hủy</strong>
                                            </div>
                                        ) : (
                                            <div className="order-timeline mt-1 mb-2">
                                                <ul className="timeline">
                                                    <li className={['S3', 'S4', 'S5', 'S6'].includes(order.statusId) ? 'active' : ''}>Chờ xác nhận</li>
                                                    <li className={['S4', 'S5', 'S6'].includes(order.statusId) ? 'active' : ''}>Chờ lấy hàng</li>
                                                    <li className={['S5', 'S6'].includes(order.statusId) ? 'active' : ''}>Đang giao hàng</li>
                                                    <li className={['S6'].includes(order.statusId) ? 'active' : ''}>Đã giao hàng</li>
                                                </ul>
                                                {statusHistory.length > 0 && (
                                                    <div className="status-history mt-3">
                                                        <h6>Lịch sử trạng thái:</h6>
                                                        <ul className="list-group">
                                                            {statusHistory.map((history, idx) => {
                                                                let statusName = "";
                                                                if (history.statusId === 'S3') {
                                                                    statusName = "Xác nhận";
                                                                }
                                                                if (history.statusId === 'S4') {
                                                                    statusName = "Đang giao";
                                                                }
                                                                if (history.statusId === 'S5') {
                                                                    statusName = "Đã giao hàng";
                                                                }
                                                                if (history.statusId === 'S6') {
                                                                    statusName = "Đã nhận hàng";
                                                                }
                                                                if (history.statusId === 'S7') {
                                                                    statusName = "Hủy đơn";
                                                                }
                                                                return (
                                                                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                                        <span>{statusName}</span>
                                                                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                                            {formatDateTime(history.updatedAt)}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className='content-top'>
                                            <div className='content-left'>
                                                <div className='label-favorite'>Yêu thích</div>
                                                <span className='label-name-shop'>Sneakerhubs</span>
                                                <div className='view-shop'>
                                                    <i className="fas fa-store"></i>
                                                    <a style={{ color: 'black' }} href='/shop'>Xem shop</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='address-info'>
                                            <h5>Thông tin giao hàng</h5>
                                            <p><strong>Tên người nhận:</strong> {order.addressData.shipName}</p>
                                            <p><strong>Địa chỉ:</strong> {order.addressData.shipAdress}</p>
                                            <p><strong>Email:</strong> {order.addressData.shipEmail}</p>
                                            <p><strong>Số điện thoại:</strong> {order.addressData.shipPhonenumber}</p>
                                        </div>

                                        {order.OrderDetails && order.OrderDetails.length > 0 &&
                                            order.OrderDetails.map((product, idx) => {
                                                totalPrice += product.quantity * product.realPrice;
                                                return (
                                                    <div className='content-center' key={idx}>
                                                        <div className='box-item-order'>
                                                            <img src={product.image} alt={product.size} />
                                                            <div className='box-des'>
                                                                <span className='name'>Sản phẩm : {product && product.productOrder && product.productOrder.name}</span>
                                                                <span className='type'>
                                                                    Size: {product.size} | Màu:
                                                                    <span style={{
                                                                        backgroundColor: product.color,
                                                                        padding: '0 10px',
                                                                        color: '#fff',
                                                                        borderRadius: "5px",
                                                                        marginLeft: "5px"
                                                                    }}></span>
                                                                </span>
                                                                <span>x{product.quantity}</span>
                                                            </div>
                                                            <div className='box-price'>
                                                                {CommonUtils.formatter.format(product.realPrice)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <div className='content-bottom'>
                                        <div className="up">{order.points > 0 && <span>Áp dụng điểm thưởng:  {CommonUtils.formatter.format(order.points)}</span>}</div>

                                        <div className='up'>
                                            <span>Tổng số tiền: </span>
                                            <span className='name'>
                                                {CommonUtils.formatter.format(order.total)}
                                            </span>
                                        </div>

                                        <div className='down' style={{ pointerEvents: !isSearch ? "auto" : "none" }}>
                                            {order.statusId === 'S3' && !order.isPaymentOnlien &&
                                                <div className='btn-buy' onClick={() => handleShowCancelModal(order)}>
                                                    Hủy đơn
                                                </div>
                                            }
                                            {order.statusId === 'S5' &&
                                                <div className='btn-buy' onClick={() => handleShowReceiveModal(order)}>
                                                    Đã nhận hàng
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            {/* Modal xác nhận hủy đơn */}
            {showCancelModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận hủy đơn hàng</h5>
                                    <button type="button" className="close" onClick={handleCloseCancelModal}>
                                        <span>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseCancelModal}>Không</button>
                                    <button type="button" className="btn btn-danger" onClick={handleCancelOrder}>Đồng ý hủy</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* Modal xác nhận đã nhận hàng */}
            {showReceiveModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Xác nhận đã nhận hàng</h5>
                                    <button type="button" className="close" onClick={handleCloseReceiveModal}>
                                        <span>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn đã nhận được đơn hàng này không?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseReceiveModal}>Không</button>
                                    <button type="button" className="btn btn-primary" onClick={handleReceivedOrder}>Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}

export default OrderDetail;

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}