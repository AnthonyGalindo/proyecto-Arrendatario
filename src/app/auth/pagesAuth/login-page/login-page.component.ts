import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginBac } from '../Interfaces/register-form.interface';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';
import { Subscriber } from 'rxjs';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',


})



export class LoginPageComponent {


 public formSubmitted = false;
 public formularioLogin: FormGroup;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService:UsuarioService
    // private usuarioService:UsuarioService
  ) {
     this.formularioLogin = this.fb.group({
      email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remenber:[false]
    });

  }


   login(){
    localStorage.removeItem('name_User');
     this.formSubmitted = true;
      localStorage.removeItem('token_User');
    //  console.log(this.formularioLogin.value);

     if (this.formularioLogin.valid) {
      const LoginData: LoginBac = {

        Correo_usuario: this.formularioLogin.value.email,
        Contrasena_usuario: this.formularioLogin.value.password,

       };
       this.usuarioService.LogearUsuario(LoginData)
       .subscribe(async resp => {
            if (resp != -1) {
              let nomUser:any  = await this.usuarioService.GetNameUser(); 

              // let tipoCuenta:any = await this.usuarioService.GetTipoCuenta();
                localStorage.setItem('name_User',nomUser.Nombre_usuario);
                localStorage.setItem('tipoDeCuenta',nomUser.Arrendatario.toString())

                this.router.navigateByUrl( "/auth/sid/propiedades");
                      if  ( this.formularioLogin.get("remenber")?.value ) {
                        localStorage.setItem( 'email', this.formularioLogin.get('email')?.value  )
                      }else{
                        localStorage.removeItem('email');
                      }
            }else{
              Swal.fire('Usuario No Registardo','Revise si toda la informacion es correcta','warning');
            }
       });

      }else{

        Swal.fire('Login Campos Vacios ','llene todos los campos Porfavor','error');
        console.log('Login no válido. Verifica los campos.');

      }
  }


  campoNoValido(campo: string):boolean{
    if ( this.formularioLogin.get(campo)!.invalid && this.formSubmitted  ) {
      return true;
    }else{
      return false;

    }
  }



}

