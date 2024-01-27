import { ChangeDetectorRef, Component , Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { MatDialog,MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';

// Importa el componente de diálogo para el perfil
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';
import { UpdateProfileDialogComponent } from '../update-profile-dialog/update-profile-dialog.component';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-side-page',
  templateUrl: './side-page.component.html',
  styleUrl: './side-page.component.css'
})
export class SidePageComponent {
  public selectedFile: File | null = null;
  public userImage: string | null = null;
public nameUser:string | null = localStorage.getItem('name_User') ;

public tipoUsuario:boolean = false ;

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private  usuarioService:UsuarioService,
    private cdr: ChangeDetectorRef,

    ){}

    ngOnInit() {

      // Obtener la imagen del usuario al iniciar el componente
      this.obtenerImagenUsuarios();

      // Suscribirse al evento de actualización de imagen
      this.usuarioService.imagenActualizada.subscribe((imageUrl: string | null) => {
        this.userImage = imageUrl;
      });

    }


    async obtenerImagenUsuarios() {
      let tipoUser = localStorage.getItem('tipoDeCuenta');
      this.tipoUsuario = JSON.parse(tipoUser.toLowerCase()); 
      const userId = localStorage.getItem('token_User') ?? '';

      try {
        const imagenBlob = await this.usuarioService.obtenerImagenUsuario(userId);
        if (imagenBlob) {
          let imageUrl = URL.createObjectURL(imagenBlob);
          this.userImage = imageUrl;
          console.log(imagenBlob);
          console.log(imagenBlob.arrayBuffer.name);
        } else {
          this.userImage = null;
        }
      } catch (error) {
        console.error('Error al obtener la imagen del usuario', error);
        this.userImage = null;
      }


    }


      public sidebarItems = [
       
        {label:'Buscador',icon:'search',url:'./propiedades'},
        {label:'Registrar Apartamento',icon:'apartment',url:'./registroApartamento',},
        {label:'Apartamentos Creados',icon:'location_city',url:'./seeApartamentos'},
        {label:'Graficos',icon:'monitoring',url:'./line'}
       
      ]
      // Puedes agregar más opciones al submenú según sea necesario
      public moreOptionsMenuItems = [
        { label: 'Cambiar Avatar', action: () => this.CambiarAvatar() },
        {label: 'Actualizar Perfil', action: () => this.ActualizarPerfil()},
        { label: 'Salir', action: () => this.salirDeLaCuenta() },
        // Puedes agregar más opciones según sea necesario
      ];



      mostrarItem(item: any): boolean {
        // Aquí decides si mostrar o no el elemento según el valor de tipoDeUsuario
        if (this.tipoUsuario) {
          return true; // Mostrar todos los elementos si tipoDeUsuario es true
        } else {
          // Filtrar los elementos que no quieres mostrar cuando tipoDeUsuario es false
          return item.label !== 'Registrar Apartamento' && item.label !== 'Apartamentos Creados' && item.label !== 'Graficos';
        }
      }


      // Método para realizar la acción de Opción 1
      CambiarAvatar() {
        console.log('Realizando acción para Opción 1');
        this.openProfileDialog();

      }
      //TODO* Metodo para actualizar La informacion del Perfil del Usuario
      ActualizarPerfil(){
        console.log('metodo ActualizarPerfil');
        // Abre el diálogo al hacer clic en el botón de actualizar perfil
        const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
          width: '700px',
          height:'700px' // Puedes ajustar el ancho según tus necesidades
        });

      // Suscríbete al evento afterClosed para realizar acciones después de que se cierre el diálogo
      dialogRef.afterClosed().subscribe((result) => {
        console.log('Diálogo cerrado', result);
      });

      }

      // Método para realizar la acción de Opción 2
      salirDeLaCuenta() {

        console.log('Realizando acción para Opción 2');
        // localStorage.removeItem('token_User');
        localStorage.clear()
        this.router.navigateByUrl('/auth/login');


        // Agrega la lógica que desees para Opción 2
      }

      openProfileDialog() {
        const dialogRef = this.dialog.open(ProfileDialogComponent, {
          data: { userImage: this.userImage },
          width:'500px',
          height:'500px'

        });

        dialogRef.afterClosed().subscribe();

      }



}
