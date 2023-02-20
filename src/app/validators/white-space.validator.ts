import { AbstractControl } from '@angular/forms';

export function WhiteSpaceValidator(control: AbstractControl) {
  if (/^\s*$/.test(control?.value)) {
    return { whiteSpace: true };
  }
  return null;
}
