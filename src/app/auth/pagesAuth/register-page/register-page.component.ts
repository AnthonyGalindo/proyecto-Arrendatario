
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import Swal from 'sweetalert2'

import { Observer } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

import { RegisterFormBac } from '../Interfaces/register-form.interface';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  tipoDeCuenta: boolean | null = null;

  opciones = [
    { etiqueta: 'Arrendatario', valor: true },
    { etiqueta: 'Inquilino', valor: false },
    // Puedes agregar más opciones según sea necesario
  ];


public formSubmitted = false;
public formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService:UsuarioService
  ) {

     this.formulario = this.fb.group({
      usuario: ['', [Validators.required ,Validators.minLength(4)] ],
      contrasena: ['', [Validators.required,Validators.minLength(7)]],
      confirmarContrasena: ['',[Validators.required,Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipoDeCuenta: [false,],

    });
      // Agregar validadores personalizados al formulario
     this.formulario.setValidators(this.passwordsIguales('contrasena', 'confirmarContrasena'));
  }

  onSubmit() {
    this.formSubmitted = true;

    // console.log(this.formulario);


    if (this.formulario.valid) {
      const usuarioData: RegisterFormBac = {
        Nombre_usuario: this.formulario.value.usuario,
        Contrasena_usuario: this.formulario.value.contrasena,
        Correo_usuario: this.formulario.value.email,
        telefono_usuario: this.formulario.value.telefono,
        Arrendatario: this.formulario.value.tipoDeCuenta,
      };

      this.usuarioService.CrearUsuario(usuarioData)
        .subscribe({
          next: (response: any) => {
            console.log(response);

            // this.mostrarMensajeModal('Registro Exitoso', 'Usuario registrado correctamente.');
            Swal.fire('Registro Exitoso','Usuario registrado correctamente','success');
            this.router.navigate(['/auth/login']);
          },
          error: (error: any) => {
            Swal.fire('Error','Usuario No Registrado','error');
            console.error('Error al registrar usuario:', error);
          }
        } as Observer<any>);
    } else {
      Swal.fire('Erro2','Usuario No Registrado','error');
      console.log('Formulario no válido. Verifica los campos.');
    }


  }


  campoNoValido(campo: string):boolean{
    if ( this.formulario.get(campo)!.invalid && this.formSubmitted  ) {
      return true;
    }else{
      return false;

    }
  }

  // private mostrarMensajeModal(titulo: string, mensaje: string): void {
  //   this.dialog.open(MensajeModalComponent, {
  //     data: {
  //       title: titulo,
  //       message: mensaje
  //     }
  //   });
  // }

   validarContrasenass():boolean {

    let pass1 = this.formulario.get('contrasena')?.value;
    let pass2 = this.formulario.get('confirmarContrasena')?.value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true

    }else{
      return false;
    }
  }



  passwordsIguales(passName1: string, passName2: string):ValidatorFn {

    return (control: AbstractControl) : ValidationErrors | null =>{
      const pass1Control = control.get(passName1);
      const pass2Control = control.get(passName2);

      if ( pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
        return null;
      }else{
        pass2Control?.setErrors({noEsIgual:true})
        return { noEsIgual: true };
      }
    };

  }

}
