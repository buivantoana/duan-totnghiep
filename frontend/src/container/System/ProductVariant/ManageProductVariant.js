import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import productVariantService from '../../../services/product_variant';
import { JSON } from 'persist/lib/type';

const ManageProductVariant = () => {
    const [dataVariants, setDataVariants] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let result = await productVariantService.getAllProductVariants();
        if (result) {
            setDataVariants(result);
            setTotalCount(Math.ceil(result.length / itemsPerPage));
            setCurrentPageData(result.slice(0, itemsPerPage));
        }
    };

    const handleDelete = async (event, id) => {
        event.preventDefault();
        let res = await productVariantService.deleteProductVariant(id);
        if (res.message) {
            toast.success("Xóa biến thể thành công");
            fetchData();
        } else {
            toast.error("Xóa biến thể thất bại");
        }
    };

    const handleChangePage = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
        const offset = selectedPage.selected * itemsPerPage;
        const newData = dataVariants.slice(offset, offset + itemsPerPage);
        setCurrentPageData(newData);
    };

    const handleSearch = (keyword) => {
        let filtered = dataVariants.filter(item =>
            item.productName.toLowerCase().includes(keyword.toLowerCase())
        );
        setCurrentPageData(filtered.slice(0, itemsPerPage));
        setTotalCount(Math.ceil(filtered.length / itemsPerPage));
    };

    const handleExportExcel = async () => {
        if (dataVariants) {
            await CommonUtils.exportExcel(dataVariants, "Danh sách biến thể", "ListProductVariant");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Biến Thể Sản Phẩm</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-boxes me-1" />
                    Danh sách Biến Thể
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <FormSearch title={"Sản phẩm..."} handleSearch={handleSearch} />
                        </div>
                        <div className="col-8">
                            <button style={{ float: 'right' }} onClick={handleExportExcel} className="btn btn-success">
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Sản phẩm</th>
                                    <th>Màu</th>
                                    <th>Size</th>
                                    <th>Số lượng</th>
                                    <th>Ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData && currentPageData.length > 0 &&
                                    currentPageData.map((item, index) => {
                                        let url  = eval(item.imageUrl)
                                        return (
                                            <tr key={item.id}>
                                                <td>{index + 1 + (currentPage * itemsPerPage)}</td>
                                                <td>{item.product.name}</td>
                                                <td>{item.color.name}</td>
                                                <td>{item.size.name}</td>
                                                <td>{item.stock}</td>
                                                <td>
                                                    {url && Array.isArray(url) && url.length > 0 ? (
                                                        url.map((url, idx) => (
                                                            <img key={idx} src={url} alt="img" width={40} height={40} style={{ objectFit: 'cover', marginRight: 5 }} />
                                                        ))
                                                    ) : 'Không có ảnh'}
                                                </td>
                                                <td>
                                                    <Link to={`/admin/edit-product-variant/${item.id}`}>Edit</Link>
                                                    &nbsp;|&nbsp;
                                                    <a href="#" onClick={(e) => handleDelete(e, item.id)}>Delete</a>
                                                </td>
                                            </tr>
                                        )
                                    })
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

export default ManageProductVariant;
