const { generarResumen } = require('./src/services/vertexService');

const cliente = {
  legal_name: "Cliente de Prueba"
};

const items = [
  { description: "Laptop", price: 15000, quantity: 1 },
  { description: "Mouse", price: 300, quantity: 2 }
];

generarResumen(cliente, items)
  .then(resumen => {
    console.log("🧾 Resumen Final:\n", resumen);
  })
  .catch(err => {
    console.error("❌ Error general:", err);
  });