import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: any;

  constructor(public auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        this.user$ = user;
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
      photoURL: user.photoURL,
    };

    this.user$ = data;
    console.log('Data: ' + this.user$);
  }
}
