
import { deleteImage, uploadImage } from '../services/uploadImage';

let uploadImageController = async (req, res) => {
   try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const result = await uploadImage(req.file.buffer);
      res.json({
         message: 'Upload successful',
         url: result.secure_url,
         public_id: result.public_id
      });

   } catch (error) {
      res.status(500).json({ message: 'Upload failed', error });
   }
}
let deleteImageController = async (req, res) => {
   try {
      const { public_id } = req.body;
      if (!public_id) return res.status(400).json({ message: 'public_id is required' });

      const result = await deleteImage(public_id);
      res.json({ message: 'Delete successful', result });

   } catch (error) {
      res.status(500).json({ message: 'Delete failed', error });
   }
}
module.exports = {
   deleteImageController,
   uploadImageController
}