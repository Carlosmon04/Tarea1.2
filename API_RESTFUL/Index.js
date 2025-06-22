import express from "express"
import Productos from "./Base_Datos/DB.json" with {type:'json'}
import {readFile, writeFile} from "node:fs/promises"

const app=express()

const PORT= process.env.PORT || 3000

app.use(express.json())

app.get("/productos",(req,res)=>{
    
    res.status(201).json(Productos)
})


app.get('/productos/disponibles',(req,res)=>{

    
    const resultado = Productos.filter((t)=>{
        return t.disponible===true

    })

    if(resultado) res.status(201).json(resultado)
        else res.status(404).json({message:"No hay Stock de productos"})

})



app.get('/productos/:id',(req,res)=>{
    const {id} = req.params

    if(!(Number(id))){
        res.status(400).json({message:"ID debe ser numerico"})
    }

    const resultado = Productos.find((i)=>{
        return i.id==Number(id)

    })
    // console.log(resultado)
     if(resultado){
            res.status(201).json(resultado)
        }
        else{
            res.status(404).json({message:"Este id no existe"})
        }


    
})

const leerjson=async ()=>{
    const datos = await readFile('./Base_Datos/DB.json','utf-8')
    return JSON.parse(datos)
}

const RegistrarProducto=async(producto)=>{
    await writeFile('./Base_Datos/DB.json',JSON.stringify(producto,null,2))
}


app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion, disponible } = req.body

    
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ message: 'El campo "nombre" es obligatorio.' })
    }

    if (typeof precio !== 'number' || precio <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo mayor a cero.' })
    }

    if (!descripcion || descripcion.trim().length < 10) {
      return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres.' })
    }

    if (typeof disponible !== 'boolean') {
      return res.status(400).json({ message: 'El campo "disponible" debe ser true o false.' })
    }

    const productos = await leerjson()

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      precio,
      descripcion: descripcion.trim(),
      disponible,
      fecha_ingreso: new Date().toISOString()
    }

    productos.push(nuevoProducto)
    await RegistrarProducto(productos)

    res.status(201).json(nuevoProducto)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

app.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, precio, descripcion, disponible } = req.body

    const productos = await leerjson()
    const index = productos.findIndex(producto => producto.id === Number(id))

    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(400).json({ message: 'El campo "nombre" debe ser un texto válido.' })
    }

    if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
      return res.status(400).json({ message: 'El campo "precio" debe ser un número positivo mayor a cero.' })
    }

    if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim().length < 10)) {
      return res.status(400).json({ message: 'La descripción debe tener al menos 10 caracteres.' })
    }

    if (disponible !== undefined && typeof disponible !== 'boolean') {
      return res.status(400).json({ message: 'El campo "disponible" debe ser true o false.' })
    }

    if (nombre !== undefined) productos[index].nombre = nombre.trim()
    if (precio !== undefined) productos[index].precio = precio
    if (descripcion !== undefined) productos[index].descripcion = descripcion.trim()
    if (disponible !== undefined) productos[index].disponible = disponible

    await RegistrarProducto(productos)

    res.json(productos[index])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params

    const productos = await leerjson()
    
    const index = productos.findIndex(producto => producto.id === Number(id))

    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const productoEliminado = productos.splice(index, 1)[0]

    await RegistrarProducto(productos)

    res.json({
      message: 'Producto eliminado correctamente',
      producto: productoEliminado
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el producto' })
  }
})

app.use((req, res) => {
  res.status(404).json({
    message: 'Hubo un Error en la URL'
  })
})

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})



