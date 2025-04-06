import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Thêm useLocation
import { toast } from 'react-toastify';
import { searchOrder } from '../../services/userService'; // Giữ nguyên các import khác
import OrderDetail from '../User/OrderDetail';
import '../User/OrderUser.scss';

function SearchOrder(props) {
   const location = useLocation(); // Dùng useLocation để lấy URL hiện tại
   const [DataOrder, setDataOrder] = useState([]);

   // Hàm để lấy giá trị 'value' từ URL query
   const getQueryParam = () => {
      const params = new URLSearchParams(location.search);
      return params.get('value');
   };

   useEffect(() => {
      const value = getQueryParam(); // Lấy 'value' mỗi khi URL thay đổi
      loadDataOrder(value); // Gọi hàm loadDataOrder với giá trị 'value'
   }, [location]); // Theo dõi sự thay đổi của URL

   let loadDataOrder = (value) => {
      if (value) {
         let fetchOrder = async () => {
            let order = await searchOrder(value);
            if (order && order.errCode === 0) {
               setDataOrder(order.data);
            }
         };
         fetchOrder();
      }
   };

   return (
      <div className="container container-list-order rounded mt-5 mb-5">
         <h4>Tìm kiếm đơn hàng</h4>
         <div className="row">
            <div className="col-md-12">
               <div className="box-nav-order">
                  <a className='nav-item-order active'>
                     <span>Tất cả</span>
                  </a>
               </div>
               {DataOrder && DataOrder.length > 0 &&
                  <OrderDetail isSearch={true} DataOrder={DataOrder} loadDataOrder={loadDataOrder} />
               }
            </div>
         </div>
      </div>
   );
}

export default SearchOrder;
