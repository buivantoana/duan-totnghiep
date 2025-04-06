import axios from "../axios";
export const uploadImage = async (data) => {
   try {
      const response = await axios.post(`/api/upload-image`, data);
      return response;
   } catch (error) {
      console.log(`upload`, error);
   }
};

export const deleteImage = async (id) => {
   try {
      const response = await axios.delete(`/api/upload-image`, { public_id: id });
      return response;
   } catch (error) {
      console.log(`delete_upload`, error);
   }
};

