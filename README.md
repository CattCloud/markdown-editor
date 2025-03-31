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


