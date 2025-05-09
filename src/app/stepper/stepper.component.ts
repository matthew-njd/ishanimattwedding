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

  @ViewChild('stepper') stepper: any;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  selectedInvitee: Invitee | null = null;
  isSubmitting = false;
  isFormsValid = false;
  completed = false;
  firstStepCompleted = false;

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
    this.firstStepCompleted = true;
  
    if (name) {
      try {
        // Get which events the invitee is invited to
        const inviteeEvents = await this.supabaseService.getInvitedEvents(name);
        
        // Check if we have any invitee events
        if (!inviteeEvents || inviteeEvents.length === 0) {
          this.selectedInvitee = null;
          return;
        }

        const invitee = inviteeEvents[0];
        const inviteeId: number = invitee.Id;
        const invitedMehndi: boolean = invitee.IsInvitedMehndi;
        const invitedGrahShanti: boolean = invitee.IsInvitedGrahShanti;
        const invitedCeremony: boolean = invitee.IsInvitedCeremony;
        const invitedReception: boolean = invitee.IsInvitedReception;

        // Check to see if invitee was invited to an event, if so show toastr of when they RSVP'd
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
  
    try {
      if (this.selectedInvitee?.Id) {
        // Create an array of promises from your Supabase calls
        const submissionPromises = [
          this.supabaseService.insertMendhiRsvp(
            this.selectedInvitee.Id,
            formData.mehndi.attending,
            formData.mehndi.numberOfGuests,
            formData.mehndi.guestsNames
          ),
          this.supabaseService.insertGrahShantiRsvp(
            this.selectedInvitee.Id,
            formData.grahShanti.attending,
            formData.grahShanti.numberOfGuests,
            formData.grahShanti.guestsNames
          ),
          this.supabaseService.insertCeremonyRsvp(
            this.selectedInvitee.Id,
            formData.ceremony.attending,
            formData.ceremony.numberOfGuests,
            formData.ceremony.guestsNames,
            formData.ceremony.dietaryRestrictions
          ),
          this.supabaseService.insertReceptionRsvp(
            this.selectedInvitee.Id,
            formData.reception.attending,
            formData.reception.numberOfGuests,
            formData.reception.guestsNames,
            formData.reception.dietaryRestrictions
          )
        ];
  
        await Promise.all(submissionPromises);
  
        this.toastr.success("Your RSVP has successfully been submitted!");
        this.completed = true;
        setTimeout(() => {
          this.stepper.selectedIndex = 2;
        }, 0);
  
      } else {
        this.toastr.error("Please select a name from the 'Select your Name' section.");
        console.error("No selected invitee ID found.");
      }
  
    } catch (error) {
      this.toastr.error("Ran into an error submitting your RSVP.");
      console.log(error);
    } finally {
      setTimeout(() => {
        this.isSubmitting = false; 
      }, 5000);
    }
  }
}
