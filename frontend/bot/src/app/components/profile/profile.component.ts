import { getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { type } from 'os';
import { buffer, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'tslint';

const Buffer = require('buffer').Buffer;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllApplications();
  }

  url = 'http://localhost:3000/';
  files = [];
  base64Value: string = '';

  applications = <any>[];
  emails = [];
  @ViewChild('emailRef') emailRef: ElementRef;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async addEmailToList() {
    let emailInput = <HTMLInputElement>document.getElementById('email-input');
    let emailValue = emailInput.value;

    if (emailValue.length > 0) {
      if (emailValue.includes('@')) {
        for (let index = 0; index < this.emails.length; index++) {
          if (!this.emails.includes(emailValue)) {
            this.emails.push(emailValue);
          } else {
          }
        }
        this.emailRef.nativeElement.value = '';
      }
    }
  }

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
      console.log(element);
      this.files.push(element);

      var reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = () => {
        this.authService.auth.user.subscribe(async (data) => {
          let postData = {
            uid: data.uid,
            fileName: element.name,
            bufferContent: reader.result as string,
            company: element.name,
          };

          // await this.http
          //   .post('http://localhost:3000/sendApplication', postData)
          //   .subscribe((data) => {
          //     console.log(data);
          //   });
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

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => result.next(btoa(reader.result.toString()));
    return result;
  }

  sendEmail() {
    this.authService.auth.user.subscribe((user) => {
      
      let password = <HTMLInputElement>(document.getElementById('password-input'));
      let passwordValue = password.value;
      let attachmentFiles = <any>[];  

      for (let index = 0; index < this.files.length; index++) {
        const file: File = this.files[index];

        this.convertFile(file).subscribe((base64) => {
          const data = {
            // encoded string as an attachment
            filename: file.name,
            content: base64,
            encoding: 'base64',
          };

          if (!attachmentFiles.includes(data)) {
            attachmentFiles.push(data);
            console.log('Added file: ' + file.name);
          }

          if (index === this.files.length - 1) {
            let postData = {
              sender: user.email,
              reciever: 'contact.savagemc@gmail.com',
              title: 'Bewerbung Fachinformatiker für Anwendungsentwicklung',
              content:
                'Sehr geehrte Damen und Herren,\nIm Anhang finden Sie meine Bewerbungsunterlagen.\nÜber eine positive Rückmeldung würde ich mich sehr freuen.\nMit freundlichen Grüßen\nMichael Ernst',
              password: passwordValue,
              files: attachmentFiles,
            };
          
            this.http
            .post<any>('http://localhost:3000/sendEmail', postData)
            .subscribe((res) => {
              console.log(res);
            });
          }
        });
      }
    });
  }
}
