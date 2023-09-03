#!/bin/bash

npm install
# Must install the Lambda's dependencies explicitly in the src directory
# I don't know why.... but we do. TODO: Figure out why
cd src && npm install && cd ..
npm run build
SECRETARN=$(aws secretsmanager describe-secret --secret-id openweather-api-key | jq -r '.ARN')
echo $SECRETARN
cdk deploy --app "npx ts-node bin/ci.ts $SECRETARN"