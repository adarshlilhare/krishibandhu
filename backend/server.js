const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
// Routes
const userRoutes = require('./routes/userRoutes');
const mlRoutes = require('./routes/mlRoutes');

app.use('/api/users', userRoutes);
app.use('/api/ml', mlRoutes);

app.get('/', (req, res) => {
    res.send('KrishiBandhu Backend is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishibandhu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
