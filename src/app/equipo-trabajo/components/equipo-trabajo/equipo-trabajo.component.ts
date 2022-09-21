import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-equipo-trabajo',
  templateUrl: './equipo-trabajo.component.html',
  styleUrls: ['./equipo-trabajo.component.scss'],
})
export class EquipoTrabajoComponent implements OnInit {
  team: any = [
    {
      name: '	Ramón Antonio Álvarez López',
      position: 'Director científico y administrativo',
      location: 'Sincelejo, Sucre, Colombia',
      profession: 'Ingeniero Electrónico- PhD en Ingeniería-Automática.',
      activities:
        'Planear, coordinar, dirigir y supervisar el desarrollo de la plataforma',
      data: '',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000411221',
      linkedIn:
        'https://www.linkedin.com/in/ram%C3%B3n-antonio-%C3%A1lvarez-l%C3%B3pez-30129126/?originalSubdomain=co',
      photo: 'assets/images/photos/ramon.png',
    },
    {
      name: 'Yaneth Patricia Romero Álvarez',
      position: 'Coordinadora de transferencia de tecnología',
      location: 'Sincelejo, Sucre, Colombia',
      profession: 'Ingeniera Industrial - MsC en Finanzas',
      activities: 'Coordinar las actividades de transferencia de tecnología',
      data: '',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001358474',
      linkedIn:
        'https://www.linkedin.com/in/yaneth-romero-alvarez-a45a834b/?originalSubdomain=co',
      photo: 'assets/images/photos/yaneth.png',
    },
    {
      name: 'Jose Luis Lopez Prado',
      position: 'Coordinador de Transferencia de conocimiento',
      location: 'Sincelejo, Sucre, Colombia',
      profession:
        'Ingeniero Electrónico, Máster en Controles Industriales, candidato a Doctor en Ingeniería Industrial.',
      activities: 'Coordinar las actividades de transferencia de Conocimiento',
      data: '',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001486987',
      /* linkedIn: '', */
      photo: 'assets/images/photos/jose.png',
    },
    {
      name: 'Sergio Antonio Sánchez Hernández',
      position: 'Coordinador técnico del proyecto',
      location: 'Sincelejo, Sucre, Colombia',
      profession:
        'Ingeniero electrónico, MSc en ingeniería con énfasis en electrónica y eléctrica, estudiante de doctorado en ingeniería',
      activities: 'Coordinar las actividades técnicas del proyecto',
      data: '',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001534589&lang=es',
      /*  linkedIn: '', */
      photo: 'assets/images/photos/sergio.png',
    },
    {
      name: 'Lina Marcela Quitian Gómez',
      position: 'Coordinadora de desarrollo',
      location: 'Cereté, Córdoba, Colombia 1992',
      profession: 'Ingeniera de Sistemas – Magíster en Ingeniería Informática',
      activities:
        'Coordinar cada una de las actividades para el desarrollo de la plataforma',
      data: '\n Ingeniera de Sistemas de la Fundación Universitaria San Martín con Maestría en Ingeniería en Informática de la Universidad Oberta de Cataluña. \n Con 3 años de experiencia en Compufácil, empresa dedicada a ofrecer servicios informáticos a grandes empresas del estado. Adicional con 2 años de experiencia como docente universitario en la CORPOSUCRE. \nActualmente, coordina las actividades de desarrollo del proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001724355',
      linkedIn:
        'https://www.linkedin.com/in/lina-quitian-g%C3%B3mez-03225b10b/?originalSubdomain=co ',
      photo: 'assets/images/photos/lina.png',
    },
    {
      name: 'Renzo Javier Funes Meza',
      position: 'Desarrollador 1',
      location: 'Sincelejo, Sucre, Colombia 1985',
      profession: 'Ingeniero de Sistemas',
      data: '\n Ingeniero de Sistemas de la Escuela Colombiana de Ingeniería Julio Garavito.\n Con 4 años de experiencia participando en el desarrollo de aplicaciones móviles y web. \n Actualmente, está a cargo de desarrollar el frontend de la plataforma en el proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      activities:
        'Desarrollar el Frontend de la aplicación web de la plataforma',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0002036878',
      linkedIn: 'https://www.linkedin.com/in/rfunez/',
      photo: 'assets/images/photos/renzo.png',
    },
    {
      name: 'Luis Alberto Pontón Mercado',
      position: 'Desarrollador 2',
      location: 'Sincelejo, Sucre, Colombia 1986',
      profession: 'Ingeniero de Sistemas',
      data: ' \n Ingeniero de Sistemas de la Universidad Francisco de Paula Santander con diplomado en docencia universitaria con énfasis en evaluación por competencias de la Universidad Incca de Colombia en convenio con Fundación Educolombia. \n Con 1 año de experiencia en Mafp Ingeniería y diseño, empresa dedicada a ofrecer servicios informáticos a grandes empresas del estado, así mismo 2 años de experiencia en Verduras del Norte, empresa dedicada a la distribución de productos de hortalizas, de igual forma con 1 año de experiencia en la Fundación manos Unidas de Colombia, y también 6 meses de experiencia en Antonio Mendoza y Asociados, empresa dedicada a la distribución de juegos de loterías, de igual modo 4 meses de experiencia en Sumisalud de la Costa. Adicional con 4 meses de experiencia como docente en el INSTITUTO CERS y 2 meses más en Fundescolombia, institución técnico laboral regional sucre. \n Actualmente, ejerce las actividades de desarrollo del backend del proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      activities: 'Desarrollar el Backend de la plataforma',
      linkedIn:
        'https://www.linkedin.com/in/luis-alberto-pont%C3%B3n-mercado-43171820/',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0002030793',
      photo: 'assets/images/photos/luis.png',
    },
    {
      name: 'Andrés David Davila Arroyo',
      position: 'Auxiliar de Investigación 1',
      location: 'Galeras, Sucre, Colombia 1998',
      profession: 'Tecnólogo Electrónico Industrial',
      data: '\n Tecnólogo en electrónica industrial de la Universidad de sucre. \n Con 1 año de experiencia como auxiliar investigativo. \n Actualmente ejerce como auxiliar de investigación en el proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      activities:
        'Contribuir en la transferencia tecnológica en el desarrollo del Backend',
      linkedIn:
        'https://www.linkedin.com/in/andr%C3%A9s-david-davila-arroyo-b4b140228',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0002030795',
      photo: 'assets/images/photos/andres.png',
    },
    {
      name: 'Ricardo Montes Romero',
      position: 'Auxiliar de Investigación 2 ',
      location: 'Sincelejo, Sucre, Colombia 1994',
      profession: 'Tecnólogo en Electrónica Industrial e Ingeniero Electrónico',
      data: '\n Ingeniero Electrónico de la Universidad de Pamplona y Tecnólogo en Electrónica Industrial de la Universidad de Sucre con diplomado en Ingeniería Biomédica de la Universidad de Pamplona. \n Con 1 año de experiencia como auxiliar investigativo. \nActualmente, ejerce actividades como auxiliar de investigación del proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      activities:
        'Contribuir en transferencia tecnológica en el desarrollo del Frontend',
      linkedIn: 'https://www.linkedin.com/in/ricardo-montes94',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001783887',
      photo: 'assets/images/photos/ricardo.png',
    },
    {
      name: 'María Angélica Pérez Fúnez    ',
      position: 'Auxiliar de Investigación 3',
      location: 'Corozal, Sucre, Colombia 1992',
      profession: 'Ingeniera Agroindustrial',
      data: '\n Ingeniera Agroindustrial de la Universidad de Sucre. \n Con experiencia en 6 meses en desarrollo de una herramienta computacional que permita hacer seguimiento detallado a las metas del PAFI en la Facultad de Ingeniería de la U de S y 1 año como auxiliar investigativo. \n Actualmente, ejerce actividades como auxiliar de investigación del proyecto “Desarrollo de una plataforma de transferencia tecnológica enmarcada en los efectos negativos de la productividad y competitividad de la cadena piscícola, derivadas de la emergencia sanitaria causada por el COVID-19 en el departamento de Sucre”. Con código BPIN 2020000100761.',
      activities:
        'Contribuir en las actividades de transferencia de conocimiento.',
      linkedIn: 'https://www.linkedin.com/in/ang%C3%A9lica-p%C3%A9rezfunez/',
      cvlac:
        'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0001916470',
      photo: 'assets/images/photos/mary.png',
    },
  ];
  member: any;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    for (let index = 0; index < this.team.length; index++) {
      const member = this.team[index];
      this.prepararDatos(member);
    }
  }
  async openModal(content: any, member: any) {
    this.member = member;
    this.modalService.open(content, {
      size: 'xl',
      backdropClass: 'modal-equipo-trabajo-BackdropClass',
      modalDialogClass: 'modal-equipo-trabajo-DialogClass',
      windowClass: 'modal-equipo-trabajo-ContentClass',
      centered: true,
    });
  }
  prepararDatos(member: any) {
    /* https://stackblitz.com/edit/angular-brujio?file=src%2Fapp%2Fapp.component.ts
    https://es.stackoverflow.com/questions/353855/salto-de-linea-en-servicio-angular */
    member.data = member.data.split('\n').join('<p />');
    return member;
  }
}
