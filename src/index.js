const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + '/public'));
app.get("/", (req, res)=>{
    res.sendFile('public/form.html', { root: __dirname });    
});

app.listen(5000);