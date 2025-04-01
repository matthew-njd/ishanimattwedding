import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { SearchNameComponent } from '../search-name/search-name.component';
import { SupabaseService } from '../_services/supabase.service';
import { EventRsvpComponent } from '../event-rsvp/event-rsvp.component';
import { Invitee } from '../_models/types';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SearchNameComponent,
    EventRsvpComponent
],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  private supabaseService = inject(SupabaseService);
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  selectedInvitee: Invitee | null = null;
  isSubmitting = false;
  isFormsValid = false;
  rsvpMehndiDate: string = '';

  @ViewChild(SearchNameComponent) searchNameComponent!: SearchNameComponent;
  @ViewChild(EventRsvpComponent) eventRsvpComponent!: EventRsvpComponent;

  ngAfterViewInit() {
    // Connect the search component's control to the stepper's form
    this.firstFormGroup.setControl('firstCtrl', this.searchNameComponent.searchControl);
  }

  // Handle form validity changes from the event component
  onFormValidityChange(isValid: boolean): void {
    this.isFormsValid = isValid;
  }
  
  async onNameSelected(name: string) {
    this.firstFormGroup.get('firstCtrl')?.setValue(name);
  
    if (name) {
      try {
        // Get which events the invitee is invited to
        const inviteeEvents = await this.supabaseService.getInvitedEvents(name);

        const inviteeId = inviteeEvents[0].Id
        const alreadyRsvpMehndi = await this.supabaseService.getAlreadyMendhRsvp(inviteeId);
        const date = new Date(alreadyRsvpMehndi[0].Created);
        this.rsvpMehndiDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        console.log(this.rsvpMehndiDate);
        
        if (inviteeEvents && inviteeEvents.length > 0) {
          // We're assuming there's only one entry per name
          this.selectedInvitee = {
            Id: inviteeEvents[0].Id,
            Name: name,
            IsInvitedMehndi: inviteeEvents[0].IsInvitedMehndi,
            IsInvitedGrahShanti: inviteeEvents[0].IsInvitedGrahShanti,
            IsInvitedCeremony: inviteeEvents[0].IsInvitedCeremony,
            IsInvitedReception: inviteeEvents[0].IsInvitedReception
          };
        } else {
          this.selectedInvitee = null;
        }
      } catch (error) {
        console.error('Error fetching invitee event data:', error);
        this.selectedInvitee = null;
      }
    } else {
      this.selectedInvitee = null;
    }
  }

  onSubmit() {
    if (!this.eventRsvpComponent || !this.eventRsvpComponent.formsValid) {
      return;
    }
    
    this.isSubmitting = true;
    const formData = this.eventRsvpComponent.getFormValues();
    
    console.log('Submitting RSVP data:', formData);

    // if (this.selectedInvitee?.Id) {
    //   this.supabaseService.insertMendhiRsvp(this.selectedInvitee.Id, formData.mehndi.attending, formData.mehndi.numberOfGuests, 
    //     formData.mehndi.guestsNames);

    //   this.supabaseService.insertGrahShantiRsvp(this.selectedInvitee.Id, formData.grahShanti.attending, formData.grahShanti.numberOfGuests, 
    //     formData.grahShanti.guestsNames);
      
    //   this.supabaseService.insertCeremonyRsvp(this.selectedInvitee.Id, formData.ceremony.attending, formData.ceremony.numberOfGuests, 
    //     formData.ceremony.guestsNames, formData.ceremony.dietaryRestrictions);
      
    //   this.supabaseService.insertReceptionRsvp(this.selectedInvitee.Id, formData.reception.attending, formData.reception.numberOfGuests, 
    //     formData.reception.guestsNames, formData.reception.dietaryRestrictions);
    // }
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      // Handle success
    }, 1000);
  }
}
