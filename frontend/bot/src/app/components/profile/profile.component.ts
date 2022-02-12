import { getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'tslint';

const Buffer = require('buffer').Buffer;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllApplications();
  }

  url = 'http://localhost:3000/';
  files = [];

  applications = <any>[];

  getAllApplications() {
    this.authService.auth.user.subscribe((data) => {
      const uid = data.uid;

      const headers = new HttpHeaders().append(
        'Content-Type',
        'application/json'
      );
      const params = new HttpParams().append('id', uid);

      this.http
        .get(this.url + 'applications', { headers, params })
        .subscribe((data) => {
          this.applications = data.valueOf();
        });
    });
  }

  uploadFiles() {
    let fileInput = <HTMLInputElement>document.getElementById('file-input');
    const selectedFile = fileInput.files;

    for (let index = 0; index < selectedFile.length; index++) {
      const element: File = selectedFile[index];
      this.files.push(element);

      var reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = () => {
        console.log(reader.result as string);

        this.authService.auth.user.subscribe(async (data) => {
          let postData = {
            uid: data.uid,
            fileName: element.name,
            bufferContent: reader.result as string,
            company: element.name,
          };

          await this.http.post('http://localhost:3000/sendApplication',postData).subscribe(data => {
            console.log(data);
          });
          window.location.reload();

        });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  donwloadFile(dataFile) {
    this.authService.auth.user.subscribe((data) => {
      let postData = {
        base64: dataFile.file,
        fileName: dataFile.fileName,
      };

      this.http
        .post<any>('http://localhost:3000/download', postData)
        .subscribe((res) => {
          const byteCharacters = atob(dataFile.file.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: res.type });

          const href = URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = href;
          a.download = dataFile.fileName;
          a.click();
          URL.revokeObjectURL(href);
        });
    });
  }

  openFileSelection() {
    let input = document.getElementById('file-input');
    input.click();
  }
}
