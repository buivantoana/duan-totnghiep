const { Size } = require('../models');

// 📌 Lấy danh sách size
const getAllSizes = async () => {
   return await Size.findAll();
};

const getDetailSizes = async (id) => {
   return await Size.findOne({
      where: { id: id }
   });
};

// 📌 Tạo size mới
const createSize = async (name) => {
   const existingSize = await Size.findOne({ where: { name } });
   if (existingSize) {
      return { code: 201, message: "Size đã tồn tại" }
   }
   return await Size.create({ name });
};


// 📌 Cập nhật size
const updateSize = async (id, name) => {
   const existingSize = await Size.findOne({ where: { name } });
   if (existingSize) {
      return { code: 201, message: "Size đã tồn tại" }
   }
   const size = await Size.findOne({
      where: {
         id: id
      },
      raw: false
   });
   console.log(size);
   if (!size) throw new Error('Size not found');

   size.name = name;
   await size.save();
   return size;
};

// 📌 Xóa size
const deleteSize = async (id) => {
   const size = await Size.findOne({
      where: {
         id: id
      },
      raw: false
   });
   if (!size) throw new Error('Size not found');

   await size.destroy();
   return { message: 'Size deleted successfully' };
};

module.exports = { getAllSizes, createSize, updateSize, deleteSize, getDetailSizes };
