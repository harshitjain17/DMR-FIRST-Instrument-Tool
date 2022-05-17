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





// //HTTP SERVER MODULE
// var http = require('http'); // calling the http module

// const hostname = '127.0.0.1';
// const port = 3000;

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
    server: 'mri-db03.mri.psu.edu',
    authentication: {
        type: 'default',
        options: {
            userName: 'tu_hmj5262', //update it
            password: 'my_password' //update it
        }
    },
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        database: 'instool'
    }
};  

var connection = new Connection(configuration);  
connection.on('connect', function(err) {  
    if (err) {
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