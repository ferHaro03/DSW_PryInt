
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF de factura con los datos recibidos
 * @param {Object} factura - Datos de la factura
 * @param {String} facturaId - ID o nombre para el archivo
 */

async function generarFacturaPDF(factura, facturaId = 'factura-generada') {
  const filePath = path.join(__dirname, `../../pdfs/${facturaId}.pdf`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Logo
  const logoPath = path.join(__dirname, '../../resources/3B.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, { width: 50, align: 'center' }).moveDown();
  }

  doc.fontSize(18).text('Factura Electrónica', { align: 'center' }).moveDown();

   const emisor = {
    nombre: 'TIENDA CyberDoor',
    rfc: 'XIA190128J61',
    direccion: 'Av. Ejemplo #123, Tepic, Nayarit',
    regimen: '601 - General de Ley Personas Morales'
  };

  // Encabezado

  doc.fontSize(10).text(`Emisor: ${emisor.nombre}`);
  doc.text(`RFC: ${emisor.rfc}`);
  doc.text(`Dirección: ${emisor.direccion}`);
  doc.text(`Régimen Fiscal: ${emisor.regimen}`).moveDown();

  // Datos del cliente
  doc.fontSize(12).text(`Cliente: ${factura.cliente.legal_name || 'undefined'}`);
  doc.text(`Correo: ${factura.cliente.email || 'undefined'}`);
  doc.text(`Teléfono: ${factura.cliente.phone || 'undefined'}`);
  doc.text(`Dirección: ${factura.cliente.address?.street || ''} #${factura.cliente.address?.exterior || ''}, ${factura.cliente.address?.neighborhood || ''}`);
  doc.text(`${factura.cliente.address?.city || ''}, ${factura.cliente.address?.state || ''}, ${factura.cliente.address?.zip || ''}, ${factura.cliente.address?.country || ''}`).moveDown(); 
  doc.text(`Fecha de emisión: ${factura.fecha}`).moveDown();

  // Productos
  doc.text('Productos adquiridos:');
  factura.productos.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.description || 'undefined'} x ${item.quantity || 'undefined'} ($${item.price || 'undefined'})`);
  });

  // Total
  doc.moveDown();
  doc.text(`Total: $${factura.total.toFixed(2)}`).moveDown();

  // Resumen automático
  doc.text('Resumen automático generado por IA:', { underline: true });
  doc.fontSize(10).text(factura.resumen).moveDown();

  // Folio y estado
  if (factura.folio || factura.status) {
    doc.moveDown().fontSize(10);
    doc.text(`Folio interno: ${factura.folio || facturaId}`);
    doc.text(`Estatus SAT: ${factura.status ?? '-'}`);
  }

  doc.end();
  return filePath;
}

module.exports = { generarFacturaPDF };

