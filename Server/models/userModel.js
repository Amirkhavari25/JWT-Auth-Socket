const { connect } = require('../utils/dbConfig');


async function createUser(email, username, password) {
    try {
        const pool = await connect();
        const result = await pool.request().input('username', username)
            .input('email', email)
            .input('password', password)
            .input('createBy', "server")
            .input('statusId', 1)
            .input('createDate', new Date())
            .input('lastModifyDate', new Date())
            .input('isDelete', false)
            .query(`INSERT INTO Users (Email,Username,Password,CreateBy,StatusId,CreateDate,LastModifyDate,IsDelete)
                  VALUES (@email,@userName,@password,@createBy,@statusId,@createDate,@lastModifyDate,@isDelete)`);
        return result;
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

async function updateResetToken(email, resetToken) {
    try {
        const pool = await connect();
        await pool.request()
            .input('email', email)
            .input('resetToken', resetToken)
            .query('UPDATE Users SET ResetToken=@resetToken WHERE Email=@email');
    } catch (err) {
        throw err;
    }
}


async function getUserByResetToken(resetToken) {
    try {
        const pool = await connect();
        await pool.request()
            .input('resetToken', resetToken)
            .query('SELECT * FROM Users WHERE ResetToken=@resetToken');
    } catch (err) {
        throw err;
    }
}


async function updatePassword(email, hashedPassword) {
    try {
        const pool = await connect();
        await pool.request()
            .input('email', email)
            .input('newPassword', hashedPassword)
            .query('UPDATE Users SET Password=@newPassword WHERE Email=@email');
    } catch (err) {
        throw err;
    }
}




module.exports = {
    createUser,
    addRoleToUser,
    findUser,
    updateResetToken,
    getUserByResetToken,
    updatePassword
}