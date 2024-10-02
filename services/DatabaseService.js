const { Op } = require('sequelize');
const ProductModel = require("../models/ProductModel");
const CarouselEntityModel = require("../models/CarouselEntityModel");
const ImageModel = require('../models/ImageModel');
const driveService = require("./DriveService");


const updateDatabase = async () => {
    try {
      await updateCarousel();
      await updateProducts();
      console.log('[DATABASE SERVICE] Database updated.');
    } catch (error) {
      console.error('[DATABASE SERVICE] Error updating database:', error);
      throw error;
    }
  };

/* const getCarouselImages = async () => {
  const images = null;
  try{
    const carouselEntities = await CarouselEntityModel.findAll({where: {}});
    const carouselImages = await ImageModel.findAll({where: {id : carouselEntities.id}});
    images = carouselImages;
  }
  catch(error){
    console.error('Error getting carousel images:', error);
    throw error;
  }
  return images;
} */


const updateCarousel = async () => {
    try {
      const metadata = await driveService.getCarouselMetaData();
      console.log('[DATABASE SERVICE] Carousel Items Metadata:', metadata);
  
      await CarouselEntityModel.sync();
      await ProductModel.sync();
      await ImageModel.sync();

      await CarouselEntityModel.destroy({ where: {} });
      await ImageModel.destroy({
        where: {
          carouselEntityId: {
            [Op.not]: null
          }
        }
      });
  
      await ImageModel.destroy({ where: {} });
      await CarouselEntityModel.destroy({ where: {} });
  
      const carouselEntities = await CarouselEntityModel.bulkCreate(
        metadata.map((data) => ({
          title: data.title,
          description: data.description, 
        }))
      );
  
      await Promise.all(
        carouselEntities.map(async (entity, index) => {
          await ImageModel.create({
            name: metadata[index].name, // Derived from metadata
            driveId: metadata[index].driveId, // Storing Google Drive file ID
            carouselEntityId: entity.id, // Associate with CarouselEntityModel
          });
        })
      );
  
      console.log('[DATABASE SERVICE] Carousel entities and image metadata updated.');
    } catch (error) {
      console.error('[DATABASE SERVICE] Error updating carousel:', error);
      throw error;
    }
  };

const updateProducts = async () => {
  try {
    const metadata = await driveService.getProductsMetaData();
    console.log('[DATABASE SERVICE] Products Metadata:', metadata);
    
    await ProductModel.sync();
    await CarouselEntityModel.sync();
    await ImageModel.sync();

    await ProductModel.destroy({ where: {} });
    await ImageModel.destroy({
      where: {
        productId: {
          [Op.not]: null
        }
      }
    });

    const products = await ProductModel.bulkCreate(
      metadata.map((data) => {
        const name = replaceImageExtensions(data.name);
        const parts = name.split('_');
        
        return {
          name: parts[0],
          volume: parts[1],
          isConcept: parts.length > 2 && parts[2].toLocaleLowerCase() == "c" ? true : false,
          driveId: data.driveId,
        }
      })
    );

    await Promise.all(
      products.map(async (product, index) => {
        await ImageModel.create({
          name: metadata[index].name,
          driveId: metadata[index].driveId,
          productId: product.id,
        });
      })
    );

    console.log('[DATABASE SERVICE] Products and image metadata updated.');
  }
  catch(error){
    console.error('[DATABASE SERVICE] Error updating products:', error);
    throw error;
  }
}

const getConceptProducts = async () => {
  try {
    const products = await ProductModel.findAll({
      where: { isConcept: true },
      include: [
        {
          model: ImageModel,
          as: 'image',
          attributes: ['driveId'], 
        }
      ],
    });

    return products.map(product => ({
      ...product.toJSON(), 
      imageDriveId: product.image ? product.image.driveId : null, 
    }));
  } catch (error) {
    console.error('[DATABASE SERVICE] Error getting concept products:', error);
    throw error;
  }
};

const getProducts = async () => {
  try{
    const products = await ProductModel.findAll({
      include: [
        {
          model: ImageModel,
          as: 'image',
          attributes: ['driveId'],
        }
      ],
    });

    return products.map(product => ({
      ...product.toJSON(),
      imageDriveId: product.image ? product.image.driveId : null,
    }));
  }catch(error){
    console.error('[DATABASE SERVICE] Error getting products:', error);
    throw error;
  }
}

const getProductById = async (productId) => {
  try{
    const product = await ProductModel.findOne({
      where: { id: productId },
      include: [
        {
          model: ImageModel,
          as: 'image',
          attributes: ['driveId'],
        }
      ],
    });

    return product.toJSON();

  }catch(error){
    console.error('[DATABASE SERVICE] Error getting product by ID:', error);
    throw error;
  }
}

const replaceImageExtensions = (filename) => {
  return filename.replace(/\.(jpg|jpeg|png|gif)$/i, '');
};
  

module.exports = { 
  updateDatabase,
  getConceptProducts,
  getProducts,
  getProductById
};
