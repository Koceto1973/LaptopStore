const fs = require('fs');  // file system module in
const http = require('http'); // server module in
const url = require('url');  // routing module in, responding differntly on each url change

// reading file from disk absolute path syncronously, __dirname is home folder
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
// console.log(json); // check up the file operation result

const laptopData = JSON.parse(json);  // parse the input into data object
// console.log(laptopData); // checkup parsing

// server creation, with a callback firing each time on server access
// calback having access to request and response objects
const server = http.createServer((req, res) => {
    
    // console.log('Server got accessed!');
    // console.log(req);  // previewing the request received from server
    // console.log(req.url); // url part used for routing
    
    // putting url module at work
    // console.log(url.parse(req.url, true));
    const pathName = url.parse(req.url, true).pathname;  // true for parsing into object
    // console.log(url.parse(req.url, true).query);
    const id = url.parse(req.url, true).query.id;        // parsing the query object
    
    
    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        // build response header
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        // fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
        //     let overviewOutput = data;
            
        //     fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
            
        //         const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
        //         overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                
        //         // build response end
        //         res.end(overviewOutput);
        //     });
        // });       
    }
});

// node attaches listener on defined port, ip address ( usually local host for development ),
// with a optional call back, confirming the listening in this case
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});