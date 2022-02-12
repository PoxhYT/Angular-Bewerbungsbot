import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  async googleSignin() {
    await this.authService.googleSignin();
  }

  async googleLogout() {
    await this.authService.auth.signOut();
    return this.router.navigate(["/"])
  }
}
