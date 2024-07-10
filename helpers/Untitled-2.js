// Import required modules
const FyersAPI = require("fyers-api-v3").fyersModel

// Create a new instance of FyersAPI
var fyers = new FyersAPI()

// Set your APPID obtained from Fyers (replace "xxx-1xx" with your actual APPID)
fyers.setAppId("9WTCPYMOB3-100");

// Set the RedirectURL where the authorization code will be sent after the user grants access
// Make sure your redirectURL matches with your server URL and port
fyers.setRedirectUrl(`https://trade.fyers.in/api-login/redirect-uri/index.html/`);

// Generate the URL to initiate the OAuth2 authentication process and get the authorization code
var generateAuthcodeURL = fyers.generateAuthCode();

console.log(generateAuthcodeURL)
