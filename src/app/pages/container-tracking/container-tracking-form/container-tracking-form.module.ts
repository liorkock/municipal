import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContainerTrackingFormPage } from './container-tracking-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContainerTrackingFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []//ContainerTrackingFormPage
})
export class ContainerTrackingFormPageModule {}
