const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
const JSON = require("JSON");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makereconid(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile("public/form.html", { root: __dirname });
});
app.post("/", (req, res) => {
  //post con axios
  let options = {
    headers: {
      "Content-Type": "application/json",
      "api-version": "1.3.0",
      "x-payments-os-env": "test",
      "app-id": "com.testwebsite.payutest",
      "private-key": "cabbc983-b175-4d56-95ac-17d6996b8f82",
      "idempotency-key": makeid(10),
    },
  };
  let payment_id = "";
  axios
    .post(
      "https://api.paymentsos.com/payments",
      {
        amount: 10000,
        currency: "COP"
      },
      options
    )
    .then(
      (response) => {
        console.log("Respuesta de la api: " + response.status);
        if (response.status == 201) {
          console.log("Pago creado");
          console.log("Card token: " + req.body.token);
          console.log("Card type: " + req.body.type);
          console.log("Payment ID: " + response.data.id);
          payment_id = response.data.id;
          let options = {
            headers: {
              "Content-Type": "application/json",
              "api-version": "1.3.0",
              "x-payments-os-env": "test",
              "app-id": "com.testwebsite.payutest",
              "private-key": "cabbc983-b175-4d56-95ac-17d6996b8f82",
              "idempotency-key": makeid(10),
            },
          };
          axios
            .post(
              "https://api.paymentsos.com/payments/" +
                payment_id +
                "/authorizations",
              {
                payment_method: {
                  type: req.body.type,
                  token: req.body.token,
                  credit_card_cvv: "365",
                },
                reconciliation_id: makereconid(8),
              },
              options
            )
            .then(
              (response) => console.log(response.status),
              (error) => {
                console.log(error.response.status);
                console.log(error.response.data);
              }
            );
        }
      },
      (error) => {
        console.log(error);
      }
    );
});

app.listen(5000,()=>{
  console.log("Estoy corriendo!");
});
