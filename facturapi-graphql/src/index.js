const startServer = require("../server");
require("./config/db"); // <-- esto debe estar presente
const PORT = process.env.PORT || 4000;

startServer().then(app => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL listo en http://localhost:${PORT}/graphql`);
  });
}).catch(err => {
  console.error("❌ Error al iniciar el servidor:", err);
});