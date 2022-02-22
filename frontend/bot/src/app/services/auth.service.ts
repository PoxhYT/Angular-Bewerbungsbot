import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: any;

  constructor(public auth: AngularFireAuth, private router: Router, private http: HttpClient) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.user$ = user;
        console.log(user);
      }
    })
  }

  async googleSignin() {
    const credential = await this.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    this.changeUserData(credential.user);
    return this.router.navigate(['/dashboard']);
  }

  async googleLogout() {
    await this.auth.signOut();
    return this.router.navigate(['/']);
  }

  changeUserData(user: any) {
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    let postData = {
      uid: data.uid, 
      userName: data.displayName, 
      profilePicture: data.photoURL
    } 
    
    this.http.post("http://localhost:3000/register", postData).toPromise().then(userData => {
      alert(userData)
    });
    this.user$ = data;
  }
}
