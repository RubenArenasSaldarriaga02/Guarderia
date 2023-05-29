# LMS

## Previo a la instalación
Deberás ejecutar el archivo SQL que se encuentra en la carpeta database, puedes hacerlo en tu gestor de bases de datos SQL favorito, aquí te recomendamos Xampp, pero bien puedes usar otras opciones a tu gusto.

![image](https://user-images.githubusercontent.com/79883410/205369401-21cdf3e5-b976-4e8c-a37b-4023f5ed5782.png)


## Instalacion y ejecucion del proyecto
Una vez clones el repositorio, deberás abrir una terminal y ejecutar los siguientes comandos:
```
npm i
npm run dev
```
Una vez los ejecutes, deberás ver algo como esto

![image](https://user-images.githubusercontent.com/79883410/205370246-b87b4073-8607-4e7f-934b-a01b25442a43.png)


Posteriormente ya podras entrar a la web a traves del localhost:4000

![image](https://user-images.githubusercontent.com/79883410/205372169-70d71e6c-965f-4994-989d-91378ef5faf3.png)


## Posibles problemas
Una vez ejecutes los comandos y no entre en la web, revisa la terminal, te avisará de dos posibles errores
1. No se conectó a la Base de Datos
2. Al entrar a localhos:4000 no carga la página

el primero puede causarse si no hiciste el paso previo, por lo cual deberás revisarlo, también puede ser al crear la base de datos hallas creado credenciales
diferentes a las del proyecto, revisa las credenciales en tu gestor de bases de datos, en caso de que tengas credenciales diferentes deberás cambiarlas en la dirección 
scr/keys.js, puedes cambiar las de tu gestor por las del proyecto o viceversa.

![image](https://user-images.githubusercontent.com/79883410/205371216-3f382b7e-5bdf-44c4-bb56-f5d9eb47ef0c.png)

El segundo error puede deberse a que tengas bloqueado el puerto, deberás revisarlo, no obstante en el proyecto podrás visualizar en que puerto se encuentra el proyecto.

![image](https://user-images.githubusercontent.com/79883410/205371675-3d978e97-8169-4916-aa76-bea60319f3dc.png)

