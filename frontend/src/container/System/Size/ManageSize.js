import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import sizeService from '../../../services/size';
import CommonUtils from '../../../utils/CommonUtils';

const ManageSize = () => {
    const [dataSize, setDataSize] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [keyword, setKeyword] = useState(''); // State cho từ khóa tìm kiếm
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let arrData = await sizeService.getAllSizes();
        if (arrData) {
            setDataSize(arrData);
            setTotalCount(Math.ceil(arrData.length / itemsPerPage));
            setCurrentPageData(arrData.slice(0, itemsPerPage));
        }
    };

    const handleDeleteCategory = async (event, id) => {
        event.preventDefault();
        let res = await sizeService.deleteSize(id);
        if (res && res.code === 200) {
            toast.success('Thay đổi trạng thái Size thành công');
            fetchData();
        } else {
            toast.error('Thay đổi trạng thái Size thất bại');
        }
    };

    const handleChangePage = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
        const offset = selectedPage.selected * itemsPerPage;
        const newData = dataSize.slice(offset, offset + itemsPerPage);
        setCurrentPageData(newData);
    };

    const handleSearchCategory = () => {
        let filteredData = dataSize;
        if (keyword) {
            filteredData = dataSize.filter((item) =>
                item.name.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        setCurrentPageData(filteredData.slice(0, itemsPerPage));
        setTotalCount(Math.ceil(filteredData.length / itemsPerPage));
        setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    };

    const handleOnClickExport = async () => {
        if (dataSize) {
            await CommonUtils.exportExcel(dataSize, 'Danh sách danh mục', 'ListCategory');
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Size</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách Size sản phẩm
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input
                                        onChange={(e) => setKeyword(e.target.value)}
                                        value={keyword}
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm theo Size..."
                                    />
                                    <div className="input-group-append">
                                        <button
                                            onClick={handleSearchCategory}
                                            className="btn"
                                            type="button"
                                        >
                                            <i className="ti-search" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <button
                                style={{ float: 'right' }}
                                onClick={handleOnClickExport}
                                className="btn btn-success"
                            >
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table
                            className="table table-bordered"
                            style={{ border: '1' }}
                            width="100%"
                            cellSpacing="0"
                        >
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Size</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData && currentPageData.length > 0 &&
                                    currentPageData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td >
                                                <Link to={`/admin/edit-size/${item.id}`} style={{ marginRight: "20px" }}>Edit</Link>
                                                <a
                                                    href="#"
                                                    onClick={(event) => handleDeleteCategory(event, item.id)}
                                                >
                                                    {item.status === 'S1' ? 'Deactive' : 'Active'}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={totalCount}
                            marginPagesDisplayed={3}
                            containerClassName={'pagination justify-content-center'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            activeClassName={'active'}
                            onPageChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageSize;