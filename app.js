const express = require('express');
const mongoose =require('mongoose');
const path = require('path');
const app = express();
const bcrypt = require("bcryptjs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


require("./server/database/conn")
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public')));
const Register = require('./server/models/registers');

app.use(express.static('public'));


// Define the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());

// SignUp code
app.post("/sign_up", async(req,res)=> {
  try{
     const password = req.body.password;
     const ConfirmPassword = req.body.ConfirmPassword;
     if(password === ConfirmPassword){
        const registerusers = new Register({
           name: req.body.name,
           email: req.body.email,
           password: password,
           ConfirmPassword: ConfirmPassword
         })
         console.log("saved ")

        const registered = await registerusers.save();
        res.status(201).sendFile(__dirname + '/public/SignUp_Page.html');
        
     }else{
        res.send("Invalid Password")
     }

  }catch(error) {
     res.status(400).send(error);
  }
})

app.post("/login", async(req,res)=> {
  try{
       const email = req.body.email;
       const password = req.body.password;
       const useremail = await Register.findOne({email:email});

     const isMatch =await bcrypt.compare(password,useremail.password); 
       if(isMatch){
           res.status(201).sendFile(__dirname + '/public/');
        }else{
           res.send("Invalid Password");          
        }    
  } catch(error){
     res.status(400).send("invalid Login Details")
  }

})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});