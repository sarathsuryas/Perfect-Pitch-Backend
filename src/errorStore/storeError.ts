import * as fs from 'fs'
export function storeError(error,date) {
   const data ={
    "message":error+'',
    "time":date
   }
    
 
fs.appendFile("logs/error.txt",JSON.stringify(data), (err) => {
  if (err) {
      console.log(err);
  }
  else {
      // // Get the file contents after the append operation 
      // console.log("\nFile Contents of file after append:",
      //     fs.readFileSync("logs/error.txt", "utf8"));
  }
});
}