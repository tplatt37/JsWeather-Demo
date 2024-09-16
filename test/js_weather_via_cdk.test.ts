import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as JsWeatherViaCdk from '../lib/lambda-api-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/js_weather_via_cdk-stack.ts
test('Lambda Function Created', () => {
   const app = new cdk.App();
     // WHEN
   const stack = new JsWeatherViaCdk.CDKExampleLambdaApiStack(app, 'MyTestStack', {functionName: "test", secretArn: "arn:aws:secretsmanager:us-west-2:123456789012:secret:openweather-api-key-xxxxxx"});
     // THEN
   const template = Template.fromStack(stack);
   
   // Assertions
   template.resourceCountIs('AWS::Lambda::Function', 1);
   template.hasResourceProperties('AWS::Lambda::Function', {
   MemorySize: 1792,
   Timeout: 30,
   Runtime: "nodejs20.x"
   });
});
