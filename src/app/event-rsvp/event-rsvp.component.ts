import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  @Output() formValidityChange = new EventEmitter<boolean>();

  mehndiForm: FormGroup;
  grahShantiForm: FormGroup;
  ceremonyForm: FormGroup;
  receptionForm: FormGroup;

  private _formsValid = false;

  // Get the forms valid state
  get formsValid(): boolean {
    return this._formsValid;
  }

  constructor(private fb: FormBuilder) {
    // Initialize all forms
    this.mehndiForm = this.createEventForm(false);
    this.grahShantiForm = this.createEventForm(false);
    this.ceremonyForm = this.createEventForm(true);
    this.receptionForm = this.createEventForm(true);
    
    // Subscribe to form value changes to update validity
    this.mehndiForm.statusChanges.subscribe(() => this.checkFormValidity());
    this.grahShantiForm.statusChanges.subscribe(() => this.checkFormValidity());
    this.ceremonyForm.statusChanges.subscribe(() => this.checkFormValidity());
    this.receptionForm.statusChanges.subscribe(() => this.checkFormValidity());
  }

  // Check all form validity and emit changes
  private checkFormValidity(): void {
    let valid: boolean = true;
  
    if (this.selectedInvitee?.IsInvitedMehndi) {
      const attendingValue = this.mehndiForm.get('attending')?.value;
      valid = valid && (this.mehndiForm.valid || 
        (attendingValue === false && this.mehndiForm.get('attending')?.valid === true));
    }
    
    if (this.selectedInvitee?.IsInvitedGrahShanti) {
      const attendingValue = this.grahShantiForm.get('attending')?.value;
      valid = valid && (this.grahShantiForm.valid || 
        (attendingValue === false && this.grahShantiForm.get('attending')?.valid === true));
    }
    
    if (this.selectedInvitee?.IsInvitedCeremony) {
      const attendingValue = this.ceremonyForm.get('attending')?.value;
      valid = valid && (this.ceremonyForm.valid || 
        (attendingValue === false && this.ceremonyForm.get('attending')?.valid === true));
    }
    
    if (this.selectedInvitee?.IsInvitedReception) {
      const attendingValue = this.receptionForm.get('attending')?.value;
      valid = valid && (this.receptionForm.valid || 
        (attendingValue === false && this.receptionForm.get('attending')?.valid === true));
    }
    
    if (this._formsValid !== valid) {
      this._formsValid = valid;
      this.formValidityChange.emit(valid);
    }
  }


  createEventForm(includeDietaryRestrictions: boolean = false): FormGroup {
    const formControls: any = {
      attending: ['', Validators.required],
      numberOfGuests: [1, []],
      guestsNames: ['', []],
    };
    
    if (includeDietaryRestrictions) {
      formControls.dietaryRestrictions = [''];
    }

    const form = this.fb.group(formControls);
  
    // Add conditional validation based on attendance
    form.get('attending')?.valueChanges.subscribe(isAttending => {
      if (isAttending === true) {
        // If attending, these fields are required
        form.get('numberOfGuests')?.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
        form.get('guestsNames')?.setValidators([Validators.required]);
      } else {
        // If not attending, these fields are optional
        form.get('numberOfGuests')?.clearValidators();
        form.get('guestsNames')?.clearValidators();
      }
      
      // Update validation status
      form.get('numberOfGuests')?.updateValueAndValidity();
      form.get('guestsNames')?.updateValueAndValidity();
    });
    
    return form;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedInvitee'] && this.selectedInvitee) {
      // Reset forms when invitee changes
      this.resetForms();
    }
  }
  
  resetForms(): void {
    this.mehndiForm.reset({ attending: '', numberOfGuests: 1, guestsNames: '' });
    this.grahShantiForm.reset({ attending: '', numberOfGuests: 1, guestsNames: '' });
    this.ceremonyForm.reset({ attending: '', numberOfGuests: 1, guestsNames: '', dietaryRestrictions: '' });
    this.receptionForm.reset({ attending: '', numberOfGuests: 1, guestsNames: '', dietaryRestrictions: '' });
  }
  
  // Get all form values for submission
  getFormValues() {
    const mehndiData = this.selectedInvitee?.IsInvitedMehndi 
      ? this.mehndiForm.value 
      : { attending: false, numberOfGuests: 0, guestsNames: '' };
      
    const grahShantiData = this.selectedInvitee?.IsInvitedGrahShanti 
      ? this.grahShantiForm.value 
      : { attending: false, numberOfGuests: 0, guestsNames: '' };
      
    const ceremonyData = this.selectedInvitee?.IsInvitedCeremony 
      ? this.ceremonyForm.value 
      : { attending: false, numberOfGuests: 0, guestsNames: '', dietaryRestrictions: '' };
      
    const receptionData = this.selectedInvitee?.IsInvitedReception 
      ? this.receptionForm.value 
      : { attending: false, numberOfGuests: 0, guestsNames: '', dietaryRestrictions: '' };
  
    return {
      id: this.selectedInvitee?.Id,
      name: this.selectedInvitee?.Name,
      mehndi: mehndiData,
      grahShanti: grahShantiData,
      ceremony: ceremonyData,
      reception: receptionData
    };
  }
}
