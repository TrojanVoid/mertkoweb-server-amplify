const express = require('express');
const imageService = require('../services/ImageService');
const driveService = require('../services/DriveService');
const databaseService = require('../services/DatabaseService');
const router = express.Router();

router.get('/product-image/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const base64Image = await imageService.getProductImageById(productId);
        
        res.json(base64Image);
        
      } catch (error) {
        console.error('Error fetching carousel images:', error);
        res.status(500).json({ error: 'Failed to fetch carousel images' });
      }
});

router.get('/concept-products', async (req, res) => {
    try{
        const products = await databaseService.getConceptProducts();
        res.json(products);
    }
    catch(error){
        console.error('Error fetching  concept products:', error);
        res.status(500).json({ error: 'Failed to fetch concept products' });
    }
});

router.get('/products', async (req, res) => {
    try{
        const products = await databaseService.getProducts();
        res.json(products);
    }
    catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/get-product/:productId', async (req, res) => {
    try{
        const { productId } = req.params;
        const product = await databaseService.getProductById(productId);
        res.json(product);
    }
    catch(error){
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router;
