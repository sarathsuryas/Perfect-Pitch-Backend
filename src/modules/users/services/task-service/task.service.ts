import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs'

@Injectable()
export class TaskService {
  @Cron("0 0 * * 6,0")
  handleCron() {
    fs.writeFile("logs/error.txt",'', (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("logs/error.txt", "utf8"));
      } 
    });

  }
}
