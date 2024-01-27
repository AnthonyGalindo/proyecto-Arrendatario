import { Component } from '@angular/core';
// import 'bootstrap/dist/css/bootstrap.min.css';
@Component({
selector:"app-contador",
templateUrl: "./contador.component.html",
})
export class ComoQuierasLLamale{

  public contador:number = 10;
  public titulo:string = 'Mi contador';

  public funContador(nume: number):void {
    (nume > 0 ) ? this.contador++ : this.contador--;
  }

  reset(){
    this.contador=10;
  }

}
