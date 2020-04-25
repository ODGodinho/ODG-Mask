
export interface ODGMask {
  value?: string;
  valid?: Boolean;
  unmasked?: String;
  newPosition?: Number;
}

export interface ODGMasksOptions {
  tokens?: Array,
  currentPosition?: Number,
  firstMatch?: Boolean,
  el?: HTMLElement,
}