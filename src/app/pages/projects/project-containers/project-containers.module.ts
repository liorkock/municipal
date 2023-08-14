import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectContainersPage } from './project-containers.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectContainersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []//ProjectContainersPage
})
export class ProjectContainersPageModule {}
