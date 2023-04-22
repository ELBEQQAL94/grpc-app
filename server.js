// Packages
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// load proto file
const packageDef = protoLoader.loadSync("todo.proto", {});

// load package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);

// get todoPackage
const todoPackage = grpcObject.todoPackage;

// create server
const server = new grpc.Server();

server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

// add service
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodoController,
    "readTodos": readTodosController,
    "readTodosStream": readTodosStreamController
});

server.start();

const todos = [];

function createTodoController(call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    };
    todos.push(todoItem);
    callback(null, todoItem);
};

function readTodosController(call, callback) {
    callback(null, {"items": todos});
};

function readTodosStreamController(call, callback) {
    todos.forEach((item) => call.write(item));
    call.end();
};