const db = require('../models');
const { ProductVariant } = require('../models');

// Kiểm tra nếu combination size và color đã tồn tại trong ProductVariant
const checkExistingVariant = async (sizeId, colorId, productId) => {
   const existingVariant = await ProductVariant.findOne({
      where: {
         sizeId,
         colorId,
         productId
      }
   });
   return existingVariant;
};

// Tạo mới ProductVariant nếu không tồn tại
const createProductVariant = async (productId, colorId, sizeId, stock, imageUrl, price) => {
   try {
      // Kiểm tra xem combination đã tồn tại chưa
      const existingVariant = await checkExistingVariant(sizeId, colorId, productId);
      if (existingVariant) {
         throw new Error('Combination of color and size already exists.');
      }

      // Nếu không tồn tại, tạo mới
      const newVariant = await ProductVariant.create({
         productId,
         colorId,
         sizeId,
         stock,
         imageUrl,
         price
      });

      return newVariant;
   } catch (error) {
      throw error;
   }
};

// Cập nhật ProductVariant
const updateProductVariant = async (id, productId, colorId, sizeId, stock, imageUrl, price) => {
   try {
      const variant = await ProductVariant.findOne({
         where: {
            id: id
         },
         raw: false
      });
      if (!variant) {
         throw new Error('Product Variant not found');
      }

      variant.productId = productId;
      variant.colorId = colorId;
      variant.sizeId = sizeId;
      variant.stock = stock;
      variant.imageUrl = imageUrl;
      variant.price = price;

      await variant.save();
      return variant;
   } catch (error) {
      throw error;
   }
};

// Xóa ProductVariant
const deleteProductVariant = async (id) => {
   try {
      const variant = await ProductVariant.findOne({
         where: {
            id: id
         },
         raw: false
      });
      if (!variant) {
         throw new Error('Product Variant not found');
      }

      variant.status = variant.status == "S1" ? "S2" : "S1"
      await variant.save()
      return { message: 'Product variant deleted successfully' };
   } catch (error) {
      throw error;
   }
};

// Lấy tất cả ProductVariants
const getAllProductVariants = async () => {
   try {
      console.log("toan")
      const variants = await ProductVariant.findAll({ include: [
         { model: db.Product, as: 'product' },
         { model: db.Color, as: 'color' },
         { model: db.Size, as: 'size' }
     ],
     raw: true,
     nest: true,
     logging: console.log });
      console.log(variants)
      return variants;
   } catch (error) {
      throw error;
   }
};

// Lấy chi tiết ProductVariant
const getProductVariantById = async (id) => {
   try {
      const variant = await ProductVariant.findOne({
         where: {
            id: id
         },
         include: [
            { model: db.Product, as: 'product' },
            { model: db.Color, as: 'color' },
            { model: db.Size, as: 'size' }
        ],
        raw: true,
        nest: true,
      });

      if (!variant) {
         throw new Error('Product Variant not found');
      }
      return variant;
   } catch (error) {
      throw error;
   }
};

const getVariantByProductId = async (id) => {
   try {
      const variant = await ProductVariant.findAll({
         where: {
            productId: id
         },
         include: [
            { model: db.Product, as: 'product' },
            { model: db.Color, as: 'color' },
            { model: db.Size, as: 'size' }
        ],
        raw: true,
        nest: true,
      });

      if (!variant) {
         throw new Error('Product Variant not found');
      }
      return variant;
   } catch (error) {
      throw error;
   }
};

module.exports = {
   checkExistingVariant,
   createProductVariant,
   updateProductVariant,
   deleteProductVariant,
   getAllProductVariants,
   getProductVariantById,
   getVariantByProductId
};
