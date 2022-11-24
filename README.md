# WebAppDory

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Despliegue de la aplicación Web

### 1.Configuraciones previas

* Cree un proyecto en firebase
	 
De clic en el siguiente enlace para acceder a la guia:
https://firebase.google.com/docs/web/setup?hl=es-419#create-project

	
* Registre la aplicación en firebase
	
https://firebase.google.com/docs/web/setup?hl=es-419#register-app

Durante el este proceso obtendrá el objeto firebaseConfig, guárdelo se usará posteriormente:

![image](https://user-images.githubusercontent.com/118612137/203827326-4d484a9e-d8f5-4135-b0a6-e0043f4d526c.png)

* Obtenga un apikey de google maps

https://developers.google.com/maps/documentation/javascript/get-api-key

* Obtenga un client id oauth2

https://developers.google.com/identity/protocols/oauth2

* Configuración del CORS en el google cloud

Ingrese a https://console.cloud.google.com/ con el mismo usuario del proyecto de firebase

Ingrese a Cloud Shell Terminal

Cree el archivo cors.json con el siguiente contenido:

![image](https://user-images.githubusercontent.com/118612137/203834496-50257bf1-899a-42e9-987f-97a2d762ffd1.png)

Ejecute el siguiente comando remplazando "gs://exampleproject.appspot.com" con el nombre del bucket:

gsutil cors set cors.json gs://exampleproject.appspot.com

Para mas información visite: https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin

### 2. Instale GIT

Ingrese al enlace https://git-scm.com y siga la instrucciones para llevar a cabo la instalación.

### 3. Ingrese a github

Cree una cuenta en GitHub en https://github.com  o ingrese si ya tiene una.

### 4. Cree un nuevo repositorio privado

![image](https://user-images.githubusercontent.com/118612137/203827821-9ca1ef75-28a2-4ab2-902a-dc5243a76ce6.png)

![image](https://user-images.githubusercontent.com/118612137/203827852-9a690ebc-688e-4dc9-bfea-907a5690cacc.png)

Guarde la dirección del nuevo repositorio será usada mas adelante.

### 5. Clone el repositorio de la aplicación web

Abra una terminal y ejecute los siguientes comando:

git clone https://github.com/doryteam1/dory-web-app.git
cd dory-web-app

Ahora usted se encuentra en el directorio que contiene el código fuente de la aplicación.

### 6. Adicione un nuevo remoto

Estando en el directorio dory-web-app ejecute el siguiente comando:

git remote add dory https://github.com/***.git

Remplace la url usada en el comando por la url del nuevo repositorio guardada en el punto 3.

Esto adiciona un nuevo remoto en el repositorio dory-web-app


### 7. Cree la rama “master”

git checkout -b master 

### 8. Suba el código al nuevo repositorio

git push dory master

Ahora el código fuente de la aplicación se encuentra en el nuevo repositorio. 

Nota: Asegúrese de tener configurada la cuenta de git con un usuario que tenga los permisos necesarios para realizar este procedimiento.

### 9. Ingrese a Heroku

Cree una cuenta en Heroku en https://signup.heroku.com/login o ingrese si ya tiene una.


### 10. Cree una app en Heroku

![image](https://user-images.githubusercontent.com/118612137/203828155-3613f050-5e3f-400b-bbb5-d72ebe1dee0f.png)

Heroku usa contenedores para ejecutar y escalar todas las aplicaciones. Estos contenedores se denominan Dynos. 

![image](https://user-images.githubusercontent.com/118612137/203828194-da2a9ae9-58f9-4444-a183-14e0609fe180.png)

Remplace el nombre de aplicación(App name) por uno que prefiera.
Diligencie el formulario y haga clic en el botón Create app

### 11. Configurar App 

Para configurar la app en Heroku realice los siguientes pasos:
	
1. Seleccione GitHub como método de despliegue.

![image](https://user-images.githubusercontent.com/118612137/203828301-cdb4cab3-2cc4-4243-a896-06feed680546.png)

2. Presione el botón Connect to GitHub

![image](https://user-images.githubusercontent.com/118612137/203828373-b4e8f257-c48c-4f11-b9c6-54af59f194f1.png)

3. Inicie sesión con su usuario y contraseña de GitHub para conectarse a Heroku

4. Conecte la App con el nuevo repositorio

![image](https://user-images.githubusercontent.com/118612137/203828430-65a6eda1-28e9-49b3-9669-1243e52f2793.png)

Seleccione el nuevo repositorio creado en el punto 3

5. Seleccione la rama master para despliegues automáticos.

![image](https://user-images.githubusercontent.com/118612137/203828538-c51f9b7a-dcbe-4bfe-bebd-bf47c3a4ec46.png)

presione el botón Enable Automatic Deploys para activar los despliegues automáticos.


### 12. Despliegue la App

![image](https://user-images.githubusercontent.com/118612137/203828592-a861bf9b-d86b-467b-ab67-d5f3913ad53b.png)

Presione el botón Deploy Branch para realizar un despliegue manual de la rama master.
Una ves terminado el proceso la app se encuentra online.


### 13. Configure las Variables de entorno en Heroku

![image](https://user-images.githubusercontent.com/118612137/203829396-a0726b81-2596-4402-a468-1b653d978ca2.png)

En la pestaña “Settings” de la aplicación en la sección “Config Vars” configurar  las siguientes variables de entorno:

DORY_API_REST: Url base del api rest de la plataforma.
 
DORY_SERVER_URL: Url del servidor del backend.

THIS_WEB_URL: Url o dominio donde se encuentra esta aplicación web. Lo puede encontrar en la pestaña “Settings” de la app en la sección “Domains”.

MAPS_API_KEY:  Api key de google. Puedes generar una en el siguiente enlace: https://developers.google.com/maps/documentation/javascript/get-api-key

OAUTH_CLIENT_ID: ID de cliente. Siga los pasos para obtener uno en: https://developers.google.com/identity/protocols/oauth2

Para configurar las siguientes variable use el objeto “firebaseConfig” obtenido en el punto 1 sección 2:

FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_LOCATION_ID, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET

 
## 14. Verifique

![image](https://user-images.githubusercontent.com/118612137/203829567-5548abda-44c4-474c-814f-fbaec59aa3cd.png)

En la sección Settings de la app encontrará la sección “Domains”. En esta encontrará la url para acceder a la aplicación web. Insertela en el navegador para acceder a esta y verificar su correcto funcionamiento.
