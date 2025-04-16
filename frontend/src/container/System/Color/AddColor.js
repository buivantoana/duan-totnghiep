import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import colorService from '../../../services/color';

const AddColor = () => {
    const [isActionADD, setIsActionADD] = useState(true);
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        name: '',
        hexCode: '#000000'
    });

    useEffect(() => {
        if (id) {
            let fetchDetailColor = async () => {
                setIsActionADD(false);
                let arrData = await colorService.getDetailColor(id);
                console.log(arrData);
                if (Object.keys(arrData).length > 0) {
                    setInputValues({
                        name: arrData.name,
                        hexCode: arrData.hexCode
                    });
                }
            };
            fetchDetailColor();
        }
    }, [id]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Cập nhật mã hex khi người dùng chọn màu
    const handleColorChange = (event) => {
        setInputValues({ ...inputValues, hexCode: event.target.value });
    };

    const handleSaveColor = async () => {
        if (inputValues.name.trim() === '') {
            toast.error("Tên màu là bắt buộc");
            return;
        }
    
        if (inputValues.hexCode.trim() === '') {
            toast.error("Mã màu là bắt buộc");
            return;
        }
        if (isActionADD) {
            console.log(inputValues);
            let res = await colorService.createColor(inputValues.name, inputValues.hexCode);
            console.log(res);
            if (res && res.code === 200) {
                toast.success("Thêm màu thành công");
                setInputValues({
                    name: "",
                    hexCode: ""
                });
            } else {
                toast.error(res.message);
            }
        } else {
            let res = await colorService.updateColor(id, inputValues.name, inputValues.hexCode);
            if (res && res.code === 200) {
                toast.success("Cập nhật màu thành công");
            } else {
                toast.error(res.message);
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Màu Sắc</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-palette me-1" />
                    {isActionADD === true ? 'Thêm mới Màu' : 'Cập nhật thông tin Màu'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputColorName">Tên Màu</label>
                                <input
                                    type="text"
                                    value={inputValues.name}
                                    name="name"
                                    onChange={handleOnChange}
                                    className="form-control"
                                    id="inputColorName"
                                />
                            </div>

                            <div className="form-group col-md-2">
                                <label htmlFor="inputHexCode">Mã Màu (HexCode)</label>
                                <input
                                    style={{ padding: "0px" }}
                                    type="color"
                                    value={inputValues.hexCode}
                                    name="hexCode"
                                    onChange={handleColorChange}
                                    className="form-control"
                                    id="inputHexCode"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveColor}
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

export default AddColor;
