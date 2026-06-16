export enum CarColor {
  WHITE     = 'WHITE',
  BLACK     = 'BLACK',
  SILVER    = 'SILVER',
  NAVY_BLUE = 'NAVY_BLUE',
  BLUE      = 'BLUE',
  RED       = 'RED',
  YELLOW    = 'YELLOW',
  GREEN     = 'GREEN',
  ORANGE    = 'ORANGE',
}

export const CAR_COLOR_LABELS: Record<CarColor, string> = {
  [CarColor.WHITE]:     '⬜ Biały',
  [CarColor.BLACK]:     '⬛ Czarny',
  [CarColor.SILVER]:    '🔘 Srebrny',
  [CarColor.NAVY_BLUE]: '🔵 Granatowy',
  [CarColor.BLUE]:      '🔷 Niebieski',
  [CarColor.RED]:       '🔴 Czerwony',
  [CarColor.YELLOW]:    '🟡 Żółty',
  [CarColor.GREEN]:     '🟢 Zielony',
  [CarColor.ORANGE]:    '🟠 Pomarańczowy',
};
