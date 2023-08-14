import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
//import { ProjectAddressMapPage } from '../projects/project-address-map/project-address-map.page';
import { ProjectSearchPage } from './project-search.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
   //declarations: [AlertsPage,AlertFormPage,AlertMapFormPage],
  //entryComponents:[ProjectAddressMapPage]
})
export class ProjectSearchPageModule {}
