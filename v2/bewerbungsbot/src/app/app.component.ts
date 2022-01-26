import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bewerbungsbot';

  // On file Select
  onChange(event) {

    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      console.log(element);
    }
  }
}
