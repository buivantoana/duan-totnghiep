const colorService = require('../services/colorServices');

// 📌 Lấy danh sách color
const getAllColors = async (req, res) => {
   try {
      const colors = await colorService.getAllColors();
      return res.status(200).json({ code: 200, message: "Success", data: colors });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Lấy chi tiết color
const getDetailColor = async (req, res) => {
   try {
      const { id } = req.params;
      const color = await colorService.getDetailColor(id);
      if (!color) {
         return res.status(404).json({ code: 404, message: 'Color not found' });
      }
      return res.status(200).json({ code: 200, message: "Success", data: color });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Tạo color mới
const createColor = async (req, res) => {
   try {
      const { name, hexCode } = req.body;
      if (!name || !hexCode) {
         return res.status(400).json({ code: 400, message: 'Name and hexCode are required' });
      }

      const color = await colorService.createColor(name, hexCode);
      if (color.code === 201) {
         return res.status(200).json(color);
      }
      return res.status(200).json({ code: 200, message: "Color created successfully", data: color });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Cập nhật color
const updateColor = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, hexCode } = req.body;

      if (!name || !hexCode) {
         return res.status(400).json({ code: 400, message: 'Name and hexCode are required' });
      }

      const color = await colorService.updateColor(id, name, hexCode);
      if (color.code === 201) {
         return res.status(200).json(color);
      }
      return res.status(200).json({ code: 200, message: "Color updated successfully", data: color });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

// 📌 Xóa color
const deleteColor = async (req, res) => {
   try {
      const { id } = req.params;
      const result = await colorService.deleteColor(id);
      return res.status(200).json({ code: 200, message: "Color deleted successfully" });
   } catch (error) {
      return res.status(500).json({ code: 500, message: error.message });
   }
};

module.exports = { getAllColors, createColor, updateColor, deleteColor, getDetailColor };
