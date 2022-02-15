const AWS = require('aws-sdk');
const axios = require('axios');

// Create a Secrets Manager client
var client = new AWS.SecretsManager();

const secretName = "openweather-api-key"

var secret;

// Handler
exports.handler = async function(event: any, context: any) {
  
  console.log('JsWeather v2.1 #### city is:' + event.queryStringParameters["city"]);

  secret = await client.getSecretValue({SecretId: secretName}).promise();
  
  // After this, api.apikey will be the Open Weather Map.org API key retrieved from Secrets Manager.
  const api = JSON.parse(secret.SecretString);
  
  var response;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ event.queryStringParameters["city"] +"&units=metric&appid=" + api.apikey;
  console.log(url);
  response = await axios.get(url);
  // Adding something simple that we can modify to simulate a change...
  response.data["JsWeatherVersion"] = "v1.0.0"
  console.log(response.data);
  
  return {"statusCode": 200, "isBase64Encoded": false, "headers": {"Content-Type": "application/json"},"body": JSON.stringify(response.data)};
}
