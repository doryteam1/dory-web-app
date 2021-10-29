export interface Novedad{
    nombre_autor: string;
    url_foto_autor:string;
    url_foto_novedad:string;
    titular:string;
    cuerpo:string;
    fecha_creacion:string;
    visitas:number;
    cant_likes:number;
    categorias:Array<string>
}