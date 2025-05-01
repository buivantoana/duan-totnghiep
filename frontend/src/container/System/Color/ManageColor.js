import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import colorService from '../../../services/color';

// Hàm chuyển đổi chuỗi có dấu thành không dấu
const removeAccents = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const ManageColor = () => {
    const [dataColor, setDataColor] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [keyword, setKeyword] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let arrData = await colorService.getAllColor();
        if (arrData) {
            setDataColor(arrData);
            setTotalCount(Math.ceil(arrData.length / itemsPerPage));
            setCurrentPageData(arrData.slice(0, itemsPerPage));
        }
    };

    const handleDeleteColor = async (event, id) => {
        event.preventDefault();
        let res = await colorService.deleteColor(id);
        if (res && res.code === 200) {
            toast.success('Thay đổi trạng thái màu thành công');
            fetchData();
        } else {
            toast.error('Thay đổi trạng thái màu thất bại');
        }
    };

    const handleChangePage = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
        const offset = selectedPage.selected * itemsPerPage;
        const newData = dataColor.slice(offset, offset + itemsPerPage);
        setCurrentPageData(newData);
    };

    const handleSearchColor = () => {
        let filteredData = dataColor;
        if (keyword) {
            filteredData = dataColor.filter((item) =>
                removeAccents(item.name.toLowerCase()).includes(
                    removeAccents(keyword.toLowerCase())
                )
            );
        }
        setCurrentPageData(filteredData.slice(0, itemsPerPage));
        setTotalCount(Math.ceil(filteredData.length / itemsPerPage));
        setCurrentPage(0);
    };

    const handleOnClickExport = async () => {
        if (dataColor) {
            await CommonUtils.exportExcel(dataColor, 'Danh sách màu', 'ListColor');
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Màu Sắc</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-palette me-1" />
                    Danh sách Màu Sắc sản phẩm
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
                                        placeholder="Tìm kiếm theo Màu..."
                                    />
                                    <div className="input-group-append">
                                        <button
                                            onClick={handleSearchColor}
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
                                    <th>Tên Màu</th>
                                    <th>Mã Màu</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData && currentPageData.length > 0 &&
                                    currentPageData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <input
                                                    style={{ padding: '0px', width: '50px' }}
                                                    type="color"
                                                    value={item.hexCode}
                                                    name="hexCode"
                                                    className="form-control"
                                                    id="inputHexCode"
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/admin/edit-color/${item.id}`}>Edit</Link>
                                                <a
                                                    href="#"
                                                    onClick={(event) => handleDeleteColor(event, item.id)}
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

export default ManageColor;