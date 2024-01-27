// import { FullScreenPageComponent } from './../maps/pages/full-screen-page/full-screen-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '../material/material.module';
import { LoginPageComponent } from './pagesAuth/login-page/login-page.component';
import { RegisterPageComponent } from './pagesAuth/register-page/register-page.component';
import { LayoutPageComponent } from './pagesAuth/layout-page/layout-page.component';
import { SidePageComponent } from './pagesAuth/side-page/side-page.component';
import { MapsRoutingModule } from '../maps/maps-routing.module';

import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import{MapsModule} from '../maps/maps.module';
import { RegisterApartmentComponent } from './pagesAuth/register-apartment/register-apartment.component';
// import { MensajeModalComponent } from './pagesAuth/modalRespuesta/mensaje-modal.component';
import { CaracteristicasComponent } from './pagesAuth/register-apartment/components/caracteristicas/caracteristicas.component';
import { ProfileDialogComponent } from './pagesAuth/profile-dialog/profile-dialog.component';


import { MatMenuModule } from '@angular/material/menu';
import { UpdateProfileDialogComponent } from './pagesAuth/update-profile-dialog/update-profile-dialog.component';
import { SeeApartmentComponent } from './pagesAuth/see-apartment/see-apartment.component';
import { PageNotFoundComponent } from './pagesAuth/page-not-found/page-not-found.component';
import { EditApartmentComponent } from './pagesAuth/edit-apartment/edit-apartment.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
      LayoutPageComponent,
      LoginPageComponent,
      RegisterPageComponent,
      SidePageComponent,
      RegisterApartmentComponent,
      // MensajeModalComponent,
      CaracteristicasComponent,
      ProfileDialogComponent,
      UpdateProfileDialogComponent,
      SeeApartmentComponent,
      PageNotFoundComponent,
      EditApartmentComponent,

      // FullScreenPageComponent

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    MatDialogModule,
    MapsModule, // le importe el module de maps en el de   auth.module
    ReactiveFormsModule,
    MatMenuModule,
    NgChartsModule,
  ]
})
export class AuthModule { }
