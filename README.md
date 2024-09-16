# Overview

This simple Lambda function invokes OpenWeatherMap.org API to retrieve the current weather for a city.

This is a TypeScript version of "PyWeather" - hence the name "JsWeather"

Perhaps more importantly, this version uses CDKv2 to create the Lambda function, and a CodeCommit/CodeBuild/CodePipeline for CI/CD.

This lets us have a direct comparison of SAM versus CDKv2.

# Architecture

The following will be created:

![Diagram - JsWeather architecture](/diagrams/aws-jsweather-demo-arch.png)


A CI/CD Pipeline is created as well

![Diagram - JsWeather CI/CD Pipeline](/diagrams/aws-jsweather-demo-pipeline.png)


# Installation

First, you must request an API Key from OpenWeatherMap.org, for the "Current Weather Data" API.

This program can, of course, use the API Key you've already registered for PyWeather.

## Register on OpenWeather Map.org

https://openweathermap.org/api

Request an API key.  

## Create a Secret in Secrets Manager

We'll store the OpenWeatherMap API key in Secrets manager.

First, you'll need to create the Secret (replace YOUR_API_KEY_HERE with yours!)

```
aws secretsmanager create-secret --name "openweather-api-key" --secret-string '{"apikey":"YOUR_API_KEY_HERE"}'
SECRETARN=$(aws secretsmanager describe-secret --secret-id openweather-api-key | jq -r '.ARN')
echo $SECRETARN
```
# Build and Run

Run npm install first to install dependencies

```
npm install
```

Then run npm build 

```
npm run build
```

CDK "synthesizes" into good old CloudFormation. To see it run:
```
cdk synthesize --app "npx ts-node bin/lambda.ts $SECRETARN"
```
This only shows the CFN for the Lambda function itself.

Then, you can deploy the Lambda function (bypassing the CI/CD Pipeline) by running this command:

```
cdk deploy --app "npx ts-node bin/lambda.ts $SECRETARN"
```

NOTE: You can just run this shell script:
```
./install.sh
```

## Create a CodeCommit repo

The CI/CD Pipeline assumes you are using CodeCommit.

Follow these steps to create a repo

```
aws codecommit create-repository --repository-name "JsWeather-Demo"
```

Then, simply add that as a new remote , and push to it:

```
git remote add cc URI
git push cc
```

## Install CI/CD Pipeline

This will create a CI/CD Pipeline that you can use for DevOps demos.

This CI/CD Pipelinewill peacefully co-exist with manually deploying as described above.

```
cdk deploy --force
```

NOTE: The pipeline assumes you are using AWS CodeCommit - NOT GITHUB!

## Uninstall

Simply delete both Cloudformation stacks:

```
cdk destroy --app "npx ts-node bin/lambda.ts $SECRETARN" --force
cdk destroy --app "npx ts-node bin/ci.ts $SECRETARN" --force
```

Then, manually delete the SecretsManager secret (if desired).

Also remember to delete the CodeCommit repository, if you don't want to keep it.

## Requirements

You need CDKv2 (2.158.0 or newer)

You need NodeJS 20 

You need jq installed

## Notes on Lambda version upgrades

To update the version of NodeJS, you must update the lambda-api-stack.ts, the test case (it asserts the NodeJS version), and possibly the dependencies in Package.json for the newer version.