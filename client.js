// Packages
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// load proto file
const packageDef = protoLoader.loadSync("todo.proto", {});

// load package definition
const grpcObject = grpc.loadPackageDefinition(packageDef);

// get todoPackage
const todoPackage = grpcObject.todoPackage;

// setup client
const client = new todoPackage.Todo("localhost:4000", grpc.credentials.createInsecure());

// client will call createTodo method
client.createTodo({
    "id": 2,
    "text": "learning grpc"
}, (error, response) => {
    if(error) console.log(`Ooops internal server error: ${error}`)
    console.log(`(createTodo) Recieved from server: ${JSON.stringify(response)}`);
});

// client will readTodos method
client.readTodos({}, (error, response) => {
    if(error) console.log(`Ooops internal server error: ${error}`)
    console.log(`(readTodos) Recieved from server: ${JSON.stringify(response)}`);
});

// client will readTodosStream
const call = client.readTodosStream();

call.on("data", (item) => {
    console.log(`(readTodosStream) Recivied data from server: ${JSON.stringify(item)}`);
});

call.on("end", (e) => console.log("server done!"));