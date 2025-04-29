import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { PAGINATION } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import {
  getAllTypeVoucher,
  deleteTypeVoucherService,
  getAllVoucher,
  deleteVoucherService,
} from '../../../services/userService';
import 'react-toastify/dist/ReactToastify.css';

const ManageVouchers = () => {
  // State for voucher types
  const [dataTypeVoucher, setDataTypeVoucher] = useState([]);
  const [countTypeVoucher, setCountTypeVoucher] = useState('');
  const [numberPageTypeVoucher, setNumberPageTypeVoucher] = useState(0);

  // State for vouchers
  const [dataVoucher, setDataVoucher] = useState([]);
  const [countVoucher, setCountVoucher] = useState('');
  const [numberPageVoucher, setNumberPageVoucher] = useState(0);

  // Fetch initial data for both voucher types and vouchers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch voucher types
        const typeVoucherRes = await getAllTypeVoucher({
          limit: PAGINATION.pagerow,
          offset: 0,
        });
        if (typeVoucherRes && typeVoucherRes.errCode === 0) {
          setDataTypeVoucher(typeVoucherRes.data);
          setCountTypeVoucher(Math.ceil(typeVoucherRes.count / PAGINATION.pagerow));
        }

        // Fetch vouchers
        const voucherRes = await getAllVoucher({
          limit: PAGINATION.pagerow,
          offset: 0,
        });
        if (voucherRes && voucherRes.errCode === 0) {
          setDataVoucher(voucherRes.data);
          setCountVoucher(Math.ceil(voucherRes.count / PAGINATION.pagerow));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu!');
      }
    };
    fetchData();
  }, []);

  // Handle delete (toggle status) for voucher type
  const handleDeleteTypeVoucher = async (id) => {
    try {
      const res = await deleteTypeVoucherService({
        data: { id },
      });
      if (res && res.errCode === 0) {
        toast.success('Thay đổi trạng thái loại voucher thành công');
        const arrData = await getAllTypeVoucher({
          limit: PAGINATION.pagerow,
          offset: numberPageTypeVoucher * PAGINATION.pagerow,
        });
        if (arrData && arrData.errCode === 0) {
          setDataTypeVoucher(arrData.data);
          setCountTypeVoucher(Math.ceil(arrData.count / PAGINATION.pagerow));
        }
      } else {
        toast.error('Thay đổi trạng thái loại voucher thất bại');
      }
    } catch (error) {
      console.error('Error deleting type voucher:', error);
      toast.error('Lỗi khi thay đổi trạng thái loại voucher!');
    }
  };

  // Handle delete (toggle status) for voucher
  const handleDeleteVoucher = async (id) => {
    try {
      const res = await deleteVoucherService({
        data: { id },
      });
      if (res && res.errCode === 0) {
        toast.success('Thay đổi trạng thái mã voucher thành công');
        const arrData = await getAllVoucher({
          limit: PAGINATION.pagerow,
          offset: numberPageVoucher * PAGINATION.pagerow,
        });
        if (arrData && arrData.errCode === 0) {
          setDataVoucher(arrData.data);
          setCountVoucher(Math.ceil(arrData.count / PAGINATION.pagerow));
        }
      } else {
        toast.error('Thay đổi trạng thái mã voucher thất bại');
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Lỗi khi thay đổi trạng thái mã voucher!');
    }
  };

  // Handle page change for voucher types
  const handleChangePageTypeVoucher = async (number) => {
    const selectedPage = number.selected;
    setNumberPageTypeVoucher(selectedPage);
    try {
      const arrData = await getAllTypeVoucher({
        limit: PAGINATION.pagerow,
        offset: selectedPage * PAGINATION.pagerow,
      });
      if (arrData && arrData.errCode === 0) {
        setDataTypeVoucher(arrData.data);
      }
    } catch (error) {
      console.error('Error fetching type voucher page:', error);
      toast.error('Lỗi khi tải trang loại voucher!');
    }
  };

  // Handle page change for vouchers
  const handleChangePageVoucher = async (number) => {
    const selectedPage = number.selected;
    setNumberPageVoucher(selectedPage);
    try {
      const arrData = await getAllVoucher({
        limit: PAGINATION.pagerow,
        offset: selectedPage * PAGINATION.pagerow,
      });
      if (arrData && arrData.errCode === 0) {
        setDataVoucher(arrData.data);
      }
    } catch (error) {
      console.error('Error fetching voucher page:', error);
      toast.error('Lỗi khi tải trang mã voucher!');
    }
  };

  // Export voucher types to Excel
  const handleExportTypeVoucher = async () => {
    try {
      const res = await getAllTypeVoucher({
        limit: '',
        offset: '',
      });
      if (res && res.errCode === 0) {
        await CommonUtils.exportExcel(res.data, 'Danh sách loại voucher', 'ListTypeVoucher');
        toast.success('Xuất file Excel loại voucher thành công!');
      } else {
        toast.error('Xuất file Excel loại voucher thất bại!');
      }
    } catch (error) {
      console.error('Error exporting type voucher:', error);
      toast.error('Lỗi khi xuất file Excel loại voucher!');
    }
  };

  // Export vouchers to Excel
  const handleExportVoucher = async () => {
    try {
      const res = await getAllVoucher({
        limit: '',
        offset: '',
      });
      if (res && res.errCode === 0) {
        const formattedData = res.data.map((item) => ({
          ...item,
          fromDate: moment.unix(item.fromDate / 1000).format('DD/MM/YYYY'),
          toDate: moment.unix(item.toDate / 1000).format('DD/MM/YYYY'),
        }));
        await CommonUtils.exportExcel(formattedData, 'Danh sách voucher', 'ListVoucher');
        toast.success('Xuất file Excel mã voucher thành công!');
      } else {
        toast.error('Xuất file Excel mã voucher thất bại!');
      }
    } catch (error) {
      console.error('Error exporting voucher:', error);
      toast.error('Lỗi khi xuất file Excel mã voucher!');
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý voucher</h1>

      {/* Voucher Types Section */}
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Danh sách loại voucher
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 mb-2">
              <button
                style={{ float: 'right' }}
                onClick={handleExportTypeVoucher}
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
                  <th>Loại voucher</th>
                  <th>Giá trị</th>
                  <th>Giá trị tối thiểu</th>
                  <th>Giá trị tối đa</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataTypeVoucher && dataTypeVoucher.length > 0 ? (
                  dataTypeVoucher.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + numberPageTypeVoucher * PAGINATION.pagerow}</td>
                      <td>{item.typeVoucherData?.value}</td>
                      <td>
                        {item.typeVoucher === 'percent'
                          ? `${item.value}%`
                          : CommonUtils.formatter.format(item.value)}
                      </td>
                      <td>{CommonUtils.formatter.format(item.minValue)}</td>
                      <td>{CommonUtils.formatter.format(item.maxValue)}</td>
                      <td>
                        <Link to={`/admin/edit-typevoucher/${item.id}`}>Edit</Link>
                        &nbsp;&nbsp;
                        <span
                          onClick={() => handleDeleteTypeVoucher(item.id)}
                          style={{ color: '#0E6DFE', cursor: 'pointer' }}
                        >
                          {item.status === 'S1' ? 'Deactive' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={'Quay lại'}
            nextLabel={'Tiếp'}
            breakLabel={'...'}
            pageCount={countTypeVoucher}
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
            onPageChange={handleChangePageTypeVoucher}
          />
        </div>
      </div>

      {/* Vouchers Section */}
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Danh sách mã voucher
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 mb-2">
              <button
                style={{ float: 'right' }}
                onClick={handleExportVoucher}
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
                  <th>Mã voucher</th>
                  <th>Loại voucher</th>
                  <th>Số lượng</th>
                  <th>Đã sử dụng</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataVoucher && dataVoucher.length > 0 ? (
                  dataVoucher.map((item, index) => {
                    const name = `${item.typeVoucherOfVoucherData?.value} ${
                      item.typeVoucherOfVoucherData?.typeVoucherData?.value
                    }`;
                    return (
                      <tr key={index}>
                        <td>{index + 1 + numberPageVoucher * PAGINATION.pagerow}</td>
                        <td>{item.codeVoucher}</td>
                        <td>{name}</td>
                        <td>{item.amount}</td>
                        <td>{item.usedAmount}</td>
                        <td>{moment.unix(item.fromDate / 1000).format('DD/MM/YYYY')}</td>
                        <td>{moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}</td>
                        <td>
                          <Link to={`/admin/edit-voucher/${item.id}`}>Edit</Link>
                          &nbsp;&nbsp;
                          <span
                            onClick={() => handleDeleteVoucher(item.id)}
                            style={{ color: '#0E6DFE', cursor: 'pointer' }}
                          >
                            {item.status === 'S1' ? 'Deactive' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={'Quay lại'}
            nextLabel={'Tiếp'}
            breakLabel={'...'}
            pageCount={countVoucher}
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
            onPageChange={handleChangePageVoucher}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageVouchers;