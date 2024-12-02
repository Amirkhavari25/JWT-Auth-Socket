const path = require('path');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;


const publickey = await fs.readFile(path.join(__dirname, '../utils', 'public.key'), 'utf-8');

const authenticateAPI = async (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization') : req.body.token;
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, publickey, { algorithms: ['RS256'] });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
}

const authenticateWebSocket = (ws, req, next) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
    const token = urlParams.get('token');

    if (!token) {
        ws.close(1008, 'Access denied. No token provided.'); 
        return;
    }

    try {
        const decoded = jwt.verify(token, publickey, { algorithms: ['RS256'] });
        ws.user = decoded;
        next();
    } catch (error) {
        ws.close(1008, 'Invalid token.');
    }
};






module.exports = {
    authenticateAPI,
    authenticateWebSocket
}