import { Component } from '@angular/core';
import { StepperComponent } from "./stepper/stepper.component";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [ StepperComponent, MatIconModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
