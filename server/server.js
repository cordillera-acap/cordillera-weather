require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins for development

// Helper utilities to reduce duplication
const isUrlLike = (v) => typeof v === 'string' && /^https?:\/\//i.test(v);
const buildBrowserLikeHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://tenday.pagasa.dost.gov.ph/',
    'Origin': 'https://tenday.pagasa.dost.gov.ph'
});

const makeUpstreamRequest = async (apiUrl, token, opts = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) {
        headers['x-access-token'] = token;
        headers['token'] = token;
        headers['Authorization'] = `Bearer ${token}`;
    }
    const mergedHeaders = { ...buildBrowserLikeHeaders(), ...headers, 'Accept-Encoding': 'gzip, deflate, br' };

    try {
        return await axios.get(apiUrl, { headers: mergedHeaders, responseType: opts.responseType || undefined });
    } catch (err) {
        // If upstream blocks with 403, retry once with minimal headers (some sites block automated requests by header set)
        if (err.response && err.response.status === 403) {
            const minimal = {
                'User-Agent': mergedHeaders['User-Agent'] || 'Mozilla/5.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': mergedHeaders['Accept-Language'] || 'en-US,en;q=0.9'
            };
            if (process.env.DEBUG === 'true') console.warn('Upstream returned 403 — retrying with minimal headers');
            try {
                return await axios.get(apiUrl, { headers: minimal, responseType: opts.responseType || undefined });
            } catch (err2) {
                // fall through to original error handling
                throw err2;
            }
        }
        throw err;
    }
};

app.get('/api/cordillera/full', async (req, res) => {
    const envApiUrl = process.env.PAGASA_API_URL;
    const envToken = process.env.PAGASA_API_TOKEN;

    // Provide sensible default for PAGASA endpoint
    let apiUrl = envApiUrl || 'https://tenday.pagasa.dost.gov.ph/api/v1/tenday/full?region=car&page=none';
    let token = envToken || '';

    // Auto-correct if values were swapped
    if (!isUrlLike(apiUrl) && isUrlLike(token)) {
        if (process.env.DEBUG === 'true') console.warn('Detected swapped PAGASA_API_URL and PAGASA_API_TOKEN; auto-correcting.');
        const tmp = apiUrl;
        apiUrl = token;
        token = tmp;
    }

    if (process.env.DEBUG === 'true') console.debug('Upstream request ->', { apiUrl, hasToken: !!token });

    try {
        const response = await makeUpstreamRequest(apiUrl, token);
        res.json(response.data);
    } catch (err) {
        const responseData = err.response ? err.response.data : null;
        const status = err.response ? err.response.status : null;
        const details = responseData || err.message;
        console.error('Axios error:', { status, details });
        res.status(status || 500).json({ error: 'Failed to fetch weather data', status, details });
    }
});

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});

// Debug endpoint: fetch upstream and return status, headers and a small body preview
app.get('/api/debug/upstream', async (req, res) => {
    const apiUrl = process.env.PAGASA_API_URL || 'https://tenday.pagasa.dost.gov.ph/api/v1/tenday/full?region=car&page=none';
    const token = process.env.PAGASA_API_TOKEN || '';
    try {
        const response = await makeUpstreamRequest(apiUrl, token, { responseType: 'text' });
        const bodyPreview = typeof response.data === 'string' ? response.data.slice(0, 2000) : JSON.stringify(response.data).slice(0, 2000);
        res.json({ status: response.status, headers: response.headers, bodyPreview });
    } catch (err) {
        const status = err.response ? err.response.status : null;
        const data = err.response ? err.response.data : err.message;
        res.status(status || 500).json({ error: 'Upstream request failed', status, data });
    }
});

// Debug variants: try upstream with token, without token, and token as query param
// Removed the verbose upstream-variants endpoint to reduce duplicated code.

// Root: serve only the main data array from upstream for quick localhost access
app.get('/', async (req, res) => {
    const apiUrl = process.env.PAGASA_API_URL || 'https://tenday.pagasa.dost.gov.ph/api/v1/tenday/full?region=car&page=none';
    const token = process.env.PAGASA_API_TOKEN || '';

    const browserLike = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://tenday.pagasa.dost.gov.ph/',
        'Origin': 'https://tenday.pagasa.dost.gov.ph'
    };

    const headers = { 'Content-Type': 'application/json', ...browserLike };
    if (token) {
        headers['x-access-token'] = token;
        headers['token'] = token;
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await axios.get(apiUrl, { headers });
        const body = response.data;
        // Prefer `data` key if present (the PAGASA API returns { metadata, data: [...] })
        if (body && Array.isArray(body.data)) {
            return res.json(body.data);
        }
        // Fallbacks: some endpoints use `forecast` or return the array directly
        if (body && Array.isArray(body.forecast)) {
            return res.json(body.forecast);
        }
        if (Array.isArray(body)) {
            return res.json(body);
        }
        // If nothing matched, return the raw body
        return res.json(body || {});
    } catch (err) {
        const status = err.response ? err.response.status : 500;
        const details = err.response ? err.response.data : err.message;
        console.error('Root fetch error:', { status, details });
        res.status(status).json({ error: 'Failed to fetch upstream data', status, details });
    }
});