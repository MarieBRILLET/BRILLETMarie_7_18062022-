const multer = require('multer');

// library
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jepg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const brut = file.originalname;
        const name = brut.split('.').slice(0, -1).join('.');
        const finalName = name.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, finalName + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');