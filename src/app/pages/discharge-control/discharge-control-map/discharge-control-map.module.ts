import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DischargeControlMapPage } from './discharge-control-map.page';

const routes: Routes = [
  {
    path: '',
    component: DischargeControlMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []//DischargeControlMapPage
})
export class DischargeControlMapPageModule {}
