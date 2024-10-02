const driveService = require('./DriveService');
const ImageModel = require('../models/ImageModel'); 

const getProductImageById = async (productId) => {
    try {
      const productModel = await ImageModel.findOne({ where: { productId: productId } });
      const image = await driveService.fetchProductImage(driveFileId = productModel.driveId);
      return await convertImageToBase64(image);

    } catch (error) {
      console.error('Error retrieving image by ID from the database:', error);
      throw error;
    }
};

const getCarouselImages = async () => {
  const images = await driveService.getCarouselImages();
  console.log('[IMAGE SERVICE] Carousel images:', images);
  return Promise.all(images.map(image => convertImageToBase64(image.file))); 
}
  
const convertImageToBase64 = (imageStream) => {
  return new Promise((resolve, reject) => {
    let chunks = [];

    imageStream.on('data', chunk => {
      chunks.push(chunk);
    });

    imageStream.on('end', () => {
      const imageBuffer = Buffer.concat(chunks);
      const base64Image = imageBuffer.toString('base64');
      resolve(`data:image/jpeg;base64,${base64Image}`);
    });

    imageStream.on('error', err => {
      console.error('Error processing image file:', err);
      reject('Error processing image');
    });
  });
};


module.exports = {getProductImageById, getCarouselImages};