import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApartamentoService } from '../services/apartamento.service';
import { Route, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin, mergeMap, Observable, of, Subscriber } from 'rxjs';
import { Apartment, Caracteristicas, Condiciones, NuevoApartamento, Servicios, Apartamento, CaracteristicasDT, CondicionesDT, ServiciosDT } from '../Interfaces/register-form.interface';
import { MostrarApartamentoService } from '../services/mostrarApartamento.service';

@Component({
  selector: 'app-edit-apartment',
  templateUrl: './edit-apartment.component.html',
  styleUrl: './edit-apartment.component.css'
})
export class EditApartmentComponent {
  public formSubmitted = false;
  public formApartmentEdit: FormGroup;
  public long:string ='';
  public lat:string ='';
  public Id_apar: number  = 0 ;



  //EntidadesDt para actualisacion
public apartamentoDt:Apartamento=  {} as Apartamento;
public serviciosDt:ServiciosDT=  {} as ServiciosDT;
public condicionesDt:CondicionesDT=  {} as CondicionesDT;
public caracteristicasDt:CaracteristicasDT=  {} as CaracteristicasDT;





  //para la lista de imagenes
  selectedFiles: File[] | null = null;
  arrayImagenesMostrar: string[]  = [];
  imagenesBaseMostrar:boolean = true;

  public apartamentoSeleccionado: NuevoApartamento | null = null;

  ngOnInit(): void {
    // Suscribirse al servicio para recibir actualizaciones del apartamento seleccionado
    this.mostrarApartamentoService.apartamentoSeleccionado$.subscribe(
      apartamento => {
        if(apartamento){
          localStorage.setItem('Id_aparta',apartamento!.Id_apartamento.toString())
        }
        // this.apartamentoSeleccionado = apartamento ;
        this.Id_apar =  Number(localStorage.getItem('Id_aparta'));
        this.traerInformacionAlFormulario();
        // this.formApartmentEdit.get('descripcion')?.setValue(apartamento?.Nombre_apart);
        // this.formApartmentEdit.get('precio')?.setValue(apartamento?.Precio_apart);
      }
    );
  }

