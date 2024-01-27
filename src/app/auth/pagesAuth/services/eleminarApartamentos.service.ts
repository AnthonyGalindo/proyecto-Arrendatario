import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const url_usuarioRegistro = environment.registro_Usuario_url;

@Injectable({
  providedIn: 'root'
})
export class EliminarService {


  constructor( private http:HttpClient    ) {

  }



  eliminarCaracteristicas(IdAparta: number){

    return this.http.delete(`${url_usuarioRegistro}/Caracteristicas/${IdAparta}`);

  }


  eliminarCondiciones(IdAparta: number){
    return this.http.delete(`${url_usuarioRegistro}/Condiciones/${IdAparta}`);
  }



  eliminarServicios(IdAparta: number){
    return this.http.delete(`${url_usuarioRegistro}/Servicios/${IdAparta}`);


  }

  eliminarImagenes(IdAparta: number){
    return this.http.delete(`${url_usuarioRegistro}/Imagenes/${IdAparta}`);
  }


  eliminarApartamento(idApartamento: number) {
    return this.http.delete(`${url_usuarioRegistro}/Apartamentos/${idApartamento}`);
  }

  //ActualizarEstado
  actualizarEstadoApartamento(idApartamento: number, nuevoEstado: boolean) {
    return this.http.put<boolean>(`${url_usuarioRegistro}/Apartamentos/UpdateEstado/${idApartamento}`, nuevoEstado);
  }

}
