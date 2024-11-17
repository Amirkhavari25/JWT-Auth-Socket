const { generateKeyPair } = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');





async function generateRSAKey() {
    try {
        const privateKeyPath = path.join(__dirname, 'private.key');
        const publicKeyPath = path.join(__dirname, 'public.key');
        // Check if keys already exist
        if (!existsSync(privateKeyPath) || !existsSync(publicKeyPath)) {
            const { publicKey, privateKey } = await new Promise((resolve, reject) => {
                generateKeyPair('rsa', {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                }, (err, publicKey, privateKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ publicKey, privateKey });
                    }
                });
            });

            // Save the keys 
            await fs.writeFile(privateKeyPath, privateKey);
            await fs.writeFile(publicKeyPath, publicKey);
            console.log('Keys generated and saved to files');
        } else {
            console.log('Keys already exist');
        }
    } catch (err) {
        console.error('Error generating keys:', err);
    }
}




module.exports = {
    generateRSAKey,
}