import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DischargeControlPage } from './discharge-control.page';
import {DischargeControlMapPage} from './discharge-control-map/discharge-control-map.page'
import {SharedModule} from'../../services/SharedModule';//on case you do not know where to put the class name that been use on two pages

//import { DrawPathPage } from '../draw-path/draw-path.page';

const routes: Routes = [
  {
    path: '',
    component: DischargeControlPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [DischargeControlPage,DischargeControlMapPage],
 // entryComponents:[DischargeControlMapPage/*,DrawPathPage*/]
})
export class DischargeControlPageModule {}
