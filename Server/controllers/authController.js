const { createUser,
    addRoleToUser,
    findUser,
    updateResetToken,
    getResetToken,
    updatePassword,
    increaseResetTokenAttemp,
    increaseForgetPasswordAttempts,
    clearResetToken } = require('../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/tokenGenerator');
const transporter = require('../Utils/sendEmail');
const { generateRandomCode } = require('../utils/randomCodeGenerator');

const registerUser = async (req, res) => {
    const { email, username, password, confirmedPassword } = req.body;
    try {
        //check if any null value posted
        if (!email || !username || !password || !confirmedPassword) {
            return res.status(400).json({ message: "invalid data please fill all username and password data" });
        }
        if (password != confirmedPassword) {
            return res.status(401).json({ message: "password and confirmed password must be same" });
        }
        //check if userName already exist
        const existUser = await findUser(email);
        if (existUser) {
            return res.status(409).json({ message: 'User is already exist , try to login' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(email, username, hashedPassword);
        //get user role to any user register for first time
        const createdUser = await findUser(email);
        await addRoleToUser(createdUser.Id, 2);
        res.status(201).json({ message: 'User created succefully' });
    } catch (error) {
        res.status(500).json({ message: "something went wrong , Internal server Error" });
        console.error(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        //find user from database
        const user = await findUser(username);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        //check password
        if (!await bcrypt.compare(password, user.Password)) {
            return res.status(401).json({ message: 'wrong password' });
        }
        //create token for user
        const payload = {
            id: user.Id,
            username: user.Username,
            email: user.Email
        };
        const token = await createToken(payload);
        //return user and token
        return res.status(200).json({ token, user: payload });
    } catch (err) {
        console.log(`login error is: ${err}`)
        return res.status(500).json({ message: 'something went wrong, server error' });
    }

}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.ForgetPasswordAttempts >= 3) {
            return res.status(401).json({ message: 'Your limit attemps to reset password is done!Try to call supports' });
        }
        await increaseForgetPasswordAttempts(email);
        const resetToken = generateRandomCode();
        await updateResetToken(email, resetToken);
        const mailOptions = {
            from: 'khavariamir25@gmail.com',
            to: email,
            subject: 'کد فراموشی رمز عبور',
            text: `لطفا کد زیر را ذخیره کنید و در برنامه وارد کنید
            ${resetToken}
            `
        };
        //sending email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);  // Log the error
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Reset link sent to your email', email: email });
        });
    } catch (error) {
        console.log('forget pass error is ', error);
        res.status(500).json({ message: 'something went wrong , Internal server Error' });
    }
}

const resetPassword = async (req, res) => {
    const { email, token, newPassword, confirmedPassword } = req.body;
    try {
        const user = await findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        const test = await getResetToken(token);
        const resetToken = test.ResetToken;
        if (!resetToken || resetToken != user.ResetToken) {
            if (user.ResetPasswordAttempts >= 3) {
                await clearResetToken(user.Email);
                return res.status(401).json({ message: 'invalid token!Try to get another reset token after 2 minutes' });
            }
            await increaseResetTokenAttemp(user.Email);
            return res.status(401).json({ message: 'invalid token' });
        }
        if (newPassword != confirmedPassword) {
            return res.status(401).json({ message: 'password and confirmed password must be same' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updatePassword(user.Email, hashedPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong , Internal server Error' });
    }
}



module.exports = { registerUser, loginUser, forgetPassword, resetPassword }