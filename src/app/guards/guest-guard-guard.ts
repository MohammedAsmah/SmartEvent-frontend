import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuardGuard: CanActivateFn = (route, state) => {
  const router =inject(Router)
  if(localStorage.getItem('token')){
    console.log("already authenticated,g to dashboard")
    router.navigate(['dashboard'])
    return false
  }
  return true;
};
