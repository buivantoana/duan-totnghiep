import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import colorService from '../../../services/color';

const ManageColor = () => {
    const [dataColor, setDataColor] = useState([]); // Tất cả dữ liệu
    const [currentPageData, setCurrentPageData] = useState([]); // Dữ liệu của trang hiện tại
    const [totalCount, setTotalCount] = useState(0); // Tổng số trang
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const itemsPerPage = 5; // Số lượng item mỗi trang

    // Lấy dữ liệu khi component được render lần đầu
    useEffect(() => {
        fetchData();
    }, []);

    // Lấy dữ liệu tất cả
    let fetchData = async () => {
        let arrData = await colorService.getAllColor();
        if (arrData) {
            setDataColor(arrData);
            setTotalCount(Math.ceil(arrData.length / itemsPerPage)); // Tính số trang
            setCurrentPageData(arrData.slice(0, itemsPerPage)); // Lấy dữ liệu của trang đầu tiên
        }
    };

    // Xử lý khi xóa màu
    let handleDeleteColor = async (event, id) => {
        event.preventDefault();
        let res = await colorService.deleteColor(id);
        if (res && res.code == 200) {
            toast.success("Xóa màu thành công");
            fetchData(); // Tải lại dữ liệu sau khi xóa
        } else {
            toast.error("Xóa màu thất bại");
        }
    };

    // Xử lý khi thay đổi trang
    let handleChangePage = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
        const offset = selectedPage.selected * itemsPerPage;
        const newData = dataColor.slice(offset, offset + itemsPerPage);
        setCurrentPageData(newData);
    };

    // Xử lý tìm kiếm màu
    let handleSearchColor = (keyword) => {
        let filteredData = dataColor.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()));
        setCurrentPageData(filteredData.slice(0, itemsPerPage));
        setTotalCount(Math.ceil(filteredData.length / itemsPerPage));
    };

    // Xuất danh sách ra Excel
    let handleOnClickExport = async () => {
        if (dataColor) {
            await CommonUtils.exportExcel(dataColor, "Danh sách màu", "ListColor");
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
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"Màu..."} handleSearch={handleSearchColor} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={handleOnClickExport} className="btn btn-success">
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
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
                                            <td><input
                                                style={{ padding: "0px", width: "50px" }}
                                                type="color"
                                                value={item.hexCode}
                                                name="hexCode"

                                                className="form-control"
                                                id="inputHexCode"
                                            /></td>
                                            <td>
                                                <Link to={`/admin/edit-color/${item.id}`}>Edit</Link>
                                                &nbsp; &nbsp;
                                                <a href="#" onClick={(event) => handleDeleteColor(event, item.id)}>Delete</a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={totalCount}
                            marginPagesDisplayed={3}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            activeClassName={"active"}
                            onPageChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageColor;
