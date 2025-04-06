import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { PAGINATION } from '../../../utils/constant';

const StockProduct = () => {
    const [dataAll, setDataAll] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllProducts();
            if (res && res.errCode === 0) {
                setDataAll(res.data);
                setPageCount(Math.ceil(res.data.length / PAGINATION.pagerow));
                setCurrentPageData(res.data.slice(0, PAGINATION.pagerow));
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (e) => {
        const selected = e.selected;
        const offset = selected * PAGINATION.pagerow;
        setCurrentPageData(dataAll.slice(offset, offset + PAGINATION.pagerow));
    };

    const handleOpenModal = (product) => {
        setModalData(product);
        const modal = new window.bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    };

    const handleExport = async () => {
        await CommonUtils.exportExcel(dataAll, "Danh sách sản phẩm tồn kho", "ListStock");
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm tồn kho</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" /> Danh sách sản phẩm tồn kho
                </div>
                <div className="card-body">
                    <div className="mb-2 text-end">
                        <button onClick={handleExport} className="btn btn-success">
                            Xuất Excel <i className="fa-solid fa-file-excel"></i>
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Nhãn hàng</th>
                                    <th>Tổng tồn kho</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData.map((item, index) => {
                                    const totalStock = item.variants.reduce((acc, variant) => acc + variant.stock, 0);
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={item.image} alt="product" width="60" height="60" style={{ objectFit: 'cover' }} />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.categoryData?.value}</td>
                                            <td>{item.brandData?.value}</td>
                                            <td>
                                                {totalStock > 0 ? totalStock : <span className="text-danger">Hết hàng</span>}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(item)}>
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <nav className="mt-4">
                        <ReactPaginate
                            previousLabel={'«'}
                            nextLabel={'»'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            nextClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </nav>
                </div>
            </div>

            {/* Modal HTML Bootstrap */}
            <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="detailModalLabel">Chi tiết tồn kho</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {modalData?.variants?.map((variant, idx) => (
                                <div key={idx} className="border rounded p-3 mb-3">
                                    <p><strong>Màu:</strong> {variant.color?.name}</p>
                                    <p><strong>Size:</strong> {variant.size?.name}</p>
                                    <p><strong>Số lượng:</strong> {variant.stock > 0 ? variant.stock : <span className="text-danger">Hết hàng</span>}</p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {JSON.parse(variant.imageUrl || "[]").map((img, i) => (
                                            <img key={i} src={img} alt={`variant-${i}`} width="80" height="80" style={{ objectFit: 'cover' }} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockProduct;
