const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const { generateRSAKey } = require('./RSAGenerator');



async function createToken(payload) {
    try {
        await generateRSAKey();
        const privateKey = await fs.readFile(path.join(__dirname, 'private.key'), 'utf8');
        // Create the token using the private key
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        return token;
    } catch (err) {
        console.log(`generting token error : ${err}`);
    }
}



module.exports = {
    createToken
}