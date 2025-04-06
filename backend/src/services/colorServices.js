const { Color } = require('../models');

// 📌 Lấy danh sách color
const getAllColors = async () => {
   return await Color.findAll();
};

// 📌 Lấy chi tiết color
const getDetailColor = async (id) => {
   return await Color.findOne({
      where: { id: id }
   });
};

// 📌 Tạo color mới
const createColor = async (name, hexCode) => {
   const existingColor = await Color.findOne({ where: { name } });
   if (existingColor) {
      return { code: 201, message: "Color đã tồn tại" };
   }
   return await Color.create({ name, hexCode });
};

// 📌 Cập nhật color
const updateColor = async (id, name, hexCode) => {
   const existingColor = await Color.findOne({ where: { name } });
   if (existingColor) {
      return { code: 201, message: "Color đã tồn tại" };
   }
   const color = await Color.findOne({
      where: { id: id },
      raw: false
   });

   if (!color) throw new Error('Color not found');

   color.name = name;
   color.hexCode = hexCode;
   await color.save();
   return color;
};

// 📌 Xóa color
const deleteColor = async (id) => {
   const color = await Color.findOne({
      where: { id: id },
      raw: false
   });
   if (!color) throw new Error('Color not found');

   await color.destroy();
   return { message: 'Color deleted successfully' };
};

module.exports = { getAllColors, createColor, updateColor, deleteColor, getDetailColor };
