# Tarea1.2

Una vez clonado el repositrio, abrir una terminal integrada desde el folder API_RESTFUL, o desde el CMD con dicha RUTA, y usar commando "npm install" para instalar todas las dependencias y este funcione, luego, abrir la misma Ruta de API_RESTFUL con GitBash y usar el comando "npm run dev" para correr el programa y levantar el servidor 

Rutas Principales :
 GET /productos
 : Retorna un listado con todos los productos.
 
 GET /productos/:id
 : Retorna la información del producto con el ID especificado
 
  GET /productos/disponibles
 : Devuelve únicamente los productos que están marcados
 como disponibles (
 disponible: true
 ).

  POST /productos
 : Permite agregar un nuevo producto.
 
 PUT /productos/:id
 : Permite modificar los datos de un producto existente.
 
 DELETE /productos/:id
 : Elimina un producto con base en su ID.

 PUT y POST tienen ciertas validaciones Como los Nombres no pueden ser vacios, Disponible debe ser booleano, Descripcion debe contener mas de 10 caracteres, precio debe ser positivo mayor a 0, etc. Todas las solicitadas, ademas PUT actualiza varios valores, y no hace falta colocar todos los campos, solamente los que vamos actualizar.

Yo utilice ThunderClient para verificar las peticiones, y la "Base de Datos" es DB.json
