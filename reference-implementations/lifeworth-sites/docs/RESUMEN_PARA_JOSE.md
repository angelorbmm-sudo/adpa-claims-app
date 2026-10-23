# José: entrega actualizada de LifeWorth

Esta carpeta contiene el módulo de referencia de la versión privada 124 (23 de octubre de 2026), con el panel analítico, tareas de documentación, organizador de compras y reparto de pertenencias. El código todavía no está integrado en la aplicación principal React/Vite/Express/PostgreSQL de este repositorio.

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
5. Ejecutar `npm install` y `npm test` dentro de esta carpeta: **35 pruebas del módulo aprobadas**. La aplicación privada completa pasó **772 pruebas**, TypeScript y compilación de producción.
6. Verificar integración, privacidad y uso móvil en staging antes de desplegar la aplicación destino. La verificación visual en navegador sigue pendiente.

HomeBack comparte tecnología para HB1 y HB2; ADPA mantiene su negocio, representación y permisos separados. Good/Better/Best describen circunstancias de precio, no niveles de calidad del producto.

No hay datos de clientes, pruebas originales, bases de datos, credenciales ni secretos en esta entrega. Las imágenes conceptuales no están incluidas. Esta PR actualiza la entrega técnica; no despliega la aplicación de José.
