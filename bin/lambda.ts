#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("aws-cdk-lib")
import { CDKExampleLambdaApiStack } from "../lib/lambda-api-stack"

export const lambdaApiStackName = "JsWeatherViaCDKLambdaStack"
export const lambdaFunctionName = "JsWeatherViaCDK"

console.log("Arguments...")
console.log(process.argv)
console.log(".")

if (process.argv.length < 3 ) {
    console.log("You must pass in the arn: for the secretsmanager secret.")
    process.exit(1)
}

const app = new cdk.App()
new CDKExampleLambdaApiStack(app, lambdaApiStackName, {
    functionName: lambdaFunctionName,
    // You have to pass in the arn: of the secretsmanager secret for the API Weather Key
    // process.argv = npx ts-node bin/lambda.ts arn:xxxxxxx
    secretArn: process.argv[2]
})
