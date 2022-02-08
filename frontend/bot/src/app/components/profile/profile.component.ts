import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  myFunction() {
    let fileInput = <HTMLInputElement>document.getElementById('file-input');
    const selectedFile = fileInput.files;

    for (let index = 0; index < selectedFile.length; index++) {
      const element = selectedFile[index];
    }
  }

  openFileSelection() {
    let input = document.getElementById('file-input');
    input.click();
  }

}
