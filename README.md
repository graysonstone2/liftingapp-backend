# Lifting App Backend

A TypeScript Lambda function with MongoDB integration for the Lifting App.

## Features

- 🚀 Serverless Lambda function with TypeScript
- 🗄️ MongoDB integration for data storage
- 🔧 AWS CDK for infrastructure as code
- 🌐 API Gateway for REST endpoints
- 🔒 Broad permissions for development
- 🤖 GitHub Actions for automated deployment

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

### Local Deployment

1. Bootstrap CDK (first time only):

```bash
npx cdk bootstrap
```

2. Deploy to AWS:

```bash
npm run deploy
```

### Automated Deployment with GitHub Actions

The repository includes GitHub Actions workflows for automated deployment:

1. **Automatic Deployment** (`deploy.yml`)

   - Triggers on push to `main` branch
   - Automatically deploys to AWS

2. **Testing & Validation** (`test.yml`)

   - Runs TypeScript checks and CDK validation
   - Triggers on push and pull requests

3. **Manual Deployment** (`manual-deploy.yml`)
   - Can be triggered manually from GitHub UI
   - Allows choosing deployment environment

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `MONGODB_URI` - Your MongoDB connection string
- `DATABASE_NAME` - Your database name

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
- **GitHub Actions**: Automated CI/CD pipeline

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_NAME`: Database name for the application

## GitHub Actions Workflows

### deploy.yml

Automatically deploys on push to main branch:

```yaml
on:
  push:
    branches: [main]
```

### test.yml

Validates code and CDK configuration:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### manual-deploy.yml

Manual deployment with environment selection:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment to deploy to"
        required: true
        default: "production"
        type: choice
        options:
          - production
          - staging
```
