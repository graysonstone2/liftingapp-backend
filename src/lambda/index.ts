import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DATABASE_NAME || 'liftingapp';

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db(dbName);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { path } = event;
    const { client, db } = await connectToDatabase();
    
    // Handle different routes
    if (path === '/templates' && event.httpMethod === 'GET') {
      return await getWorkoutTemplates(db);
    } else if (path === '/workouts' && event.httpMethod === 'GET') {
      return await getWorkouts(db);
    } else if (path === '/workouts' && event.httpMethod === 'POST') {
      return await createWorkout(db, event);
    } else {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify({
          message: 'Route not found',
          path,
          method: event.httpMethod,
        }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

async function getWorkoutTemplates(db: Db): Promise<APIGatewayProxyResult> {
  try {
    const collection = db.collection('workouttemplates');
    const templates = await collection.find({}).limit(10).toArray();
    
    console.log(`Found ${templates.length} workout templates`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: templates,
        count: templates.length,
        message: 'Workout templates retrieved successfully',
      }),
    };
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch workout templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

async function getWorkouts(db: Db): Promise<APIGatewayProxyResult> {
  try {
    const collection = db.collection('workouts');
    const workouts = await collection.find({}).limit(10).toArray();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: workouts,
        count: workouts.length,
        message: 'Workouts retrieved successfully',
      }),
    };
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch workouts',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

async function createWorkout(db: Db, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const collection = db.collection('workouts');
    
    const workout = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = await collection.insertOne(workout);
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: true,
        data: { ...workout, _id: result.insertedId },
        message: 'Workout created successfully',
      }),
    };
  } catch (error) {
    console.error('Error creating workout:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to create workout',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
} 