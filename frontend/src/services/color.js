import axios from "../axios"; // Thay bằng URL backend của bạn

const colorService = {
   // 📌 Lấy danh sách sizes
   getAllColor: async (type) => {
      try {
         const response = await axios.get(`/api/color?type=${type}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching Color:', error);
         throw error;
      }
   },
   getDetailColor: async (id) => {
      try {
         const response = await axios.get(`/api/color/${id}`);
         return response.data;
      } catch (error) {
         console.error('Error fetching Color:', error);
         throw error;
      }
   },

   // 📌 Thêm size mới
   createColor: async (name, hexCode) => {
      try {
         const response = await axios.post("/api/color", { name, hexCode });
         return response;
      } catch (error) {
         console.error('Error creating color:', error);
         throw error;
      }
   },

   // 📌 Cập nhật color
   updateColor: async (id, name, hexCode) => {
      try {
         const response = await axios.put(`/api/color/${id}`, { name, hexCode });
         return response;
      } catch (error) {
         console.error('Error updating color:', error);
         throw error;
      }
   },

   // 📌 Xóa color
   deleteColor: async (id) => {
      try {
         const response = await axios.delete(`/api/color/${id}`);
         return response;
      } catch (error) {
         console.error('Error deleting color:', error);
         throw error;
      }
   }
};

export default colorService;
