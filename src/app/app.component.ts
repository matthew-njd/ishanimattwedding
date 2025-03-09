import { Component } from '@angular/core';
import { StepperComponent } from "./stepper/stepper.component";

@Component({
  selector: 'app-root',
  imports: [ StepperComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
