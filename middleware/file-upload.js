const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    use_filename: true,
    public_id: (req, file) => {
      return file.originalname
    },
  },
})

const fileUpload = multer({ storage })

module.exports = fileUpload
