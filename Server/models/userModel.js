const sql = require('../config/dbConfig');


async function createUser(email, username, password) {
    try {
        const pool = await sql.connect();
        await pool.request().input('username', username)
            .input('email', email)
            .input('password', password)
            .input('createBy', "server")
            .input('statusId', 1)
            .input('createDate', new Date())
            .input('lastModifyDate', new Date())
            .input('isDelete', false)
            .query(`INSERT INTO Users (Email,Username,Password,CreateBy,StatusId,CreateDate,LastModifyDate,IsDelete)
                  VALUES (@email,@userName,@password,@createBy,@statusId,@createDate,@lastModifyDate,@isDelete)`);
    } catch (err) {
        throw err;
    }
}

async function getUserByUserName(userName, email) {
    try {
        const pool = await sql.connect();
        const result = await pool.request().input('userName', userName)
            .input('email', email)
            .query('SELECT * FROM Users WHERE Username = @userName or Email=@email');
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}

async function addRoleToUser(userId) {
    try {
        const pool = await sql.connect();
        await pool.request().input('userId', userId)
            .query('INSERT INTO User_Roles (UserRef,RoleRef) VALUES (@userId,2)');
    } catch (err) {
        throw err;
    }
}



module.exports = {
    createUser,
    getUserByUserName,
    addRoleToUser
}