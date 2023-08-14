import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClientFormPage } from './client-form.page';
import { TownSearchPage } from '../town-search/town-search.page';
const routes: Routes = [
  {
    path: '',
    component: ClientFormPage
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
  //entryComponents:[TownSearchPage]

})
export class ClientFormPageModule {}
