import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apartamento, Apartment, Caracteristicas, CaracteristicasDT, Condiciones, CondicionesDT, ServiciosDT } from '../Interfaces/register-form.interface';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, map, of, tap,switchMap, BehaviorSubject, forkJoin, EMPTY } from 'rxjs';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


const url_usuarioRegistro = environment.registro_Usuario_url;

@Injectable({
  providedIn: 'root'
})
export class ApartamentoService {

  ActualizarCaracteristicas(caracteristicasDt: CaracteristicasDT, Id_apar: number): any {
    return this.http.put(`${url_usuarioRegistro}/Caracteristicas/${Id_apar}`,caracteristicasDt)
  }
  ActualizarCondiciones(condicionesDt: CondicionesDT, Id_apar: number): any {
   return this.http.put(`${url_usuarioRegistro}/Condiciones/${Id_apar}`,condicionesDt);
  }
  ActualizarServicios(serviciosDt: ServiciosDT, Id_apar: number): any {
    return this.http.put(`${url_usuarioRegistro}/Servicios/${Id_apar}`,serviciosDt)
  }

  ActualizarApartamento(apartamentoDt: Apartamento, Id_apar:number) {
    return this.http.put(`${url_usuarioRegistro}/Apartamentos/${Id_apar}`,apartamentoDt)
  }

  //Para traer la informacion para Editar
  traerServicios(Id_apar: number): Observable<any> {
    return this.http.get(`${url_usuarioRegistro}/Servicios/${Id_apar}`)
  }
  traerCondiciones(Id_apar: number):Observable<any>  {
    return this.http.get(`${url_usuarioRegistro}/Condiciones/${Id_apar}`)
  }
  traerCaracteristicasEdit(Id_apar: number):Observable<any>  {
    return this.http.get(`${url_usuarioRegistro}/Caracteristicas/${Id_apar}`)
  }

  traerApartamentoEdit(Id_apar: number):Observable<any>  {
   return this.http.get(`${url_usuarioRegistro}/Apartamentos/${Id_apar}`)
  }

//



  EnviarCaracteristicas(caracteristicas: Caracteristicas): any {
    return this.http.post(`${url_usuarioRegistro}/Caracteristicas`,caracteristicas);
  }

  EnviarCondiciones(condiciones: Condiciones): any {
    console.log(condiciones);

    return this.http.post(`${url_usuarioRegistro}/Condiciones`,condiciones)

  }

  constructor(private http: HttpClient) { }

  public get ObtenerId() : string {
    return localStorage.getItem('token_User')|| '';
  }

  EnviarApartamento(apartamento:Apartment){
    console.log(apartamento);

    return this.http.post(`${url_usuarioRegistro}/Apartamentos`,apartamento)
  }

  private locationSubject = new BehaviorSubject<{ latitude: string, longitude: string } | null>(null);
  location$ = this.locationSubject.asObservable();

  setLocation(latitude: string, longitude: string) {
    this.locationSubject.next({ latitude, longitude });
  }

  private editarPagina = new BehaviorSubject<number>(0) ;
  editarform$ = this.editarPagina.asObservable();

  setEditarPagina(estadoEditar:number){
    this.editarPagina.next(estadoEditar);
  }



//para no perder la informacion del formulario ya llenado ir al mapa y trerme las coordeandas
private apartmentState = new BehaviorSubject<any>(null);

setApartmentState(state: any) {
  this.apartmentState.next(state);
}
getApartmentState() {
  return this.apartmentState.asObservable();
}
// Nuevo método para guardar el estado del formulario
setApartmentFormState(formState: FormGroup) {
  this.apartmentState.next({ ...this.apartmentState.value, formState });
}
// Nuevo método para obtener el estado del formulario
getApartmentFormState() {
  return this.apartmentState.value?.formState || null;
}

//Enviar Servicios
EnviarServicios(servicios:any){
  console.log(servicios);

  return this.http.post(`${url_usuarioRegistro}/Servicios`,servicios)
}



subirImagenes(idApartamento: number, imagenes: File[]): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('id_apartamentos_per', idApartamento.toString());

  const observables: Observable<File>[] = [];

  for (let i = 0; i < Math.min(imagenes.length, 6); i++) {
    const compressedImageObservable = this.compressImage(imagenes[i]);


    observables.push(compressedImageObservable);
  }

  //Actualizar imagenes


  // Combinar observables para esperar que todas las imágenes se completen
  return forkJoin(observables).pipe(
    switchMap((compressedImages: File[]) => {
      for (let i = 0; i < compressedImages.length; i++) {
        formData.append(`imagen${i + 1}`, compressedImages[i], compressedImages[i].name);
      }

      // Enviar la solicitud HTTP con las imágenes comprimidas
      return this.http.post(`${url_usuarioRegistro}/Imagenes/Subir`, formData);


    })
  );
}



ActualizarImagenes(idApartamento: number, imagenes: File[]): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('id_apartamentos_per', idApartamento.toString());

  const observables: Observable<File>[] = [];

  for (let i = 0; i < Math.min(imagenes.length, 6); i++) {
    const compressedImageObservable = this.compressImage(imagenes[i]);


    observables.push(compressedImageObservable);
  }

  //Actualizar imagenes


  // Combinar observables para esperar que todas las imágenes se completen
  return forkJoin(observables).pipe(
    switchMap((compressedImages: File[]) => {
      for (let i = 0; i < compressedImages.length; i++) {
        formData.append(`imagen${i + 1}`, compressedImages[i], compressedImages[i].name);
      }

      // Enviar la solicitud HTTP con las imágenes comprimidas

      return this.http.put(`${url_usuarioRegistro}/Imagenes/Actualizar/${idApartamento}`, formData);
    })
  );
}


traerTodasLasIMagenesDelApartamento(){
  const  id_apart = localStorage.getItem('Id_aparta');
  return this.http.get(`${url_usuarioRegistro}/Imagenes/GetTodasFotosPorApartamento/${id_apart}`)
}



 // Metotdo para comprimir imagenes
  private compressImage(file: File): Observable<File> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 500; // Aqui puedo Ajusta el ancho
          const maxHeight = 500; // Aqui puedo Ajusta el alto

          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(image, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob as Blob], file.name, {
                type: file.type,
              });
              observer.next(compressedFile);
              observer.complete();
            },
            file.type,
            0.8 // Ajusta la calidad de compresión según tus necesidades (0.7 es un valor de ejemplo)
          );
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }


  traerConsulta1(){
    return this.http.get(`${url_usuarioRegistro}/apartamentos/vista`)
  }

  traerConsulta2() {
    return this.http.get(`${url_usuarioRegistro}/apartamentos/vista2`)
  }

}
