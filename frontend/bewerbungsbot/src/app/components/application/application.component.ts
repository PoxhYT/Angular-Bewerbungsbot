import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})

export class ApplicationComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  documents = []

  // On file Select
  onChange(event) {

    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      console.log(element);
      this.documents.push(element)
    }
  }

  sendApplication() {
    this.taskService.sendApplication("Mike", "PP", this.documents)
  }
}
