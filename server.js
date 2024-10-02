const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { updateDatabase } = require('./services/DatabaseService');
const carouselRoutes = require('./routes/CarouselRoutes');
const productRoutes = require('./routes/ProductRoutes');

const PORT = process.env.PORT || 5000;


const setup = () => {
  app.use(cors()); 
  app.use(express.json());
  app.use(bodyParser.json());
  setupRoutes();
  
}

const setupRoutes = () => {
  app.use('/api', carouselRoutes);
  app.use('/api', productRoutes);

  app.get('/', (req, res) => {
    res.send('Server is running');
  });
}


setup();

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await updateDatabase();
    
  } catch (error) {
    console.error('Error during server startup:', error);
  }
});
