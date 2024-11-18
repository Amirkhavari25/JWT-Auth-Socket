const { createUser, addRoleToUser, findUser, updateResetToken, getUserByResetToken, updatePassword } = require('../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/tokenGenerator');
const transporter = require('../Utils/sendEmail');



const registerUser = async (req, res) => {
    const { email, userName, password, confirmedPassword } = req.body;
    try {
        //check if any null value posted
        if (!email || !userName || !password || !confirmedPassword) {
            return res.status(400).json({ message: "invalid data please fill all username and password data" });
        }
        if (password != confirmedPassword) {
            return res.status(400).json({ message: "password and confirmed password must be same" });
        }
        //check if userName already exist
        const existUser = await findUser(email);
        if (existUser) {
            return res.status(409).json({ message: 'User is already exist , try to login' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await createUser(email, userName, hashedPassword);
        //get user role to any user register for first time
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
        const resetToken = crypto.randomBytes(20).toString('hex');
        await updateResetToken(email, resetToken);

        const resetLink = `http://localhost:7070/resetPasword?token=${resetToken}`;
        const mailOptions = {
            from: 'khavariamir25@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Please click the following link to reset your password: ${resetLink}`
        };
        //send email tool
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);  // Log the error
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Reset link sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request' });
    }
}


const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        //get user by reset token
        const user = await getUserByResetToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updatePassword(user.email, hashedPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
}



module.exports = { registerUser, loginUser, forgetPassword, resetPassword }