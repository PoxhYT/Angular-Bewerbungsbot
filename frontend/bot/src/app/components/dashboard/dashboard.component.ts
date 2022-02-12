import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService: AuthService, private http: HttpClient) {
    this.getAllApplications()
  }

  ngOnInit(): void {}

  url = "http://localhost:3000"
  createdData = false
  applications = <any>[] 

  getAllApplications() {
    this.authService.auth.user.subscribe(data => {
      const uid = data.uid;

      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      const params = new HttpParams().append("id", uid);

      this.http.get(this.url + "getApplicationsFromUser", {headers, params}).subscribe(data => {
        this.applications = data.valueOf()
      });
    });
  }

  createApplication(uid, company, emailFromCompany) {

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const currentDate = dd + '/' + mm + '/' + yyyy;

    let postData = {
      uidFromUser: uid, 
      status: "SENT", 
      company: company, 
      emailFromCompany: emailFromCompany, 
      sentAT: currentDate
    } 

    this.http.post(this.url + "sendApplication", postData).toPromise().then(data => {
      const dataStringFormat = data.toString();
      
      if(dataStringFormat.includes("Created")) {
        this.createdData = true;
      } else {
        this.createdData = false;
      }
    });
  }

  deleteApplication(emailFromCompany) {

    console.log(emailFromCompany);

    this.authService.auth.user.subscribe(data => {
      const uid = data.uid;
      const headers = new HttpHeaders().append('Content-Type', 'application/json');
      const params = new HttpParams().append("uidFromUser", uid).append("emailFromCompany", emailFromCompany);
      
      this.http.delete(this.url + "deleteApplicationFromUser", {headers, params}).subscribe(data => {
        console.log(data);
      });
      
    });
  }

}
