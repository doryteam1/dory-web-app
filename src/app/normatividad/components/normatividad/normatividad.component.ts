import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NormatividadService } from 'src/app/services/normatividad.service';
import { Normatividad } from 'src/models/normatividad.model';

@Component({
  selector: 'app-normatividad',
  templateUrl: './normatividad.component.html',
  styleUrls: ['./normatividad.component.scss']
})
export class NormatividadComponent implements OnInit {
  normatividades:Array<Normatividad> = [
    {
      nombre:"Ley 13 de 1990 de 2015",
      contenido:"Por la cual se dicta el estatuto general de pesca.",
      url_descarga:"https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=66783",
      tipo:"ley"
    },
    {
      nombre:"Ley 1131 de 2007",
      contenido:"Por medio de la cual se aprueba el “Acuerdo entre Ecuador y Colombia sobre Pesca Artesanal”, firmado en la ciudad de Popayán, a los trece (13) días del mes de mayo de mil novecientos noventa y cuatro (1994). ",
      url_descarga:"http://www.secretariasenado.gov.co/senado/basedoc/ley_1131_2007.html",
      tipo:"ley"
    },
    {
      nombre:"Decreto número 1780 de 2015",
      contenido:"Por el cual se adiciona el Decreto 1071 de 2015, Decreto Único Reglamentario del Sector Administrativo Agropecuario, Pesquero y de Desarrollo Rural, en lo relacionado con la adopción de medidas para administrar, fomentar y controlar la actividad de la acuicultura.",
      url_descarga:"https://www.minagricultura.gov.co/Normatividad/Decretos/Decreto No. 1780 de 2015.pdf",
      tipo:"decreto"
    },
    {
      nombre:"Decreto 4181 de 2011 ",
      contenido:"Por el cual se escinden unas funciones del Instituto Colombiano de Desarrollo Rural (Incoder) y del Ministerio de Agricultura y Desarrollo Rural, y se crea la Autoridad Nacional de Acuicultura y Pesca (AUNAP).",
      url_descarga:"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44640",
      tipo:"decreto"
    },
    {
      nombre:"Decreto 2256 de 1991",
      contenido:"Por medio de la cual se establecen los requisitos y el procedimiento para la expedición del permiso de pesca comercial artesanal a persona natural y jurídica en el territorio nacional”. El cual se reglamenta la Ley 13 de 1990.",
      url_descarga:"https://www.aunap.gov.co/wp-content/uploads/2017/06/Resoluci%C3%B3n-ULTIMA-V-REQUISITOS-Y-PROCEDIMIENTOS-PARA-PERM.-PESCA-COMERC.-ARTESANL.pdf",
      tipo:"decreto"
    },
    {
      nombre:"Decreto 2811 de 1974 ",
      contenido:"Por el cual se dicta el Código Nacional de Recursos Naturales Renovables y de Protección al Medio Ambiente.” En el título ll del presente decreto DE LA ACUICULTURA Y DEL FOMENTO DE LA PESCA en el Artículo 286.",
      url_descarga:"https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=1551",
      tipo:"decreto"
    },
    {
      nombre:"Resolución 124 de 2018",
      contenido:"Por la cual se modifica el artículo 1º y 2º de la Resolución 1500 del 28 de julio de 2017 y artículo 1º de la Resolución 1604 del 14 de agosto de 2017 y se establecen otras disposiciones. El Director de la Autoridad Nacional de Acuicultura y Pesca, en ejercicio de las facultades que le confiere el Decreto 4181 del 3 de noviembre de 2011, Ley 13 de 1990 y su Decreto Reglamentario 2256 de 1991, compilado con el Decreto 1071 del 26 de mayo de 2015.",
      url_descarga:"http://extwprlegs1.fao.org/docs/pdf/col181943.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 2879 de 2017",
      contenido:"Por la cual se establecen los requisitos que deben cumplir los establecimientos dedicados a la acuicultura en el país para minimizar los riesgos de escape de especímenes de recursos pesqueros ícticos de especies exóticas, domesticadas y/o trasplantadas y de camarón marino a cuerpos de agua naturales o artificiales.",
      url_descarga:"https://www.aunap.gov.co/wp-content/uploads/2015/06/resolucion-no-02879-28dic2017.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 2838 de 2017",
      contenido:"Por la cual se establecen las directrices técnicas y los requisitos para realizar repoblamientos y rescate, traslado y liberación con recursos pesqueros ícticos en aguas continentales de Colombia y se deroga la Resolución No. 0531 del 20 de diciembre de 1995 expedida por el Instituto Nacional de Pesca y Acuicultura — INPA'EL DIRECTOR TÉCNICO DE ADMINISTRACIÓN Y FOMENTO DE LA AUTORIDAD NACIONAL DE ACUICULTURA Y PESCA.",
      url_descarga:"https://www.aunap.gov.co/wp-content/uploads/2015/06/resolucion-no-02879-28dic2017.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 1500 de 2017",
      contenido:"Por la cual se modifica el artículo 1° de la Resolución número 1257 del 28 de junio de 2017 y se establecen otras disposiciones” expedida por la Autoridad Nacional de Acuicultura y Pesca.",
      url_descarga:"https://medioambiente.uexternado.edu.co/resolucion-1500-de-2017-por-la-cual-se-modifica-el-articulo-1-de-la-resolucion-numero-1257-del-28-de-junio-de-2017-y-se-establecen-otras-disposiciones/",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 1352 de 2016",
      contenido:"Por la cual se establece la clasificación de los acuicultores comerciales en Colombia de acuerdo con la actividad, el sistema y el volumen de producción y se deroga la resolución No. 1352 de 2016.",
      url_descarga:"https://www.aunap.gov.co/wp-content/uploads/2016/08/1352-18-08-16.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 064	de 2016 del ICA",
      contenido:"Por la cual establece requisitos para obtener el registro pecuario	de los establecimientos de Acuicultura.",
      url_descarga:"https://sioc.minagricultura.gov.co/Acuicultura/Normatividad/Resoluci%C3%B3n ICA 064 de 2016 - Registro ICA Pecuario de Establecimiento de acuicultura.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 2287 de 2015 de la AUNAP",
      contenido:"Declara especies domesticadas a las truchas y a las tilapias roja y plateada.",
      url_descarga:"https://sioc.minagricultura.gov.co/Acuicultura/Normatividad/Resoluci%C3%B3n 2287 de 2015 AUNAP.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 1924 de 2015",
      contenido:"Por la cual se racionalizan unos trámites, señalando los requisitos para el permiso de cultivo para el ejercicio de la acuicultura de recursos limitados El Director General de la Autoridad Nacional de Acuicultura y Pesca — AUNAP-, en uso de las facultades legales conferidas en numeral 8 del Artículo 5° en concordancia con el Artículo 11 del Decreto No. 4181 del 3 de noviembre de 2011, y conforme a lo establecido en la Ley 13 de 1990 y el Decreto Reglamentario 2256 de 1991.",
      url_descarga:"https://sioc.minagricultura.gov.co/Acuicultura/Normatividad/Resoluci%C3%B3n 1193 de 2014 AUNAP Cultivo AREL.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 601 de 2012",
      contenido:"Por la cual se establecen los requisitos y procedimientos para el otorgamiento de permisos, autorizaciones, patentes de pesca, prórrogas, modificaciones, aclaraciones, cancelaciones y archivo de expedientes para el ejercicio de la actividad pesquera y de la acuicultura, se adoptan otras medidas para el cumplimiento de los objetivos y funciones de la AUNAP y se derogan las Resoluciones No. 0601 de 2012, No. 0729 del 2012, No. 01193 de 2014, No. 2110 del 2017 y No. 01365 de 2018.",
      url_descarga:"https://www.aunap.gov.co/images/proyectos-de-consulta/resol-601-2019.pdf",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 602 de 2012",
      contenido:"Por el cual se establece el valor de las tasas y derechos por el ejercicio de la actividad acuícola y pesca (UNAP).",
      url_descarga:"https://www.redjurista.com/Documents/resolucion_602_de_2012_autoridad_nacional_de_acuicultura_y_pesca.aspx#/",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución No. 301 de 2011",
      contenido:"Ministerio de Agricultura ¨Por la cual se establecen las cuotas globales de pesca de las diferentes especies bajo aprovechamiento para la vigencia 2012 y se dictan otras disposiciones.",
      url_descarga:"https://avancejuridico.com/actualidad/documentosoficiales/2011/48227/r_ma_0301_2011.html",
      tipo:"resolucion"
    },
    {
      nombre:"Resolución 848 de 2008",
      contenido:"Por la cual se declaran unas especies exóticas como invasoras y se señalan las especies introducidas irregularmente al país que pueden ser objeto de cría en ciclo cerrado y se adoptan otras determinaciones.",
      url_descarga:"https://www.icbf.gov.co/cargues/avance/docs/resolucion_minambientevdt_0848_2008.htm",
      tipo:"resolucion"
    },
    {
      nombre:"Ley 811 de 2003",
      contenido:"Por medio de la cual se modifica la Ley 101 de 1993, se crean las organizaciones de cadenas en el sector agropecuario, pesquero, forestal, acuícola, las Sociedades Agrarias de Transformación, SAT, y se dictan otras disposiciones.",
      url_descarga:"https://www.ica.gov.co/normatividad/normas-nacionales/leyes/2003/2003l811",
      tipo:"ley"
    },
    {
      nombre:"Ley 101 de 1993",
      contenido:"Ley General de Desarrollo Agropecuario y Pesquero.",
      url_descarga:"https://www.minagricultura.gov.co/Normatividad/Leyes/Ley%20101%20de%201993.pdf",
      tipo:"ley"
    },
    {
      nombre:"Decreto 1985 de 2013",
      contenido:"Por el cual se modifica la estructura del Ministerio de Agricultura y Desarrollo Rural y se determinan las funciones de sus dependencias.",
      url_descarga:"http://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Decretos/1381213",
      tipo:"decreto"
    },
    {
      nombre:"Decreto 3800 de 2006",
      contenido:"Por el cual se reglamenta parcialmente la Ley 811 de 2003 modificatoria de la Ley 101 de 1993, sobre Organizaciones de Cadenas en el Sector Agropecuario, Pesquero, Forestal y Acuícola.",
      url_descarga:"https://www.minagricultura.gov.co/Normatividad/Decretos/Decreto%20No.%203800%20de%202006.pdf",
      tipo:"decreto"
    },
    {
      nombre:"Resolución 186 de 2018",
      contenido:"Por la cual se reglamenta parcialmente la Ley 811 de 2003 y el Decreto 3800 de 2006 sobre la inscripción de las organizaciones de cadena en el Sector Agropecuario, Forestal, Acuícola y Pesquero ante el Ministerio de Agricultura y Desarrollo Rural. ",
      url_descarga:"https://www.ica.gov.co/normatividad/normas-nacionales/resoluciones/2008/2008r0186",
      tipo:"resolucion"
    }
  ];

  normatividadesFiltered:Array<Normatividad> = [];

  constructor(private activatedRoute:ActivatedRoute, private nService: NormatividadService, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.cargarTodos();
  }

  cargarTodos(){
    this.normatividadesFiltered = this.normatividades.filter((value)=>{
      if(this.activatedRoute.snapshot.url[0].path == "resoluciones"){
        return value.tipo == "resolucion"
      }
      if(this.activatedRoute.snapshot.url[0].path == "leyes"){
        return value.tipo == "ley"
      }
      return value.tipo == this.activatedRoute.snapshot.url[0].path.substring(0, this.activatedRoute.snapshot.url[0].path.length - 1);
    });
  }

  onSearch(event:string){
    console.log("event: ",event);
    this.spinner.show();
    if(event == ''){
      this.cargarTodos();
      return;
    }
    this.nService.getNormatividadesByString(event).subscribe(
      (response)=>{
        this.normatividadesFiltered = response.data;
        this.spinner.hide();
      },err=>{
        console.log("err ",err);
        this.normatividadesFiltered.length = 0;
        this.spinner.hide();
      }
    );
  }

}
