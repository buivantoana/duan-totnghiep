import React from 'react';
import { useEffect, useState } from 'react';
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = (props) => {
    const [isActionADD, setisActionADD] = useState(true);
    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        value: '', code: ''
    });

    useEffect(() => {
        if (id) {
            let fetchDetailCategory = async () => {
                setisActionADD(false);
                let allcode = await getDetailAllcodeById(id);
                if (allcode && allcode.errCode === 0) {
                    setInputValues({
                        value: allcode.data.value,
                        code: allcode.data.code
                    });
                }
            };
            fetchDetailCategory();
        }
    }, [id]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const validateInput = () => {
        if (!inputValues.value || inputValues.value.trim() === '') {
            toast.error("Vui lòng nhập tên danh mục");
            return false;
        }
        if (!inputValues.code || inputValues.code.trim() === '') {
            toast.error("Vui lòng nhập mã code");
            return false;
        }
        return true;
    };

    const handleSaveCategory = async () => {
        if (!validateInput()) return;

        if (isActionADD) {
            let res = await createAllCodeService({
                value: inputValues.value,
                code: inputValues.code,
                type: 'CATEGORY'
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm danh mục thành công");
                setInputValues({ value: '', code: '' });
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Thêm danh mục thất bại");
            }
        } else {
            let res = await UpdateAllcodeService({
                value: inputValues.value,
                code: inputValues.code,
                id: id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật danh mục thành công");
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Cập nhật danh mục thất bại");
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý danh mục</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới danh mục' : 'Cập nhật thông tin danh mục'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputValue">Tên danh mục</label>
                                <input
                                    type="text"
                                    value={inputValues.value}
                                    name="value"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputValue"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputCode">Mã code</label>
                                <input
                                    type="text"
                                    value={inputValues.code}
                                    name="code"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputCode"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveCategory}
                            className="btn btn-primary"
                        >
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
