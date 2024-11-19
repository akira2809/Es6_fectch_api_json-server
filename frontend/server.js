const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    } 4
    const imagePath = `/images/${req.file.filename}`;
    res.json({ imageUrl: imagePath });
});

app.listen(3005, () => {
    console.log('Server started on http://localhost:3005');
});