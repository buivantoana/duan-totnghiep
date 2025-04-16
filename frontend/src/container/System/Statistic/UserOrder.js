import React, { useEffect, useState } from 'react';
import { getTopUsersOrder } from '../../../services/userService';
import CommonUtils from '../../../utils/CommonUtils';

const UserOrder = () => {
    const [dataAll, setDataAll] = useState([]);
    const [limit, setLimit] = useState(5); // mặc định top 5

    useEffect(() => {
        fetchData(limit);
    }, [limit]);

    const fetchData = async (limit) => {
        const res = await getTopUsersOrder({ limit });
        if (res && res.errCode === 0) {
            setDataAll(res.data);
        }
    };

    const handleExport = async () => {
        await CommonUtils.exportExcel(dataAll, "Top người dùng đặt hàng", "TopUserOrder");
    };

    const handleLimitChange = (e) => {
        const value = parseInt(e.target.value);
        setLimit(value);
    };

    return (
        <div className="container-fluid px-4">
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <i className="fas fa-table me-1" /> Danh sách top người dùng đặt hàng 
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <select className="form-select w-auto" value={limit} onChange={handleLimitChange}>
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                        </select>
                        <button onClick={handleExport} className="btn btn-success">
                            Xuất Excel <i className="fa-solid fa-file-excel"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Số lượng đơn hàng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataAll.length > 0 ? (
                                    dataAll.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.lastName} {user.firstName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.orderCount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
