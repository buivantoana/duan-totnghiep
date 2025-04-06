import React from 'react';
import { useEffect, useState } from 'react';

import moment from 'moment';
import { toast } from 'react-toastify';

import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";


const DeleteShopCartModal = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    let handleCloseModal = () => {
        if (!isLoading) {
            props.closeModal()
        }
    }

    let handleDelete = async () => {
        try {
            setIsLoading(true);
            await props.handleDeleteShopCart();
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            handleCloseModal();
        } catch (error) {
            toast.error('Xóa thất bại');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Bạn chắc chắn muốn bỏ sản phẩm này?</h5>
                    <button 
                        onClick={handleCloseModal} 
                        type="button" 
                        className="btn btn-time" 
                        aria-label="Close"
                        disabled={isLoading}
                    >X</button>
                </div>
                <ModalBody>
                    <div style={{ padding: '10px 20px', fontSize: '20px' }} className="row">
                        {props.name}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Thực hiện'}
                    </Button>
                    {' '}
                    <Button onClick={handleCloseModal} disabled={isLoading}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </div >
    )
}
export default DeleteShopCartModal;