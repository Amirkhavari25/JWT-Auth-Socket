function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 6;

    let code;
    do {
        code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
    } while (new Set(code.toLowerCase()).size === 1);

    console.log(code);
    return code;
}

module.exports = {
    generateRandomCode
}



