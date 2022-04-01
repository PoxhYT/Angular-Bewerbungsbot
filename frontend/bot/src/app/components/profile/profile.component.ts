import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { faCoffee, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface emailObject {
  email: string;
}

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

  faCoffee = faCoffee;
  faInfoCircle = faInfoCircle;

  url = 'http://localhost:3000/';
  files = [];
  base64Value: string = '';

  applications = <any>[];
  emails = [];
  @ViewChild('emailRef') emailRef: ElementRef;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  addEmailToList() {
    let jsonEMailInput = <HTMLInputElement>document.getElementById('json-email-input-data');
    let jsonEMailDataString = jsonEMailInput.value;
    let jsonEmailList: emailObject[] = JSON.parse(jsonEMailDataString);

    for (let index = 0; index < jsonEmailList.length; index++) {
      const email = jsonEmailList[index];
      this.emails.push(email);
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

  emailMatchesWithDocument(emailObject:emailObject, splitted:string): boolean {
    return emailObject.email.toString().includes(splitted);
  }

  isReadyToSendEmail(index:number, attachmentFiles:any[]) {
    return index == attachmentFiles.length;
  }

  sendEmail() {
    this.authService.auth.user.subscribe((user) => {

      let messageInput = <HTMLInputElement>document.getElementById('message-input-data');
      let messageInputValue = messageInput.value;
      
      let passwordInput = <HTMLInputElement>(document.getElementById('password-input-data'));
      let passwordInputValue = passwordInput.value;

      let jsonEMailInput = <HTMLInputElement>document.getElementById('json-email-input-data');
      let jsonEMailDataString = jsonEMailInput.value;
      let jsonEmailList: emailObject[] = JSON.parse(jsonEMailDataString);

      this.addEmailToList();

      let attachmentFiles = [];
      for (let index = 0; index < this.files.length; index++) {
        let file: File = this.files[index]
        let fileName: string = this.files[index].name;
        let splitted = fileName.split('-')[0];

        for (let index = 0; index < jsonEmailList.length; index++) {
          const emailObject: emailObject = this.emails[index];

          if(this.emailMatchesWithDocument(emailObject, splitted)) {

            console.log("Email: " + emailObject.email + " matches with document: " + splitted);

            this.convertFile(file).subscribe((base64) => {
              const data = {
                // encoded string as an attachment
                filename: fileName,
                content: base64,
                encoding: 'base64',
              };

              console.log(fileName);
              console.log(splitted);
              
              
    
              if (!attachmentFiles.includes(data) && fileName.includes(splitted)) {
                attachmentFiles.push(data);
                console.log(attachmentFiles);   
                console.log("SENT EMAIL");

                let postData = {
                  sender: user.email,
                  reciever: emailObject.email,
                  title: 'Bewerbung Fachinformatiker für Anwendungsentwicklung',
                  content: "Sehr geehrte Damen und Herren,\nIm Anhang finden Sie meine Bewerbungsunterlagen. Über eine positive Rückmeldung freue ich mich sehr.\nMit freundlichen Grüßen\nMichael Ernst",
                  password: passwordInputValue,
                  files: attachmentFiles,
                };
          
                this.http
                .post<any>('http://localhost:3000/sendEmail', postData)
                .subscribe((res) => {
                  console.log(res);
                });

                attachmentFiles = <any>[]
              }
            });
          } else {
            console.log("Email: " + emailObject.email + " does not match with document: " + splitted);  
          }
        }
      }
      console.log(' ');

    });
  }
}
