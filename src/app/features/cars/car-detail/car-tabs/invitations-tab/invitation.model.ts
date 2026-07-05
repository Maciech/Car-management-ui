export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface Invitation {
  invitationId: number;
  carId: number;
  carName: string;
  inviteeEmail: string;
  status: InvitationStatus;
}
