import React from 'react';
import { useEffect, useState } from 'react';
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService';

import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import moment from 'moment';
import sizeService from '../../../services/size';
const AddSize = (props) => {



    const [isActionADD, setisActionADD] = useState(true)


    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        name: ''
    });

    useEffect(() => {

        if (id) {
            let fetchDetailSize = async () => {
                setisActionADD(false)
                let arrData = await sizeService.getDetailSizes(id);
                console.log(arrData);
                if (Object.keys(arrData).length > 0) {
                    setInputValues({
                        name: Number(arrData.name)
                    })
                }
            }
            fetchDetailSize()
        }
    }, [])


    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };
    let handleSaveCategory = async () => {
        if (inputValues.name === "" || Number(inputValues.name) < 0) {
            toast.error("Size là bắt buộc và không được nhỏ hơn 0");
            return;
        }
        if (isActionADD === true) {
            let res = await sizeService.createSize(inputValues.name)
            console.log(res);
            if (res && res.code == 200) {
                toast.success("Thêm size thành công")
                setInputValues({
                    name: ""
                })
            }
            else {
                toast.error(res.message)
            }

        } else {
            let res = await sizeService.updateSize(id, inputValues.name)
            if (res && res.code == 200) {
                toast.success("Cập nhật size thành công")

            }
            else {
                toast.error(res.message)
            }
        }
    }


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Size</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD === true ? 'Thêm mới Size' : 'Cập nhật thông tin Size'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Size</label>
                                <input type="number" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>

                        </div>
                        <button type="button" onClick={() => handleSaveCategory()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddSize;