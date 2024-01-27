// import { Component, OnInit } from '@angular/core';
// import { Chart, ChartType } from 'chart.js/auto';

// @Component({
//   selector: 'app-line-chart',
//   templateUrl: './line-chart.component.html',
//   styleUrl: './line-chart.component.css'
// })
// export class LineChartComponent implements OnInit{

//   public chart: Chart;


//   ngOnInit(): void {
//    // datos
//    const data = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [{
//       label: 'My First Dataset',
//       data: [65, 59, 80, 81, 56, 55, 40],
//       fill: false,
//       borderColor: 'rgb(75, 192, 192)',
//       tension: 0.1
//     }]
//   };

//   // Creamos la gráfica
//   this.chart = new Chart("chart", {
//     type: 'line' as ChartType, // tipo de la gráfica
//     data // datos
// })
//   }

// }

import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, ChartType, LabelItem } from 'chart.js/auto';
import { ApartamentoService } from '../../auth/pagesAuth/services/apartamento.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

    public chart: Chart;
    public chart2:Chart;

    info:any =[];
    info2:any =[];

      constructor( private apartamentoService:ApartamentoService) {


      }

      ngOnInit(): void {
        this.traerInfo();


      }


      traerInfo(){
        this.apartamentoService.traerConsulta1().subscribe(
            (resp) => {
              console.log(resp)
              this.info =resp;
              this.crearGrafica();
              // this.crearGrafica2();
            }
        )


        this.apartamentoService.traerConsulta2().subscribe(
          (resp)=>{
              console.log(resp);
              this.info2 =resp;
               this.crearGrafica2();
          }
        )
      }


      crearGrafica(){
      // Supongamos que obtienes estos datos de tu base de datos
        const nombresApartamentos = this.info.map( m => m.Nombre_apart );
        const preciosApartamentos = this.info.map(apartamento => apartamento.Precio_apart);

        const data = {
          labels: nombresApartamentos,
          datasets: [{
            label: 'Precios de Apartamentos',
            data: preciosApartamentos,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            // backgroundColor:'rgb(9, 33, 214)'
          }]
        };

        this.chart = new Chart("chart", {
          type: 'line' as ChartType,
          data
        });
      }


      crearGrafica2(){
        // Supongamos que obtienes estos datos de tu base de datos
          let nombresApartamentos = this.info2.map( m => m.Nombre_apart );
          let preciosApartamentos = this.info2.map(apartamento => apartamento.Precio_apart);

          const data = {
            labels: nombresApartamentos,
            datasets: [{
              label: 'Precios de Apartamentos',
              data: preciosApartamentos,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              backgroundColor:'rgb(9, 33, 214)'
            }]
          };

          const options = {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          };

          this.chart2 = new Chart("chart2", {
            type: 'bar' as ChartType,
            data,
            options
          });
        }








}




