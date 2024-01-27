import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { audit } from 'rxjs';

const routes: Routes = [

    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module').then( m => m.MapsModule ),
    },

    // {
    //   path: 'heroes',
    //   loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule ),
    // },
    {
      path: '**',
     redirectTo: 'auth/login'
    },
    // {
    //   path: '',
    //   redirectTo: 'heroes',
    //   pathMatch: 'full'
    // },
    // {
    //   path: '**',
    //   redirectTo: '404',
    // }

  ];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
