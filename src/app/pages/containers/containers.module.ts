import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContainersPage } from './containers.page';



import { ContainerMapFormPage } from './container-map-form/container-map-form.page';
import { ContainerFormPage } from './container-form/container-form.page';
import { ProjectSearchPage } from '../project-search/project-search.page';
import { ProjectAddressMapPage } from '../projects/project-address-map/project-address-map.page';
import { TownSearchPage } from '../town-search/town-search.page';
import { ProjectFormPage } from '../projects/project-form/project-form.page'
import { ClientsPage } from '../clients/clients.page';
import { ClientFormPage } from '../client-form/client-form.page';
import {SharedModule} from'../../services/SharedModule';//on case you do not know where to put the class name that been use on two pages
//import { DrawPathPage } from '../draw-path/draw-path.page';

const routes: Routes = [
  {
    path: '',
    component: ContainersPage
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
  declarations: [ContainersPage,ContainerMapFormPage,ContainerFormPage],//ProjectFormPage
 // entryComponents:[ContainerMapFormPage,ContainerFormPage,ProjectFormPage,ProjectSearchPage,ProjectAddressMapPage,TownSearchPage,ClientsPage,ClientFormPage/*,DrawPathPage*/]//ProjectFormPage
})
export class ContainersPageModule {}
