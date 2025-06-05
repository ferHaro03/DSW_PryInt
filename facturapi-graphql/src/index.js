// Importa la función que inicializa y configura el servidor Apollo (GraphQL + Express)
const startServer = require("../server");
// Importa y ejecuta la configuración de conexión a la base de datos
//  Esta línea es fundamental: se asegura de que MongoDB esté conectado antes de iniciar el servidor
require("./config/db");
// Establece el puerto del servidor, tomando el valor de la variable de entorno o el puerto 4000 por defecto
const PORT = process.env.PORT || 4000;

// Inicia el servidor y lo pone a escuchar en el puerto definido
startServer().then(app => {
  app.listen(PORT, () => {
    console.log(` Servidor GraphQL listo en http://localhost:${PORT}/graphql`);
  });
}).catch(err => {
  // Captura cualquier error que ocurra durante la inicialización del servidor
  console.error(" Error al iniciar el servidor:", err);
});