import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipo-trabajo',
  templateUrl: './equipo-trabajo.component.html',
  styleUrls: ['./equipo-trabajo.component.scss']
})
export class EquipoTrabajoComponent implements OnInit {
  team:any = [
    {
      name:'Ramón Álvarez',
      position:'Director científico y administrativo',
      profession:'Ingeniero Electrónico- PhD en Ingeniería-Automática.',
      activities:'Planear, coordinar, dirigir y supervisar el desarrollo de la plataforma',
      cvlac:'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000411221',
      photo:'assets/images/photos/ramon.png'
    },
    {
      name:'Yaneth Romero',
      position:'Coordinador de transferencia de tecnología',
      profession:'Ingeniera Industrial - MsC en Finanzas',
      activities:'Coordinar las actividades de transferencia de tecnología',
      cvlac:'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001358474',
      photo:'assets/images/photos/yaneth.png'
    },
    {
      name:'José López',
      position:'Coordinador de Transferencia de conocimiento',
      profession:'Ingeniero Electrónico, Máster en Controles Industriales, candidato a Doctor en Ingeniería Industrial.',
      activities:'Coordinar las actividades de transferencia de Conocimiento',
      cvlac:'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001486987',
      photo:'assets/images/photos/jose.png'
    },
    {
      name:'Sergio Sánchez',
      position:'Coordinador técnico del proyecto',
      profession:'Ingeniero electrónico, MSc en ingeniería con énfasis en electrónica y eléctrica, estudiante de doctorado en ingeniería',
      activities:'Coordinar las actividades técnicas del proyecto',
      cvlac:'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001534589&lang=es',
      photo:'assets/images/photos/sergio.png'
    },
    {
      name:'Lina Quitian',
      position:'Coordinadora de desarrollo',
      profession:'Ingeniera de Sistemas – Magíster en Ingeniería Informática',
      activities:'Coordinar cada una de las actividades para el desarrollo de la plataforma',
      cvlac:'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001724355',
      linkedIn:'https://www.linkedin.com/in/lina-quitian-g%C3%B3mez-03225b10b/?originalSubdomain=co ',
      photo:'assets/images/photos/lina.png'
    },
    {
      name:'Renzo Funes',
      position:'Desarrollador 1',
      profession:'Ingeniero de Sistemas',
      activities:'Desarrollar el Frontend de la aplicación web de la plataforma',
      linkedIn:'https://www.linkedin.com/in/rfunez/',
      photo:'assets/images/photos/renzo.png'
    },
    {
      name:'Luis Pontón',
      position:'Desarrollador 2',
      profession:'Ingeniero de Sistemas',
      activities:'Desarrollar el Backend de la de la plataforma',
      linkedIn:'https://www.linkedin.com/in/luis-alberto-pont%C3%B3n-mercado-43171820/',
      photo:'assets/images/photos/luis.png'
    },
    {
      name:'Andrés Dávila',
      position:'Auxiliar de Investigación 1',
      profession:'Tecnólogo Electrónico Industrial',
      activities:'Contribuir en la transferencia tecnológica en el desarrollo del Backend',
      linkedIn:'https://www.linkedin.com/in/andr%C3%A9s-david-davila-arroyo-b4b140228',
      photo:'assets/images/photos/andres.png'
    },
    {
      name:'Ricardo Montes',
      position:'Auxiliar de Investigación 2 ',
      profession:'Tecnólogo en Electrónica Industrial e Ingeniero Electrónico',
      activities:'Contribuir en transferencia tecnológica en el desarrollo del Frontend',
      linkedIn:'https://www.linkedin.com/in/ricardo-montes94',
      photo:'assets/images/photos/ricardo.png'
    },
    {
      name:'María Pérez',
      position:'Auxiliar de Investigación 3',
      profession:'Ingeniera Agroindustrial',
      activities:'Contribuir en las actividades de transferencia de conocimiento.',
      linkedIn:'https://www.linkedin.com/in/ang%C3%A9lica-p%C3%A9rezfunez/',
      photo:'assets/images/photos/mary.png'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
