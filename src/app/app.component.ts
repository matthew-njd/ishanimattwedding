import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepperComponent } from "./stepper/stepper.component";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [ StepperComponent, MatIconModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private timeoutId: any;
  private readonly TIMEOUT_DURATION = 900000; // 10 mins

  ngOnInit() {
    this.resetTimeout();
    
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('keydown', () => this.resetTimeout());
    window.addEventListener('click', () => this.resetTimeout());
    window.addEventListener('touchstart', () => this.resetTimeout());
    window.addEventListener('touchmove', () => this.resetTimeout());
    window.addEventListener('touchend', () => this.resetTimeout());
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resetTimeout();
      }
    });
  }

  ngOnDestroy() {
    this.clearTimeout();
    
    window.removeEventListener('mousemove', () => this.resetTimeout());
    window.removeEventListener('keydown', () => this.resetTimeout());
    window.removeEventListener('click', () => this.resetTimeout());
    window.removeEventListener('touchstart', () => this.resetTimeout());
    window.removeEventListener('touchmove', () => this.resetTimeout());
    window.removeEventListener('touchend', () => this.resetTimeout());
    
    // Remove visibility change listener
    document.removeEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resetTimeout();
      }
    });
  }

  private resetTimeout() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      window.location.reload();
    }, this.TIMEOUT_DURATION);
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
