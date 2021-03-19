const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const bodyParser = require('body-parser');


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())

app.get("/", (req, res)=>{
    res.sendFile('public/form.html', { root: __dirname });    
});
app.post("/", (req,res)=>{
    console.log(req.body)    
    //post con axios
    let options = {
        headers: {
            'Content-Type':'application/json',
            'api-version':'1.3.0',
            'x-payments-os-env': 'test',
            'app-id': 'com.testwebsite.payutest',
            'private-key': 'cabbc983-b175-4d56-95ac-17d6996b8f82',
            'idempotency-key': makeid(10)
        }
    };
    axios.post("https://api.paymentsos.com/payments",{
        'amount': 2000000,
        'currency': 'COP'
    },options).then((response)=>{
        console.log("Respuesta de la api: " + response.status);
        if(response.status == 201){
            console.log("Pago creado");
            //axios.post("https://api.paymentsos.com/payments/"+response.data.id+"/authorizations",{

            //},options);
        }
    },(error)=>{console.log(error)});
});

app.listen(5000);