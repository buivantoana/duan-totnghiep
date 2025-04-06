import axios from "../axios"; // Thay bằng URL backend của bạn

const favoriteService = {
   // 📌 Lấy danh sách yêu thích của người dùng
   getAllFavoritesByUser: async (userId) => {
      try {
         const response = await axios.get(`/api/product-favorite/${userId}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching favorites:', error);
         throw error;
      }
   },

   // 📌 Thêm sản phẩm vào danh sách yêu thích
   addToFavorites: async (userId, productId) => {
      try {
         const response = await axios.post("/api/product-favorite", { userId, productId });
         return response;
      } catch (error) {
         console.error('Error adding to favorites:', error);
         throw error;
      }
   },

   // 📌 Xóa sản phẩm khỏi danh sách yêu thích
   removeFromFavorites: async (userId, productId) => {
      try {
         const response = await axios.delete(`/api/product-favorite/${userId}/${productId}`);
         return response;
      } catch (error) {
         console.error('Error removing from favorites:', error);
         throw error;
      }
   },

   // 📌 Kiểm tra sản phẩm có trong danh sách yêu thích của người dùng không
   checkFavoriteStatus: async (userId, productId) => {
      try {
         const response = await axios.get(`/api/product-favorite/status/${userId}/${productId}`);
         return response.data;
      } catch (error) {
         console.error('Error checking favorite status:', error);
         throw error;
      }
   }
};

export default favoriteService;
