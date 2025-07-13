import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class LiftingAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function with broad permissions
    const workoutLambda = new lambda.Function(this, 'WorkoutFunction', {
      functionName: 'lifting-app-workout-function',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist/lambda')),
      environment: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        DATABASE_NAME: process.env.DATABASE_NAME || 'liftingapp',
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    // Grant broad permissions for development
    workoutLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['*'],
      resources: ['*'],
    }));

    // API Gateway
    const api = new apigateway.RestApi(this, 'LiftingAppApi', {
      restApiName: 'Lifting App API',
      description: 'API for the Lifting App',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API Resources and Methods
    const workouts = api.root.addResource('workouts');
    const templates = api.root.addResource('templates');

    // GET /templates - Get workout templates from MongoDB
    templates.addMethod('GET', new apigateway.LambdaIntegration(workoutLambda));

    // GET /workouts - Get workouts
    workouts.addMethod('GET', new apigateway.LambdaIntegration(workoutLambda));

    // POST /workouts - Create workout
    workouts.addMethod('POST', new apigateway.LambdaIntegration(workoutLambda));

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: workoutLambda.functionName,
      description: 'Lambda Function Name',
    });
  }
} 