  constructor(
    private fb: FormBuilder,
    private apartService:ApartamentoService,
    private router:Router,
    private dialog: MatDialog,
    private mostrarApartamentoService:MostrarApartamentoService,

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

      this.formApartmentEdit = this.fb.group({
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
        this.formApartmentEdit.patchValue(formState.value);
      }

  }


  public get traerUserId() : string {
    return localStorage.getItem('token_User') || '';
  }

  getImgUrl(file: File): any {
    return file ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)) : '';
  }

  actualizarApartamento(){
    this.formSubmitted = true;

    console.log('apartamneto actualizar Anthony');

    if( this.formApartmentEdit.valid ){
      console.log(this.formApartmentEdit.value);
      const id =  parseInt(this.traerUserId);
      const precio = this.formApartmentEdit.value.precio
      console.log(typeof precio);

      //Apartamento
      debugger
      this.apartamentoDt.Precio_apart = this.formApartmentEdit.get('precio')?.value;
      this.apartamentoDt.Nombre_apart = this.formApartmentEdit.get('descripcion')?.value;
      this.apartamentoDt.Longitud = this.long;
      this.apartamentoDt.Latitud = this.lat;
      debugger
      this.apartService.ActualizarApartamento(this.apartamentoDt,this.Id_apar)
      .pipe(
          mergeMap((resp: any) => {
            console.log('Respuesta de Apartamento continua servicio', resp);
            console.log(resp);


             this.serviciosDt.Luz       =  this.formApartmentEdit.get('luz')?.value
             this.serviciosDt.Agua      =  this.formApartmentEdit.get('agua')?.value
             this.serviciosDt.Telefono  =  this.formApartmentEdit.get('telefono')?.value
             this.serviciosDt.Garage    =  this.formApartmentEdit.get('garage')?.value
             this.serviciosDt.Gas       =  this.formApartmentEdit.get('gas')?.value
             this.serviciosDt.Desayuno  =  this.formApartmentEdit.get('desayuno')?.value
             this.serviciosDt.Almuerzo  =  this.formApartmentEdit.get('almuerzo')?.value
             this.serviciosDt.Merienda  =  this.formApartmentEdit.get('merienda')?.value


            // Puedes realizar más operaciones aquí si es necesario
            // Por ejemplo, puedes devolver otro observable si necesitas realizar más operaciones encadenadas
            return this.apartService.ActualizarServicios(this.serviciosDt, this.Id_apar)
          }),
              mergeMap((respServicios: any) => {
                console.log('se actualizo seervicios entra en condiciones');


             this.condicionesDt.Permite_MusicaAltoVolumen = this.formApartmentEdit.get('permite_MusicaAltoVolumen')?.value;
             this.condicionesDt.Permite_Mascotas          = this.formApartmentEdit.get('permite_Mascotas')?.value;
             this.condicionesDt.Permite_Fiestas           = this.formApartmentEdit.get('permite_Fiestas')?.value;
             this.condicionesDt.Permite_Tomar             = this.formApartmentEdit.get('permite_Tomar')?.value;
             this.condicionesDt.Permite_Fumar             = this.formApartmentEdit.get('permite_Fumar')?.value;

             return this.apartService.ActualizarCondiciones(this.condicionesDt, this.Id_apar);
              }),
                mergeMap((resp) => {
                  console.log("se actulizo las condiciones empieza caracteristicas");
                  console.log(resp);


              this.caracteristicasDt.N_habitaciones         = this.formApartmentEdit.get('nHabitaciones')?.value;
              this.caracteristicasDt.ApartamentoCompartido  = this.formApartmentEdit.get('aCompartido')?.value;
              this.caracteristicasDt.Cocina                 = this.formApartmentEdit.get('aCocina')?.value;
              this.caracteristicasDt.Bano_Independiente     = this.formApartmentEdit.get('aBanoIndependiente')?.value;
              this.caracteristicasDt.Bano_Compartid         = this.formApartmentEdit.get('aBanoCompartido')?.value;
              this.caracteristicasDt.Ducha                  = this.formApartmentEdit.get('aDucha')?.value;
              this.caracteristicasDt.Amoblado               = this.formApartmentEdit.get('aAmoblado')?.value;

              return this.apartService.ActualizarCaracteristicas(this.caracteristicasDt,this.Id_apar);
                }),

              mergeMap((resp: any) => {
                console.log("se actulizo las caracteriss empieza imagenes");

                if (this.selectedFiles) {
                  const filesArray = Array.from(this.selectedFiles);

                  if (filesArray.length > 0) {
                      // Llamar al servicio para subir las imágenes

                      return this.apartService.ActualizarImagenes(this.Id_apar, filesArray);
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
          this.long ='';
          this.lat= '';
          // Todas las operaciones han tenido éxito
          Swal.fire('Operación Exitosa', 'Apartamentos y Actualizados', 'success');
          this.formApartmentEdit.reset();
        },
        (err: any) => {
          Swal.fire('Error', 'Hubo un error en la operación', 'error');
        }
      );

    }else{
      Swal.fire('Campos Vacios o No Validos', 'No paso la Validacion', 'error');
    }


  }


  traerInformacionAlFormulario(){

    const apartmen:Observable<Apartamento> =   this.apartService.traerApartamentoEdit(this.Id_apar);
    const caracteristica: Observable<CaracteristicasDT> =   this.apartService.traerCaracteristicasEdit(this.Id_apar);
    const condiciones:Observable<CondicionesDT> = this.apartService.traerCondiciones(this.Id_apar);
    const servicios:Observable<ServiciosDT> = this.apartService.traerServicios(this.Id_apar);
    const imageness:Observable<any> = this.apartService.traerTodasLasIMagenesDelApartamento();

    forkJoin([apartmen, caracteristica,condiciones, servicios, imageness]).subscribe({
     next: ( [apartamento, caracteristica, condiciones, servicios, imagens] ) => {

        //aparatamento
       this.apartamentoDt.Id_usuario_per = apartamento.Id_usuario_per;
       this.apartamentoDt.Id_apartamento = apartamento.Id_apartamento;
       this.apartamentoDt.Estado_apart   = apartamento.Estado_apart;

       if(this.long == '' || this.long == null){
        this.apartamentoDt.Longitud       = apartamento.Longitud;
        this.apartamentoDt.Latitud        = apartamento.Latitud;
        this.long                         = apartamento.Longitud;
        this.lat                          = apartamento.Latitud;
       }

       this.formApartmentEdit.get('descripcion')?.setValue(apartamento.Nombre_apart);
       this.formApartmentEdit.get('precio')?.setValue(apartamento.Precio_apart);
       //servicios
       this.serviciosDt.Id_apartamento_per = servicios.Id_apartamento_per;
       this.serviciosDt.Id_servicio        = servicios.Id_servicio;

       this.formApartmentEdit.get('luz')?.setValue(servicios.Luz);
       this.formApartmentEdit.get('agua')?.setValue(servicios.Agua);
       this.formApartmentEdit.get('telefono')?.setValue(servicios.Telefono);
       this.formApartmentEdit.get('garage')?.setValue(servicios.Garage);
       this.formApartmentEdit.get('gas')?.setValue(servicios.Gas);
       this.formApartmentEdit.get('desayuno')?.setValue(servicios.Desayuno);
       this.formApartmentEdit.get('almuerzo')?.setValue(servicios.Almuerzo);
       this.formApartmentEdit.get('merienda')?.setValue(servicios.Merienda);
       //Condiciones
       this.condicionesDt.Id_apartamento_per = condiciones.Id_apartamento_per;
       this.condicionesDt.Id_condicion       = condiciones.Id_condicion;

       this.formApartmentEdit.get('permite_Mascotas')?.setValue(condiciones.Permite_Mascotas);
       this.formApartmentEdit.get('permite_Fiestas')?.setValue(condiciones.Permite_Fiestas);
       this.formApartmentEdit.get('permite_MusicaAltoVolumen')?.setValue(condiciones.Permite_MusicaAltoVolumen);
       this.formApartmentEdit.get('permite_Tomar')?.setValue(condiciones.Permite_Tomar);
       this.formApartmentEdit.get('permite_Fumar')?.setValue(condiciones.Permite_Fumar);
      //Caracteristicas
       this.caracteristicasDt.Id_apartamento_per = caracteristica.Id_apartamento_per;
       this.caracteristicasDt.Id_caracteristicas = caracteristica.Id_caracteristicas;

       this.formApartmentEdit.get('nHabitaciones')?.setValue(caracteristica.N_habitaciones);
       this.formApartmentEdit.get('aCompartido')?.setValue(caracteristica.ApartamentoCompartido);
       this.formApartmentEdit.get('aCocina')?.setValue(caracteristica.Cocina);
       this.formApartmentEdit.get('aBanoIndependiente')?.setValue(caracteristica.Bano_Independiente);
       this.formApartmentEdit.get('aBanoCompartido')?.setValue(caracteristica.Bano_Compartid);
       this.formApartmentEdit.get('aDucha')?.setValue(caracteristica.Ducha);
       this.formApartmentEdit.get('aAmoblado')?.setValue(caracteristica.Amoblado);


      var listaImagenes = imagens[0];
      let{ foto1:fot1 , foto2:fot2, foto3: fot3, foto4:fot4, foto5:fot5 , foto6:fot6} = listaImagenes;
      let arrayFotos = [fot1 ,fot2, fot3, fot4, fot5, fot6] ;


        if (arrayFotos.length > 0){
          for (let i = 0; i < arrayFotos.length; i++) {
            if (arrayFotos[i] != null ) {
              let blob:Blob | null =  this.base64toBlob(arrayFotos[i]);
              if (blob != null){
                  this.arrayImagenesMostrar[i]= URL.createObjectURL(blob);
              }
            }

          }
        }
      },
      error: (error:any) => {
        console.error('Error:', error);
        // Manejar errores si alguno de los observables emite un error.
      }
    });
  }
  // para la carga de imagenes
  onFileSelected(event: any) {

    this.imagenesBaseMostrar=false;
    this.selectedFiles = Array.from(event.target.files);
    console.log(event.target.files);
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

  // base64toBlob(base64String: string): Blob {
  //   try {
  //     const byteCharacters = atob(base64String);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     return new Blob([byteArray], { type: 'application/octet-stream' });
  //   } catch (error) {
  //     console.error('Error decoding Base64:', error);
  //     throw error; // Rethrow the error to propagate it further if needed
  //   }
  // }


  // uploadImages() {
  //   if (this.selectedFiles) {
  //     const filesArray = Array.from(this.selectedFiles);
  //     this.apartService.subirImagenes(2, filesArray)
  //       .subscribe(
  //         response => {
  //           console.log('Imágenes subidas exitosamente', response);
  //           // Realizar cualquier lógica adicional después de subir las imágenes
  //         },
  //         error => {
  //           console.error('Error al subir las imágenes', error);
  //           // Manejar el error según tus necesidades
  //         }
  //       );
  //   }
  // }

  campoNoValido(campo: string):boolean{
    if ( this.formApartmentEdit.get(campo)!.invalid && this.formSubmitted  ) {
      return true;
    }else{
      return false;

    }
  }


  irAMarcador() {
    // Guardar el estado del formulario antes de navegar al componente del mapa
    this.apartService.setApartmentFormState(this.formApartmentEdit);
    // Navegar al componente del mapa
    this.apartService.setEditarPagina(1);
    this.router.navigate(['/auth/sid/marcador']);
  }

}

