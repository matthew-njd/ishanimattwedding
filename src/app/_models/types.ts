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