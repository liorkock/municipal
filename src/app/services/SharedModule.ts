import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClientsPage } from '../pages/clients/clients.page';
import { ClientFormPage } from '../pages/client-form/client-form.page';
import { ContainerSearchPage } from '../pages/container-search/container-search.page';
import { ProjectFormPage } from '../pages/projects/project-form/project-form.page';
import { ProjectSearchPage } from '../pages/project-search/project-search.page';
import { ProjectAddressMapPage } from '../pages/projects/project-address-map/project-address-map.page';
import { TownSearchPage } from '../pages/town-search/town-search.page';
//import { DrawPathPage } from '../pages/draw-path/draw-path.page';
//import { SupplierOrderFormPage } from '../pages/supplier-orders/supplier-order-form//supplier-order-form.page';





@NgModule({
    imports: [
        CommonModule,IonicModule,FormsModule
    ],
    declarations: [
        ClientsPage,ContainerSearchPage,ProjectFormPage,ProjectSearchPage,ProjectAddressMapPage,TownSearchPage,ClientFormPage
    ],
    exports: [
        ClientsPage,ContainerSearchPage,ProjectFormPage,ProjectSearchPage,ProjectAddressMapPage,TownSearchPage,ClientFormPage
    ]
})
export class SharedModule {}