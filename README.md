# Delila_Resto

# Instalación:
Para poder utilizar esta API Rest primero se deben instalar los paquetes de Node. Para esto debemos utilizar el comando `npm install` en la carpeta del projecto.

Una vez que se terminan de instalar las dependencias de Node se debe levantar el projecto. Para esto podemos utilizar el comando nodemon seguido del archivo que inicia el projecto, `nodemon server.js`.

Opcionalmente se puede importar el archivo `delila_resto.sql` para tener una base de datos ya precargada con algunos usuarios, productos y ordenes.

# Endpoints:

## De Usuarios
### 1.POST=>/usuarios
- **Descripcion:** Crea un nuevo Usuario.
- **Ejemplo de url:** www.localhost:3000/usuarios
- **Datos Requeridos:**
En el body se debe enviar **'nombre'**, **'apellido'**, **'email'**, **'celular'**, **'direccion'**, **'contrasenia'**.

- **Ejemplo de body:** 
```
{
	"nombre":"Geralt",
	"apellido":"De Rivia",
	"email":"i_hate_portals@gmail.com",
	"celular": "1111111111",
	"direccion":"Novigrad 1566",
	"contrasenia":"sardinilla"
}
```

### 2.PUT=>/usuarios
- **Descripcion:** Actualiza uno o todos los campos de un Usuario.
- **Ejemplo de url:** www.localhost:3000/usuarios
- **Datos Requeridos:**
En el body se debe enviar los datos que se quieran actualizar.
Se debe enviar un **'token'** en el body.

- **Ejemplo de body:** 
```
{
"nombre": "Cirilla",
"apellido": "Fiona Elen Riannon",
"email": "ciri@gmail.com",
"celular": "1111111111",
"token": "TuTokenValidoAca"
}
```

### 3.DELETE=>/usuarios
- **Descripcion:** Elimina un Usuario.
- **Ejemplo de url:** www.localhost:3000/usuarios
- **Datos Requeridos:**
En la url se debe incluir el id del usuario que se quiere eliminar.
Se debe enviar un **'token'** en el body.

### 4.GET=>/usuarios
- **Descripcion:** Devuelve una lista de todos los Usuarios.
- **Ejemplo de url:** www.localhost:3000/usuarios
- **Datos Requeridos:**
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

### 5.POST=>/login
- **Descripcion:** Recibe las credenciales del usuario y en caso de que sean validas loguea al usuario, devolviendo un token valido.
- **Ejemplo de url:** www.localhost:3000/usuarios/login
- **Datos Requeridos:**
Se deben enviar las creedenciales del usuario en el body, siendo estas **email** y **contraseña**.

- **Ejemplo de body:** 
```
{
	"email":"i_hate_portals@gmail.com",
	"contrasenia": "sardinilla"
}
```

## De Productos
### 1.POST=>/productos
- **Descripcion:** Crea un nuevo producto.
- **Ejemplo de url:** www.localhost:3000/productos
- **Datos Requeridos:**
En el body se debe enviar **'titulo'** y **'precio'**.
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

- **Ejemplo de body:** 
```
{
	"titulo":"Pizza",
	"precio":"480",
	"token": "TuTokenValidoAca"
}
```

### 2.PUT=>/productos/{id_producto}
- **Descripcion:** Actualiza uno o todos los campos de un producto.
- **Ejemplo de url:** www.localhost:3000/productos/24
- **Datos Requeridos:**
En el body se debe enviar los datos que se quieran actualizar siendo **'titulo'** y/u **'precio'**.
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

- **Ejemplo de body:** 
```
{
	"titulo":"Cangreburger",
	"precio":"180",
	"token": "TuTokenValidoAca"
}
```

### 3.DELETE=>/productos/{id_producto}
- **Descripcion:** Elimina un producto.
- **Ejemplo de url:** www.localhost:3000/productos/12
- **Datos Requeridos:**
En la url se debe incluir el id del producto que se quiere eliminar.
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.
### 4.GET=>/productos
- **Descripcion:** Devuelve una lista de todos los productos.
- **Ejemplo de url:** www.localhost:3000/productos
- **Datos Requeridos:**
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

