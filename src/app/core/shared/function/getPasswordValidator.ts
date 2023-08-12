// import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

// export function getPasswordValidator(): ValidatorFn {
//   return (control:AbstractControl) : ValidationErrors | null => {

//     const value = control.value;

//     if (!value) {
//       return null;
//     }
//     // falta definir caracteres especiales
//     const hasSpecialChar = /[$%&]/.test(value);
//     const hasUpperCase = /[A-Z]+/.test(value);
//     const hasLowerCase = /[a-z]+/.test(value);
//     const hasNumeric = /[0-9]+/.test(value);

//     let result = null;
//     if (!hasSpecialChar) {
//       result = {missingSpecialChar: true};
//     }
//     if (!hasUpperCase) {
//       result = (result || {}).missingUpperCase = true;
//     }
//     if (!hasLowerCase) {
//       result = (result || {}).missingLowerCase = true;
//     }
//     if (!hasNumeric) {
//       result = (result || {}).missingNumeric = true;
//     }


//     return result;
//   }
// }