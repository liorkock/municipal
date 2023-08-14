import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/*
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];
*/

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 // { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  {path: 'home',loadChildren: () => import('./pages/home/home.module').then(x => x.HomePageModule)},

  //{ path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: () => import( './pages/login/login.module' ).then(x=>x.LoginPageModule)},
  { path: 'alerts', loadChildren: () => import('./pages/alerts/alerts.module').then(x => x.AlertsPageModule) },
  
  //{ path: 'open-alert/:myid', loadChildren: './pages/alerts/alerts.module#AlertsPageModule' },
  { path: 'open-alert/:myid', loadChildren: () => import('./pages/alerts/alerts.module' ).then(x=>x.AlertsPageModule)},


 // { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
 { path: 'about', loadChildren: () => import('./pages/about/about.module').then(x=>x.AboutPageModule) },


  //{ path: 'projects', loadChildren: './pages/projects/projects.module#ProjectsPageModule' },
  { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(x=>x.ProjectsPageModule) },


  //{ path: 'alert-form/:myid', loadChildren: './pages/alerts/alert-form/alert-form.module#AlertFormPageModule' },
  { path: 'alert-form/:myid', loadChildren:  () => import('./pages/alerts/alert-form/alert-form.module').then(x=>x.AlertFormPageModule) },

  //{ path: 'alert-map-form/:myid', loadChildren: './pages/alerts/alert-map-form/alert-map-form.module#AlertMapFormPageModule' },
  { path: 'alert-map-form/:myid', loadChildren: () => import('./pages/alerts/alert-map-form/alert-map-form.module').then(x=>x.AlertMapFormPageModule) },


  //{ path: 'orders', loadChildren: './pages/orders/orders.module#OrdersPageModule' },
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then(x=>x.OrdersPageModule) },

  //{ path: 'order-form/:myid/:mctz', loadChildren: './pages/order-form/order-form.module#OrderFormPageModule' },
  { path: 'order-form/:myid/:mctz', loadChildren:()=>import( './pages/order-form/order-form.module').then(x=>x.OrderFormPageModule) },

  //{ path: 'clients', loadChildren: './pages/clients/clients.module#ClientsPageModule' },
  { path: 'clients', loadChildren: ()=>import( './pages/clients/clients.module').then(x=>x.ClientsPageModule) },

  //{ path: 'client-form/:myid/:mctz', loadChildren: './pages/client-form/client-form.module#ClientFormPageModule' },
  { path: 'client-form/:myid/:mctz', loadChildren: ()=>import('./pages/client-form/client-form.module').then(x=>x.ClientFormPageModule) },

  //{ path: 'drivers', loadChildren: './pages/drivers/drivers.module#DriversPageModule' },
  { path: 'drivers', loadChildren:  ()=>import('./pages/drivers/drivers.module').then(x=>x.DriversPageModule) },


  //{ path: 'container-search', loadChildren: './pages/container-search/container-search.module#ContainerSearchPageModule' },
  { path: 'container-search', loadChildren: ()=>import('./pages/container-search/container-search.module').then(x=>x.ContainerSearchPageModule) },


  //{ path: 'project-search', loadChildren: './pages/project-search/project-search.module#ProjectSearchPageModule' },
  { path: 'project-search', loadChildren: ()=>import('./pages/project-search/project-search.module' ).then(x=>x.ProjectSearchPageModule)},

  //{ path: 'signature', loadChildren: './pages/signature/signature.module#SignaturePageModule' },
  { path: 'signature', loadChildren:  ()=>import('./pages/signature/signature.module' ).then(x=>x.SignaturePageModule)},

  //{ path: 'containers', loadChildren: './pages/containers/containers.module#ContainersPageModule' },
  { path: 'containers', loadChildren:  ()=>import('./pages/containers/containers.module').then(x=>x.ContainersPageModule) },


  //{ path: 'container-map-form', loadChildren: './pages/containers/container-map-form/container-map-form.module#ContainerMapFormPageModule' },  
  { path: 'container-map-form', loadChildren:  ()=>import('./pages/containers/container-map-form/container-map-form.module' ).then(x=>x.ContainerMapFormPageModule)},  

  //{ path: 'container-form', loadChildren: './pages/containers/container-form/container-form.module#ContainerFormPageModule' },
  { path: 'container-form', loadChildren: ()=>import('./pages/containers/container-form/container-form.module').then(x=>x.ContainerFormPageModule) },

  //{ path: 'discharge-control', loadChildren: './pages/discharge-control/discharge-control.module#DischargeControlPageModule' },
  { path: 'discharge-control', loadChildren: ()=>import('./pages/discharge-control/discharge-control.module').then(x=>x.DischargeControlPageModule) },

  //{ path: 'discharge-control-map', loadChildren: './pages/discharge-control/discharge-control-map/discharge-control-map.module#DischargeControlMapPageModule' },
  { path: 'discharge-control-map', loadChildren:()=>import( './pages/discharge-control/discharge-control-map/discharge-control-map.module').then(x=>x.DischargeControlMapPageModule) },

  //{ path: 'container-tracking', loadChildren: './pages/container-tracking/container-tracking.module#ContainerTrackingPageModule' },
  { path: 'container-tracking', loadChildren:()=>import( './pages/container-tracking/container-tracking.module').then(x=>x.ContainerTrackingPageModule) },

  //{ path: 'container-tracking-map', loadChildren: './pages/container-tracking/container-tracking-map/container-tracking-map.module#ContainerTrackingMapPageModule' },
  { path: 'container-tracking-map', loadChildren: ()=>import('./pages/container-tracking/container-tracking-map/container-tracking-map.module').then(x=>x.ContainerTrackingMapPageModule) },


  //{ path: 'container-tracking-form', loadChildren: './pages/container-tracking/container-tracking-form/container-tracking-form.module#ContainerTrackingFormPageModule' },
  { path: 'container-tracking-form', loadChildren: ()=>import('./pages/container-tracking/container-tracking-form/container-tracking-form.module').then(x=>x.ContainerTrackingFormPageModule) },


  //{ path: 'project-form', loadChildren: './pages/projects/project-form/project-form.module#ProjectFormPageModule' },
  { path: 'project-form', loadChildren: ()=>import('./pages/projects/project-form/project-form.module').then(x=>x.ProjectFormPageModule) },


  //{ path: 'project-address-map', loadChildren: './pages/projects/project-address-map/project-address-map.module#ProjectAddressMapPageModule' },
  { path: 'project-address-map', loadChildren: ()=>import('./pages/projects/project-address-map/project-address-map.module').then(x=>x.ProjectAddressMapPageModule) },

  //{ path: 'project-containers', loadChildren: './pages/projects/project-containers/project-containers.module#ProjectContainersPageModule' },    
  { path: 'project-containers', loadChildren: ()=>import('./pages/projects/project-containers/project-containers.module').then(x=>x.ProjectContainersPageModule) },    

  //{ path: 'town-search', loadChildren: './pages/town-search/town-search.module#TownSearchPageModule' },
  { path: 'town-search', loadChildren: ()=>import('./pages/town-search/town-search.module').then(x=>x.TownSearchPageModule) },

  //{ path: 'location-search', loadChildren: './pages/location-search/location-search.module#LocationSearchPageModule' },
  { path: 'location-search', loadChildren:()=>import( './pages/location-search/location-search.module').then(x=>x.LocationSearchPageModule) },

  //{ path: 'draw-path', loadChildren: './pages/draw-path/draw-path.module#DrawPathPageModule' },
  { path: 'draw-path', loadChildren: ()=>import('./pages/draw-path/draw-path.module').then(x=>x.DrawPathPageModule) },

  //{ path: 'supplier-orders', loadChildren: './pages/supplier-orders/supplier-orders.module#SupplierOrdersPageModule' },
  //{ path: 'supplier-orders', loadChildren: ()=>import('./pages/supplier-orders/supplier-orders.module').then(x=>x.SupplierOrdersPageModule) },

  
  //{ path: 'supplier-order-form', loadChildren: './pages/supplier-orders/supplier-order-form/supplier-order-form.module#SupplierOrderFormPageModule' },
  //{ path: 'supplier-order-form', loadChildren: ()=>import('./pages/supplier-orders/supplier-order-form/supplier-order-form.module').then(x=>x.SupplierOrderFormPageModule) },

];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
