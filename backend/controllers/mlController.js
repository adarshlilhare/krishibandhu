const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const ML_ENGINE_URL = 'http://localhost:8000';

exports.detectDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const response = await axios.post(`${ML_ENGINE_URL}/predict/disease`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json(response.data);
    } catch (error) {
        console.error('ML Engine Error:', error.message);
        res.status(500).json({ message: 'Error communicating with ML service', error: error.message });
    }
};

exports.getCropAdvisory = async (req, res) => {
    try {
        const response = await axios.post(`${ML_ENGINE_URL}/advisory/crop`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('ML Engine Error:', error.message);
        res.status(500).json({ message: 'Error communicating with ML service', error: error.message });
    }
};
