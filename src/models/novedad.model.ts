export interface Novedad{
    id_novedad:number;
    autor: string;
    email_autor:string;
    url_foto_autor:string;
    url_foto_novedad:string;
    titulo:string;
    cuerpo:string;
    resumen:string;
    fecha_creacion:string;
    cant_visitas:number;
    likes:number;
    categorias:Array<string>;
    url_novedad:string;
    canal:string;
    tipo:string;
    me_gusta:number;
}