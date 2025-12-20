import { RouterModule, Routes } from '@angular/router';
import { LoginForm } from './Components/login-form/login-form';
import { Layouts } from './Components/layouts/layouts';
import { NgModule } from '@angular/core';
import { authGuardGuard } from './guards/auth-guard-guard';
import { RegisterForm } from './Components/register-form/register-form';
import { guestGuardGuard } from './guards/guest-guard-guard';
import { Email } from './Components/resetPassword/email/email';
import { Code } from './Components/resetPassword/code/code';
import { Password } from './Components/resetPassword/password/password';
import { Dashboard } from './Components/dashboard/dashboard';
import { Events } from './Components/events/events';
import { EventsList } from './Components/events/events-list/events-list';
import { AddEvent } from './Components/events/add-event/add-event';
import { LocationPicker } from './Components/events/location-picker/location-picker';
import { EventDetails } from './Components/events/event-details/event-details';
import { UpdateEvent } from './Components/events/update-event/update-event';
import { EventInvitations } from './Components/invitation/event-invitations/event-invitations';

export const routes: Routes = [
  {path:'auth',
    children:[
      {path:'login',component:LoginForm},
      {path:'register',component:RegisterForm},
      {path:'email',component:Email},
      {path:'code',component:Code},
      {path:'password',component:Password},
    ],
    canActivate:[guestGuardGuard]
  },
  {
    path: '',
    component: Layouts,
    canActivate:[authGuardGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'events', component:EventsList },
      { path: 'addEvent', component:AddEvent },
      { path: 'details', component:EventDetails },
      { path: 'map', component:LocationPicker },
      { path: 'updateEvnet', component:UpdateEvent },
      { path: 'event-invitations', component:EventInvitations },
    ]
  },
    {path:'',redirectTo:'/dashboard',pathMatch:'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule  { 

}
