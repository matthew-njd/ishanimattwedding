import { Component, inject, ViewChild } from '@angular/core';
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

  @ViewChild(SearchNameComponent) searchNameComponent!: SearchNameComponent;
  @ViewChild(EventRsvpComponent) eventRsvpComponent!: EventRsvpComponent;
  
  ngAfterViewInit() {
    // Connect the search component's control to the stepper's form
    this.firstFormGroup.setControl('firstCtrl', this.searchNameComponent.searchControl);
  }
  
  async onNameSelected(name: string) {
    this.firstFormGroup.get('firstCtrl')?.setValue(name);
  
    if (name) {
      try {
        // Get which events the invitee is invited to
        const inviteeEvents = await this.supabaseService.getInvitedEvents(name);
        
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
    
    // Here you would send the data to your backend
    console.log('Submitting RSVP data:', formData);

    // if (this.selectedInvitee?.Id) {
    //   this.supabaseService.insertMendhiRsvp(this.selectedInvitee.Id, formData.mehndi.isAttending, formData.mehndi.numberOfGuests, formData.mehndi.guestsNames);
    // }
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      // Handle success - perhaps navigate to a thank you page
    }, 1000);
  }
}
