import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/models/evento.model';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  eventos:Array<Evento> = [
    {
      url:"https://www.cursosgratuitosdeformaciononline.com/agricultura/piscicultura",
      resumen:"Este sitio de cursos gratuitos es de formación online es una entidad creada para brindar cursos a distancia de piscicultura con énfasis en sistemas de manejo, alimentación, fertilización, consumo y venta, crece el interés por la piscicultura, comercialización, estación piscícola, piscicultura tropical y subtropical de agua dulce y piscicultura marina.",
      dirigidoa:"El curso va dirigido y está abierto a toda persona interesada o involucrada en el sector piscícola, que quiera mejorar o actualizar su información. ",
      nombre:"Piscicultura",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Plataforma de formación online",
      costo:0,
      imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0xH64LdRmZb_YPcfpCeoxAGfM2CiuJqxSlQ&usqp=CAU",
      duracion:""
    },
    {
      url:"http://sis.senavirtual.edu.co/compartel/infocurso.php?semid=573",
      resumen:"Con este curso de quiere capacitar a las personas interesadas para que realicen las acciones necesarias que conduzcan a la implementación del cultivo de peces en cautiverio como una alternativa económica rentable tanto para satisfacer necesidades nutricionales en las fincas como para establecer cultivos con fines comerciales.",
      dirigidoa:"Proporcionar información para aquellas personas interesadas en nuevas técnicas para nuevas implementaciones de cultivo.",
      nombre:"Piscicultura Continental",
      modalidad:"Virtual",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Comunidad de aprendizaje, Sena virtual",
      costo:0,
      imagen:"https://i2.wp.com/panoramaacuicola.com/wp-content/uploads/2018/11/acuicultura_agrofy_news_2.jpg?fit=620%2C375&ssl=1",
      duracion:"40 Horas"
    },
    {
      url:"http://cursacuicultura.webs.upv.es/?gclid=CjwKCAjwoP6LBhBlEiwAvCcthJrRx6rlebIn7xS-3szBhaOKgOpKaLQzyX6vtbzAOufMK-V_1RAAPhoCovcQAvD_BwE",
      resumen:"La formación de los Cursos On-line en Acuicultura del Grupo de Acuicultura y Biodiversidad de la Universidad Politécnica Valencia, pretenden llegar a todos los rincones de habla hispana ofreciendo una enseñanza de calidad. ",
      dirigidoa:"A los estudiantes, técnicos y profesionales del sector acuícola, mediante la Plataforma PoliFormaT de la UPV.",
      nombre:"Acuicultura",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Universidad Politécnica de Valencia",
      costo:0,
      imagen:"https://elproductor.com/wp-content/uploads/2017/07/acuicola.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-sistemas-de-aireacion/",
      resumen:"Es un curso online de sistemas de aireación y manejo adecuado del oxígeno en la acuicultura.",
      dirigidoa:"Este curso permitirá capacitar los participantes en las técnicas de operación, diseño e implementación de sistemas de aireación en granjas acuícolas a diferentes densidades de cultivo y en distintos sistemas de producción.",
      nombre:"Sistemas de Aireación",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Piscicultura Global. ING. FLAVIO GONZÁLEZ",
      costo:0,
      imagen:"https://gt.kaeser.com/Media/Aeration-and-protection_48-70237-460x258.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-como-organizar-su-empresa-piscicola-en-10-pasos/",
      resumen:"Este curso permitirá capacitar a los participantes en los principales aspectos a tomar en consideración en el momento de Constituir o adecuar su Organización al crecimiento natural por diferentes motivos, sea expansión o situaciones externas de diversa índole.",
      dirigidoa:"Capacitar a los líderes, gerentes, administradores y propietarios.",
      nombre:"Cómo organizar su empresa piscícola en 10 pasos ",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción) ",
      hora:"",
      organizador:"Piscicultura Global. MsG. Francisca Scarso",
      costo:0,
      imagen:"https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-biofloc-implementacion-y-manejo/",
      resumen:"Este curso permitirá capacitar a los participantes en la implementación del Biofloc como método de producción con el objetivo de incrementar las densidades de cultivo y mejorar la rentabilidad sobre la inversión acuícola. ",
      dirigidoa:"Online",
      nombre:" Biofloc Implementación Y Manejo ",
      modalidad:"",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Piscicultura Global",
      costo:0,
      imagen:"https://agrotendencia.tv/agropedia/wp-content/uploads/2020/06/agrotendencia-agropedia-bio-floc-39.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-principios-de-la-acuicultura/",
      resumen:"Este curso te permitirá iniciar las prácticas y conocimientos básicos de la acuicultura.  además de capacitar a los participantes en las generalidades del mundo de la acuicultura, con el objetivo de mejorar sus procesos productivos.",
      dirigidoa:"Personas interesadas.",
      nombre:"Principios de la acuicultura",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción) ",
      hora:"",
      organizador:"Piscicultura Global",
      costo:0,
      imagen:"https://www.gob.mx/cms/uploads/article/main_image/40238/granja.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-produccion-de-alevines-de-tilapia-con-interes-comercial/",
      resumen:"Este curso te capacitará en la producción comercial de alevines de tilapia, con el objetivo de su comercialización o utilización para su engorde dentro de las fincas acuícolas.",
      dirigidoa:"Personas interesadas que hagan parte del sector Piscícola con interés comercial. ",
      nombre:"Producción de alevines de Tilapia con interés comercial",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Piscicultura Global",
      costo:0,
      imagen:"https://www.laopinion.com.co/sites/default/files/2019/07/27/imagen/tilapias1.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso-alimentacion-y-nutricion-en-la-acuicultura/",
      resumen:"Este curso te capacitará en la alimentación y nutrición en la acuicultura, con el objetivo de mejorar sus procesos dentro de las fincas acuícolas; además como profesionales y expertos en la Alimentación y Nutrición Acuícola.",
      dirigidoa:"Personal del sector piscícola, productores entre otros.",
      nombre:"Alimentación y nutrición en la acuicultura",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Piscicultura Global",
      costo:0,
      imagen:"https://www.globalseafood.org/wp-content/uploads/2017/04/BOYD-Pic-0_resize-1-960x720.jpg",
      duracion:""
    },
    {
      url:"https://www.pisciculturaglobal.com/curso%20calidad%20de%20agua%20en%20la%20acuicultura/",
      resumen:"Este curso te permitirá controlar y monitorear correctamente los distintos parámetros de calidad de agua con el objetivo de obtener un óptimo rendimiento en tu producción acuícola.",
      dirigidoa:"A personas interesadas que estén involucradas en el sector piscícola.",
      nombre:"Calidad de agua en la acuicultura",
      modalidad:"Online",
      fecha:"Sin definir (Previa inscripción)",
      hora:"",
      organizador:"Piscicultura Global",
      costo:0,
      imagen:"https://cdn-blog1.fibrasynormasdecolombia.com/wp-content/uploads/2021/02/laboratorio-toma-de-muestras-de-agua-en-rio-depuradora-coronovirus-810x456.jpg",
      duracion:""
    },
    {
      url:"https://www.cultivodetilapiamojarraroja.com/cursos-biofloc-para-piscicultura/",
      resumen:"Tecnología Biofloc amigable con el Medio Ambiente. tecnología biofloc como respuesta a una necesidad del sector piscícola de practicar una piscicultura intensiva que fuera amigable con el medio ambiente y que no necesitara del uso de grandes volúmenes de agua ni de contaminar las fuentes hídricas con el vertimiento de excretas y otras sustancias de desecho.",
      dirigidoa:"Estudiantes, titulados y las personas del sector piscícola.",
      nombre:"Tecnología Biofloc amigable con el Medio Ambiente",
      modalidad:"Online",
      fecha:"Sin definir (Previa Inscripción)",
      hora:"",
      organizador:"Acuicultura Sostenible",
      costo:100000,
      imagen:"https://www.cultivodetilapiamojarraroja.com/wp-content/uploads/2019/01/Cursos-Biofloc.png",
      duracion:""
    },
    {
      url:"https://www.educaweb.mx/curso/piscicultura-distancia-226375/",
      resumen:"Con el curso de piscicultura va a poder criar peces de distinto tipo en su hogar y con muy poca inversión.",
      dirigidoa:"Este curso es ideal para quien desea criar peces como hobby",
      nombre:"Piscicultura",
      modalidad:"",
      fecha:"",
      hora:"",
      organizador:"",
      costo:0,
      imagen:"https://www.aquahoy.com/images/Peces/Red-Drum-Broofish.jpg",
      duracion:""
    },
    {
      url:"https://cursos.com/cursos/veterinaria/piscicultura/",
      resumen:"Trabaja en la cría y producción de peces de todo tipo.",
      dirigidoa:"Al personal del sector piscícola",
      nombre:"Piscicultura",
      modalidad:"",
      fecha:"",
      hora:"",
      organizador:"",
      costo:0,
      imagen:"https://cursos.com/wp-content/uploads/2021/03/curso-piscicultura-1536x566.jpg.webp",
      duracion:""
    },
    {
      url:"https://repositorio.sena.edu.co/bitstream/handle/11404/3698/mod_02_cultivo_peces_estanques.PDF?sequence=1",
      resumen:"Capacitación en acuicultura para las personas que quieran aprender y tener menos errores para obtener mejores alternativas en este sector. ",
      dirigidoa:"Al sector piscícola",
      nombre:"Programa capacitación en acuicultura módulo 2",
      modalidad:"",
      fecha:"",
      hora:"",
      organizador:"",
      costo:0,
      imagen:"https://www.foodnewslatam.com/images/stories/2021/Julio/peces_mas_grandes.jpg",
      duracion:""
    },
    {
      url:"http://redmujeres.org/wp-content/uploads/2019/01/capacitacion_piscicultura_tropical.pdf",
      resumen:"Programa de capacitación por competencias en piscicultura.",
      dirigidoa:"Al sector piscícola",
      nombre:"Manual de capacitación",
      modalidad:"",
      fecha:"",
      hora:"",
      organizador:"",
      costo:0,
      imagen:"assets/images/manual.svg",
      duracion:""
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
