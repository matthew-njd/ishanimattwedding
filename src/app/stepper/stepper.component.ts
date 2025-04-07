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
import { ToastrService } from 'ngx-toastr';

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
    EventRsvpComponent,
],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  private supabaseService = inject(SupabaseService);
  private _formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  selectedInvitee: Invitee | null = null;
  isSubmitting = false;
  isFormsValid = false;

  rsvpMehndiDate: string = '';
  rsvpGrahShantiDate: string = '';
  rsvpCeremonyDate: string = '';
  rsvpReceptionDate: string = '';

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
        const inviteeId: number = inviteeEvents[0].Id;
        const invitedMehndi: boolean = inviteeEvents[0].IsInvitedMehndi;
        const invitedGrahShanti: boolean = inviteeEvents[0].IsInvitedGrahShanti;
        const invitedCeremony: boolean = inviteeEvents[0].IsInvitedCeremony;
        const invitedReception: boolean = inviteeEvents[0].IsInvitedReception;

        // Check to see if invitee has already RSVP'd and when
        if (invitedMehndi) {
          const alreadyRsvpMehndi = await this.supabaseService.getAlreadyMendhiRsvp(inviteeId);
          if (alreadyRsvpMehndi.length > 0) {
            const date = new Date(alreadyRsvpMehndi[0].Created);
            const attending: string = alreadyRsvpMehndi[0].IsAttending ? 'Attending' : 'Not Attending';

            this.rsvpMehndiDate = `You RSVP'd to the Mehndi on: ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} (${attending})`;
            this.toastr.info(this.rsvpMehndiDate);
          }
        }

        if (invitedGrahShanti) {
          const alreadyRsvpGrahShanti= await this.supabaseService.getAlreadyGrahShantiRsvp(inviteeId);
          if (alreadyRsvpGrahShanti.length > 0) {
            const date = new Date(alreadyRsvpGrahShanti[0].Created);
            const attending: string = alreadyRsvpGrahShanti[0].IsAttending ? 'Attending' : 'Not Attending';

            this.rsvpGrahShantiDate = `You RSVP'd to the Pithi on: ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} (${attending})`;
            this.toastr.info(this.rsvpGrahShantiDate);

          }
        }

        if (invitedCeremony) {
          const alreadyRsvpCeremony = await this.supabaseService.getAlreadyCeremonyRsvp(inviteeId);
          if (alreadyRsvpCeremony.length > 0) {
            const date = new Date(alreadyRsvpCeremony[0].Created);
            const attending: string = alreadyRsvpCeremony[0].IsAttending ? 'Attending' : 'Not Attending';
            
            this.rsvpCeremonyDate = `You RSVP'd to the Ceremony on: ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} (${attending})`;
            this.toastr.info(this.rsvpCeremonyDate);
          }
        }

        if (invitedReception) {
          const alreadyRsvpReception = await this.supabaseService.getAlreadyReceptionRsvp(inviteeId);
          if (alreadyRsvpReception.length > 0) {
            const date = new Date(alreadyRsvpReception[0].Created);
            const attending: string = alreadyRsvpReception[0].IsAttending ? 'Attending' : 'Not Attending';

            this.rsvpReceptionDate = `You RSVP'd to the Reception on: ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} (${attending})`;
            this.toastr.info(this.rsvpReceptionDate);
          }
        }
        
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

  async onSubmit() {
    if (!this.eventRsvpComponent || !this.eventRsvpComponent.formsValid) {
      return;
    }
  
    this.isSubmitting = true; // Set loading state
    const formData = this.eventRsvpComponent.getFormValues();
    console.log('Submitting RSVP data:', formData);
  
    try {
      if (this.selectedInvitee?.Id) {
        // Create an array of promises from your Supabase calls
        const submissionPromises = [
          this.supabaseService.insertMendhiRsvp(this.selectedInvitee.Id, formData.mehndi.attending, formData.mehndi.numberOfGuests, formData.mehndi.guestsNames),
          this.supabaseService.insertGrahShantiRsvp(this.selectedInvitee.Id, formData.grahShanti.attending, formData.grahShanti.numberOfGuests, formData.grahShanti.guestsNames),
          this.supabaseService.insertCeremonyRsvp(this.selectedInvitee.Id, formData.ceremony.attending, formData.ceremony.numberOfGuests, formData.ceremony.guestsNames, formData.ceremony.dietaryRestrictions),
          this.supabaseService.insertReceptionRsvp(this.selectedInvitee.Id, formData.reception.attending, formData.reception.numberOfGuests, formData.reception.guestsNames, formData.reception.dietaryRestrictions)
        ];
  
        // Wait for ALL promises to resolve successfully
        await Promise.all(submissionPromises);
  
        // Handle success *after* all calls are complete
        this.toastr.success("Your RSVP has succefully been submitted!");
        console.log('All RSVP data submitted successfully!');
        // Maybe show a success message to the user
        // Maybe navigate away or reset the form
  
      } else {
        this.toastr.error("Please select a name from the 'Select your Name' section.");
         console.error("No selected invitee ID found.");
      }
  
    } catch (error) {
      // Handle any errors that occurred during *any* of the Supabase calls
      this.toastr.error("Ran into an error submitting your RSVP.");
      console.error('Error submitting RSVP data:', error);
      // Show an error message to the user
  
    } finally {
      // This block executes whether the try block succeeded or failed
      this.isSubmitting = false; // Reset loading state *after* completion or error
    }
  }
}
