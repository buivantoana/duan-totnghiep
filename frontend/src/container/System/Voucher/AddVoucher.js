// src/components/AddVoucher.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import DatePicker from '../../../component/input/DatePicker'; // Adjust path to your DatePicker component
import {
  getSelectTypeVoucher,
  createNewVoucherService,
  getDetailVoucherByIdService,
  updateVoucherService,
  createNewTypeVoucherService,
  getDetailTypeVoucherByIdService,
  updateTypeVoucherService,
} from '../../../services/userService';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';

const AddVoucher = () => {
  const { id } = useParams();
  const { data: dataTypeVoucher } = useFetchAllcode('DISCOUNT');
  const [dataTypeVoucherList, setDataTypeVoucherList] = useState([]);
  const [isActionADD, setIsActionADD] = useState(true);

  const [inputValues, setInputValues] = useState({
    typeVoucher: '',
    value: '',
    maxValue: '',
    minValue: '',
    fromDate: '',
    toDate: '',
    typeVoucherId: '',
    amount: '',
    codeVoucher: '',
    isChangeFromDate: false,
    isChangeToDate: false,
    fromDateUpdate: '',
    toDateUpdate: '',
  });

  // Initialize typeVoucher if empty
  useEffect(() => {
    if (dataTypeVoucher && dataTypeVoucher.length > 0 && !inputValues.typeVoucher) {
      setInputValues({ ...inputValues, typeVoucher: dataTypeVoucher[0].code });
    }
  }, [dataTypeVoucher]);

  // Fetch type voucher list and voucher details (if editing)
  useEffect(() => {
    const fetchTypeVoucher = async () => {
      const typeVoucher = await getSelectTypeVoucher();
      if (typeVoucher && typeVoucher.errCode === 0) {
        setDataTypeVoucherList(typeVoucher.data);
        if (typeVoucher.data.length > 0 && !inputValues.typeVoucherId) {
          setInputValues((prev) => ({ ...prev, typeVoucherId: typeVoucher.data[0].id }));
        }
      }
    };
    fetchTypeVoucher();

    if (id) {
      const fetchVoucher = async () => {
        setIsActionADD(false);
        const voucher = await getDetailVoucherByIdService(id);
        if (voucher && voucher.errCode === 0) {
          const typeVoucher = await getDetailTypeVoucherByIdService(voucher.data.typeVoucherId);
          if (typeVoucher && typeVoucher.errCode === 0) {
            setInputValues({
              ...inputValues,
              fromDate: moment.unix(+voucher.data.fromDate / 1000).locale('vi').format('DD/MM/YYYY'),
              toDate: moment.unix(+voucher.data.toDate / 1000).locale('vi').format('DD/MM/YYYY'),
              typeVoucherId: voucher.data.typeVoucherId,
              amount: voucher.data.amount,
              codeVoucher: voucher.data.codeVoucher,
              isActionADD: false,
              fromDateUpdate: voucher.data.fromDate,
              toDateUpdate: voucher.data.toDate,
              typeVoucher: typeVoucher.data.typeVoucher,
              value: typeVoucher.data.value,
              maxValue: typeVoucher.data.maxValue,
              minValue: typeVoucher.data.minValue,
            });
          }
        }
      };
      fetchVoucher();
    }
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOnChangeDatePickerFromDate = (date) => {
    setInputValues({
      ...inputValues,
      fromDate: date[0],
      isChangeFromDate: true,
    });
  };

  const handleOnChangeDatePickerToDate = (date) => {
    setInputValues({
      ...inputValues,
      toDate: date[0],
      isChangeToDate: true,
    });
  };

  const handleSaveVoucher = async () => {
    // Validate required fields
    const requiredFields = [
      'typeVoucher',
      'value',
      'maxValue',
      'minValue',
      'fromDate',
      'toDate',
      'amount',
      'codeVoucher',
    ];
    for (const field of requiredFields) {
      if (!inputValues[field]) {
        toast.error('Tất cả các trường đều là bắt buộc!');
        return;
      }
    }

    // Validate numeric fields
    const numericFields = {
      value: 'Giá trị',
      maxValue: 'Giá trị tối đa',
      minValue: 'Giá trị tối thiểu',
      amount: 'Số lượng mã',
    };
    for (const [field, label] of Object.entries(numericFields)) {
      if (isNaN(inputValues[field]) || Number(inputValues[field]) < 0) {
        toast.error(`${label} phải là số và không được âm!`);
        return;
      }
    }

    // Validate typeVoucher specific rules
    if (inputValues.typeVoucher === 'percent' && Number(inputValues.value) > 100) {
      toast.error('Giá trị phần trăm không được lớn hơn 100!');
      return;
    }

    // Validate minValue <= maxValue
    if (Number(inputValues.minValue) > Number(inputValues.maxValue)) {
      toast.error('Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa!');
      return;
    }

    // Validate fromDate <= toDate
    if (new Date(inputValues.fromDate) > new Date(inputValues.toDate)) {
      toast.error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!');
      return;
    }

    try {
      if (isActionADD) {
        // Create new type voucher
        const typeVoucherRes = await createNewTypeVoucherService({
          typeVoucher: inputValues.typeVoucher,
          value: inputValues.value,
          maxValue: inputValues.maxValue,
          minValue: inputValues.minValue,
        });

        if (typeVoucherRes && typeVoucherRes.errCode === 0) {
          // Create new voucher
          const voucherRes = await createNewVoucherService({
            fromDate: new Date(inputValues.fromDate).getTime(),
            toDate: new Date(inputValues.toDate).getTime(),
            typeVoucherId: typeVoucherRes.id,
            amount: inputValues.amount,
            codeVoucher: inputValues.codeVoucher,
          });

          if (voucherRes && voucherRes.errCode === 0) {
            toast.success('Tạo voucher thành công!');
            setInputValues({
              typeVoucher: dataTypeVoucher[0]?.code || '',
              value: '',
              maxValue: '',
              minValue: '',
              fromDate: '',
              toDate: '',
              typeVoucherId: voucherRes.id,
              amount: '',
              codeVoucher: '',
              isChangeFromDate: false,
              isChangeToDate: false,
              fromDateUpdate: '',
              toDateUpdate: '',
            });
          } else {
            toast.error(voucherRes?.errMessage || 'Tạo voucher thất bại!');
          }
        } else {
          toast.error(typeVoucherRes?.errMessage || 'Tạo loại voucher thất bại!');
        }
      } else {
        // Update type voucher
        const typeVoucherRes = await updateTypeVoucherService({
          typeVoucher: inputValues.typeVoucher,
          value: inputValues.value,
          maxValue: inputValues.maxValue,
          minValue: inputValues.minValue,
          id: inputValues.typeVoucherId,
        });

        if (typeVoucherRes && typeVoucherRes.errCode === 0) {
          // Update voucher
          const voucherRes = await updateVoucherService({
            fromDate: inputValues.isChangeFromDate
              ? new Date(inputValues.fromDate).getTime()
              : inputValues.fromDateUpdate,
            toDate: inputValues.isChangeToDate
              ? new Date(inputValues.toDate).getTime()
              : inputValues.toDateUpdate,
            typeVoucherId: inputValues.typeVoucherId,
            amount: inputValues.amount,
            codeVoucher: inputValues.codeVoucher,
            id,
          });

          if (voucherRes && voucherRes.errCode === 0) {
            toast.success('Cập nhật voucher thành công!');
          } else {
            toast.error(voucherRes?.errMessage || 'Cập nhật voucher thất bại!');
          }
        } else {
          toast.error(typeVoucherRes?.errMessage || 'Cập nhật loại voucher thất bại!');
        }
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
      console.error(error);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý voucher</h1>
      {/* Tailwind: <h1 className="mt-4 text-2xl font-bold">Quản lý voucher</h1> */}

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          {isActionADD ? 'Thêm mới voucher' : 'Cập nhật thông tin voucher'}
        </div>
        {/* Tailwind: <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center">
            <i className="fas fa-table mr-2" />
            {isActionADD ? 'Thêm mới voucher' : 'Cập nhật thông tin voucher'}
          </div> */}

        <div className="card-body">
          <form>
            <div className="form-row">
              {/* Type Voucher */}
              <div className="form-group col-md-6">
                <label htmlFor="typeVoucher">Loại voucher</label>
                <select
                  value={inputValues.typeVoucher}
                  name="typeVoucher"
                  onChange={handleOnChange}
                  id="typeVoucher"
                  className="form-control"
                >
                  {dataTypeVoucher &&
                    dataTypeVoucher.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
                {/* Tailwind: 
                <select
                  className="w-full p-2 border rounded-md"
                  ...
                >
                */}
              </div>

              {/* Value */}
              <div className="form-group col-md-6">
                <label htmlFor="value">Giá trị</label>
                <input
                  type="text"
                  value={inputValues.value}
                  name="value"
                  onChange={handleOnChange}
                  className="form-control"
                  id="value"
                />
                {/* Tailwind: <input className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* Min Value */}
              <div className="form-group col-md-6">
                <label htmlFor="minValue">Giá trị tối thiểu</label>
                <input
                  type="number"
                  value={inputValues.minValue}
                  name="minValue"
                  onChange={handleOnChange}
                  className="form-control"
                  id="minValue"
                />
                {/* Tailwind: <input type="number" className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* Max Value */}
              <div className="form-group col-md-6">
                <label htmlFor="maxValue">Giá trị tối đa</label>
                <input
                  type="number"
                  value={inputValues.maxValue}
                  name="maxValue"
                  onChange={handleOnChange}
                  className="form-control"
                  id="maxValue"
                />
                {/* Tailwind: <input type="number" className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* From Date */}
              <div className="form-group col-md-6">
                <label htmlFor="fromDate">Ngày bắt đầu</label>
                <DatePicker
                  className="form-control"
                  onChange={handleOnChangeDatePickerFromDate}
                  value={inputValues.fromDate}
                />
                {/* Tailwind: <DatePicker className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* To Date */}
              <div className="form-group col-md-6">
                <label htmlFor="toDate">Ngày kết thúc</label>
                <DatePicker
                  className="form-control"
                  onChange={handleOnChangeDatePickerToDate}
                  value={inputValues.toDate}
                />
                {/* Tailwind: <DatePicker className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* Type Voucher ID */}
              {/* <div className="form-group col-md-4">
                <label htmlFor="typeVoucherId">Loại voucher áp dụng</label>
                <select
                  value={inputValues.typeVoucherId}
                  name="typeVoucherId"
                  onChange={handleOnChange}
                  id="typeVoucherId"
                  className="form-control"
                >
                  {dataTypeVoucherList &&
                    dataTypeVoucherList.map((item, index) => {
                      const name = `${item.value} ${item.typeVoucherData.value}`;
                      return (
                        <option key={index} value={item.id}>
                          {name}
                        </option>
                      );
                    })}
                </select>
              
              </div> */}

              {/* Amount */}
              <div className="form-group col-md-6">
                <label htmlFor="amount">Số lượng mã</label>
                <input
                  type="number"
                  value={inputValues.amount}
                  name="amount"
                  onChange={handleOnChange}
                  className="form-control"
                  id="amount"
                />
                {/* Tailwind: <input type="number" className="w-full p-2 border rounded-md" ... /> */}
              </div>

              {/* Code Voucher */}
              <div className="form-group col-md-6">
                <label htmlFor="codeVoucher">Mã voucher</label>
                <input
                  type="text"
                  value={inputValues.codeVoucher}
                  name="codeVoucher"
                  onChange={handleOnChange}
                  className="form-control"
                  id="codeVoucher"
                />
                {/* Tailwind: <input className="w-full p-2 border rounded-md" ... /> */}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveVoucher}
              className="btn btn-primary mt-3"
            >
              Lưu thông tin
            </button>
            {/* Tailwind: <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" ...>Lưu thông tin</button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVoucher;