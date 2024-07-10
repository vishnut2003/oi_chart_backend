const FyersAPI = require("fyers-api-v3").fyersModel

var fyers = new FyersAPI()
fyers.setAppId("9WTCPYMOB3-100")
fyers.setRedirectUrl("https://trade.fyers.in/api-login/redirect-uri/index.html")
fyers.setAccessToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjA1MDMzMDksImV4cCI6MTcyMDU3MTQwOSwibmJmIjoxNzIwNTAzMzA5LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWpNd05JOEdiRGVyZlYtNTR0emlHU3VoTVczQ0pBX05ialhQV0dOWERQS2pJaXo4Z09xcmEzdFNyUWdrYWJxdHFVWHQyZ1ltMTRsVWFnN01VRURnSTh5T3BGSV9qNXlnN1l0aDhtSjR3Q3drVlpoQT0iLCJkaXNwbGF5X25hbWUiOiJWSVNITlUgVEhPVFRJWUlMIiwib21zIjoiSzEiLCJoc21fa2V5IjpudWxsLCJmeV9pZCI6IllWMDg5NjEiLCJhcHBUeXBlIjoxMDAsInBvYV9mbGFnIjoiTiJ9.11KvzO3vCJi6WhMBfPpGQ1lr_vfR17nuaO_5ezLqUmg")

var inp={
    "symbol":"NSE:NIFTY11JUL2430CE",
    "resolution":"D",
    "date_format":"1",
    "range_from":"2024-07-01",
    "range_to":"2024-07-08",
    "cont_fclag":"1",
    "oi_flag" : "1"

}
fyers.getHistory(inp).then((response)=>{
    console.log(response)
}).catch((err)=>{
    console.log(err)
})

