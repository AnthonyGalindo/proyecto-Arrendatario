import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';
import { SidePageComponent } from '../side-page/side-page.component';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent {
  selectedFile: File | null = null;
  imageUrl: string | null = null ; // Agrega la propiedad imageUrl aquí

  constructor(
      public dialogRef: MatDialogRef<ProfileDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { userImage: string },
      private fb: FormBuilder,
      private userService: UsuarioService ,
      private actualizarImagen:SidePageComponent,
      private cdr: ChangeDetectorRef// Inyecta tu servicio de usuario
  ) {}

  profileForm: FormGroup = this.fb.group({
    nombre: ['', ],
    email: ['', ],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Agrega aquí la lógica para guardar los cambios en el perfil si es necesario

handleFileInput(): void {
  // this.selectedFile = event.target.files[0];
  // Mostrar la ventana modal de SweetAlert para la selección de la imagen
  (async () => {
    const { value: file } = await Swal.fire({
      title: "Selecciona una imagen",
      input: "file",
      inputAttributes: {
        "accept": "image/*",
        "aria-label": "Upload your profile picture"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
        Swal.fire({
          title: "Foto de Perfil",
          imageUrl: e.target.result as string,
          imageAlt: "Imagen de Perfil"

        });
        this.selectedFile = file;
        this.imageUrl =e.target.result as string;
      }else{
        console.error('e.target is null');
      }
      };
      reader.readAsDataURL(file);
    }
})()
}


saveChanges(): void {
  const userIdString = localStorage.getItem('token_User');
  // Verifica si userIdString no es nulo
  if (userIdString !== null) {
    // Verifica si hay una imagen seleccionada
    if (this.selectedFile) {
      // Si hay una imagen seleccionada, carga la imagen al servidor
          this.userService.uploadProfileImage(userIdString, this.selectedFile)
              .subscribe(
                (response) => {
                  console.log(response);
                  this.dialogRef.close(response);
                },
                (error) => {
                  console.error('Error al cargar la imagen de perfil', error);
                }
              );

        } else {
            console.error('No hay una imagen seleccionada');
            this.dialogRef.close(null);
        }

        if(this.imageUrl != null)
debugger
console.log(this.imageUrl);

        this.userService.imagenActualizada.emit(this.imageUrl);

    }



    }


}

