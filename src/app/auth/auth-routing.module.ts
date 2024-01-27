import { RegisterPageComponent } from './pagesAuth/register-page/register-page.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { LayoutPageComponent } from './pagesAuth/layout-page/layout-page.component';
import { LoginPageComponent } from './pagesAuth/login-page/login-page.component';

// import { FullScreenPageComponent } from "../maps/pages/full-screen-page/full-screen-page.component";
import { MarkersPageComponent } from "../maps/pages/markers-page/markers-page.component";
import { PropertiesPageComponent } from "../maps/pages/properties-page/properties-page.component";
import{RegisterApartmentComponent} from "./pagesAuth/register-apartment/register-apartment.component";
import{SeeApartmentComponent} from "./pagesAuth/see-apartment/see-apartment.component"
// import { ZoomRangePageComponent } from "../maps/pages/zoom-range-page/zoom-range-page.component";

import {SidePageComponent} from './pagesAuth/side-page/side-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { PageNotFoundComponent } from './pagesAuth/page-not-found/page-not-found.component';
import { EditApartmentComponent } from './pagesAuth/edit-apartment/edit-apartment.component';
import { DetalleimagenComponent } from '../maps/pages/detalleimagen/detalleimagen.component';
import { LineChartComponent } from '../app/line-chart/line-chart.component';
// localhost:4200/auth/
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'Registrarse', component: RegisterPageComponent },
      // {path:'editar',component:EditApartmentComponent },
      {  path:'pageNotFound', component:PageNotFoundComponent}
      // { path: '**', redirectTo: 'login' },
    ],

  },


  {
    path:'sid',
    component:SidePageComponent,
    canActivate:[AuthGuard],
    children:[
    // {  path:'fullScreen', component:FullScreenPageComponent},
    {path:'registroApartamento',component:RegisterApartmentComponent},
    {  path:'marcador', component:MarkersPageComponent},
    {  path:'propiedades', component:PropertiesPageComponent},
    {  path:'seeApartamentos', component:SeeApartmentComponent},
    {path:'imagen',component:DetalleimagenComponent},
    {path:'editar',component:EditApartmentComponent },
    {path:'line',component:LineChartComponent}
    // {  path:'zoom', component:ZoomRangePageComponent},
    //   component: FullScreenPageComponent,
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
})
export class AuthRoutingModule { }
