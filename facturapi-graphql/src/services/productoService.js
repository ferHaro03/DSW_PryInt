// src/services/productoService.js
const Producto = require('../models/Producto');
const axios = require('axios');

async function crearProducto(productoInput) {
  const { data } = await axios.post(
    'https://www.facturapi.io/v2/products',
    productoInput,
    {
      headers: {
        Authorization: `Bearer ${process.env.FACTURAPI_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const nuevoProducto = new Producto({
    ...productoInput,
    facturapi_id: data.id,
  });

  await nuevoProducto.save();
  return nuevoProducto;
}

module.exports = { crearProducto };
