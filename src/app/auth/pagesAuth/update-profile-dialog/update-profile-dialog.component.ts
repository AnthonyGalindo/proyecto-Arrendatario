import { Component,   } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrl: './update-profile-dialog.component.css'
})


export class UpdateProfileDialogComponent {
  public formSubmitted = false;

  public formActualizarUsuario: FormGroup;
  public formActualizarTelefono: FormGroup;
  public formActualizaCorreo: FormGroup;




    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
      private usuariosService:UsuarioService

    ){
        this.formActualizarUsuario = fb.group({
          usuario:['', Validators.required  ]
        })

        this.formActualizaCorreo =fb.group({
          email:['',Validators.required]
        })

        this.formActualizarTelefono =fb.group({
          telefono:['',Validators.required]
        })


    }


    // desactiva el foco



    OnSubmitUsuario(){
      if (this.formActualizarUsuario.valid) {
        const usuario = this.formActualizarUsuario.value.usuario;
        this.usuariosService.actualizarUsuario(usuario)
        .subscribe(
          response => {
            console.log('Usuario actualizado exitosamente', response);
            Swal.fire('Registro Exitoso','Usuario actualizado exitosamente','success');
            localStorage.setItem('name_User',usuario);


            const userReset = this.formActualizarUsuario.get('usuario');
            userReset?.reset();
            userReset?.clearValidators();
            userReset?.updateValueAndValidity();

          },
          error => {
            console.error('Error al actualizar el usuario', error);
            Swal.fire('Error','Error al actualizar el usuario','error');
          }
        );
      }
    }

    OnSubmitCorreo(){
        if (this.formActualizaCorreo.valid) {
          const email = this.formActualizaCorreo.value.email;
          this.usuariosService.actualizarEmail(email)
          .subscribe(
              response => {

                Swal.fire('Registro Exitoso','Email actualizado exitosament','success');
                const emailReset = this.formActualizaCorreo.get('email');
                emailReset?.reset();
                emailReset?.clearValidators();
                emailReset?.updateValueAndValidity()

              },
              error => {
                console.error('Error al actualizar el email', error);
                Swal.fire('Error','Error al actualizar el email o ese email ya existe','error');
              }
          );
        }
    }

    OnSubmitTelefono(){
      if (this.formActualizarTelefono.valid) {
        const tel = this.formActualizarTelefono.value.telefono;

        this.usuariosService.actualizarTelefono(tel)
        .subscribe(
            response => {



              Swal.fire('Registro Exitoso','Telefono actualizado exitosamente','success');
              const telReset = this.formActualizaCorreo.get('email');
              telReset?.reset();
              telReset?.clearValidators();
              telReset?.updateValueAndValidity()

            },
            error => {

              console.error('Error al actualizar el Telefono', error);
              Swal.fire('Error','Error al actualizar el Telefono ','error');
            }
        );
      }
    }
    // Puedes agregar lógica para cerrar el diálogo cuando sea necesario
    cerrarDialog() {
      this.dialogRef.close();
    }
}
