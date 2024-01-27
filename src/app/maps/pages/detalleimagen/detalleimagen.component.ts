import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MostrarApartamentoService } from '../../../auth/pagesAuth/services/mostrarApartamento.service';

@Component({
  selector: 'app-detalleimagen',
  templateUrl: './detalleimagen.component.html',
  styleUrl: './detalleimagen.component.css'
})
export class DetalleimagenComponent implements OnInit {

//

imagenes!:any[]

constructor(@Inject(MAT_DIALOG_DATA) public apartamento:any,private mostrarApartamentoServicio:MostrarApartamentoService){

}
ngOnInit(): void {
    console.log(this.apartamento)
    this.getImagenesDepartamento()
}

getImagenesDepartamento(){
  debugger
  this.mostrarApartamentoServicio.traerTodasLasIMagenesDelApartamento(this.apartamento.Numero)
  .subscribe((response:any)=>{
    debugger
    this.imagenes=response;
    console.log(this.imagenes)
  })
}

//
}
