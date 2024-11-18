const { connect, sql } = require('../utils/dbConfig');


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

async function findUser(username) {
    try {
        const pool = await connect();
        const result = await pool.request().input('userName', username)
            .query('SELECT * FROM Users WHERE Username = @userName or Email=@userName AND StatusId=1');
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
            .query(`
              UPDATE Users 
                SET ResetToken = @resetToken, 
                    ResetTokenExpiry = DATEADD(MINUTE, 2, GETDATE()), 
                    ForgetPasswordAttempts = ForgetPasswordAttempts +1
                WHERE Email = @email  
            `);
    } catch (err) {
        throw err;
    }
}

async function getResetToken(resetToken) {
    try {
        const pool = await connect();
        const result = await pool.request()
            .input('resetToken', resetToken)
            .query('SELECT ResetToken FROM Users where ResetToken=@resetToken and ResetTokenExpiry>=GETDATE()');
        return result.recordset[0].ResetToken;
    } catch (err) {
        console.log(err)
        throw err;
    }
}


async function updatePassword(email, hashedPassword) {
    try {
        const pool = await connect();
        await pool.request()
            .input('email', email)
            .input('newPassword', hashedPassword)
            .query(`UPDATE Users 
                SET Password=@newPassword ,ResetToken=NULL,ResetTokenExpiry=NULL
                ,ResetPasswordAttempts=0,ForgetPasswordAttempts=0
                 WHERE Email=@email`);
    } catch (err) {
        throw err;
    }
}


async function increaseForgetPasswordAttempts(email) {
    try {
        const pool = await connect();
        await pool.request()
            .input('email', email)
            .query(`
                UPDATE Users 
                SET ForgetPasswordAttempts = ForgetPasswordAttempts + 1 
                WHERE Email = @email
            `);

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT ForgetPasswordAttempts 
                FROM Users 
                WHERE Email = @email
            `);

        const attempts = result.recordset[0].ForgetPasswordAttempts;

        if (attempts > 3) {
            await pool.request()
                .input('email', email)
                .query(`
                    UPDATE Users 
                    SET Status = 2 
                    WHERE Email = @email
                `);
        }
    } catch (err) {
        throw err;
    }
}

async function increaseResetTokenAttemp(email) {
    try {
        const pool = await connect();
        await pool.request()
            .input('email', email)
            .query('UPDATE Users SET ResetPasswordAttempts=ResetPasswordAttempts+1 WHERE Email=@email');
    } catch (err) {
        throw err;
    }
}



module.exports = {
    createUser,
    addRoleToUser,
    findUser,
    updateResetToken,
    getResetToken,
    updatePassword,
    increaseResetTokenAttemp,
    increaseForgetPasswordAttempts,
}