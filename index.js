const fs = require('fs');  // file system module in
const http = require('http'); // server module in
const url = require('url');  // routing module in, responding differntly on each url change

// reading file from disk absolute path syncronously, __dirname is home folder
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // sync is ok, runs once at app start
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
    // console.log(url.parse(req.url, true).pathname);
    const pathName = url.parse(req.url, true).pathname;  // true for parsing into object
    // console.log(url.parse(req.url, true).query);
    const id = url.parse(req.url, true).query.id;        // parsing the query object
    // console.log(url.parse(req.url, true).query.id);
    
    // LAPTOP DETAIL
    if (pathName === '/laptop' && id< laptopData.length ) {
        // build response header
        res.writeHead(200, { 'Content-type': 'text/html'});
        // console.log('a laptop case '+(id));

        // async this time, fill in the prebuild laptop.html template based on id from the routing query
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
           if ( err ) {
               console.log(err);
           } else {
               const laptop = laptopData[id];
               const output = replaceTemplate(data,laptop); res.end(output);
           }
        }); 

    // PRODUCTS OVERVIEW         
    } else if (pathName === '/products' || pathName === '/' ) {
        // build response header
        res.writeHead(200, { 'Content-type': 'text/html'});

        // async this time, fill in the prebuild laptop.html template based on id from the routing query
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
            
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                
                // build response end
                res.end(overviewOutput);
            });
        });
        
    // IMAGES ARE SEPARETE REQUESTS INDEED, see console.log(url.parse(req.url, true).pathname);  
    } else if ( (/\.(jpg|jpeg|png|gif)$/i).test(pathName) ) {
        // async this time, fill in the prebuild laptop.html template based on id from the routing query
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            if ( err ) {
                console.log(err);
            } else {
                // build response header
                res.writeHead(200, { 'Content-type': 'img/jpg'});

                // build response end
                res.end(data);
            }
         }); 
    
    // URL NOT FOUND    
    } else {
        // build response header
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end('URL not found!');
    }
});

// node attaches listener on defined port, ip address ( usually local host for development ),
// with a optional call back, confirming the listening in this case
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName);  // put some regex templates to use
    output = output.replace('{%IMAGE%}',laptop.image);
    output = output.replace(/{%PRICE%}/g,laptop.price);
    output = output.replace('{%SCREEN%}',laptop.screen);
    output = output.replace('{%CPU%}',laptop.cpu);
    output = output.replace('{%STORAGE%}',laptop.storage);
    output = output.replace('{%RAM%}',laptop.ram);
    output = output.replace('{%DESCRIPTION%}',laptop.description);
    output = output.replace('{%ID%}',laptop.id);

    return output;
}