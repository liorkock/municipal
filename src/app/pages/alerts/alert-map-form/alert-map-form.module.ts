import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlertMapFormPage } from './alert-map-form.page';

const routes: Routes = [
  {
    path: '',
    component: AlertMapFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []//AlertMapFormPage
})
export class AlertMapFormPageModule {}
