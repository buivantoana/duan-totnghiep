const sizeService = require('../services/size');

// 📌 Lấy danh sách size
const getAllSizes = async (req, res) => {
   try {
      const sizes = await sizeService.getAllSizes();
      return res.status(200).json({ code: 200, message: "Success", data: sizes });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};
const getDetailSizes = async (req, res) => {
   try {
      const { id } = req.params;
      const sizes = await sizeService.getDetailSizes(id);
      return res.status(200).json({ code: 200, message: "Success", data: sizes });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Tạo size mới
const createSize = async (req, res) => {
   try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ code: 400, message: 'Name is required' });

      const size = await sizeService.createSize(name);
      if (size.code == 201) {
         return res.status(200).json(size);
      }
      return res.status(200).json({ code: 200, message: "Size created successfully", data: size });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Cập nhật size
const updateSize = async (req, res) => {
   try {
      const { id } = req.params;
      const { name } = req.body;
      console.log("name", name);
      const size = await sizeService.updateSize(id, name);
      if (size.code == 201) {
         return res.status(200).json(size);
      }
      return res.status(200).json({ code: 200, message: "Size updated successfully", data: size });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Xóa size
const deleteSize = async (req, res) => {
   try {
      const { id } = req.params;

      const result = await sizeService.deleteSize(id);
      return res.status(200).json({ code: 200, message: "Size deleted successfully" });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

module.exports = { getAllSizes, createSize, updateSize, deleteSize, getDetailSizes };
