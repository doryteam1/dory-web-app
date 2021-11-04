import { Especie } from "./especie.model";
import { Infraestructura } from "./infraestructura.model";

export interface Granja{
    nombre:string;
    area:number;
    numero_trabajadores:number;
    produccion_estimada_mes:number;
    direccion:string;
    latitud:number;
    longitud:number;
    descripcion:string;
    departamento:string;
    municipio:string;
    corregimiento:string;
    vereda:string;
    puntuacion:number;
    numero_reseñas:number;
    propietario:string;
    propietario_celular:number;
    propietario_direccion:string;
    fotos:Array<string>,
    especies_cultivadas:Array<Especie>;
    infraestructuras:Array<Infraestructura>;
    esFavorita:boolean;
}