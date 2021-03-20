const axios = require("axios");

const get_token = async () => {
  try {
    var data_1 = JSON.stringify({
      card_number: "4093550009138938",
      expiration_date: "01-28",
      holder_name: "Sebastian Bejarano",
      token_type: "credit_card"
    });

    var config = {
      method: "post",
      url: "https://api.paymentsos.com/tokens",
      headers: {
        "public-key": "d2a0e6e9-526b-434f-840b-90de8a550205",
        "x-payments-os-env": "test",
        "api-version": "1.3.0",
        "Content-Type": "application/json"
      },
      data: data_1,
    };
    const { data } = await axios(config);
    return data;
  } catch (error) {
    throw error;
  }
};

const index = async () => {
  try {
    const { token } = await get_token();
    const { data, status } = await axios.post(
      "https://api.paymentsos.com/payments",
      {
        amount: 2000000,
        currency: "COP",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-version": "1.3.0",
          "x-payments-os-env": "test",
          "app-id": "com.testwebsite.payutest",
          "private-key": "cabbc983-b175-4d56-95ac-17d6996b8f82",
          "idempotency-key": "abcdefghij"
        },
      }
    );
    console.log(data);

    const { href } = data.possible_next_actions.find(
      (item) => item.action === "Authorization"
    );

    var data_2 = JSON.stringify({
        reconciliation_id : "01234567",
        payment_method: {
            credit_card_cvv: "365",
            type: "tokenized",
            token
            }
      });

    var config_2 = {
      method: "post",
      url: href,
      headers: {
        "x-payments-os-env": "test",
        "api-version": "1.3.0",
        "Content-Type": "application/json",
        "app-id": "com.testwebsite.payutest",
        "private-key": "cabbc983-b175-4d56-95ac-17d6996b8f82"
      },
      data: data_2,
    };
    const result = await axios(config_2);
    console.log(result.data)
  } catch (error) {
    console.log(error);
  }
};

index();
