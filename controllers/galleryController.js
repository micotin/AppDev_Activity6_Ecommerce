const fs = require('fs');
const path = require('path');

exports.getGallery = (req, res) => {
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      console.error('Error reading gallery directory:', err);
      res.status(500).send('Error loading gallery');
      return;
    }
    
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });
    
    res.render('gallery', { title: 'Our Gallery', images });
  });
};