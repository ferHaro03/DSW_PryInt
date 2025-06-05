// Importa la librería PDFKit para generar archivos PDF
const PDFDocument = require('pdfkit');
// Módulo del sistema de archivos
const fs = require('fs');
// Módulo para construir rutas compatibles con el sistema operativo
const path = require('path');

/**
 * Genera un archivo PDF con los datos de una factura.
 * @param {Object} factura - Objeto que contiene datos de cliente, productos, total, resumen, etc.
 * @param {String} facturaId - ID único que se usará como nombre del archivo PDF.
 * @returns {Promise<String>} - Ruta absoluta al archivo PDF generado.
 */

async function generarFacturaPDF(factura, facturaId = 'factura-generada') {
  // Ruta donde se guardará el PDF
  const filePath = path.join(__dirname, `../../pdfs/${facturaId}.pdf`);
  // Asegura que el directorio exista (lo crea si no existe)
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Crea un nuevo documento PDF y un flujo de escritura
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Agrega un logo si existe
  const logoPath = path.join(__dirname, '../../resources/3B.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, { width: 50, align: 'center' }).moveDown();
  }

  // Título principal
  doc.fontSize(18).text('Factura Electrónica', { align: 'center' }).moveDown();
  // Información fija del emisor
  const emisor = {
    nombre: 'TIENDA REACHERDANIEL',
    rfc: 'XIA190128J61',
    direccion: 'Av. Ejemplo #123, Tepic, Nayarit',
    regimen: '601 - General de Ley Personas Morales'
  };
  // Datos del emisor
  doc.fontSize(10).text(`Emisor: ${emisor.nombre}`);
  doc.text(`RFC: ${emisor.rfc}`);
  doc.text(`Dirección: ${emisor.direccion}`);
  doc.text(`Régimen Fiscal: ${emisor.regimen}`).moveDown();

  // Información del cliente
  doc.fontSize(12).text(`Cliente: ${factura.cliente.legal_name}`);
  doc.text(`Correo: ${factura.cliente.email}`);
  doc.text(`Fecha de emisión: ${factura.fecha}`).moveDown();

  // Lista de productos adquiridos
  doc.text('Productos adquiridos:');
  factura.productos.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.quantity} x ${item.description} ($${item.price})`);
  });

  // Total de la factura
  doc.moveDown();
  doc.text(`Total: $${factura.total.toFixed(2)}`).moveDown();
  // Resumen generado automáticamente por IA
  doc.text('Resumen automático generado por IA:', { underline: true });
  doc.fontSize(10).text(factura.resumen).moveDown();
  // Información adicional: folio y estatus de la factura
  if (factura.folio_number || factura.status) {
    doc.moveDown().fontSize(10);
    doc.text(`Folio interno: ${factura.folio || facturaId}`);
    doc.text(`Estatus SAT: ${factura.status ?? '-'}`);
  }

  // Finaliza el documento PDF
  doc.end();

  // Retorna una promesa que se resuelve cuando se termina de escribir el archivo
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`PDF finalizado y guardado: ${filePath}`);
      resolve(filePath);
    });
    stream.on('error', reject);
  });
}

// Exporta la función para usarla en otras partes del sistema
module.exports = { generarFacturaPDF };