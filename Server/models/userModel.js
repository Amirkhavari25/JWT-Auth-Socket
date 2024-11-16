const { connect } = require('../config/dbConfig');


async function createUser(email, username, password) {
    try {
        const pool = await connect();
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
        const pool = await connect();
        const result = await pool.request().input('userName', userName)
            .input('email', email)
            .query('SELECT * FROM Users WHERE Username = @userName or Email=@email');
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}


async function findUser(username) {
    try {
        const pool = await connect();
        const result = await pool.request().input('userName', username)
            .query('SELECT * FROM Users WHERE Username = @userName or Email=@userName');
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}


async function addRoleToUser(userId, roleRef) {
    try {
        const pool = await connect();
        await pool.request()
            .input('userId', userId)
            .input('roleRef', roleRef)
            .query('INSERT INTO User_Roles (UserRef,RoleRef) VALUES (@userId,@roleRef)');
    } catch (err) {
        throw err;
    }
}



module.exports = {
    createUser,
    getUserByUserName,
    addRoleToUser,
    findUser
}