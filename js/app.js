/**
 * Variables para obtener elementos HTML
 */
const generateHtml = document.querySelector("#generate-html");
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const toggleContrastButton = document.getElementById("toggle-contrast");


function getTextFromTextArea() {
  const text = markdownInput.value;
  return text;
}

// Detectar Heading
function convertHeadings(html) {
  html = html.replace(
    /^# (.+)$/gm,
    "<h1 class='text-6xl font-bold border-b'>$1</h1>"
  );
  // ## titulo -> <h2>titulo</h2>
  html = html.replace(
    /^## (.+)$/gm,
    "<h2 class='text-5xl font-bold border-b'>$1</h2>"
  );
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-4xl font-bold'>$1</h3>");
  html = html.replace(
    /^#### (.+)$/gm,
    "<h4 class='text-3xl font-bold'>$1</h4>"
  );
  html = html.replace(
    /^##### (.+)$/gm,
    "<h5 class='text-2xl font-bold'>$1</h5>"
  );
  html = html.replace(
    /^###### (.+)$/gm,
    "<h6 class='text-xl font-bold'>$1</h6>"
  );

  return html;
}


function convertLists(html) {
  const lines = html.split("\n");
  let result = "";
  let stack = [];

  lines.forEach((line) => {
    let unorderedMatch = line.match(/^(\s*)([-*+] )(.+)$/);
    let orderedMatch = line.match(/^(\s*)(\d+\.\s)(.+)$/);

    if (unorderedMatch || orderedMatch) {
      let indent = unorderedMatch ? unorderedMatch[1].length : orderedMatch[1].length;
      let type = unorderedMatch ? "ul" : "ol";
      let className = type === "ul" ? "list-disc ms-4" : "list-decimal ms-4"; 
      let content = unorderedMatch ? unorderedMatch[3] : orderedMatch[3];

      // Cerrar listas de niveles superiores antes de continuar
      while (stack.length > 0 && stack[stack.length - 1].indent > indent) {
        result += `</li></${stack.pop().type}>`;
      }

      // Si no hay lista en el nivel actual, abrir una nueva
      if (stack.length === 0 || stack[stack.length - 1].type !== type) {
        result += `<${type} class="${className}">`;
        stack.push({ type, indent });
      } else if (stack.length > 0 && stack[stack.length - 1].indent < indent) {
        result += `<${type} class="${className}">`;
        stack.push({ type, indent });
      }

      // Agregar el contenido del elemento de lista
      result += `<li>${content}</li>`;
    } else {
      // Cerrar todas las listas si la línea está vacía o no es una lista
      while (stack.length > 0) {
        result += `</${stack.pop().type}>`;
      }
      result += line;
    }
  });

  // Cerrar cualquier lista restante
  while (stack.length > 0) {
    result += `</${stack.pop().type}>`;
  }
  console.log(result);
  return result;
}


function convertToHtml(text) {
  let html = text;
  // evaluamos titulo
  html = convertHeadings(html);
  // evaluamos listas
  html = convertLists(html);
  
  return html;
}

function renderPreview(html) {
  previewSection.innerHTML = html;
}

// TODO: Cuando hagamos click en el boton generateHtml, tenemos que obtener el texto del textarea y trasnformalo a HTML y eso mostrarlo el preview
generateHtml.addEventListener("click", function () {
  // para obtener el texto de un input usamos el .value
  const text = getTextFromTextArea(); // Obtiene el value del textarea
  const html = convertToHtml(text); // convierte el value a un HTML
  console.log(html);
  renderPreview(html); // HTML lo muestra en el preview
});


/*
markdownInput.addEventListener("input", function () {
  const text = getTextFromTextArea();
  const html = convertToHtml(text);
  renderPreview(html);
});*/


document.getElementById("markdown-input").addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault(); // Evita que el foco salte a otro elemento
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const spaces = "  "; // Puedes cambiarlo por "\t" si prefieres un tab real

    // Insertar los espacios en la posición del cursor
    this.value = this.value.substring(0, start) + spaces + this.value.substring(end);

    // Mover el cursor después de los espacios insertados
    this.selectionStart = this.selectionEnd = start + spaces.length;
  }
});

// Manejo del evento "click" para alternar el contraste
toggleContrastButton.addEventListener("click", () => {
  // Seleccionamos todos los encabezados dentro de la vista previa
  const headers = document.querySelectorAll("#preview-section h1, #preview-section h2, #preview-section h3, #preview-section h4, #preview-section h5, #preview-section h6");

  // Recorremos cada encabezado y alternamos los estilos en línea
  headers.forEach((header) => {
    if (header.style.color === "rgb(110, 242, 208)") {
      // Volver al estilo original
      header.style.color = "";
      header.style.fontSize = "";
      header.style.textTransform = "";
    } else {
      // Aplicar estilo contrastado
      header.style.color = "#6ef2d0";
      header.style.fontSize = "2rem"; // Aumentar tamaño del texto
      header.style.textTransform = "uppercase"; // Todo en mayúsculas
    }
  });
});