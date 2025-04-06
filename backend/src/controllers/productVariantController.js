const productVariantService = require('../services/productVariantService');

const createVariant = async (req, res) => {
   const { productId, colorId, sizeId, stock, imageUrl, price } = req.body;
   try {
      // Tạo mới sản phẩm variant
      const newVariant = await productVariantService.createProductVariant(
         productId, colorId, sizeId, stock, imageUrl, price
      );
      return res.status(201).json({
         code: 200,
         message: 'Sản phẩm biến thể tạo thành công',
         data: newVariant
      });
   } catch (error) {
      if (error.message === 'Combination of color and size already exists.') {
         return res.status(200).json({ code: 201, message: 'Sản phẩm biến thể đã tồn tại.' });
      }
      return res.status(500).json({
         message: 'Internal Server Error',
         error: error.message
      });
   }
};

const updateVariant = async (req, res) => {
   const { id } = req.params;
   const { productId, colorId, sizeId, stock, imageUrl, price } = req.body;
   try {
      const updatedVariant = await productVariantService.updateProductVariant(
         id, productId, colorId, sizeId, stock, imageUrl, price
      );
      return res.status(200).json({
         code: 200,
         message: 'Sản phẩm biến thể sửa thành công',
         data: updatedVariant
      });
   } catch (error) {
      return res.status(500).json({
         message: 'Internal Server Error',
         error: error.message
      });
   }
};

const deleteVariant = async (req, res) => {
   const { id } = req.params;
   try {
      const result = await productVariantService.deleteProductVariant(id);
      return res.status(200).json(result);
   } catch (error) {
      return res.status(500).json({
         message: 'Internal Server Error',
         error: error.message
      });
   }
};

const getAllVariants = async (req, res) => {
   try {
      const variants = await productVariantService.getAllProductVariants();
      return res.status(200).json({ code: 200, data: variants });
   } catch (error) {
      return res.status(500).json({
         message: 'Internal Server Error',
         error: error.message
      });
   }
};

const getVariantById = async (req, res) => {
   const { id } = req.params;
   try {
      const variant = await productVariantService.getProductVariantById(id);
      return res.status(200).json({ code: 200, data: variant });
   } catch (error) {
      return res.status(500).json({
         message: 'Internal Server Error',
         error: error.message
      });
   }
};

module.exports = {
   createVariant,
   updateVariant,
   deleteVariant,
   getAllVariants,
   getVariantById
};
