import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
