const FyersAPI = require("fyers-api-v3").fyersModel

// Create a new instance of FyersAPI
var fyers = new FyersAPI();

// Set your APPID obtained from Fyers (replace "xxx-1xx" with your actual APPID)
fyers.setAppId("9WTCPYMOB3-100");

// Set the RedirectURL where the authorization code will be sent after the user grants access
fyers.setRedirectUrl("https://trade.fyers.in/api-login/redirect-uri/index.html");

// Define the authorization code and secret key required for generating access token
const authcode = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3MjA1MDMxMzYsImV4cCI6MTcyMDUzMzEzNiwibmJmIjoxNzIwNTAyNTM2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImF1dGhfY29kZSIsImRpc3BsYXlfbmFtZSI6IllWMDg5NjEiLCJvbXMiOiJLMSIsImhzbV9rZXkiOm51bGwsIm5vbmNlIjoiIiwiYXBwX2lkIjoiOVdUQ1BZTU9CMyIsInV1aWQiOiJjZmQ0OGMyMDE4MGI0MGM4ODAyY2Y1ODk0YWIyNWU5MiIsImlwQWRkciI6IjEyNS42My4xMjQuMjQ3LCAxNzIuNjguMTQ3LjI0NSIsInNjb3BlIjoiIn0.XOKhfDfU0rfKlD9C8FCY5ysXUzZ6gD1JHwWqOP0_Ulg"; // Replace with the actual authorization code obtained from the user
const secretKey = "GYLJ5QIFAU"; // Replace with your secret key provided by Fyers
fyers.generate_access_token({ "secret_key": secretKey, "auth_code": authcode }).then((response) => {
  console.log(response)
}).catch((error) => {
  console.log(error)
})
