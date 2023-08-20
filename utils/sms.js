const config = require("../config");
const client = require("twilio")(config.accountSid, config.authToken);

// send message
const sendSms = (phone, body) => {
  return client.messages
    .create({
      body: body,
      from: config.twilioNumber,
      to: phone,
    })
    .then((message) => console.log(message.sid))
    .catch(function (error) {
      if (error.code === 21614) {
        console.error("This caller can't receive SMS messages.");
      }
      console.error("Uncought error in sending message", error);
    });
};

module.exports = {
  sendSms,
};
