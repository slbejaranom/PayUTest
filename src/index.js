const express = require("express");
const app = express();
const path = require("path");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
app.get("/", (req, res)=>{
    res.sendFile('public/form.html', { root: __dirname });    
});
app.post("/", (req,res)=>{
    //acá ejecutamos el POST al servidor de la transacción
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.paymentsos.com/payments');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('api-version', '1.3.0');
    request.setRequestHeader('x-payments-os-env', 'test');
    request.setRequestHeader('app-id', 'com.testwebsite.payutest');
    request.setRequestHeader('private-key', 'cabbc983-b175-4d56-95ac-17d6996b8f82');
    request.setRequestHeader('idempotency-key', makeid(10));
    var body = {
    'amount': 100,
    'currency': 'COP',
    'statement_soft_descriptor': 'Test Pago'};
    request.send(JSON.stringify(body));
});

app.listen(5000);