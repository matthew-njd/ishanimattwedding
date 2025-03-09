import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { Invitee } from '../_models/types';

@Component({
  selector: 'app-event-rsvp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  templateUrl: './event-rsvp.component.html',
  styleUrl: './event-rsvp.component.css'
})
export class EventRsvpComponent implements OnChanges {
  @Input() selectedInvitee: Invitee | null = null;

  mehndiForm: FormGroup;
  grahShantiForm: FormGroup;
  ceremonyForm: FormGroup;
  receptionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize all forms
    this.mehndiForm = this.createEventForm();
    this.grahShantiForm = this.createEventForm();
    this.ceremonyForm = this.createEventForm();
    this.receptionForm = this.createEventForm();
  }

  // Track which forms are valid
  get formsValid(): boolean {
    let valid = true;
    
    if (this.selectedInvitee?.IsInvitedMehndi && this.mehndiForm) {
      valid = valid && this.mehndiForm.valid;
    }
    
    if (this.selectedInvitee?.IsInvitedGrahShanti && this.grahShantiForm) {
      valid = valid && this.grahShantiForm.valid;
    }
    
    if (this.selectedInvitee?.IsInvitedCeremony && this.ceremonyForm) {
      valid = valid && this.ceremonyForm.valid;
    }
    
    if (this.selectedInvitee?.IsInvitedReception && this.receptionForm) {
      valid = valid && this.receptionForm.valid;
    }
    
    return valid;
  }

  createEventForm(): FormGroup {
    return this.fb.group({
      attending: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      dietaryRestrictions: [''],
      additionalNotes: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedInvitee'] && this.selectedInvitee) {
      // Reset forms when invitee changes
      this.resetForms();
    }
  }
  
  resetForms(): void {
    this.mehndiForm.reset({ attending: '', numberOfGuests: 1 });
    this.grahShantiForm.reset({ attending: '', numberOfGuests: 1 });
    this.ceremonyForm.reset({ attending: '', numberOfGuests: 1 });
    this.receptionForm.reset({ attending: '', numberOfGuests: 1 });
  }
  
  // Get all form values for submission
  getFormValues() {
    return {
      name: this.selectedInvitee?.Name,
      mehndi: this.selectedInvitee?.IsInvitedMehndi ? this.mehndiForm.value : null,
      grahShanti: this.selectedInvitee?.IsInvitedGrahShanti ? this.grahShantiForm.value : null,
      ceremony: this.selectedInvitee?.IsInvitedCeremony ? this.ceremonyForm.value : null,
      reception: this.selectedInvitee?.IsInvitedReception ? this.receptionForm.value : null
    };
  }
}
