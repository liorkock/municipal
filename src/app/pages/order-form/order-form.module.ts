import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderFormPage } from './order-form.page';

import { ClientFormPage } from '../client-form/client-form.page';
import { DriversPage } from '../drivers/drivers.page';

import { ProjectSearchPage } from '../project-search/project-search.page';

import { ClientsPage } from '../clients/clients.page';
import { ContainerSearchPage } from '../container-search/container-search.page';

import {SharedModule} from'../../services/SharedModule'
import { SignaturePage } from '../signature/signature.page';

//import { SignaturePadModule } from 'angular2-signaturepad';

const routes: Routes = [
  {
    path: '',
    component: OrderFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule//,
    //SignaturePadModule
  ],
  declarations: [OrderFormPage,DriversPage,SignaturePage],//ClientsPage,ContainerSearchPage,ProjectSearchPage
 // entryComponents:[ClientFormPage,DriversPage,ProjectSearchPage,ClientsPage,ContainerSearchPage,SignaturePage]//
})
export class OrderFormPageModule {}
