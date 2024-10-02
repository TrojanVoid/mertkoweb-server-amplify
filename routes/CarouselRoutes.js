const express = require('express');
const { getCarouselImages } = require('../services/ImageService');
const router = express.Router();

router.get('/carousel-images', async (req, res) => {
  try {
    const base64Images = await getCarouselImages();
    
    res.json(base64Images);
    
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    res.status(500).json({ error: 'Failed to fetch carousel images' });
  }
});

module.exports = router;
