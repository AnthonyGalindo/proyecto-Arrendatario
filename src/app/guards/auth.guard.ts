import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../auth/pagesAuth/services/usuario.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {


  const userService = inject(UsuarioService);
  const router = inject(Router);

  console.log('paso por el canActive');

  const user_id_bool = userService.ValidarUsuario() ;
  if(!user_id_bool && state.url !== '/auth/sid/propiedades'){
    router.navigateByUrl("/auth/sid/pageNotFound" , { replaceUrl: true });
  }

  return user_id_bool

};
