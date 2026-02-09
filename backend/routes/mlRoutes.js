const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mlController = require('../controllers/mlController');

router.post('/disease-detection', upload.single('image'), mlController.detectDisease);
router.post('/crop-advisory', mlController.getCropAdvisory);

module.exports = router;
