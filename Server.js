const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
require("./server/database/conn");

const Register = require("./server/models/registers");
//const Feedback = require("./server/models/feedback");
//const Payment = require("./server/models/payment");

const port = process.env.port || 3000;

app.use(bodyParser.json())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended:true
}))


app.get("/",(req,res)=> {
   res.render("index");
})

app.get("/admin",(req,res)=> {
   res.render("admin");
})

app.get("/login",(req,res)=> {
   res.render("Login_Page");
})

app.get("/register",(req, res)=>{
   res.render("index");
})
app.get("/AboutUs",(req,res)=> {
   res.render("AboutUs");
})

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

         const registered = await registerusers.save();
         res.status(201).sendFile(__dirname + '/public/Login_Page.html');
         
      }else{
         res.send("Invalid Password")
      }

   }catch(error) {
      res.status(400).send(error);
   }
})

//login 

app.post("/login", async(req,res)=> {
   try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email:email});

      const isMatch =await bcrypt.compare(password,useremail.password); 
        if(isMatch){
            res.status(201).sendFile(__dirname + '/public/index.html');
         }else{
            res.send("Invalid Password");          
         }    
   } catch(error){
      res.status(400).send("invalid Login Details")
   }
 
})

// app.post("/adminLogin", (req,res)=> {
//    try{
//         const name = req.body.Uname;
//         const pass = req.body.Pass;
      
//         if(name == "admin" && pass == "admin"){
//             res.status(201).sendFile(__dirname + '/public/adminPanel.html');
//          }else{
//             res.send("Invalid Password");          
//          }    
//    } catch(error){
//       res.status(400).send("invalid Login Details")
//    }
// })


// Feedback code
// app.post("/feedback", (req,res)=> {
//    try{
     
//          const UserFeedback = new Feedback({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             mailid: req.body.mailid,
//             contry: req.body.country,
//             subject: req.body.subject
//          })

//          const registered = UserFeedback.save();
//          res.status(201).sendFile(__dirname + '/public/index.html');
         

//    }catch(error) {
//       res.status(400).send(error+"Error while inserting data");
//    }

// })

// app.post("/payment", async(req,res)=> {
//    try{
     
//          const UserPayment = new Payment({
//             ev: req.body.ev,
//             paymentmethod: req.body.paymentmethod,
//             amt: req.body.amt,
         
//          })

//          const registered = await UserPayment.save();
//          res.status(201).sendFile(__dirname + '/public/index.html');

//    }catch(error) {
//       res.status(400).send(error+"Error while inserting data");
//    }

// })

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`)
});
