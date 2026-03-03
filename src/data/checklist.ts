export interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
}

export const DEFAULT_CHECKLIST: CheckItem[] = [
  { id: 'c1', label: 'Festival wristband activated', checked: true },
  { id: 'c2', label: 'Phone fully charged (100%)', checked: true },
  { id: 'c3', label: 'Offline map downloaded', checked: true },
  { id: 'c4', label: 'Power bank packed', checked: false },
  { id: 'c5', label: 'Squad meeting point agreed', checked: false },
  { id: 'c6', label: 'Emergency contact set in app', checked: false },
  { id: 'c7', label: 'Ear plugs packed', checked: false },
  { id: 'c8', label: 'Cash + card (cashless backup)', checked: false },
  { id: 'c9', label: 'Rain poncho packed', checked: false },
  { id: 'c10', label: 'Tent pegs + mallet', checked: false },
];
