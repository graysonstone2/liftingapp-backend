#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LiftingAppStack } from './lifting-app-stack';

const app = new cdk.App();
new LiftingAppStack(app, 'LiftingAppStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1' 
  },
}); 