import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './../../environments/environment';
import { Database } from '../_models/types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() { 
    this.supabase = createClient<Database>(environment.apiUrl, environment.apiKey, {
      auth: {
        persistSession: false,  // Disables session persistence
        autoRefreshToken: false, // Prevents auto-refreshing tokens
        detectSessionInUrl: false // Disables session detection in the URL
      }
    });
  }

  async getNames() {
    const { data, error } = await this.supabase.from('WeddingInvitees').select('Id, Name');
    if (error) throw error;
    return data;
  }

  async getInvitedEvents(name: string) {
    const { data, error } = await this.supabase.from('WeddingInvitees')
      .select('Id, Name, IsInvitedMehndi, IsInvitedGrahShanti, IsInvitedCeremony, IsInvitedReception')
      .eq('Name', name);
    if (error) throw error;
    return data;
  }

  async getAlreadyMendhiRsvp(id: number) {
    const {data, error} = await this.supabase.from('MehndiRsvps')
      .select('IsAttending, Created')
      .eq('WeddingInviteeId', id)
      .order('Created', { ascending: false })
      .limit(1);
    if (error) throw error;
    return data;
  }

  async getAlreadyGrahShantiRsvp(id: number) {
    const {data, error} = await this.supabase.from('GrahShantiRsvps')
      .select('IsAttending, Created')
      .eq('WeddingInviteeId', id)
      .order('Created', { ascending: false })
      .limit(1);
    if (error) throw error;
    return data;
  }

  async getAlreadyCeremonyRsvp(id: number) {
    const {data, error} = await this.supabase.from('CeremonyRsvps')
      .select('IsAttending, Created')
      .eq('WeddingInviteeId', id)
      .order('Created', { ascending: false })
      .limit(1);
    if (error) throw error;
    return data;
  }

  async getAlreadyReceptionRsvp(id: number) {
    const {data, error} = await this.supabase.from('ReceptionRsvps')
      .select('IsAttending, Created')
      .eq('WeddingInviteeId', id)
      .order('Created', { ascending: false })
      .limit(1);
    if (error) throw error;
    return data;
  }

  async insertMendhiRsvp(inviteeId: number, isAttending: boolean, numberOfGuests: number, guestsNames: string) {
    const { data, error } = await this.supabase.from('MehndiRsvps')
    .insert([
      { 
        WeddingInviteeId: inviteeId, 
        IsAttending: isAttending,
        NumberGuests: numberOfGuests,
        GuestsNames: guestsNames
      },
    ])
    if (error) throw error;
  }

  async insertGrahShantiRsvp(inviteeId: number, isAttending: boolean, numberOfGuests: number, guestsNames: string) {
    const { data, error } = await this.supabase.from('GrahShantiRsvps')
    .insert([
      { 
        WeddingInviteeId: inviteeId, 
        IsAttending: isAttending,
        NumberGuests: numberOfGuests,
        GuestsNames: guestsNames
      },
    ])
    if (error) throw error;
  }

  async insertCeremonyRsvp(inviteeId: number, isAttending: boolean, numberOfGuests: number, guestsNames: string, dietaryRestrictions: string) {
    const { data, error } = await this.supabase.from('CeremonyRsvps')
    .insert([
      { 
        WeddingInviteeId: inviteeId, 
        IsAttending: isAttending,
        NumberGuests: numberOfGuests,
        GuestsNames: guestsNames,
        DietaryRestrictions: dietaryRestrictions
      },
    ])
    if (error) throw error;
  }

  async insertReceptionRsvp(inviteeId: number, isAttending: boolean, numberOfGuests: number, guestsNames: string, dietaryRestrictions: string) {
    const { data, error } = await this.supabase.from('ReceptionRsvps')
    .insert([
      { 
        WeddingInviteeId: inviteeId, 
        IsAttending: isAttending,
        NumberGuests: numberOfGuests,
        GuestsNames: guestsNames,
        DietaryRestrictions: dietaryRestrictions
      },
    ])
    if (error) throw error;
  }
}
