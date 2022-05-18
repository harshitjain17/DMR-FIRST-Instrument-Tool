//**** / NOTE: THIS PIECE OF CODE WILL BE USED LATER FOR HANDLING API REQUEST. FOR NOW, I AM COMMENTING IT *****

// // WORKING WITH JSON (javaScript Object Notation)
// let jsonObj = {
//     name: 'Harshit Jain',
//     Channel: 'CWH',
//     Friend: 'Life',
//     Food: 'Dal Makhani'
// };
// console.log(jsonObj);

// // stringify the object (to convert to string) to transport
// let myJsonStr = JSON.stringify(jsonObj);
// console.log(myJsonStr);

// // unstringify (parse) to make it back as an object
// let newJsonObj = JSON.parse(myJsonStr);
// console.log(newJsonObj);


var config = require("./config")()
//***** THIS PIECE OF CODE WILL BE USED FOR CREATE THE WEB SERVER TO TEST (NOT MUCH IMPORTANT)

// //HTTP SERVER MODULE
// var http = require('http'); // calling the http module

// const hostname = config.hostname;
// const port = config.port;

// const server = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.write(request.url);
//     response.end('Hello World');
// });
// server.listen(port,hostname,() => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });





// CONNECTION WITH SQL SERVER
var Connection = require('tedious').Connection;  // calling the tedious module

var configuration = {
    server: config.database.server,
    authentication: {
        type: 'default',
        options: {
            userName: config.database.user,
            password: config.database.password
        }
    },
    options: {
        encrypt: true, // only used when we are using MS Azure
        enableArithAbort: true,
        trustServerCertificate: true,
        database: config.database.schema
    }
};  

var connection = new Connection(configuration);  
connection.on('connect', function(err) {  
    if (err) { // handling errors
        console.error(err.message);
    } else {
        executionOfQuery();
    }
    console.log("Connected!");  
});
connection.connect();




// EXECUTION OF QUERY
function executionOfQuery() {
    
    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  
  
    req = new Request("SELECT * FROM InstrumentContact;", function(err) {  
        if (err) {  
            console.error (err.message);
        }  
    });  
    var result = "";  
    req.on('row', function(columns) {  
        columns.forEach(function(column) {  
            if (column.value === null) {  
            console.log('NULL');  
            } else {  
            result+= column.value + " ";  
            }  
        });  
        console.log(result);  
        result ="";  
    });  

    req.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    req.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(req);
}
