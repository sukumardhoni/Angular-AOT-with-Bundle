import { Component } from '@angular/core';

@Component({
  // moduleId : module.id,
  selector: 'my-app1',
  // templateUrl: '../../../app1/view/setup/app.component.html'
  template:`<button (click)="toggleHeading()">Toggle Heading</button>
  <h1 *ngIf="showHeading">Hello Angular App 1</h1>
  
  <h3>List of Heroes</h3>
  <div *ngFor="let hero of heroes">{{hero}}</div>
  
  {{'test1' | simpleExamplePipe}}
  `
})
export class AppComponent {
  showHeading = true;
  heroes = ['Magneta', 'Bombasto', 'Magma', 'Tornado'];

  toggleHeading() {
    this.showHeading = !this.showHeading;
  }
}
