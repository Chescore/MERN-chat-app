const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req,res)=>{
    try{
        const {name,email} = req.body;

        const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
    
        if(!emailRegex.test(email)) return res.status(400).send('Invalid email address');
    
        const existingEmail = await User.findOne({
            email
        });
    
        if (existingEmail) return res.status(400).send('Email is already registered. Log in instead');
        
        const existingUser = await User.findOne({
            name
        });
    
        if (existingUser) return res.status(400).send('Username is already taken');
        
        const user = new User({
            name,
            email
        })
    
        await user.save();
    
        const token = user.generateAuthToken();
        user.token = token;
    
        res.json({
            message:'User created successfully',
            token: token
        })
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

exports.login = async(req,res) =>{
    try{
        const {name} = req.body;

        const user = await User.findOne({name});
        if(!user) return res.status(400).send('User does not exist!');

        const token = user.generateAuthToken();
        user.token = token;

        res.json({
            message:'User logged in successfully',
            token: token
        })
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

