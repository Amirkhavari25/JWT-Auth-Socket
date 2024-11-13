const { createUser, getUserByUserName, addRoleToUser } = require('../models/userModel');
const bcrypt = require('bcrypt');

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
        const existUser = await getUserByUserName(userName, email);
        if (existUser) {
            return res.status(409).json({ message: 'User is already exist , try to login' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(userName, email, hashedPassword);
        await addRoleToUser(await getUserByUserName(userName).Id);
        res.status(201).json({ message: 'User created succefully' });
    } catch (error) {
        res.status(500).json({ message: "something went wrong , Internal server Error" });
    }
};




module.exports = { registerUser }