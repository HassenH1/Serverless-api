exports.getTodos = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v4! Your getTodos function executed successfully!",
    }),
  };
};

exports.createTodo = async (event) => {
  console.log(event);
  console.log(typeof event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v4! Your createTodo function executed successfully!",
    }),
  };
};

exports.updateTodo = async (event) => {
  console.log(event);
  console.log(typeof event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v4! Your updateTodo function executed successfully!",
    }),
  };
};

exports.deleteTodo = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless v4! Your deleteTodo function executed successfully!",
    }),
  };
};
