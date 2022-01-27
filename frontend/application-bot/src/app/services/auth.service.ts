import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { User } from './user.model';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: any;

  constructor(public auth: AngularFireAuth, private router: Router) {
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
    return this.changeUserData(credential.user);
  }

  async googleLogout() {
    await this.auth.signOut();
    return this.router.navigate(['/']);
  }

  changeUserData(user) {
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
