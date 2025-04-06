import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import './OrderUser.scss';
import { getAllOrdersByUser, updateStatusOrderService } from '../../services/userService'
import { concat } from 'lodash';
import CommonUtils from '../../utils/CommonUtils';
import OrderDetail from './OrderDetail';
function OrderUser(props) {
    const { id } = useParams();
    const [DataOrder, setDataOrder] = useState([]);
    useEffect(() => {
        loadDataOrder()
    }, [])
    let loadDataOrder = () => {
        if (id) {
            let fetchOrder = async () => {
                let order = await getAllOrdersByUser(id)
                if (order && order.errCode == 0) {
                    setDataOrder(order.data)

                }
            }
            fetchOrder()


        }
    }

    
    return (

        <div className="container container-list-order rounded mt-5 mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="box-nav-order">
                        <a className='nav-item-order active'>
                            <span>Tất cả</span>
                        </a>

                    </div>
                    {/* <div className='box-search-order'>
                        <i className="fas fa-search"></i>
                        <input autoComplete='off' placeholder='Tìm kiếm theo Tên Shop, ID đơn hàng hoặc Tên Sản phẩm' type={"text"} />
                    </div> */}
                    {DataOrder && DataOrder.length > 0 && <OrderDetail DataOrder={DataOrder} loadDataOrder={loadDataOrder} />
                       
                    }


                </div>
            </div>

        </div >

    );
}

export default OrderUser;

