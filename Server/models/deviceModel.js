const { connect, sql } = require('../utils/dbConfig');


async function getDeviceByUser(userId) {
    try {
        const pool = await connect();
        const result = await pool.request()
            .input('owner', userId)
            .query(`SELECT * FROM Devices WHERE Owner LIKE ${userId}`);
        return result;

    } catch (err) {
        console.log('getting user device error is:', err)
    }
}










module.exports = {
    getDeviceByUser
}