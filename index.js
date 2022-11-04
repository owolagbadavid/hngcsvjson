let csvToJson = require('convert-csv-to-json');
let { createHash } =require('node:crypto')
let {csvAppend} = require("csv-append");
let fs = require('fs');

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
array = array.map((item, index)=>{
if(!item['TEAMNAMES'].length){
    item['TEAMNAMES'] = array[index-1]['TEAMNAMES']
}
let attr = item['Attributes'].split(';')
attr = attr.map(output=>output.split(':'))
attr = attr.map(output=>{
    return output.map(output2=>{
            return output2.trim();
    })
})

attr = Object.fromEntries(attr)
    item['Attributes'] = attr
    item['hash'] = sha256(JSON.stringify(item))
    return item;
})
console.log(array)
let jsonOutput = JSON.stringify(array)
fs.writeFileSync('output.json', jsonOutput);


let array2 = array.map(item=>{
    let attr = item['Attributes']
    attr = Object.entries(attr)
    attr = attr.map(output=>output.join(':'))
 
    return attr
})
array = array.map((item, index)=>{
item['Attributes'] = array2[index].join(';')
return item;
})
//CONVERT TO CSV WITH THE ADDED FIELDS
const RELATIVE_PATH_TO_CSV = `output.csv`;
const { append, end } = csvAppend(RELATIVE_PATH_TO_CSV);
 
append(array);
 
end();
