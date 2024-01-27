import { Component, OnInit, ViewChild } from '@angular/core';

import{PlainMarker} from '../markers-page/markers-page.component'

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MostrarApartamentoService } from '../../../auth/pagesAuth/services/mostrarApartamento.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DetalleimagenComponent } from '../detalleimagen/detalleimagen.component';

import { Cell, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UsuarioService } from '../../../auth/pagesAuth/services/usuario.service';
import { DatePipe } from '@angular/common';



@Component({
  templateUrl: './properties-page.component.html',
  styleUrls: ['./properties-page.component.css']
})
export class PropertiesPageComponent implements OnInit {
//

public columsToDisplay=['Apartamento','Descripcion','Servicios','Condiciones','Imagen','Contrato'];
public datasource:any=new MatTableDataSource();
public apartamentos!:any[];

private usuario:string;

      @ViewChild(MatPaginator) paginator!:MatPaginator;

      constructor(
        private mostrarApartamentoServicio:MostrarApartamentoService,
        private usuarioServicio:UsuarioService,
        public dialog:MatDialog,
        public router:Router,
        ){

      }

    async ngOnInit(): Promise<void> {

      this.getDataApartamentos();

      this.usuario=await this.usuarioServicio.GetNameUser();

    }

    getDataApartamentos(){
      this.mostrarApartamentoServicio.traerTodosApartamentos().subscribe((response:any)=>{
        console.log(response);
        this.apartamentos=response;
        this.datasource.data=this.apartamentos;
        this.datasource.paginator=this.paginator;

      })
    }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.datasource.filter = filterValue.trim().toLowerCase();
    }

    openDialogApartamentos(apartamento:any){
    const dialogRef=this.dialog.open(DetalleimagenComponent,{
    width:'800px',
    height:'600px',
    data:apartamento
    });
    dialogRef.afterClosed().subscribe(result=>{
      console.log('OK')
    })

    }

    generarPdf(apartamento){
      PdfMakeWrapper.setFonts(pdfFonts);

      const datePipe = new DatePipe('en-US');

      const pdf = new PdfMakeWrapper();

      pdf.pageSize ('A4') ;
      pdf.pageOrientation('portrait');

      pdf.defaultStyle({
        bold: false,
        fontSize: 11
      });

      pdf.pageMargins([60,30,60,50]);

      pdf.add(new Txt('CONTRATO DE ARRENDAMIENTO').bold().alignment("center").end);
      pdf.add("\n\n");

      pdf.add(new Txt('PRIMERA: COMPARECIENTES.-').bold().end);
      pdf.add(new Txt(`Comparecen libre y voluntariamente a la celebración del presente contrato de arrendamiento, por una parte el Sr ${apartamento.usuario_name}, a quien en adelante y para plena validez del presente contrato se denominara simplemente "EL ARRENDADOR" y por otra el Sr ${this.usuario}, parte que en adelante y para plena validez del presente contrato se le denominara simplemente "LA ARRENDATARIA"`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('SEGUNDA: OBJETO.-').bold().end);
      pdf.add(new Txt(`Los comparecientes por asi convenir a sus intereses acuerdan que EL ARRENDADOR da en arriendo a LA ARRENDATARIA, ${apartamento.Descripcion}. Se entrega con servicios que ${apartamento.Servicios}, y condiciones ${apartamento.Condiciones}`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('TERCERA: DESTINO DEL INMUEBLE.-').bold().end);
      pdf.add(new Txt(`El bien inmueble arrendado será destinado para el funcionamiento, oficinas y local de funcionamiento de la arrendataria, sin poder la arrendataria dar otro uso que el convenido, caso contrario será causal de terminación del presente contrato de arrendamiento.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt(`LA ARRENDATARIA no podrá destinar el local a ninguna actividad ilegal o cualquiera otra que no sea la expresamente determinada en esta cláusula.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('CUARTA: CANON MENSUAL DE ARRENDAMIENTO.-').bold().end);
      pdf.add(new Txt(`El canon mensual de arrendamiento que LA ARRENDATARIA pagara por adelantado al ARRENDADOR será de acuerdo al siguiente detalle: \n\n- Los dos primeros años de duración del contrato, se pagará un canon mensual de USD $${apartamento.costo} más el impuesto al Valor Agregado (IVA). \n- Los años tercero y cuarto de la duración del presente contrato, se pagará un canon mensual de USD ${apartamento.valorAño} más el impuesto al Valor Agregado (IVA). \n\nEl Canon será pagado dentro de los primeros 5 dias de cada mes.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('QUINTA: PLAZO DE DURACIÓN DEL CONTRATO.-').bold().end);
      pdf.add(new Txt(`El arrendamiento objeto del presente contrato, inicia ${datePipe.transform(new Date(), "d de MMMM de yyyy")}. El plazo de duración del presente contrato es de CUATRO AÑOS, pudiento ser renovado por las partes por 4 años más, si asi lo convinieren.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('SEXTA: RENOVACIÓN.-').bold().end);
      pdf.add(new Txt(`Á la terminación del presente contrato las partes podrán suscribir un nuevo contrato, en el que se deberá negociar el valor del canon a cobrarse y demás condiciones del contrato. Si las partes no suscriben un nuevo contrato se entenderá que el presente contrato termina en el plazo estipulado en la cláusula anterior.`).alignment("justify").end);      pdf.add("\n\n");

      pdf.add(new Txt('SEPTIMA: PASOS POR SERVICIOS.-').bold().end);
      pdf.add(new Txt(`Los pagos por consumo de luz eléctrica, agua potable y demás servicios que existan correrán por cuenta de la ARRENDATARIA.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('OCTAVA: REQUISITOS PARA LA DEVOLUCIÓN.-').bold().end);
      pdf.add(new Txt(`LA ARRENDATARIA acepta recibir todos los servicios pagados y garantiza al ARRENDADOR entregar el inmueble con todos los servicios pagados, al momento de la terminación del presente contrato.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('NOVENA: PROHIBICIÓN.-').bold().end);
      pdf.add(new Txt(`Le esta prohibido a la ARRENDATARIA el subarriendo de todo o parte del inmueble arrendado, caso contrario será causal para dar por terminado el presente contrato de arrendamiento.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA: TERMINACIÓN DEL CONTRATO.-').bold().end);
      pdf.add(new Txt(`Este contrato de arrendamiento se terminará por las siguientes causas:\n\nA.-   Por vencimiento de plazo de Contrato.- En caso que no se haya acordado la renovación del mismo.\n\nB.-    Por falta de pago del canon arrendaticio.- En caso del no pago de dos meses del canon de arrendamiento, por parte de la ARRENDATARIA, será causal suficiente para declarar vencido el plazo.\n\nC.-   Por Decisión del ARRENDADOR, tendrá obligación de notificarle a la ARRENDATARIA con 90 días de abticipación`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA PRIMERA: REFORMAS LOCATIVAS.-').bold().end);
      pdf.add(new Txt(`Le esta prohibido a la AARENDATARIA el efectuar cualquier reforma locativa, sin consentimiento por escrito del ARRENDADOR. Las mejoras o reformas quedaran a beneficio del ARRENDADOR, sin que por ello deba el ARRENDADOR hacer pago alguno.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA SEGUNDA: DAÑOS OCASIONADOS.-').bold().end);
      pdf.add(new Txt(`La ARRENDATARIA entregará al ARRENDADOR al final del contrato, el inmueble en buenas condiciones, igual que lo recibió y en caso de existirlo, pagará todos los daños ocasionados, a excepción de aquiellos que se produzcan como consecuencia de uso normal y deterioro del inmueble.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA TERCERA: DIFERENCIA EN CANON.-').bold().end);
      pdf.add(new Txt(`Si existiera alguna diferencia entre el canon de arrendamiento establecido en el presente contrato y el fijado por la oficina de Registro de Arrendamientos, Oficina Municipal de Arrendamientos o Jefatura de Catastros, las partes contratantes renuncian a reclamo de cualquier diferencia, asi como a cualquier acción por este concepto`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA CUARTA: CLAUSULAS ESCENCIALES.-').bold().end);
      pdf.add(new Txt(`Las partes convienen a elevar a la calidad de cláusulas esenciales o determinantes del presente contrato, cada una de las indicadas en el mismo, de modo que el incumplimiento de cualquiera de ellas, se entiende común acuerdo, causal suficiente y motivo para solicitar la terminación del presente contrato`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA QUINTA: GARANTÍA.-').bold().end);
      pdf.add(new Txt(`La arrendataria entrega al arrendador al momento de la suscripción del presente contrato, un valor de mil doscientos dólares de los Estados Unidos de América, por concepto de garanbtía del cumplimiento de la obligaciones por parte de la arrendataria y además de la conservación y entrega el inmueble en buenas condiciones, al terminarse el presente contrato.`).alignment("justify").end);
      pdf.add("\n\n");

      pdf.add(new Txt('DÉCIMA SEXTA: DIVERGENCIAS.-').bold().end);
      pdf.add(new Txt(`En caso de controversias derivadas del presente instrumento y de las obligaciones aquí contenidas, los comparecientes de forma expresa renuncian fuero y domicilio, y se someten a los jueces competentes del Cantón Ambato, Provincia de Tungurahua.\n\nLos comparecientes declaran su aceptación expresa a todo el contenido de este Contrato y, para constancia, suscriben en unidad de acto y por triplicado de igual tenor, Ambato, ${datePipe.transform(new Date(), 'd de MMMM de yyyy')}}`).alignment("justify").end);
      pdf.add("\n\n");

      const tablaFirmas=[
        [
          new Cell( new Txt(`______________________\nARRENDADOR`).end).alignment("center").end,
          new Cell( new Txt('______________________\nARRENDATARIO').end).alignment("center").end,
        ]
      ]

      pdf.add(new Table(tablaFirmas).widths([ '50%','50%' ]).layout("noBorders").margin([0,0,0,0]).end)

      pdf.create().getBase64(async data=>{
        let file=this.base64ToFile(data,`Contrato_Arrendamiento`,"application/pdf");
        let url = URL.createObjectURL(await file)
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          newWindow.focus();
        }
      });

    }

    async base64ToFile(base64: string, fileName: string, fileType: string) {
      const response = await fetch(`data:${fileType};base64,${base64}`);
      const buffer = await response.arrayBuffer();
      const byteArray = new Uint8Array(buffer);
      var blob = new Blob([byteArray],{type: fileType})
      return new File([blob], fileName, { type: fileType });
    }

//


}
