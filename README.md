# WebAppDory

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Guía De Instalación de la aplicación Web

## 1.Configuraciones previas

1. Instalar servidor de api rest
	    
El funcionamiento de la aplicación web depende del funcionamiento del servidor        
de api rest. Siga la guía de instalación “Guía De Instalación Api Rest”.
            
2. Cree un proyecto en firebase
	 
De clic en el siguiente enlace para acceder a la guia:
https://firebase.google.com/docs/web/setup?hl=es-419#create-project

	
3. Registre la aplicación en firebase
	
https://firebase.google.com/docs/web/setup?hl=es-419#register-app

Durante el este proceso obtendrá el objeto firebaseConfig, guárdelo se usará posteriormente:

![image](https://user-images.githubusercontent.com/118612137/203827326-4d484a9e-d8f5-4135-b0a6-e0043f4d526c.png)

## 1. Cree un proyecto en firebase
	 
De clic en el siguiente enlace para acceder a la guia:
https://firebase.google.com/docs/web/setup?hl=es-419#create-project

	
## 2. Registre la aplicación en firebase
	
https://firebase.google.com/docs/web/setup?hl=es-419#register-app

Durante el este proceso obtendrá el objeto firebaseConfig, guárdelo se usará posteriormente:


««««<Configuración del CORS en google cloud mirar en trello«««««««««««

## 2. Instale GIT

Ingrese al enlace https://git-scm.com y siga la instrucciones para llevar a cabo la instalación.

## 3. Ingrese a github

Cree una cuenta en GitHub en https://github.com  o ingrese si ya tiene una.

## 4. Cree un nuevo repositorio privado
 
Guarde la dirección del nuevo repositorio será usada mas adelante.

## 5. Clone el repositorio de la aplicación web

Abra una terminal y ejecute los siguientes comando:

git clone https://github.com/doryteam1/dory-web-app.git
cd dory-web-app

Ahora usted se encuentra en el directorio que contiene el código fuente de la aplicación.

## 6. Adicione un nuevo remoto

Estando en el directorio dory-web-app ejecute el siguiente comando:

git remote add dory https://github.com/***.git

Remplace la url usada en el comando por la url del nuevo repositorio guardada en el punto 3.

Esto adiciona un nuevo remoto en el repositorio dory-web-app


## 7. Cree la rama “master”

git checkout -b master 

## 8. Suba el código al nuevo repositorio

git push dory master

Ahora el código fuente de la aplicación se encuentra en el nuevo repositorio. 

Nota: Asegúrese de tener configurada la cuenta de git con un usuario que tenga los permisos necesarios para realizar este procedimiento.

## 9. Ingrese a Heroku

Cree una cuenta en Heroku en https://signup.heroku.com/login o ingrese si ya tiene una.


## 10. Cree una app en Heroku
 
Heroku usa contenedores para ejecutar y escalar todas las aplicaciones. Estos contenedores se denominan Dynos. 

Remplace el nombre de aplicación(App name) por uno que prefiera.
Diligencie el formulario y haga clic en el botón Create app

## 11. Configurar App 

  Para configurar la app en Heroku realice los siguientes pasos:
	
  1. Seleccione GitHub como método de despliegue.

  2. Presione el botón Connect to GitHub

  3. Inicie sesión con su usuario y contraseña de GitHub para conectarse a Heroku

  4. Conecte la App con el nuevo repositorio

  Seleccione el nuevo repositorio creado en el punto 3

  5. Seleccione la rama master para despliegues automáticos.

 presione el botón Enable Automatic Deploys para activar los despliegues automáticos.


## 12. Despliegue la App

Presione el botón Deploy Branch para realizar un despliegue manual de la rama master.
Una ves terminado el proceso la app se encuentra online.


## 13. Configure las Variables de entorno en Heroku

En la pestaña “Settings” de la aplicación en la sección “Config Vars” configurar  las siguientes variables de entorno:

DORY_API_REST: Url base del api rest de la plataforma. Se obtuvo en la guía de instalación del api rest(enlace en el punto 0).
 
DORY_SERVER_URL: Url del servidor del backend. Se obtuvo en la guia de instalación del servidor(enlace en el punto 0).

THIS_WEB_URL: Url o dominio donde se encuentra esta aplicación web. Lo puede encontrar en la pestaña “Settings” de la app en la sección “Domains”.

MAPS_API_KEY:  Api key de google. Puedes generar una en el siguiente enlace: https://developers.google.com/maps/documentation/javascript/get-api-key

OAUTH_CLIENT_ID: ID de cliente. Siga los pasos para obtener uno en: https://developers.google.com/identity/protocols/oauth2

Para configurar las siguientes variable use el objeto “firebaseConfig” obtenido en el punto 0 sección 3:

FIREBASE_API_KEY
FIREBASE_APP_ID
FIREBASE_AUTH_DOMAIN
FIREBASE_LOCATION_ID
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET

 
## 14. Verifique

En la sección Settings de la app encontrará la sección “Domains”. En esta encontrará la url para acceder a la aplicación web. Insertela en el navegador para acceder a esta y verificar su correcto funcionamiento.
