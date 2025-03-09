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
    this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: false,  // Disables session persistence
        autoRefreshToken: false, // Prevents auto-refreshing tokens
        detectSessionInUrl: false // Disables session detection in the URL
      }
    });
  }

  async getNames() {
    const { data, error } = await this.supabase.from('WeddingInvitees').select('Name');
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
}
