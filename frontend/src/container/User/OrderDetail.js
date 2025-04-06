import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import './OrderUser.scss';
import CommonUtils from '../../utils/CommonUtils';
import { updateStatusOrderService } from '../../services/userService';

function OrderDetail({ DataOrder, loadDataOrder, isSearch }) {
    let handleCancelOrder = async (data) => {
        let res = await updateStatusOrderService({
            id: data.id,
            statusId: 'S7',
            dataOrder: data
        })
        if (res && res.errCode == 0) {
            toast.success("Hủy đơn hàng thành công")
            loadDataOrder()
        }
    }
    let handleReceivedOrder = async (orderId) => {
        let res = await updateStatusOrderService({
            id: orderId,
            statusId: 'S6'
        })
        if (res && res.errCode == 0) {
            toast.success("Đã nhận đơn hàng")
            loadDataOrder()
        }
    }
    return (
        <div className=" rounded  mb-2">
            <div className="row">
                <div className="col-md-12">
                    {DataOrder && DataOrder.length > 0 &&
                        DataOrder.map((order, index) => {
                            let totalPrice = 0;
                            return (
                                <div key={index}>
                                    <div className='box-list-order'>
                                        <div className='content-top'>
                                            <div className='content-left'>
                                                <div className='label-favorite'>
                                                    Yêu thích
                                                </div>
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
                                                                <span className='name'>Sản phẩm ID: {product.productId}</span>
                                                                <span className='type'>Size: {product.size} | Màu: <span style={{ backgroundColor: product.color, padding: '0 10px', color: '#fff', borderRadius: "5px", marginLeft: "5px" }}></span></span>
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

                                        <div className='down' style={{ pointerEvents: !isSearch ? "auto" : "none", }}>
                                            {order.statusId === 'S3' && !order.isPaymentOnlien &&
                                                <div className='btn-buy' onClick={() => handleCancelOrder(order)}>
                                                    Hủy đơn
                                                </div>
                                            }
                                            {order.statusId === 'S5' &&
                                                <div className='btn-buy' onClick={() => handleReceivedOrder(order.id)}>
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
        </div>
    );
}

export default OrderDetail;
