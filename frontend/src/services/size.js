import axios from "../axios"; // Thay bằng URL backend của bạn

const sizeService = {
   // 📌 Lấy danh sách sizes
   getAllSizes: async () => {
      try {
         const response = await axios.get("/api/size");
         return response.data;
      } catch (error) {
         console.error('Error fetching sizes:', error);
         throw error;
      }
   },
   getDetailSizes: async (id) => {
      try {
         const response = await axios.get(`/api/size/${id}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching sizes:', error);
         throw error;
      }
   },

   // 📌 Thêm size mới
   createSize: async (name) => {
      try {
         const response = await axios.post("/api/size", { name });
         return response;
      } catch (error) {
         console.error('Error creating size:', error);
         throw error;
      }
   },

   // 📌 Cập nhật size
   updateSize: async (id, name) => {
      try {
         const response = await axios.put(`/api/size/${id}`, { name });
         return response;
      } catch (error) {
         console.error('Error updating size:', error);
         throw error;
      }
   },

   // 📌 Xóa size
   deleteSize: async (id) => {
      try {
         const response = await axios.delete(`/api/size/${id}`);
         return response;
      } catch (error) {
         console.error('Error deleting size:', error);
         throw error;
      }
   }
};

export default sizeService;
