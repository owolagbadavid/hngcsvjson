let csvToJson = require('convert-csv-to-json');
let { createHash } =require('node:crypto')
let {csvAppend} = require("csv-append");


function sha256(content) {  
  return createHash('sha256').update(content).digest('hex')
}

let array = [];
//CONVERT CSV TO JSON
let json = csvToJson.fieldDelimiter(',').formatValueByType().getJsonFromCsv("myInputFile.csv");
for(let i=0; i<json.length;i++){
    array.push(json[i]);
    
}

//CALCUALTE AND ADD THE SHA256 OF ALL JSON FILES TO EACH JSON FILE
array.map(item=>{
    item['hash'] = sha256(JSON.stringify(item))
    return item;
})
console.log(array)

//CONVERT TO CSV WITH THE ADDED FIELDS
const RELATIVE_PATH_TO_CSV = `output.csv`;
const { append, end } = csvAppend(RELATIVE_PATH_TO_CSV);
 
append(array);
 
end();
