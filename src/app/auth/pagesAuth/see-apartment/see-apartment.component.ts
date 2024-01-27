import { Component } from '@angular/core';
import { Apartamento, NuevoApartamento } from '../Interfaces/register-form.interface';
import { MostrarApartamentoService } from '../services/mostrarApartamento.service';
import {  catchError, forkJoin, mergeMap, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EliminarService } from '../services/eleminarApartamentos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-see-apartment',
  templateUrl: './see-apartment.component.html',
  styleUrl: './see-apartment.component.css'
})
export class SeeApartmentComponent {


  ngOnInit(): void {

      this.agregarApartamentos();
  }
  constructor( private mostrarAp: MostrarApartamentoService, private router:Router,  private eliminarService:EliminarService ){
  }

public imageSrc: Blob[] = [] ;
public aparta: Apartamento[] =[];
public nuevoApartamentos: NuevoApartamento[] = [];



  agregarApartamentos() {
    this.mostrarAp.traerAapartamentos().pipe(
      mergeMap(
      (resp:Apartamento[]) => {
         resp.forEach(el => {
          const nuevoApart:NuevoApartamento ={
          Id_apartamento: el.Id_apartamento,
          Nombre_apart: el.Nombre_apart,
          Precio_apart: el.Precio_apart,
          Id_usuario_per: el.Id_usuario_per,
          Longitud: el.Longitud,
          Latitud: el.Latitud,
          Estado_apart: el.Estado_apart,
          foto1: ''
        }
        this.nuevoApartamentos.push(nuevoApart);
       });


        return this.mostrarAp.traerPrimeraImagen( );
      })
    ).subscribe(
      (resp:any)=>{
          if (resp.length > 0){
            for (let i = 0; i < resp.length; i++) {
              let foto = resp[i];
              let blob:Blob =  this.base64toBlob(foto);
              this.nuevoApartamentos[i].foto1= URL.createObjectURL(blob);
            }
          }
        }
    )

  }
   base64toBlob(base64: string): Blob {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'image/jpeg' }); // Ajusta el tipo de imagen según tu necesidad
  }
  editarApartamento(idApartamento: number){
    // Buscar el apartamento por su Id
    const apartamentoSeleccionado = this.nuevoApartamentos.find(apart => apart.Id_apartamento === idApartamento);
    // Comprobar si se encontró el apartamento
    if (apartamentoSeleccionado) {
      // Enviar el apartamento al componente de formulario para editar
      this.mostrarAp.setApartamentoSeleccionado(apartamentoSeleccionado);
      this.router.navigate(['/auth/sid/editar'])
    } else {
      console.error('Apartamento no encontrado');
    }
  }


  //Eliminar
  eliminarApartamento(idApartamento:number ){
    const indiceApartamento = this.nuevoApartamentos.findIndex(apart => apart.Id_apartamento === idApartamento);

    if (indiceApartamento !== -1) {
      // Eliminar el apartamento usando splice
      this.nuevoApartamentos.splice(indiceApartamento, 1);
      console.log(`Apartamento con ID ${idApartamento} eliminado correctamente.`);
    }


    // const eliminarCaracteristicas$ = this.eliminarService.eliminarCaracteristicas(idApartamento);
    // const eliminarCondiciones$ = this.eliminarService.eliminarCondiciones(idApartamento);
    // const eliminarServicios$ = this.eliminarService.eliminarServicios(idApartamento);
    // const eliminarImagenes$ = this.eliminarService.eliminarImagenes(idApartamento);
    // const eliminarApartamento$ = this.eliminarService.eliminarApartamento(idApartamento);


   this.eliminarService.eliminarCaracteristicas(idApartamento)
 .pipe(
      mergeMap((resp):any => {
    console.log('11111111111111111');
    console.log(resp);


      return this.eliminarService.eliminarCondiciones(idApartamento);

      }),
      mergeMap( (resp):any =>{
    console.log('2222222222');
    console.log(resp);


        return this.eliminarService.eliminarServicios(idApartamento);
      }),
      mergeMap( (resp):any =>{
        console.log('33333333333');
        console.log(resp);

        return this.eliminarService.eliminarImagenes(idApartamento);
      }),
    ).subscribe(
      (resp):any=>{
        console.log('4444444444444444');
        console.log(resp);

        return this.eliminarService.eliminarApartamento(idApartamento).subscribe(
            (resp):any => {
                console.log(resp);
                console.log('55555555555555555555');
                Swal.fire('Operacion Exitosa','Apartamento Eliminado','success')
            }

        )
      }
    )

  }






  actualizarEstado(idApartamento: number, nuevoEstado: boolean): void {
    this.eliminarService.actualizarEstadoApartamento(idApartamento, nuevoEstado)
      .subscribe(
        respuesta => {


          const ind = this.nuevoApartamentos.findIndex(apart => apart.Id_apartamento === idApartamento);
          if (respuesta == true) {
             this.nuevoApartamentos[ind].Estado_apart =true;

          }else{
            this.nuevoApartamentos[ind].Estado_apart =false;
          }
          console.log('Estado actualizado correctamente', respuesta);
          // Aquí puedes realizar acciones adicionales después de actualizar el estado
        },
        error => {
          console.error('Error al actualizar el estado', error);
        }
      );
  }


}
