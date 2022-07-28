export interface Filtro {
  nameButton: string,//Nombre del boton
   data:MetaFiltro []
}
export interface MetaFiltro {
  nombrecampoDB: string | null;
  nombrefiltro: string; // Nombre  del filtro en la interfas
  datoafiltrar: string | null; //String que se ba a buscar dentro del array
  modoFiltro: string; //la manera en que se va a filtrar puede ser: number_ordenarmayoramenor(ordena de mayor a menor)
  //o string_filtrodatosvarios(recibe el string que se va filtrar )
}
