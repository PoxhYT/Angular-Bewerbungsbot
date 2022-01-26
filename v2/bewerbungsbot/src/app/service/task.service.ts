import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private WebRequestService: WebRequestService) { }

  sendApplication(userName : string, profilePicture: string, documents: Object) {
    return this.WebRequestService.post("/sendApplication", { userName, profilePicture, documents});
  }

  getApplications() {
    return this.WebRequestService.getApplicationsSent("/applications/Mike");
  }
}
