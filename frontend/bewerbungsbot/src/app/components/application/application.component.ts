import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})

export class ApplicationComponent implements OnInit {

  documents = [];
  lists = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getApplications().subscribe((data) => {
      const jsonString = JSON.stringify(data);
      const jsonObject = JSON.parse(jsonString);
      this.lists = jsonObject[0].documents;
      console.log(this.lists);
    });  
  }

  downloadFile() {
    var a = document.createElement("a"); //Create <a>
    a.href = this.lists[0].base64 //Image Base64 Goes here
    a.download = this.lists[0].filename //File name Here
    a.click(); 
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
  }

  convertBase64ToFile(dataUrl: string, filename: string): File | undefined {
    const arr = dataUrl.split(',');
    if (arr.length < 2) { return undefined; }
    const mimeArr = arr[0].match(/:(.*?);/);
    if (!mimeArr || mimeArr.length < 2) { return undefined; }
    const mime = mimeArr[1];
    const test = Buffer.from(arr[1]);
    return new File([test], filename, {type:mime});
  }

  fileNames = [];

  // On file Select
  onChange(event) {

    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      this.documents.push(element);
    }
  }

  clearArray(array) {
    while (array.length) {
      array.pop();
    }
    console.log("Array has been cleared successfully!");
  }

  sendApplication() {
    for (let index = 0; index <  this.documents.length; index++) {
      const element =  this.documents[index];

      this.getBase64(element).then((data) => {
        const json = {"base64": data, "filename": element.name}  
        this.taskService.sendApplication("Mike", "PP", json).subscribe((response) => {
          console.log("TEST");
        })
      });
    }
    this.clearArray(this.documents);
  }
}
