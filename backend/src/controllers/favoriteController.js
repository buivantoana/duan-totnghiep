const favoriteService = require('../services/favoriteService');

// 📌 Lấy tất cả yêu thích của người dùng
const getAllFavoritesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await favoriteService.getAllFavoritesByUser(userId);
        return res.status(200).json({ code: 200, message: "Success", data: favorites });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
};

// 📌 Tạo yêu thích mới
const createFavorite = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ code: 400, message: 'UserId và ProductId là bắt buộc' });
        }

        const result = await favoriteService.createFavorite(userId, productId);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
};

// 📌 Xóa yêu thích
const deleteFavorite = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const result = await favoriteService.deleteFavorite(userId, productId);
        return res.status(200).json({ code: 200, message: result.message });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message });
    }
};

module.exports = { getAllFavoritesByUser, createFavorite, deleteFavorite };
