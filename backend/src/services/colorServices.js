const { where } = require('sequelize');
const { Color } = require('../models');

// 📌 Lấy danh sách color
const getAllColors = async (type) => {
   const whereCondition = {};

   if (type == "true") {
     whereCondition.status = 'S1';
   }
   return await Color.findAll({where:whereCondition});
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

   color.status = color.status == "S1" ? "S2" : "S1"
                await color.save()
   return { message: 'Color deleted successfully' };
};

module.exports = { getAllColors, createColor, updateColor, deleteColor, getDetailColor };
