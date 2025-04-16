import React, { useEffect, useState } from 'react';
import { getTopSellingProducts } from '../../../services/userService';
import CommonUtils from '../../../utils/CommonUtils';

const ProductOrder = () => {
    const [dataAll, setDataAll] = useState([]);
    const [limit, setLimit] = useState(5);
    const [filterType, setFilterType] = useState("desc");

    useEffect(() => {
        fetchData(limit, filterType);
    }, [limit, filterType]);

    const fetchData = async (limit, filterType) => {
        const res = await getTopSellingProducts({ limit, sortType: filterType });
        if (res && res.errCode === 0) {
            setDataAll(res.data);
        }
    };

    const handleExport = async () => {
        await CommonUtils.exportExcel(dataAll, "Top sản phẩm bán chạy", "TopSellingProducts");
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    return (
        <div className="container-fluid px-4">
           

            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <i className="fas fa-table me-1" /> Danh sách top sản phẩm bán chạy
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <select className="form-select w-auto" value={limit} onChange={handleLimitChange}>
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                        </select>
                        <select className="form-select w-auto" value={filterType} onChange={handleFilterChange}>
                            <option value="desc">Bán chạy</option>
                            <option value="asc">Không bán được</option>
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
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Tổng đã bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataAll.length > 0 ? (
                                    dataAll.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {item.productOrder && (
                                                    <img
                                                        src={item.productOrder.image}
                                                        alt="product"
                                                        style={{ width: 80, height: 80, objectFit: "cover" }}
                                                    />
                                                )}
                                            </td>
                                            <td>{item.productOrder ? item.productOrder.name : 'Không xác định'}</td>
                                            <td>{item.totalSold || 0}</td>
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

export default ProductOrder;
