import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectFormPage } from './project-form.page';
//import { ClientsPage } from '../../clients/clients.page';



const routes: Routes = [
  {
    path: '',
    component: ProjectFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],//ProjectFormPage
  //entryComponents:[]
})
export class ProjectFormPageModule {}
