const { createUser, getUserByUserName, addRoleToUser, findUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/tokenGenerator');




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


module.exports = { registerUser, loginUser }