## De Ordenes
### 1.POST=>/orden
- **Descripcion:** Crea una nueva orden.
- **Ejemplo de url:** www.localhost:3000/orden
- **Datos Requeridos:**
En el body se deben enviar los campos de **precio_total**, **metodo_pago** (Efectivo o Tarjeta), un **arreglo de productos** y un **token valido**.

El arreglo de productos contiene una lista de objetos donde cada objeto tiene **dos propiedades**, una llamada **producto** y otra llamada **cantidad**.

###  -La propiedad **producto** 
Es un objeto que contiene las propiedas del producto pedido siendo estas las mismas a la entidad de la tabla **Productos**. Por lo tanto este objeto contiene el **id_producto**, **titulo**, **precio** y **activo**.

> *__Atencion__: Se recomienda que para conformar correctamente esta propiedad se realice un [GET al endpoint de /productos](#4.GET=>/productos) para poder obtener estos datos y asi armar la propiedad correctamente.*



###  -La propiedad **Cantidad**
Es un numero que representa la cantidad del producto que se pidio.

- **Ejemplo de body:** 
```
{
    "precio_total": 1180,
    "metodo_pago": "Efectivo",
    "productos": [
        {
			"producto": {
            "id_producto": 2,
            "titulo": "Cangreburger",
            "precio": 1000,
			"activo": true
        }, 
		"cantidad": 2},
		{
			"producto": {
            "id_producto": 4,
            "titulo": "Champiñones",
            "precio": 180,
			"activo": true
        	}, 
		"cantidad": 3}
		],
    "token": "TuTokenValidoAca"
	}
```

### 2.PUT=>/orden/actualizarEstado/{id_orden}
- **Descripcion:** Actualiza la orden al siguiente estado. 
- **Ejemplo de url:** www.localhost:3000/orden/actualizarEstado/63
- **Datos Requeridos:**
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

- **Ejemplo de body:** 
```
{
	"token": "TuTokenValidoAca"
}
```

### 3.DELETE=>/orden/{id_orden}
- **Descripcion:** Elimina una orden.
- **Ejemplo de url:** www.localhost:3000/orden/59
- **Datos Requeridos:**
En la url se debe incluir el id del producto que se quiere eliminar.
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.
### 4.GET=>/orden
- **Descripcion:** Devuelve una lista de todos las ordenes.
- **Ejemplo de url:** www.localhost:3000/orden
- **Datos Requeridos:**
Se debe enviar un **'token'** en el body.
- **Validacion:**
Este endpoint es solo valido para **administradores**.

# Autenticación
Para poder utilizar la gran mayoria de los endpoints se necesita un Token. Para poder conseguir uno se debe utilizar el [endpoint de login](#5.POST=>/login). Si las credenciales corresponden a un usuario existente y son correctas se devolvera un token.

# Autorización
En caso de que el usuario que fue logueado sea un administrador el token le permitira acceder a recursos que un usuario sin un rol de administrador puede acceder.

Caso contrario si un usuario quiere acceder a un recurso que no tiene permiso se le negara el acceso.

# Entidades, Tablas y Relaciones
La base de datos esta conformada por cuatro tablas.

### Usuarios
Contiene toda la información que representa al usuario en el sistema.

### Productos
Contiene un listado de todos los productos disponibles o no en el sistema. Con su descripcion, precio y si se encuentra disponible.

### Ordenes
Contiene un listado de todas las ordenes en el sistema, las que estan en proceso o las ya finalizadas.

### ProductosOrdenes
Esta es una tabla intermedia entre productos y ordenes. Sirve para poder manejar la cantidad de un producto en una orden. Para hacer esto utiliza el id_producto y el id_orden, mas un campo de cantidad.
