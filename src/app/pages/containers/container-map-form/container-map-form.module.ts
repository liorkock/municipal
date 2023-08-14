import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContainerMapFormPage } from './container-map-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContainerMapFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []//ContainerMapFormPage
})
export class ContainerMapFormPageModule {}
