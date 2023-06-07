import {IntroToursteps } from "src/models/introJsTourt.model";

 export const tourSteps: { [key: string]: IntroToursteps } = {
   stepWelcome: {
     title: 'Bienvenido',
     intro:
       'A continuación iniciarás un breve recorrido, al finalizar recuerda llenar todos los datos obligatorios.',
   },
   stepMenuPrincipal: {
     title: 'Menú principal',
     element: '#menuOptions',
     intro: 'Aquí encontrarás todo lo que puedes realizar con tu cuenta',
   },
   stepPerfil: {
     title: 'Perfil',
     element: '#perfil',
     intro:
       'Esta opción te lleva al formulario donde podrás llenar toda tú información, para que así puedan encontrarte.',
   },
   stepContrasena: {
     title: 'Cambiar contraseña',
     element: '#contrasena',
     intro: 'Desde aquí podrás cambiar la contraseña de la cuenta',
   },
   stepMispublicaciones: {
     title: 'Mis publicaciones',
     element: '#mispublicaciones',
     intro: 'Desde aquí podrás publicar todo',
   },
   stepPublicaciones: {
     title: 'Publicaciones',
     element: '#publicaciones_user',
     intro:
       'Desde aquí podrás ver todas las publicaciones, hechas por un pescador o piscicultor',
   },
   stepOtrosDocumentos: {
     title: 'Documentos adicionales',
     element: '#otrosDocumentos',
     intro: 'Desde aquí podrás cargar tú documento de cédula y sisben',
   },
   stepMisGranjas: {
     title: 'Mis granjas',
     element: '#misgranjas',
     intro:
       ' En esta opción podrás registrar, modificar y eliminar la información de tus granjas piscicolas.',
   },
   stepMisProductos: {
     title: 'Mis productos',
     element: '#misproductos',
     intro:
       'En esta opción podrás registrar, modificar y eliminar la información de los productos que vendes.',
   },

   stepAsociaciones: {
     title: 'Mis asociaciones',
     element: '#misasociaciones',
     intro:
       'En esta opción podrás registrar, modificar y eliminar la información de tus asociaciones.',
   },
   stepNombre: {
     title: 'Nombres y apellidos',
     element: '#nombre',
     intro: 'En este campo puedes ingresar tus nombres y apellidos.',
   },
   stepVehiculos: {
     title: 'Mis vehículos',
     element: '#misvehiculos',
     intro:
       'En esta opción podrás registrar, modificar y eliminar la información de tus vehículos.',
   },
   stepConsumo: {
     title: 'Mis consumos',
     element: '#consumo',
     intro:
       'Aquí podrás ingresar lo que consumes, así los productores podran tener una idea de lo que necesitan cultivar.',
   },
   stepNegocios: {
     title: 'Mis negocios',
     element: '#misnegocios',
     intro:
       'En esta opción podrás registrar, modificar y eliminar la información de tus negocios.',
   },
   stepSalir: {
     title: 'Salir',
     element: '#salir',
     intro: 'Desde aquí podras cerrar la sesión.',
   },
   stepFavorito: {
     title: 'Mis favoritos',
     element: '#misfavoritos',
     intro: 'Aquí podrás ver las granjas que has marcado como favoritas.',
   },
   stepDatosBasicos: {
     title: 'Datos básicos',
     element: '#basicos',
     intro:
       'Aquí encontrarás todos tus datos básicos, recuerda llenar los obligatorios.',
   },
   stepFotoPerfil1: {
     title: 'Foto de perfil',
     element: '#foto1',
     intro:
       'Presionando el icono de la cámara, podrás cambiar tu foto de perfil.',
   },
   stepFotoPerfil2: {
     title: 'Foto de perfil',
     element: '#foto2',
     intro: 'Desde aquí, también podrás cambiar o eliminar tu foto de perfil.',
   },
   stepUbicacion: {
     title: 'Ubicación',
     element: '#ubicacion',
     intro:
       'En esta sección podrás ingresar la información referente a tu ubicación.',
   },
   stepPhoneNull: {
     title: 'Numero de celular',
     element: '#celular',
     intro:
       'No olvides llenar tu número de celular. Servirá para contactarte facilmente',
   },
   stepMunicNull: {
     title: 'Municipio',
     element: '#municipio',
     intro: 'Escoge el municipio donde vives ',
   },
   stepDirecNull: {
     title: 'Dirección',
     element: '#direccion',
     intro: 'Ingresa tu dirección ',
   },
 };

export const guidedTours = {
  piscicultorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepMisGranjas,
    tourSteps.stepFavorito,
    tourSteps.stepAsociaciones,
    tourSteps.stepMispublicaciones,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  pescadorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepFavorito,
    tourSteps.stepAsociaciones,
    tourSteps.stepMispublicaciones,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  proveedorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepMisProductos,
    tourSteps.stepFavorito,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  transportadorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepVehiculos,
    tourSteps.stepFavorito,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  consumidorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepConsumo,
    tourSteps.stepFavorito,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  investigadorGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepFavorito,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],

  comercianteGuidedTour: [
    tourSteps.stepWelcome,
    tourSteps.stepMenuPrincipal,
    tourSteps.stepPerfil,
    tourSteps.stepFavorito,
    tourSteps.stepNegocios,
    tourSteps.stepPublicaciones,
    tourSteps.stepContrasena,
    tourSteps.stepSalir,
    tourSteps.stepDatosBasicos,
    tourSteps.stepFotoPerfil1,
    tourSteps.stepFotoPerfil2,
    tourSteps.stepOtrosDocumentos,
    tourSteps.stepUbicacion,
  ],
  miniGuidedCelularTour: [tourSteps.stepPhoneNull],
  miniGuidedDirecTour: [tourSteps.stepDirecNull],
  miniGuidedMunicipioTour: [tourSteps.stepMunicNull],
};
