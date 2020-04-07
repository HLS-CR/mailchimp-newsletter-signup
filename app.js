// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  }

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/dfca6c11a8",
    method: "POST",
    headers: {
      "Authorization": "lars1 b69417cf21d03a47a9986c9f63ace558-us4"
    },
    body: jsonData
  }

  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      console.log(response);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

});

app.post("/failure", function (req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
