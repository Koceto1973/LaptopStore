const fs = require('fs');  // file system module in

// reading file from disk absolute path syncronously, __dirname is home folder
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
// console.log(json); // check up the file operation result

const laptopData = JSON.parse(json);  // parse the input into data object
// console.log(laptopData); // checkup parsing

