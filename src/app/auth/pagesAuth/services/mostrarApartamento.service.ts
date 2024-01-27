import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { NuevoApartamento } from '../Interfaces/register-form.interface';
import { DomSanitizer } from '@angular/platform-browser';
const url_usuarioRegistro = environment.registro_Usuario_url;

@Injectable({
  providedIn: 'root'
})




export class MostrarApartamentoService {


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

  }


  traerAapartamentos():Observable<any>{
    const  id_usuario = localStorage.getItem('token_User');
    return this.http.get( `${url_usuarioRegistro}/Apartamentos/ByUserId/${id_usuario}`);
  }

  traerPrimeraImagen(){
   const  id_usuario = localStorage.getItem('token_User');
    return this.http.get(`${url_usuarioRegistro}/Imagenes/GetFoto1ByUserId/${id_usuario}`)
  }



  //Para llevarme la informacion a editar de ese formulario
    private apartamentoSeleccionadoSubject = new BehaviorSubject<NuevoApartamento | null>(null);

    get apartamentoSeleccionado$() {
      return this.apartamentoSeleccionadoSubject.asObservable();
    }

    setApartamentoSeleccionado(apartamento: NuevoApartamento) {
      this.apartamentoSeleccionadoSubject.next(apartamento);
    }

    getApartamentoSeleccionado(): NuevoApartamento | null {
      return this.apartamentoSeleccionadoSubject.value;
    }

    resetApartamentoSeleccionado() {
      this.apartamentoSeleccionadoSubject.next(null);
    }


    traerTodosApartamentos():Observable<any>{
      return this.http.get( `${url_usuarioRegistro}/Apartamentos`);

    }


    //aqui tambien esta

    traerTodasLasIMagenesDelApartamento(id_apart:number){

      return this.http.get(`${url_usuarioRegistro}/Imagenes/GetTodasFotosPorApartamentoss/${id_apart}`)
    }


    // getSafeUrl(base64String: string): any {
    //   const dataUrl = `data:image/jpeg;base64,${base64String}`;
    //   return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    // }

  }





