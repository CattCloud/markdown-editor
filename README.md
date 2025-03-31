# Proyecto Editor Markdown
---

## 📌 HU1: Carga de Archivo Local con FileReader

### Descripción
Se implementó una función para leer archivos de texto en formato Markdown (`.md`) utilizando la API `FileReader` y promesas. La lectura es asíncrona para garantizar una mejor experiencia de usuario.

### Uso de Promesas
- La función `readFileAsync(file)` devuelve una promesa que se resuelve con el contenido del archivo o se rechaza en caso de error.
- Se usa `async/await` en el evento del botón de aceptación para manejar la carga del archivo de manera clara y estructurada.
- Se implementa un **spinner de carga** para indicar que la operación está en progreso.
- **Manejo de errores** con `try/catch` para capturar problemas en la lectura del archivo y notificar al usuario.

### Mensajes en la UI
- **Cargando...**: Se muestra un spinner mientras se procesa el archivo.
- **Error**: Se notifica si el archivo no es válido o hay un problema de lectura.



---

## 📌 HU2: Transformación con Manejo de Excepciones

### Descripción
Se mejoró la conversión de Markdown a HTML con una estrategia de manejo de excepciones, evitando que un error en una parte del proceso afecte a toda la transformación.

### Uso de Try/Catch
- Se encapsuló cada función de conversión (`convertHeadings`, `convertStyleText`, etc.) en `try/catch` dentro de `safeConvert()`, lo que previene bloqueos en la aplicación.
- Se usa `showNotification()` para mostrar avisos de error sin interrumpir la ejecución.
- Se gestiona un `try/catch` global en `convertToHtml()` para capturar errores inesperados y garantizar la estabilidad.

### Mensajes en la UI
- **Transformación Exitosa**: Se informa al usuario si todo salió bien.
- **Advertencias**: Si alguna conversión falla, se notifica sin detener el resto.
- **Error General**: Se captura cualquier error crítico en la transformación.


---

## 📌 HU3: Exportar el Documento a PDF

### Descripción
Se implementó la exportación del documento a PDF de forma asíncrona usando `html2pdf()`. La funcionalidad incluye una interfaz que permite ingresar el nombre del archivo antes de exportarlo.

### Uso de Promesas
- Se encapsuló la exportación en una promesa para simular un proceso asíncrono con un `setTimeout()`.
- Se usa un **spinner de carga** para indicar que la exportación está en progreso.
- Se maneja el éxito y el error con `.then()` y `.catch()` para asegurar que el usuario reciba retroalimentación clara.
- **Validación del nombre del archivo**: Si el input está vacío, se asigna un nombre por defecto.

### Mensajes en la UI
- **Cargando...**: Se muestra un spinner mientras se genera el PDF.
- **Éxito**: Se descarga el archivo automáticamente.
- **Error**: Se muestra un mensaje si la exportación falla.


---
## 📝 Historias de Usuario Implementadas

### HU: Botón de Alternancia de Vista entre Editor y Previsualización
**Como usuario, quiero alternar entre la vista de edición y previsualización para mejorar mi experiencia de uso.**

#### ✅ Criterios de Aceptación:
- En escritorio: alternar entre editor expandido y vista dividida (50-50).
- En móvil: mostrar solo el editor o solo la previsualización según el estado actual.
- Cambio de estado con cada clic.
- Persistencia del estado en cambios de tamaño de ventana.

#### 🔹 Implementación
Se manejó la alternancia con clases CSS y `window.innerWidth` para detectar si el usuario está en móvil o escritorio.

---

### HU: Botón de Heading, Bold e Italic
**Como usuario, quiero un botón que me permita insertar encabezados (H2, H3), negrita y cursiva,** para mejorar la velocidad de escritura de código Markdown.

#### Criterios de Aceptación:
- Un botón permite insertar headings sin escribir manualmente `##` o `###`.
- Botones adicionales permiten aplicar formato de **negrita** y *cursiva* sobre un texto seleccionado.
- Si un texto ya tiene formato, al presionar el botón correspondiente, el formato se elimina (efecto toggle).
- El cursor debe ubicarse correctamente después de insertar el formato.

---

## Decisiones Técnicas Clave

- **Promesas y `async/await`**: Se usaron para manejar procesos asíncronos sin bloquear la aplicación.
  
- **Manejo de excepciones**: Se usaron `try/catch` y `.catch()` en promesas para evitar que errores detengan la app.
  
- **Adaptabilidad (Responsividad)**: Se usaron clases de Tailwind CSS para garantizar una UI adaptable en escritorio y móvil.
  
- **Estructura Modular**: Se separaron las funciones en módulos reutilizables para mejorar mantenibilidad.

- **Uso de `dataset` para asignar tags a los botones de heading.** Se asignaron atributos `data-tag` a cada opción para facilitar la detección del tipo de encabezado seleccionado sin necesidad de condicionales extensos.

- **Detección y manipulación de la selección del usuario.** Se usaron `setSelectionRange` y `focus()` para preservar la selección del usuario y mejorar la experiencia de edición.

- **Lógica de detección de formato Markdown.** Se implementó una función para analizar si un texto seleccionado ya contiene formato y actuar en consecuencia (por ejemplo, eliminar los asteriscos si ya está en negrita en lugar de añadir más).

- **Compatibilidad con dispositivos móviles.** Se aseguró que el botón de alternancia de vista responda adecuadamente según el tamaño de la pantalla, utilizando `window.innerWidth` y `resize` para ajustes dinámicos.




