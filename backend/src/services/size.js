const { Size } = require('../models');

// 📌 Lấy danh sách size
const getAllSizes = async (type) => {
   const whereCondition = {};

   if (type == "true") {
     whereCondition.status = 'S1';
   }
   return await Size.findAll({where:whereCondition});
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

   size.status = size.status == "S1" ? "S2" : "S1"
                await size.save()
   return { message: 'Size deleted successfully' };
};

module.exports = { getAllSizes, createSize, updateSize, deleteSize, getDetailSizes };
