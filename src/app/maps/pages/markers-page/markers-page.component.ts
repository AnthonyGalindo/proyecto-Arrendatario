import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';
import { NavigationExtras, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ApartamentoService } from '../../../auth/pagesAuth/services/apartamento.service';
import Swal from 'sweetalert2';

interface MarkerAndColor {
  LocationID?: number;
  color?: string;
  marker: Marker;
}

export interface PlainMarker {
  longitude: string;
  latitude: string;
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements OnInit {

  constructor(private http: HttpClient,
    private router:Router,
    private locationService: ApartamentoService) { }
  @ViewChild('map') divMap?: ElementRef;
  ngOnInit(): void {
    // this.loadMarkersFromDatabase();
  }

  // loadMarkersFromDatabase() {
  //   this.http.get<PlainMarker[]>('http://localhost:59199/api/MapboxLocations')
  //     .subscribe((markersFromDb) => {
  //       markersFromDb.forEach((markerData) => {
  //         if (markerData && markerData.lngLat && Array.isArray(markerData.lngLat) && markerData.lngLat.length === 2) {
  //           const coords = new LngLat(markerData.lngLat[0], markerData.lngLat[1]);
  //           this.addMarker(coords, markerData.color);
  //         } else {
  //           console.error('Invalid format for markerData:', markerData);
  //         }
  //       });
  //     });
  // }


  public markers: MarkerAndColor[] = [];

  // propiedad para zoom
  public zoom: number = 16;

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-78.62321756646375, -1.2689010806900711);

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.currentLngLat.lng, this.currentLngLat.lat],
      zoom: this.zoom
    });

    // this.readFromLocalStorage();
    this.mapListeners();

    setTimeout(() => {
      this.map?.resize(); // Redimensionar el mapa después de 3 segundos
    }, 300);
  }

  createMarker( ) {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat);


  }

  saveMarkerToDatabase(plainMarker: PlainMarker) {
    this.http.post<any>('http://localhost:59199/api/MapboxLocations', plainMarker)
    .subscribe(response => {
      console.log('Marcador guardado en la base de datos:', response);

      // Obtener el ID asignado y luego agregar el marcador localmente
      const locationID = response?.LocationID;
      if (locationID) {
        this.addMarker(new LngLat(Number(plainMarker.longitude), Number(plainMarker.latitude)),);
      }
    });
  }

  addMarker(lngLat: LngLat, ) {
    if (!this.map) return;

    const marker = new Marker({
      draggable: true
    })
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(this.map);

    this.markers.push({   marker });
  }


  // deleteMarker(index: number) {
  //   const deletedMarker = this.markers[index];

  //   // Eliminar el marcador del mapa
  //   deletedMarker.marker.remove();

  //   // Eliminar el marcador del array de markers
  //   this.markers.splice(index, 1);

  //   // Eliminar el marcador de la base de datos
  //   this.deleteMarkerFromDatabase(deletedMarker.LocationID);
  // }


  deleteMarkerFromDatabase(locationID: number) {
    this.http.delete(`http://localhost:59199/api/MapboxLocations/${locationID}`)
      .subscribe(
        response => {
          console.log('Marcador eliminado de la base de datos:', response);
        },
        error => {
          console.error('Error al eliminar el marcador de la base de datos:', error);
        }
      );
  }


  deleteMarker(index: number) {
    const deletedMarker = this.markers[index];

    if (deletedMarker && deletedMarker.marker) {
      // Eliminar el marcador del mapa
      deletedMarker.marker.remove();

      // Eliminar el marcador del array de markers
      this.markers.splice(index, 1);

      // Eliminar el marcador de la base de datos
      // this.deleteMarkerFromDatabase(deletedMarker.LocationID);
    }
  }
  // getLocationIDFromMarker(marker: MarkerAndColor): number | null {
  //   // Recorrer el array de markers para encontrar el LocationID correspondiente al marcador
  //   for (const dbMarker of this.markers) {
  //     if (dbMarker.marker === marker.marker) {
  //       return dbMarker.LocationID;
  //     }
  //   }
  //   return null; // Devolver null si no se encuentra el LocationID
  // }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 18,
      center: marker.getLngLat(),
    });
  }



  ngOnDestroy(): void {
    this.map?.remove();
  }

  // zoom

  mapListeners() {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
    });
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }

  saveMarkers() {
    this.markers.forEach(({ LocationID, marker }) => {
      const lngLat = marker.getLngLat();
      const updatedMarker: PlainMarker  = {

        longitude: lngLat.lng.toString(),
        latitude: lngLat.lat.toString(),
      };

      this.locationService.setLocation(lngLat.lat.toString(), lngLat.lng.toString());

      Swal.fire('Operacion Exitosa','Ubicacion Guardada','success');

      this.locationService.editarform$.subscribe(
        resp => {
            if(resp == 1){
              this.router.navigate(['/auth/sid/editar']);
            }else{
              this.router.navigate(['/auth/sid/registroApartamento'] );
            }
        }
      )


      // Utiliza el método PUT para actualizar el marcador existente

    });
  }

  cerrar(){

    this.locationService.editarform$.subscribe(
      resp => {
          if(resp == 1){
            this.router.navigate(['/auth/sid/editar']);
          }else{
            this.router.navigate(['/auth/sid/registroApartamento'] );
          }
      }
    )
  }


}
