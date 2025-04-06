import db from "../models/index";


let addShopCart = async (data) => {
    try {
        // Kiểm tra các tham số bắt buộc
       
            if (!data.userId || !data.productdetailsizeId || !data.quantity || !data.productdetailcolor ||!data.productId) {
                return {
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                };
            }
       


        let cart = await db.ShopCart.findOne({
            where: {
                userId: data.userId,
                productdetailsizeId: data.productdetailsizeId,
                productdetailcolor: data.productdetailcolor,
                productId:data.productId,
                statusId: 0
            },
            raw: false
        });
        console.log(cart)
        // Nếu giỏ hàng đã tồn tại
        if (cart) {
            if (data.type === "UPDATE_QUANTITY") {
                // Cập nhật số lượng nếu yêu cầu là cập nhật
                cart.quantity = +data.quantity;
                await cart.save();
            } else {
                // Nếu không phải cập nhật, tăng số lượng lên
                cart.quantity += +data.quantity;
                await cart.save();
            }
        } else {
            // Nếu giỏ hàng chưa tồn tại, tạo mới
            await db.ShopCart.create({
                userId: data.userId,
                productdetailsizeId: data.productdetailsizeId,
                quantity: data.quantity,
                productdetailcolor: data.productdetailcolor,
                productId:data.productId,
                statusId: 0 // Giỏ hàng đang trong trạng thái chưa thanh toán
            });
        }

        return {
            errCode: 0,
            errMessage: 'Success'
        };
    } catch (error) {
        console.log(error)
        // Xử lý lỗi
        return {
            errCode: 500,
            errMessage: 'Internal Server Error'
        };
    }
};

let getAllShopCartByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShopCart.findAll({
                    where: { userId: id, statusId: 0 },
                     include: [
                             { model: db.Product, as: 'product' },
                         ],
                         raw: true,
                         nest: true,
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        data: res
                    })
                }
            }
        } catch (error) {
            console.log("cart" , error)
            reject(error)
        }
    })
}
let deleteItemShopCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let res = await db.ShopCart.findOne({ where: { id: data.id, statusId: 0 } })
                if (res) {
                    await db.ShopCart.destroy({
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    addShopCart: addShopCart,
    getAllShopCartByUserId: getAllShopCartByUserId,
    deleteItemShopCart: deleteItemShopCart
}