const fs = require('fs').promises;
const { existsSync } = require('fs');
const { generateKeyPair } = require('crypto');


async function generateRSAKey() {
    try {
        // Check if keys already exist
        if (!existsSync('private.key') || !existsSync('public.key')) {
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
            // Save the keys to the file system
            await fs.writeFile('private.key', privateKey);
            await fs.writeFile('public.key', publicKey);
            console.log('Keys generated and saved to files');
        } else {
            console.log('Keys already exist');
        }
    } catch (err) {
        console.error('Error generating keys:', err);
    }
}



module.exports = {
    generateRSAKey
}