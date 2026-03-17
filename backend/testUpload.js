const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
    try {
        const fb = new FormData();
        fb.append('image', fs.createReadStream(__dirname + '/package.json')); // Sending something, though Cloudinary might fail because it's not an image

        const res = await axios.post('http://localhost:5000/api/upload/upload', fb, {
            headers: fb.getHeaders()
        });
        console.log(res.data);
    } catch (error) {
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
    }
}
testUpload();
