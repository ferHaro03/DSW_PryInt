# API GraphQL de Facturación con Notificaciones

## Descripción General

Este proyecto consiste en el diseño, desarrollo y despliegue de una API basada en GraphQL utilizando una arquitectura modular (MVC). La API se conecta con [FacturAPI](https://www.facturapi.io) para gestionar operaciones de facturación electrónica como manejo de clientes, productos y emisión de facturas. Además, integra servicios externos para:

- Enviar notificaciones por email, SMS y WhatsApp al emitir una factura.
- Generar automáticamente un archivo PDF con los datos de la factura.
- Utilizar la API de OpenAI para redactar un mensaje de resumen personalizado de la compra, el cual se envía al cliente.

## Objetivos Específicos

1. Desarrollar una API GraphQL modular, clara y segura.
2. Conectarse a FacturAPI para emitir facturas con clientes y productos reales.
3. Generar un archivo PDF con los datos de la factura.
4. Enviar el PDF al cliente por correo electrónico, SMS y WhatsApp.
5. Utilizar OpenAI para generar un resumen natural de la compra.
6. Documentar el código y desplegar la API en la nube.
7. Presentar evidencias de pruebas funcionales.

## Tecnologías Utilizadas

- **Backend:** Node.js, Apollo Server, Express.js
- **Base de Datos:** MongoDB / Mongo Atlas
- **Servicios Externos:**
  - FacturAPI
  - OpenAI
  - SendGrid (email)
  - Twilio (SMS y WhatsApp)
- **Generación de PDF:** pdfkit, puppeteer o html-pdf
- **Despliegue:** Railway / Render / Heroku / Vercel
- **Control de Versiones:** Git + GitHub

## Ejecución del Proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ferHaro03/DSW_PryInt.git
   cd tu-repo
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno (`.env`):
   - Claves de API para FacturAPI, OpenAI, SendGrid y Twilio
   - URL de conexión a MongoDB

4. Ejecutar el servidor en desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue en la nube

Este proyecto ha sido desplegado usando . La API puede ser accedida en la siguiente URL:


##  Integrantes del equipo

- **Macedo Calvillo Karina Yamilet**
- **Ramírez López Adileni**
- **Enciso Ramírez Daniel Alexis**
- **Haro Candelario Fernando Saúl**
- **Hernández Castro Kevin Iván**

---
