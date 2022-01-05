import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private WebRequestService: WebRequestService) { }

  sendApplication(userName : string, profilePicture: string, documents: Array<Object>) {
    this.WebRequestService.post("/sendApplication", { userName, profilePicture, documents});
  }
}
