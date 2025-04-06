const db = require('../models');
const { Favorite } = require('../models');
const getAllFavoritesByUser = async (userId) => {
    console.log("Bắt đầu lấy danh sách yêu thích cho người dùng:", userId);

    try {
        const favorites = await Favorite.findAll({
            where: { userId: userId },
            include: [{
                model: db.Product,
                as: 'product'
            }],
            raw: true,
            nest:true
        });

        if (!favorites) {
            console.log("Không có sản phẩm yêu thích nào");
        } else {
            console.log("Kết quả truy vấn:", favorites);
        }

        return favorites;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error.message);  // In lỗi chi tiết
        console.error("Thông tin lỗi:", error);  // Log thêm thông tin chi tiết của lỗi
        throw error;  // Ném lại lỗi để xử lý ở nơi khác nếu cần
    }
};



// 📌 Tạo yêu thích mới
const createFavorite = async (userId, productId) => {
    const existingFavorite = await Favorite.findOne({
        where: { userId, productId },
    });

    if (existingFavorite) {
        return { code: 201, message: "Sản phẩm đã được yêu thích" };
    }

    const favorite = await Favorite.create({ userId, productId });
    return { code: 200, message: "Sản phẩm yêu thích đã được thêm", data: favorite };
};

// 📌 Xóa yêu thích
const deleteFavorite = async (userId, productId) => {
    const favorite = await Favorite.findOne({
        where: { userId, productId },
        raw: false,
    });

    if (!favorite) {
        throw new Error('Yêu thích không tồn tại');
    }

    await favorite.destroy();
    return { message: 'Sản phẩm đã được xóa khỏi yêu thích' };
};

module.exports = { getAllFavoritesByUser, createFavorite, deleteFavorite };
