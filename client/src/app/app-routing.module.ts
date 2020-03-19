import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortCreateComponent } from './shorten/short-create/short-create.component';
import { LongGetComponent } from './shorten/long-get/long-get.component';

const routes: Routes = [
  {
    path: '',
    component: ShortCreateComponent
  },
  {
    path: ':shorturl',
    component: LongGetComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
