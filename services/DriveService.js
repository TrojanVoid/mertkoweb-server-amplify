const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const keypath = fs.readFileSync(path.join(__dirname, '../private/drive_key/', 'key.json'));

const credentials = JSON.parse(keypath);


const DriveFolders = {
  CAROUSEL: '1XLMr43H71uldMkXxENyOmYDKJ3gzeGT5',
  PRODUCTS: '1EL_TGGjUtDZIj-IV8GW7fmHrIfCNXjd7',
  CONCEPT_PRODUCTS:'1vTk-Xl7VlcCrNtTLX_dP51zge-usUWsQ'
};

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/drive.readonly'] // Scopes
);



const drive = google.drive({ version: 'v3', auth });

const fetchFilesFromFolder = async (folderId) => {
  const { data: { files } } = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name)',
  });

  const imagePromises = files.map(async (file) => {
    const response = await drive.files.get({
      fileId: file.id,
      alt: 'media'
    }, { responseType: 'stream' });

    return {
      name: file.name,
      file: response.data 
    };
  });

  return await Promise.all(imagePromises);
};

const getProductsMetaData = async () => {
  const folderId = DriveFolders.PRODUCTS;
  const { data: { files } } = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name)',
  });

  return files.map(file => ({
    name: file.name,
    driveId: file.id, 
  }));
};

const fetchProductImage = async (driveFileId) => {
  try {
    const response = await drive.files.get({
      fileId: driveFileId,
      alt: 'media'
    }, { responseType: 'stream' });

    return response.data;

  } catch (error) {
    console.error('Error fetching product image from Google Drive:', error);
    throw error;
  }
};

const getCarouselImages = async () => {
    const folderId = DriveFolders.CAROUSEL;
    return await fetchFilesFromFolder(folderId);
};

const getCarouselMetaData = async () => {
    const folderId = DriveFolders.CAROUSEL;
    const { data: { files } } = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name)', 
    });

    return files.map(file => ({
      name: file.name,
      driveId: file.id, 
    }));
};

module.exports = {
  drive, 
  getCarouselImages, 
  getCarouselMetaData, 
  getProductsMetaData, 
  fetchProductImage, 
  DriveFolders};