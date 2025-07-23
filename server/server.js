require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins for development

app.get('/api/cordillera/full', async (req, res) => {
    const apiUrl = process.env.PAGASA_API_URL || 'https://tenday.pagasa.dost.gov.ph/api/v1/tenday/full?region=car&page=none';
    const token = process.env.PAGASA_API_TOKEN;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'x-access-token': token,
                'token': token,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error('Axios error:', err.response ? err.response.data : err.message);
        res.status(500).json({
            error: 'Failed to fetch weather data',
            details: err.response ? err.response.data : err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});