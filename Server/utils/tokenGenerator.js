const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const { generateRSAKey } = require('./RSAGenerator');



async function createToken(payload) {
    const privateKey = await fs.readFile('private.key', 'utf8');
    const publicKey = await fs.readFile('public.key', 'utf8');
    if (!privateKey || !publicKey) {
        await generateRSAKey();
    }
    // Create the token using the private key
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return token;
}



module.exports = {
    createToken
}