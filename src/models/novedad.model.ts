export interface Novedad{
    nombre_autor: string;
    email_autor:string;
    url_foto_autor:string;
    url_foto_novedad:string;
    titulo:string;
    cuerpo:string;
    resumen:string;
    fecha_creacion:string;
    visitas:number;
    cant_likes:number;
    categorias:Array<string>;
    url:string;
    canal:string;
    tipo:string
}