import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlertsPage } from './alerts.page';
import {AlertFormPage} from './alert-form/alert-form.page'
import {AlertMapFormPage} from './alert-map-form/alert-map-form.page'
import { ProjectSearchPage } from '../project-search/project-search.page';

import { ProjectFormPage } from '../projects/project-form/project-form.page';
import {SharedModule} from'../../services/SharedModule';//on case you do not know where to put the class name that been use on two pages
import { ProjectAddressMapPage } from '../projects/project-address-map/project-address-map.page';
import { TownSearchPage } from '../town-search/town-search.page';

//import { DrawPathPage } from '../draw-path/draw-path.page';

const routes: Routes = [
  {
    path: '',
    component: AlertsPage
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
  declarations: [AlertsPage,AlertFormPage,AlertMapFormPage],
 // entryComponents:[AlertFormPage,AlertMapFormPage,ProjectSearchPage,ProjectFormPage,ProjectAddressMapPage,TownSearchPage/*,DrawPathPage*/]
})
export class AlertsPageModule {}
