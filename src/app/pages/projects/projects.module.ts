import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectsPage } from './projects.page';
import { ProjectFormPage } from './project-form/project-form.page';

import { TownSearchPage } from '../town-search/town-search.page';
import { ProjectAddressMapPage } from './project-address-map/project-address-map.page';
import { ProjectContainersPage } from './project-containers/project-containers.page';
import { LocationSearchPage } from '../location-search/location-search.page';

import { ClientsPage } from '../clients/clients.page';
import { ClientFormPage } from '../client-form/client-form.page';
import { ContainerSearchPage } from '../container-search/container-search.page';
import {SharedModule} from'../../services/SharedModule';//on case you do not know where to put the class name that been use on two pages

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage
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
  declarations: [ProjectsPage,ProjectContainersPage,LocationSearchPage],//ClientsPage,ContainerSearchPage,ProjectFormPage
  //entryComponents:[ProjectFormPage,ProjectContainersPage,LocationSearchPage,ClientsPage,ContainerSearchPage,TownSearchPage,ProjectAddressMapPage,ClientFormPage]//
})
export class ProjectsPageModule {}
