import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import "dotenv/config";

const TABLENAME = process.env.TODO_TABLE;
const client = new DynamoDBClient({ region: "us-west-1" });

const getTodos = async () => {
  try {
    const data = await client.send(new ScanCommand({ TableName: TABLENAME }));
    const todos = data.Items ? data.Items.map((item) => unmarshall(item)) : [];
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todos }),
    };
  } catch (error) {
    console.error("Error:", error);

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
  const body = JSON.parse(event.body);

  try {
    await client.send(
      new PutItemCommand({
        TableName: TABLENAME,
        Item: {
          TodoID: { S: `${crypto.randomBytes(16).toString("hex")}` },
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
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);

  try {
    await client.send(
      new UpdateItemCommand({
        TableName: TABLENAME,
        Key: { TodoID: { S: id } },
        UpdateExpression: "SET #task = :newTask",
        ExpressionAttributeNames: {
          "#task": "task",
        },
        ExpressionAttributeValues: {
          ":newTask": { S: body.task },
        },
        ReturnValues: "ALL_NEW",
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
        message: "Failed to update todo",
        error: error.message,
      }),
    };
  }
};

const deleteTodo = async (event) => {
  try {
    const { id } = event.pathParameters;
    await client.send(
      new DeleteItemCommand({
        TableName: TABLENAME,
        Key: { TodoID: { S: id } },
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
    console.error("Error:", error);

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
