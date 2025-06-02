
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF de factura con los datos recibidos
 * @param {Object} factura - Datos de la factura
 * @param {String} facturaId - ID o nombre para el archivo
 */
function generarFacturaPDF(factura, facturaId = 'factura-generada') {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../../pdfs/${facturaId}.pdf`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.pipe(fs.createWriteStream(filePath));

  // Cargar el logo (debe existir en la raíz del proyecto o en la ruta dada)
  const logoPath = path.join(__dirname, '../../resources/3B.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, { width: 50, align: 'center' }).moveDown();
  }

  doc.fontSize(18).text('Factura Electrónica', { align: 'center' }).moveDown();

  // Datos del emisor (estáticos)
  const emisor = {
    nombre: 'TIENDA REACHERDANIEL',
    rfc: 'XIA190128J61',
    direccion: 'Av. Ejemplo #123, Tepic, Nayarit',
    regimen: '601 - General de Ley Personas Morales'
  };

  doc.fontSize(10).text(`Emisor: ${emisor.nombre}`);
  doc.text(`RFC: ${emisor.rfc}`);
  doc.text(`Dirección: ${emisor.direccion}`);
  doc.text(`Régimen Fiscal: ${emisor.regimen}`).moveDown();

  // Datos del receptor
  doc.fontSize(12).text(`Cliente: ${factura.cliente.legal_name}`);
  doc.text(`Correo: ${factura.cliente.email}`);
  doc.text(`Fecha de emisión: ${factura.fecha}`).moveDown();

  // Productos
  doc.text('Productos adquiridos:');
  factura.productos.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.quantity} x ${item.description} ($${item.price})`);
  });

  doc.moveDown();
  doc.text(`Total: $${factura.total.toFixed(2)}`, { bold: true }).moveDown();

  // Resumen generado
  doc.text('Resumen automático generado por IA:', { underline: true });
  doc.fontSize(10).text(factura.resumen).moveDown();

  // Otros datos (si existen)
    if (factura.folio_number || factura.status) {
    doc.moveDown().fontSize(10);
    doc.text(`Folio interno: ${factura.folio || facturaId}`);
    doc.text(`Estatus SAT: ${factura.status ?? '-'}`);
    }

  doc.end();

  console.log(`✅ PDF generado: ${filePath}`);
  return filePath;
}

module.exports = { generarFacturaPDF };
