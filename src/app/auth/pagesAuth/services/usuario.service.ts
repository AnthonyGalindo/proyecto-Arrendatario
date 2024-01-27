import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { LoginBac, RegisterForm, RegisterFormBac } from '../Interfaces/register-form.interface';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, map, of, tap,switchMap } from 'rxjs';


import * as imageSize from 'image-size';



const url_usuarioRegistro = environment.registro_Usuario_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public imagenActualizada = new EventEmitter<string | null>();


  public get ObtenerId() : string {
    return localStorage.getItem('token_User')|| '';
  }


  constructor(private http: HttpClient) { }

      CrearUsuario(formData: RegisterFormBac){
        console.log('Creando Usuario');
        console.log(formData);
        return this.http.post(`${url_usuarioRegistro}/Usuarios`,formData);
      }

      LogearUsuario(logData: LoginBac){
        return this.http.post(`${url_usuarioRegistro}/Usuarios/Login`,logData)
          .pipe(
            tap( (resp: any) => {
              console.log( typeof resp);
              console.log( resp);
              console.log("servicio");
            let   numId = resp.toString()
              localStorage.setItem('token_User',numId);
            })
        );
      }

      //traer todos los campos del usuario con el id
      async GetNameUser() {
        try {
          const id = localStorage.getItem('token_User');
          // Utiliza await para esperar a que la solicitud HTTP se complete
          const nomId: any = await this.http.get(`${url_usuarioRegistro}/Usuarios/${id}`).toPromise();
          console.log(nomId);
          console.log(nomId.Nombre_usuario);
          // Puedes retornar el resultado si es necesario
          return nomId;
        } catch (error) {
          // Manejar errores aquí
          console.error('Error al obtener el nombre del usuario', error);
          throw error; // Puedes lanzar o manejar el error según tus necesidades
        }
      }
     

    //  async  GetTipoCuenta() {

    //   try {
    //     const id = localStorage.getItem('token_User');

    //     // Utiliza await para esperar a que la solicitud HTTP se complete
    //     const nomId: any = await this.http.get(`${url_usuarioRegistro}/Usuarios/${id}`).toPromise();

    //     console.log(nomId);
    //     console.log(nomId.Nombre_usuario);

    //     // Puedes retornar el resultado si es necesario
    //     return nomId.Nombre_usuario;
    //   } catch (error) {
    //     // Manejar errores aquí
    //     console.error('Error al obtener el nombre del usuario', error);
    //     throw error; // Puedes lanzar o manejar el error según tus necesidades
    //   }
    //     throw new Error('Method not implemented.');
    //   }
    




      ValidarUsuario(){

        const user_id = localStorage.getItem('token_User');

        if( (user_id  !== '-1') && (user_id !== null  ) ) {

          return true;
        }else{

          return false;
        }
      }


      uploadProfileImage(userId: string, file: File): Observable<string | null> {

        console.log(file);

        return this.compressImage(file).pipe(
          switchMap((compressedFile) => {
            const formData = new FormData();
            formData.append('file', compressedFile);
            return this.http.put(`${url_usuarioRegistro}/Usuarios/${userId}/Foto`, formData).pipe(
              map(
                (response: any) => {
                  if (response && response.imageUrl) {
                    return response.imageUrl as string;
                  } else {
                    return null;
                  }
                },
                catchError((error) => {
                  console.error('Error en la carga de la imagen de perfil:', error);
                  return of(null);
                })
              )

            );
          })
        );
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

              const maxWidth = 100; // Ajusta el ancho máximo según tus necesidades
              const maxHeight = 100; // Ajusta la altura máxima según tus necesidades

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
                0.5 // Ajusta la calidad de compresión según tus necesidades (0.7 es un valor de ejemplo)
              );
            };
            image.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      async obtenerImagenUsuario(userId: string): Promise<Blob> {
        const url = `${url_usuarioRegistro}/Usuarios/${userId}/Foto`;
        try {
          const response = await this.http.get(url, { responseType: 'blob' }).toPromise();
          console.log(response);


          return response as Blob;
        } catch (error) {
          console.error('Error al obtener la imagen del usuario', error);
          throw error; // Puedes manejar el error aquí o dejar que se propague
        }
      }
      //Actualizaicon de Usuario
      actualizarUsuario(nombreUsuario:string):Observable<any>{
        try {
          const id = this.ObtenerId;

          const url = `${url_usuarioRegistro}/Usuarios/Act/${id}`;  // Reemplaza 'actualizarTelefono' con la ruta real de tu API para actualizar el teléfono

          const data ={
            Id_usuario:id,
            Nombre_usuario:nombreUsuario
          }
          // Envia la solicitud HTTP PUT para actualizar el teléfono
          return this.http.put(url, data);


        } catch (error) {
          console.error('Error al obtener la imagen del usuario', error);
          throw error; // Puedes manejar el error aquí o dejar que se propague
        }
      }

      actualizarEmail(nuevoEmail:string):Observable<any>{
        try {
          const id = this.ObtenerId;

          const url = `${url_usuarioRegistro}/Usuarios/Act/${id}`;  // Reemplaza 'actualizarTelefono' con la ruta real de tu API para actualizar el teléfono

          const data ={
            Id_usuario:id,
            Correo_usuario:nuevoEmail
          }
          // Envia la solicitud HTTP PUT para actualizar el teléfono
          return this.http.put(url, data);


        } catch (error) {
          console.error('Error al obtener la imagen del usuario', error);
          throw error; // Puedes manejar el error aquí o dejar que se propague
        }
      }

      actualizarTelefono(telefono:string):Observable<any>{
        try {
          const id = this.ObtenerId;

          const url = `${url_usuarioRegistro}/Usuarios/Act/${id}`;

          const data ={
            Id_usuario:id,
            telefono_usuario:telefono
          }
          // Envia la solicitud HTTP PUT para actualizar el teléfono
          return this.http.put(url, data);


        } catch (error) {
          console.error('Error al obtener la imagen del usuario', error);
          throw error; // Puedes manejar el error aquí o dejar que se propague
        }
      }


}
