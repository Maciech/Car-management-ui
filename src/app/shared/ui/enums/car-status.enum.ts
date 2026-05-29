export enum CarStatus {
  W_NAPRAWIE = 'W_NAPRAWIE',
  GOTOWE = 'GOTOWE',
  WYSTAWIONE = 'WYSTAWIONE',
  SPRZEDANE = 'SPRZEDANE',
}

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  [CarStatus.W_NAPRAWIE]: 'W naprawie',
  [CarStatus.GOTOWE]: 'Gotowe',
  [CarStatus.WYSTAWIONE]: 'Wystawione',
  [CarStatus.SPRZEDANE]: 'Sprzedane',
};

export const CAR_STATUS_CSS: Record<CarStatus, string> = {
  [CarStatus.W_NAPRAWIE]: 'status-repair',
  [CarStatus.GOTOWE]: 'status-ready',
  [CarStatus.WYSTAWIONE]: 'status-listed',
  [CarStatus.SPRZEDANE]: 'status-sold',
};
