import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContainerTrackingPage } from './container-tracking.page';
import {ContainerTrackingMapPage} from './container-tracking-map/container-tracking-map.page'
import {ContainerTrackingFormPage} from './container-tracking-form/container-tracking-form.page'

const routes: Routes = [
  {
    path: '',
    component: ContainerTrackingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContainerTrackingPage,ContainerTrackingMapPage,ContainerTrackingFormPage],
 // entryComponents:[ContainerTrackingMapPage,ContainerTrackingFormPage]
})
export class ContainerTrackingPageModule {}
