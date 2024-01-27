import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapsLayoutComponent } from './layout/maps-layout/maps-layout.component';

import { FullScreenPageComponent } from './pages/full-screen-page/full-screen-page.component';
import { MarkersPageComponent } from './pages/markers-page/markers-page.component';



import { PropertiesPageComponent } from './pages/properties-page/properties-page.component';
import { DetalleimagenComponent } from './pages/detalleimagen/detalleimagen.component';






const routes: Routes = [
  {
    path: '',
    component: MapsLayoutComponent,
    children: [
      { path: 'fullscreen', component: FullScreenPageComponent },
      { path: 'markers', component: MarkersPageComponent },
      { path: 'properties', component: PropertiesPageComponent },
      {path: 'imagen',component:DetalleimagenComponent}

      // { path: '**', redirectTo: 'fullscreen' },
    ]
  },

  {
    path: 'maps',
    loadChildren: () => import('../maps/maps.module').then( m => m.MapsModule ),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
