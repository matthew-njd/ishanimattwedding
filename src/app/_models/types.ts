export interface Database {
    public: {
        Tables: {
            WeddingInvitees: {
                Row: {
                    Name: string;
                    IsInvitedMehndi: boolean;
                    IsInvitedGrahShanti: boolean;
                    IsInvitedCeremony: boolean;
                    IsInvitedReception: boolean;
                }
            }
            MendhiRsvps: {
                Row: {
                    WeddingInviteeId: number;
                    IsAttending: boolean;
                    NumberGuests: number;
                    GuestsNames: string;
                }
            }
            GrahShantiRsvps: {
                Row: {
                    WeddingInviteeId: number;
                    IsAttending: boolean;
                    NumberGuests: number;
                    GuestsNames: string;
                }
            }
            CeremonyRsvps: {
                Row: {
                    WeddingInviteeId: number;
                    IsAttending: boolean;
                    NumberGuests: number;
                    GuestsNames: string;
                    DietaryRestrictions: string;
                }
            }
            ReceptionRsvps: {
                Row: {
                    WeddingInviteeId: number;
                    IsAttending: boolean;
                    NumberGuests: number;
                    GuestsNames: string;
                    DietaryRestrictions: string;
                }
            }
        }
    }
}

export interface Invitee {
    Id: number;
    Name: string;
    IsInvitedMehndi: boolean;
    IsInvitedGrahShanti: boolean;
    IsInvitedCeremony: boolean;
    IsInvitedReception: boolean;
}