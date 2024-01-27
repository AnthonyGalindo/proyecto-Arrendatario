

export interface RegisterForm{
    usuario:string,
    contrasena:string,
    confirmarContrasena:string,
    email:string,
    telefono:string,
}


export interface RegisterFormBac {
 Nombre_usuario: string,
Contrasena_usuario: string,
Correo_usuario: string,
telefono_usuario: string,
Arrendatario: boolean,
}

export interface LoginBac{
  Correo_usuario: string,
  Contrasena_usuario:string
}

export  interface Apartment{
  Nombre_apart:string,
  Precio_apart:number,
  Id_usuario_per:number,
  Longitud: string,
  Latitud	:string,
  Estado_apart:boolean
}


export interface Servicios{
	Id_apartamento_per: number
	Luz: boolean
  Agua: boolean
	Telefono: boolean
	Garage: boolean
	Gas: boolean
	Desayuno: boolean
	Almuerzo: boolean
	Merienda: boolean
}


export interface Condiciones{
  Id_apartamento_per:number
  Permite_Mascotas:boolean
  Permite_Fiestas:boolean
  Permite_MusicaAltoVolumen:boolean
  Permite_Tomar:boolean
  Permite_Fumar:boolean
}

export interface Apartamento {

  Id_apartamento:number
  Nombre_apart:string,
  Precio_apart:string,
  Id_usuario_per:string,
  Longitud:string,
  Latitud:string,
  Estado_apart:boolean,


}

export interface NuevoApartamento {

  Id_apartamento:number
  Nombre_apart:string,
  Precio_apart:string,
  Id_usuario_per:string,
  Longitud:string,
  Latitud:string,
  Estado_apart:boolean,
  foto1:string
}


export interface Caracteristicas{

  Id_apartamento_per:number,
  N_habitaciones:number,
  ApartamentoCompartido:boolean,
  Cocina:boolean,
  Bano_Independiente:boolean,
  Bano_Compartido:boolean,
  Ducha:boolean,
  Amoblado:boolean,
}


//DT

 export interface CaracteristicasDT{
  Id_caracteristicas:number,
  Id_apartamento_per:boolean,
  N_habitaciones:number,
  ApartamentoCompartido:boolean,
  Cocina:boolean,
  Bano_Independiente:boolean,
  Amoblado:boolean,
  Ducha:boolean,
  Bano_Compartid:boolean,
 }


 export interface CondicionesDT{
  Id_condicion: number,
  Id_apartamento_per:number,
  Permite_Mascotas:boolean,
  Permite_Fiestas:boolean,
  Permite_MusicaAltoVolumen:boolean,
  Permite_Tomar:boolean,
  Permite_Fumar:boolean,
}


export interface ServiciosDT {
  Id_servicio:number,
	Id_apartamento_per: number,
	Luz: boolean,
  Agua: boolean,
	Telefono: boolean,
	Garage: boolean,
	Gas: boolean,
	Desayuno: boolean,
	Almuerzo: boolean,
	Merienda: boolean,
}


