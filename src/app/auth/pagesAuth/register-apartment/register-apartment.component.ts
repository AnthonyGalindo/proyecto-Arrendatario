// import { MarkersPageComponent } from './../../../maps/pages/markers-page/markers-page.component';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Apartment, Caracteristicas, Condiciones, Servicios } from '../Interfaces/register-form.interface';
import { ApartamentoService } from '../services/apartamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { catchError, merge, mergeMap, of, throwError } from 'rxjs';


@Component({
  selector: 'app-register-apartment',
  templateUrl: './register-apartment.component.html',
  styleUrl: './register-apartment.component.css'
})
export class RegisterApartmentComponent {
  public formSubmitted = false;
  public formApartment: FormGroup;
  public long:string ='';
  public lat:string ='';
  public Id_apar: number  = 0;

  //para la lista de imagenes
  selectedFiles: File[] | null = null;

  constructor(
    private fb: FormBuilder,
    private apartService:ApartamentoService,
    private router:Router,
    private dialog: MatDialog,

    private locationService: ApartamentoService,
    private sanitizer: DomSanitizer

  ){
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.locationService.location$.subscribe(location => {
        // Hacer algo con las coordenadas, como asignarlas a las propiedades del formulario
        if (location) {
          this.long= location.longitude,
          this.lat= location.latitude
        }
      });

      this.formApartment = this.fb.group({
        descripcion:['',[ Validators.required, Validators.minLength(5) ]],
        precio:[0,[Validators.required]],
        //servicios
        luz:[false,],
        agua:[false,],
        telefono:[false,],
        garage:[false,],
        gas:[false,],
        desayuno:[false,],
        almuerzo:[false,],
        merienda:[false,],
        //Condiciones
        permite_Mascotas:[false],
        permite_Fiestas:[false],
        permite_MusicaAltoVolumen:[false],
        permite_Tomar:[false],
        permite_Fumar:[false],
        //Caracteristicas
        nHabitaciones:[1,[Validators.required]],
        aCompartido:[false],
        aCocina:[false],
        aBanoIndependiente:[false],
        aBanoCompartido:[false],
        aDucha:[false],
        aAmoblado:[false],
      })

      const formState = this.apartService.getApartmentFormState();
      if (formState) {
        this.formApartment.patchValue(formState.value);
      }

  }

  public get traerUserId() : string {
    return localStorage.getItem('token_User') || '';
  }

  getImgUrl(file: File): any {
    return file ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)) : '';
  }

  // ObtenerUbicacion(){
  //   const dialogRef = this.dialog.open(MarkersPageComponent);


  // }

  enviarApartamento(){
    this.formSubmitted = true;

    console.log('apartamneto envado Anthony');

    if( this.formApartment.valid ){
      console.log(this.formApartment.value);
      const id =  parseInt(this.traerUserId);
      const precio = this.formApartment.value.precio
      console.log(typeof precio);

      const apartment:Apartment = {
        Nombre_apart: this.formApartment.value.descripcion,
        Precio_apart: precio,
        Id_usuario_per: id,
        Longitud: this.long,
        Latitud: this.lat,
        Estado_apart: false
      }

      this.apartService.EnviarApartamento(apartment)
      .pipe(
          mergeMap((resp: any) => {
            console.log('Respuesta del apartamento validada:', resp);
            console.log(resp);

            this.Id_apar = resp.Id_apartamento;

            const servicios: Servicios ={
              Id_apartamento_per:   this.Id_apar,
              Luz: this.formApartment.value.luz,
              Agua: this.formApartment.value.agua,
              Telefono: this.formApartment.value.telefono,
              Garage: this.formApartment.value.garage,
              Gas: this.formApartment.value.gas,
              Desayuno: this.formApartment.value.desayuno,
              Almuerzo: this.formApartment.value.almuerzo,
              Merienda: this.formApartment.value.merienda
            }
            // Puedes realizar más operaciones aquí si es necesario
            // Por ejemplo, puedes devolver otro observable si necesitas realizar más operaciones encadenadas
            return this.apartService.EnviarServicios(servicios)
          }),
              mergeMap((respServicios: any) => {

                const condiciones:Condiciones ={
                  Id_apartamento_per:   this.Id_apar,
                  Permite_Mascotas: this.formApartment.value.permite_Mascotas,
                  Permite_Fiestas:  this.formApartment.value.permite_Fiestas,
                  Permite_MusicaAltoVolumen:  this.formApartment.value.permite_MusicaAltoVolumen,
                  Permite_Tomar:  this.formApartment.value.permite_Tomar,
                  Permite_Fumar:  this.formApartment.value.permite_Fumar,
                }
                return this.apartService.EnviarCondiciones(condiciones);
              }),
                mergeMap((resp) => {
                  console.log(resp);
                  const caracteristicas: Caracteristicas ={
                    Id_apartamento_per: this.Id_apar,
                    N_habitaciones: this.formApartment.value.nHabitaciones,
                    ApartamentoCompartido: this.formApartment.value.aCompartido,
                    Cocina: this.formApartment.value.aCocina,
                    Bano_Independiente: this.formApartment.value.aBanoIndependiente,
                    Bano_Compartido: this.formApartment.value.aBanoCompartido,
                    Ducha: this.formApartment.value.aDucha,
                    Amoblado: this.formApartment.value.aAmoblado
                  }

                  return this.apartService.EnviarCaracteristicas(caracteristicas);
                }),

              mergeMap((resp: any) => {
                

                if (this.selectedFiles) {
                  const filesArray = Array.from(this.selectedFiles);

                  if (filesArray.length > 0) {
                      // Llamar al servicio para subir las imágenes
                      this.formApartment.reset();
                      return this.apartService.subirImagenes(this.Id_apar, filesArray);

                  } else {
                    // No hay archivos seleccionados
                    return of(true); //  Observable vacío
                  }
                } else {

                  return of(true); // Devolver un Observable vacío
                }
                // Manejar el caso donde no hay archivos seleccionados
              })
        )
      .subscribe(
        (resp) => {
          console.log('sale Respuesta');
          console.log(resp);
          // this.formApartment.get('descripcion')?.value('');
          // Todas las operaciones han tenido éxito
          Swal.fire('Operación Exitosa', 'Apartamento y otros campos creados', 'success');
          this.router.navigate(['/auth/sid/seeApartamentos'] );
        },
        (err: any) => {
          
          Swal.fire('Operación Exitosa', 'Apartamento y otros campos creados', 'success');
          this.router.navigate(['/auth/sid/seeApartamentos'] );
        }
      );

    }else{
      Swal.fire('Campos Vacios o No Validos', 'No paso la Validacion', 'error');
    }


  }

  // para la carga de imagenes
  onFileSelected(event: any) {

    this.selectedFiles = Array.from(event.target.files);

    console.log(event.target.files);


  }



  campoNoValido(campo: string):boolean{
    if ( this.formApartment.get(campo)!.invalid && this.formSubmitted  ) {
      return true;
    }else{
      return false;

    }
  }



  irAMarcador() {
    // Guardar el estado del formulario antes de navegar al componente del mapa
    this.apartService.setEditarPagina(0);
    this.apartService.setApartmentFormState(this.formApartment);

    // Navegar al componente del mapa
    this.router.navigate(['/auth/sid/marcador']);
  }




}
