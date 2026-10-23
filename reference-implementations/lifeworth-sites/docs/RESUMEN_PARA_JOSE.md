# José: entrega actualizada de LifeWorth

Esta carpeta contiene el módulo de referencia de la versión privada 125 (23 de octubre de 2026), con el panel analítico, tareas de documentación, organizador de compras, reparto de pertenencias y carga/lectura de recibos. El código todavía no está integrado en la aplicación principal React/Vite/Express/PostgreSQL de este repositorio.

## Cambios nuevos

- Tareas: priorización de documentación pendiente, responsable indicado por el propietario, estados y notas de revisión.
- Compras: recibos, fecha de compra, plazos de devolución confirmados con su fuente, garantías, enlace al manual, búsqueda y filtros por fechas próximas. No envía recordatorios automáticos.
- Reparto: planes con dos participantes, selección de pertenencias, distribución de cantidades y valores propuestos separados del valor de reposición. Cada respuesta se registra por separado con fecha y referencia. Los cambios invalidan respuestas actuales y conservan el historial.

Las respuestas del reparto son registradas por el propietario que inició sesión. No representan autenticación independiente, firma electrónica ni transferencia legal de propiedad. No se comparte información ni se envían invitaciones automáticamente.

## Qué hacer

1. Leer README.md y docs/INTEGRATION_CHECKLIST.md.
2. Portar juntos lib/lifeworth.ts y lib/lifeworth-division.ts.
3. Adaptar autenticación del servidor, rutas y persistencia PostgreSQL; mantener aislamiento por propietario, validación del origen y control de versiones.
4. Adaptar todos los componentes de app/lifeworth y sus estilos.
5. Ejecutar `npm install` y `npm test` dentro de esta carpeta: **43 pruebas del módulo aprobadas**. La aplicación privada completa pasó **780 pruebas**, TypeScript y compilación de producción.
6. Verificar integración, privacidad y uso móvil en staging antes de desplegar la aplicación destino. La verificación visual en navegador sigue pendiente.

HomeBack comparte tecnología para HB1 y HB2; ADPA mantiene su negocio, representación y permisos separados. Good/Better/Best describen circunstancias de precio, no niveles de calidad del producto.

No hay datos de clientes, pruebas originales, bases de datos, credenciales ni secretos en esta entrega. Las imágenes conceptuales no están incluidas. Esta PR actualiza la entrega técnica; no despliega la aplicación de José.

## Nuevo: carga y lectura de recibos

Leer `docs/RECEIPT_SCANNING_FOR_JOSE.md` para los contratos de API, almacenamiento y compilación. El propietario sube un PDF/JPEG/PNG/WebP (máximo 8 MB); el original queda privado con hash SHA-256. La lectura usa OCR inglés en el navegador y PDF.js para PDF de texto o páginas escaneadas (máximo tres páginas por lectura). No utiliza una clave ni un servicio externo de IA.

Las propuestas de productos, cantidades y precios son borradores y necesitan revisión humana. El usuario corrige datos, vincula inventario existente o crea artículos nuevos, confirma USD y registra notas de conciliación. Solo entonces se guardan todas las líneas seleccionadas en una actualización atómica. Los artículos nuevos empiezan sin precio de reposición y pendientes de revisión; el inventario existente no cambia. Hay avisos de compras posiblemente duplicadas y protección contra doble confirmación.

Dependencias exactas: Tesseract.js 7.0.0, datos ingleses 1.0.0 y PDF.js 6.4.299. Ejecutar `npm run prepare:scanner` y servir los archivos generados en `/receipt-scanner/` desde el mismo origen. Incorporar ese paso en dev y build de la aplicación destino. `npm run test:engines` prueba OCR de foto, extracción de PDF de texto y OCR de un PDF escaneado con documentos sintéticos. No subir node_modules ni recursos generados al repositorio.

La revisión visual y las pruebas móviles siguen pendientes. La aplicación privada está desplegada; esta carpeta sigue siendo una implementación de referencia, no integración automática en tu aplicación.
