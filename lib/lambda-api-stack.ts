import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway"
import { PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, Code, LayerVersion, Architecture } from "aws-cdk-lib/aws-lambda"
import { Duration, Stack, StackProps, RemovalPolicy } from "aws-cdk-lib"
import { Construct } from "constructs"

interface LambdaApiStackProps extends StackProps {
    functionName: string,
    secretArn: string
}

export class CDKExampleLambdaApiStack extends Stack {
    private restApi: RestApi
    private lambdaFunction: Function
    private layer: LayerVersion

    constructor(scope: Construct, id: string, props: LambdaApiStackProps) {
        super(scope, id, props)

        this.restApi = new RestApi(this, this.stackName + "RestApi", {
            deployOptions: {
                stageName: "dev",
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
        })

        this.layer = new LayerVersion(this, 'AxiosLayer', {
            code: new AssetCode(`./layer`),
            description: 'Axios for making get requests',
            compatibleRuntimes: [Runtime.NODEJS_20_X],
            removalPolicy: RemovalPolicy.DESTROY,
            compatibleArchitectures: [Architecture.X86_64, Architecture.ARM_64],
        });
        
        const lambdaPolicy = new PolicyStatement()
        lambdaPolicy.addActions("secretsmanager:GetSecretValue")
        lambdaPolicy.addResources(props.secretArn)
        
        this.lambdaFunction = new Function(this, props.functionName, {
            functionName: props.functionName,
            handler: "handler.handler",
            runtime: Runtime.NODEJS_20_X,
            code: new AssetCode(`./src`),
            memorySize: 1792,
            timeout: Duration.seconds(30),
            layers: [this.layer],
            initialPolicy: [lambdaPolicy],
            architecture: Architecture.ARM_64,
        })

        this.restApi.root.addMethod("GET", new LambdaIntegration(this.lambdaFunction, {}))
    }
}
