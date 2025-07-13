# Lifting App Backend

A TypeScript Lambda function with MongoDB integration for the Lifting App.

## Features

- 🚀 Serverless Lambda function with TypeScript
- 🗄️ MongoDB integration for data storage
- 🔧 AWS CDK for infrastructure as code
- 🌐 API Gateway for REST endpoints
- 🔒 Broad permissions for development

## API Endpoints

- `GET /templates` - Fetch workout templates from MongoDB
- `GET /workouts` - Fetch workouts from MongoDB
- `POST /workouts` - Create a new workout

## Prerequisites

- Node.js 18+
- AWS CLI configured
- MongoDB instance

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

```bash
export MONGODB_URI="your-mongodb-connection-string"
export DATABASE_NAME="your-database-name"
```

3. Build the project:

```bash
npm run build
```

## Deployment

1. Bootstrap CDK (first time only):

```bash
npx cdk bootstrap
```

2. Deploy to AWS:

```bash
npm run deploy
```

## Development

- Build: `npm run build`
- Deploy: `npm run cdk:deploy`
- Destroy: `npm run cdk:destroy`
- Diff: `npm run cdk:diff`

## Architecture

- **Lambda Function**: TypeScript runtime with MongoDB driver
- **API Gateway**: REST API with CORS enabled
- **CDK**: Infrastructure as code for AWS resources
- **MongoDB**: External database for data storage

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_NAME`: Database name for the application
