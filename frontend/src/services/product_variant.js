import axios from "../axios"; // Thay bằng URL backend của bạn

const productVariantService = {
   // 📌 Lấy danh sách tất cả biến thể sản phẩm
   getAllProductVariants: async () => {
      try {
         const response = await axios.get("/api/product-variant");
         return response.data;
      } catch (error) {
         console.error('Error fetching product variants:', error);
         throw error;
      }
   },

   getVariantsByProductId: async (id) => {
      try {
         const response = await axios.get(`/api/product-variant/product/${id}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching product variants:', error);
         throw error;
      }
   },

   // 📌 Lấy chi tiết biến thể sản phẩm theo ID
   getDetailProductVariant: async (id) => {
      try {
         const response = await axios.get(`/api/product-variant/${id}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching product variant details:', error);
         throw error;
      }
   },

   // 📌 Thêm biến thể sản phẩm mới
   createProductVariant: async (data) => {
      try {
         const response = await axios.post("/api/product-variant", data);
         return response;
      } catch (error) {
         console.error('Error creating product variant:', error);
         throw error;
      }
   },

   // 📌 Cập nhật biến thể sản phẩm
   updateProductVariant: async (id, data) => {
      try {
         const response = await axios.put(`/api/product-variant/${id}`, data);
         return response;
      } catch (error) {
         console.error('Error updating product variant:', error);
         throw error;
      }
   },

   // 📌 Xóa biến thể sản phẩm
   deleteProductVariant: async (id) => {
      try {
         const response = await axios.delete(`/api/product-variant/${id}`);
         return response;
      } catch (error) {
         console.error('Error deleting product variant:', error);
         throw error;
      }
   }
};

export default productVariantService;
