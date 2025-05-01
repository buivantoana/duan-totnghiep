import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import ReactPaginate from 'react-paginate';
import productVariantService from '../../../services/product_variant';
import { getAllProductAdmin, handleBanProductService, handleActiveProductService } from '../../../services/userService';
import colorService from '../../../services/color';
import sizeService from '../../../services/size';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { uploadImage } from '../../../services/upload';

// Hàm chuyển đổi chuỗi có dấu thành không dấu
const removeAccents = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const ManageProduct = () => {
    // State for products
    const [dataProduct, setDataProduct] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [productPage, setProductPage] = useState(0);
    const [productKeyword, setProductKeyword] = useState('');

    // State for variants
    const [dataVariants, setDataVariants] = useState([]);
    const [currentVariantPageData, setCurrentVariantPageData] = useState([]);
    const [variantTotalCount, setVariantTotalCount] = useState(0);
    const [currentVariantPage, setCurrentVariantPage] = useState(0);
    const [variantKeyword, setVariantKeyword] = useState(''); // State cho từ khóa tìm kiếm biến thể
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProductName, setSelectedProductName] = useState('');
    const [showVariants, setShowVariants] = useState(false);
    const itemsPerPage = 5;

    // State for add variant modal
    const [showAddVariantModal, setShowAddVariantModal] = useState(false);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [newVariant, setNewVariant] = useState({
        colorId: '',
        sizeId: '',
        stock: '',
        imageUrls: [],
        hexCode: '#000000'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchColorsAndSizes();
    }, []);

    // Fetch colors and sizes for variant modal
    const fetchColorsAndSizes = async () => {
        try {
            const colorRes = await colorService.getAllColor(true);
            const sizeRes = await sizeService.getAllSizes(true);
            setColors(colorRes);
            setSizes(sizeRes);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu màu sắc và kích thước');
        }
    };

    // Product functions
    const fetchProducts = async (keyword = '') => {
        let arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: PAGINATION.pagerow,
            offset: productPage * PAGINATION.pagerow,
            keyword: keyword
        });

        if (arrData && arrData.errCode === 0) {
            setDataProduct(arrData.data);
            setProductCount(Math.ceil(arrData.count / PAGINATION.pagerow));
        }
    };

    const handleBanProduct = async (id) => {
        let data = await handleBanProductService({ id });
        if (data && data.errCode === 0) {
            toast.success("Ẩn sản phẩm thành công!");
            fetchProducts(productKeyword);
        } else {
            toast.error("Ẩn sản phẩm thất bại!");
        }
    };

    const handleActiveProduct = async (id) => {
        let data = await handleActiveProductService({ id });
        if (data && data.errCode === 0) {
            toast.success("Hiện sản phẩm thành công!");
            fetchProducts(productKeyword);
        } else {
            toast.error("Hiện sản phẩm thất bại!");
        }
    };

    const handleProductPageChange = async (number) => {
        setProductPage(number.selected);
        let arrData = await getAllProductAdmin({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword: productKeyword
        });
        if (arrData && arrData.errCode === 0) {
            setDataProduct(arrData.data);
        }
    };

    const handleSearchProduct = (keyword) => {
        fetchProducts(keyword);
        setProductKeyword(keyword);
    };

    // Variant functions
    const fetchVariants = async (productId, productName) => {
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        let result = await productVariantService.getVariantsByProductId(productId);
        if (result) {
            setDataVariants(result);
            setVariantTotalCount(Math.ceil(result.length / itemsPerPage));
            setCurrentVariantPageData(result.slice(0, itemsPerPage));
            setShowVariants(true);
            setVariantKeyword(''); // Reset từ khóa tìm kiếm khi mở danh sách biến thể
        }
    };

    const handleDeleteVariant = async (event, id) => {
        event.preventDefault();
        let res = await productVariantService.deleteProductVariant(id);
        if (res.message) {
            toast.success("Thay đổi trạng thái biến thể thành công");
            fetchVariants(selectedProductId, selectedProductName);
        } else {
            toast.error("Thay đổi trạng thái biến thể thất bại");
        }
    };

    const handleVariantPageChange = (selectedPage) => {
        setCurrentVariantPage(selectedPage.selected);
        const offset = selectedPage.selected * itemsPerPage;
        const newData = dataVariants.slice(offset, offset + itemsPerPage);
        setCurrentVariantPageData(newData);
    };

    const handleSearchVariant = () => {
        let filtered = dataVariants;
        if (variantKeyword) {
            filtered = dataVariants.filter((item) =>
                removeAccents(item.product.name.toLowerCase()).includes(
                    removeAccents(variantKeyword.toLowerCase())
                ) ||
                removeAccents(item.color?.name.toLowerCase() || '').includes(
                    removeAccents(variantKeyword.toLowerCase())
                ) ||
                removeAccents(item.size?.name.toLowerCase() || '').includes(
                    removeAccents(variantKeyword.toLowerCase())
                )
            );
        }
        setCurrentVariantPageData(filtered.slice(0, itemsPerPage));
        setVariantTotalCount(Math.ceil(filtered.length / itemsPerPage));
        setCurrentVariantPage(0); // Reset về trang đầu khi tìm kiếm
    };

    // Add Variant Modal functions
    const handleAddVariantModalShow = () => setShowAddVariantModal(true);
    const handleAddVariantModalClose = () => {
        setShowAddVariantModal(false);
        setNewVariant({
            colorId: '',
            sizeId: '',
            stock: '',
            imageUrls: [],
            hexCode: '#000000'
        });
    };

    const handleNewVariantChange = (e) => {
        const { name, value } = e.target;
        setNewVariant({
            ...newVariant,
            [name]: value
        });
    };

    const handleNewVariantImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + newVariant.imageUrls.length > 5) {
            toast.error('Bạn chỉ có thể tải tối đa 5 ảnh cho mỗi biến thể.');
            return;
        }
        setNewVariant({
            ...newVariant,
            imageUrls: [...newVariant.imageUrls, ...files]
        });
    };

    const handleRemoveNewVariantImage = (index) => {
        const updatedImages = [...newVariant.imageUrls];
        updatedImages.splice(index, 1);
        setNewVariant({
            ...newVariant,
            imageUrls: updatedImages
        });
    };

    const uploadImages = async (files) => {
        const uploadedUrls = [];
        for (let file of files) {
            if (typeof file === 'string') {
                uploadedUrls.push(file); // Keep existing URLs
                continue;
            }
            const formData = new FormData();
            formData.append('image', file);
            try {
                const uploadRes = await uploadImage(formData);
                if (uploadRes?.url) {
                    uploadedUrls.push(uploadRes.url);
                }
            } catch (error) {
                toast.error('Lỗi khi tải ảnh lên');
                return null;
            }
        }
        return uploadedUrls;
    };

    const handleAddVariantSubmit = async () => {
        if (!newVariant.colorId || !newVariant.sizeId || !newVariant.stock) {
            toast.error('Vui lòng điền đầy đủ thông tin biến thể');
            return;
        }

        // Check if variant already exists
        const existingVariant = dataVariants.find(v =>
            v.colorId === newVariant.colorId && v.sizeId === newVariant.sizeId
        );

        if (existingVariant) {
            toast.error('Biến thể với màu và size này đã tồn tại!');
            return;
        }

        setLoading(true);
        try {
            // Upload images
            const uploadRes = await uploadImages(newVariant.imageUrls);
            // Create variant
            const variantData = {
                productId: selectedProductId,
                colorId: newVariant.colorId,
                sizeId: newVariant.sizeId,
                stock: newVariant.stock,
                price: 0, // As per original
                imageUrl: JSON.stringify(uploadRes),
            };

            const res = await productVariantService.createProductVariant(variantData);
            if (res && res.code === 200) {
                toast.success('Thêm biến thể thành công!');
                fetchVariants(selectedProductId, selectedProductName);
                handleAddVariantModalClose();
            } else {
                throw new Error(res?.message || 'Lỗi khi thêm biến thể');
            }
        } catch (error) {
            console.error('Error adding variant:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi thêm biến thể');
        } finally {
            setLoading(false);
        }
    };

    // Export functions
    const handleExportProductExcel = async () => {
        let res = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword: '',
            limit: '',
            offset: ''
        });
        if (res && res.errCode === 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách sản phẩm", "ListProduct");
        }
    };

    const handleExportVariantExcel = async () => {
        if (dataVariants) {
            await CommonUtils.exportExcel(dataVariants, "Danh sách biến thể", "ListProductVariant");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý Sản phẩm và Biến thể</h1>

            {/* Product Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input
                                        onChange={(e) => {
                                            setProductKeyword(e.target.value);
                                            if (!e.target.value) fetchProducts('');
                                        }}
                                        value={productKeyword}
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm theo tên sản phẩm..."
                                    />
                                    <div className="input-group-append">
                                        <button
                                            onClick={() => handleSearchProduct(productKeyword)}
                                            className="btn"
                                            type="button"
                                        >
                                            <i className="ti-search" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-8'>
                            <button
                                style={{ float: 'right' }}
                                onClick={handleExportProductExcel}
                                className="btn btn-success"
                            >
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ảnh sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Nhãn hàng</th>
                                    <th>Giá gốc</th>
                                    <th>Giá khuyến mãi</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataProduct && dataProduct.length > 0 &&
                                    dataProduct.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><img src={item.image} width={30} height={30} style={{ objectFit: "cover", borderRadius: "5px" }} alt='' /></td>
                                                <td>{item.name}</td>
                                                <td>{item.categoryData.value}</td>
                                                <td>{item.brandData.value}</td>
                                                <td>{CommonUtils.formatter.format(item.originalPrice)}</td>
                                                <td>{CommonUtils.formatter.format(item.discountPrice)}</td>
                                                <td>{item.statusData.value}</td>
                                                <td style={{ width: '20%' }}>
                                                    <Link to={`/admin/edit-product/${item.id}`}>Edit</Link>
                                                    |
                                                    {item.statusData.code === 'S1' ?
                                                        <span onClick={() => handleBanProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}>Deactive</span>
                                                        : <span onClick={() => handleActiveProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}>Active</span>
                                                    }
                                                    |
                                                    <span
                                                        onClick={() => fetchVariants(item.id, item.name)}
                                                        style={{ color: '#0E6DFE', cursor: 'pointer' }}
                                                    >
                                                        Biến thể
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={productCount}
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
                        onPageChange={handleProductPageChange}
                    />
                </div>
            </div>

            {/* Variant Section - Only shown when a product is selected */}
            {showVariants && (
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-boxes me-1" />
                        Danh sách Biến Thể cho Sản phẩm: {selectedProductName}
                        <button
                            className="btn btn-primary btn-sm float-end me-2"
                            onClick={handleAddVariantModalShow}
                        >
                            Thêm biến thể
                        </button>
                        <button
                            className="btn btn-secondary btn-sm float-end me-2"
                            onClick={() => setShowVariants(false)}
                        >
                            Đóng
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <div className="input-group mb-3">
                                        <input
                                            onChange={(e) => setVariantKeyword(e.target.value)}
                                            value={variantKeyword}
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm theo tên sản phẩm, màu, size..."
                                        />
                                        <div className="input-group-append">
                                            <button
                                                onClick={handleSearchVariant}
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
                                    onClick={handleExportVariantExcel}
                                    className="btn btn-success"
                                >
                                    Xuất excel <i className="fa-solid fa-file-excel"></i>
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Màu</th>
                                        <th>Size</th>
                                        <th>Số lượng</th>
                                        <th>Ảnh</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentVariantPageData && currentVariantPageData.length > 0 ?
                                        currentVariantPageData.map((item, index) => {
                                            let url;
                                            try {
                                                url = JSON.parse(item.imageUrl);
                                            } catch (e) {
                                                url = [];
                                            }
                                            return (
                                                <tr key={item.id}>
                                                    <td>{index + 1 + (currentVariantPage * itemsPerPage)}</td>
                                                    <td>{item.color?.name}</td>
                                                    <td>{item.size?.name}</td>
                                                    <td>{item.stock}</td>
                                                    <td>
                                                        {url && Array.isArray(url) && url.length > 0 ? (
                                                            url.map((imgUrl, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={imgUrl}
                                                                    alt="img"
                                                                    width={40}
                                                                    height={40}
                                                                    style={{ objectFit: 'cover', marginRight: 5 }}
                                                                />
                                                            ))
                                                        ) : 'Không có ảnh'}
                                                    </td>
                                                    <td>{item.status === "S1" ? "Active" : "Inactive"}</td>
                                                    <td>
                                                        <Link to={`/admin/edit-product-variant/${item.id}`}>Edit</Link>
                                                        |
                                                        <a
                                                            href="#"
                                                            onClick={(e) => handleDeleteVariant(e, item.id)}
                                                        >
                                                            {item.status === "S1" ? "Deactive" : "Active"}
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">Không có biến thể nào</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            {currentVariantPageData && currentVariantPageData.length > 0 && (
                                <ReactPaginate
                                    previousLabel={'Quay lại'}
                                    nextLabel={'Tiếp'}
                                    breakLabel={'...'}
                                    pageCount={variantTotalCount}
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
                                    onPageChange={handleVariantPageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Variant Modal */}
            <Modal show={showAddVariantModal} onHide={handleAddVariantModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm biến thể mới cho {selectedProductName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Màu sắc</label>
                            <select
                                name="colorId"
                                value={newVariant.colorId}
                                onChange={handleNewVariantChange}
                                className="form-control"
                            >
                                <option value="">Chọn màu</option>
                                {colors.map(color => (
                                    <option key={color.id} value={color.id}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Size</label>
                            <select
                                name="sizeId"
                                value={newVariant.sizeId}
                                onChange={handleNewVariantChange}
                                className="form-control"
                            >
                                <option value="">Chọn size</option>
                                {sizes.map(size => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Số lượng</label>
                            <input
                                type="number"
                                name="stock"
                                value={newVariant.stock}
                                onChange={handleNewVariantChange}
                                className="form-control"
                                min="0"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Ảnh biến thể (Tối đa 5 ảnh)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleNewVariantImageChange}
                                className="form-control"
                                disabled={newVariant.imageUrls.length >= 5}
                            />
                            <small className="text-muted">
                                {newVariant.imageUrls.length}/5 ảnh đã chọn
                            </small>
                        </div>
                        <div className="form-group col-md-12">
                            <div className="d-flex flex-wrap">
                                {newVariant.imageUrls.map((image, index) => (
                                    <div key={index} className="position-relative me-3 mb-3">
                                        <img
                                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                            alt={`variant-preview-${index}`}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '5px'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                            onClick={() => handleRemoveNewVariantImage(index)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddVariantModalClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddVariantSubmit} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Lưu biến thể'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageProduct;