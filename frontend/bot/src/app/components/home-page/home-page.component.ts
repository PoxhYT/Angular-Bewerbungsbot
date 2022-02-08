import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async googleSignin() {
    const credential = await this.authService.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    console.log("Final: " + this.authService.user$);
    return this.createUser(credential.user);
  }

  async googleLogout() {
    await this.authService.auth.signOut();
    return this.router.navigate(["/"])
  }

  private createUser(user) {
  
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };  
    
    console.log(data);
  }

}