import "dotenv/config";
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const getTodos = async () => {
  try {
    const data = await client.send(new ScanCommand({ TableName: "TodoDB" }));
    console.log("Data retrieved:", data);
    return {
      statusCode: 200,
      body: data.Items ? JSON.stringify(data.Items) : JSON.stringify([]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to get todos",
        error: error.message,
      }),
    };
  }
};

const createTodo = async (event) => {
  if (!event.body) throw new Error("Missing event body");

  const body = JSON.parse(event.body);
  try {
    await client.send(
      new PutItemCommand({
        TableName: "TodoDB",
        Item: {
          TodoID: { S: `${crypto.randomBytes(16).toString("hex")}` },
          timestamp: { N: `${Date.now()}` },
          task: { S: body.task },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "Go Serverless v4! Your createTodo function executed successfully!",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create todo",
        error: error.message,
      }),
    };
  }
};

const updateTodo = async (event) => {
  if (!event.pathParameters) throw new Error("Missing path parameters");
  if (!event.body) throw new Error("Missing event body");

  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);
  try {
    await client.send(
      new UpdateItemCommand({
        TableName: "TodoDB",
        Key: {
          TodoID: { S: id },
        },
        UpdateExpression: "SET #task = :newTask, timestamp = :newTimestamp",
        ExpressionAttributeNames: {
          "#task": "task",
          "#timestamp": "timestamp",
        },
        ExpressionAttributeValues: {
          ":newTask": { S: body.task },
          ":newTimestamp": { N: `${Date.now()}` },
        },
        // ReturnValues: "ALL_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "Go Serverless v4! Your updateTodo function executed successfully!",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create todo",
        error: error.message,
      }),
    };
  }
};

const deleteTodo = async (event) => {
  if (!event.pathParameters) throw new Error("Missing path parameters");

  try {
    const { id } = event.pathParameters;
    await client.send(
      new DeleteItemCommand({
        TableName: "TodoDB",
        Key: {
          userId: { S: id },
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "Go Serverless v4! Your deleteTodo function executed successfully!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete todo",
        error: error.message,
      }),
    };
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
