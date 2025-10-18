const express = require('express');
const path = require('path');
const userModel = require("./models/userModel");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express();
app.set('view engine', 'ejs')


app.listen(3000);
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/create', (req, res)=>{
    let {username, password, email, age} = req.body;
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
            console.log(hash)
            let createdUser = await userModel.create({
            username,
            password:hash,
            email,
            age
        })
        token = jwt.sign({email}, 'rahultoken')
        res.cookie("token", token)
        res.send(createdUser);
            // $2b$10$aSLbWpSgOT..FjsqY9fWAeX4GAsgSltwyiHsTxrMj4h57N9B9xwyC
        })
    })
})

app.get('/login',(req, res)=>{
    res.render('login')
})

app.post('/login', async (req, res)=>{
    email = req.body.email;
    let user = await userModel.findOne({email});
    if(!user) return res.send('something went wrong');
    console.log(user);
    bcrypt.compare(req.body.password, user.password, (err, result)=>{
        let token = jwt.sign({email}, 'rahultoken');
        res.cookie("token", token);
        console.log(result)
        if(result){
            res.send('yes you can login');
        } else res.send('incorrect password');
    });
})

app.get('/logout', (req, res)=>{
    res.cookie("token", '');
    res.redirect('/')
})