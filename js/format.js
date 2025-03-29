

const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");



export function getTextFromTextArea() {
    const text = markdownInput.value;
    /*if (text === "") {
      alert("Debe ingresar un texto para poder generar el MD");
      return; // termine la ejecución luego de mostrar la alert
    }*/
    convertToHtml(text);
  }



  function convertCodeBlocks(html) {
    return html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      lang = lang?.trim() || "plaintext"; // Asegurar que el lenguaje esté bien definido
      return `
        <div class="bg-[#3e345e] border border-[#574a87] rounded-lg overflow-hidden">
          <div class="bg-[#403d61] text-white px-3 py-1 text-sm font-mono">${lang}</div>
          <pre class="bg-[#554a82] p-3 overflow-auto"><code class="language-${lang}">${escapeHTML(code.trim())}</code></pre>
        </div>
      `;
    });
  }
  
  
  // Función para escapar caracteres HTML y evitar errores de renderizado
  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");
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
    //console.log(result);
    return result;
}
  
// Detectar cursiva y negrita
function convertStyleText(html) {
  // Detectar y reemplazar negrita y cursiva combinadas (***texto***) con <strong><em>
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Detectar y reemplazar negrita (**texto**) con <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Detectar y reemplazar cursiva (*texto*) con <em>
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return html;
}



function convertToHtml(text) {
    let html = text;
    // evaluamos titulo
    html = convertHeadings(html);
    
    // evaluamos negrita y cursiva
    html = convertStyleText(html);

    
    //evaluamos code
    html=convertCodeBlocks(html);

    // evaluamos listas
    html = convertLists(html);

    renderPreview(html); // HTML lo muestra en el preview
}

//Renderizamos para que se muestre el codigo
function renderPreview(html) {
    previewSection.innerHTML = html;
}

export function formatHeading(){
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
}


export function toggleTextFormat(startTextSelect, endTextSelect) {
  let tipeStyle = ""; // Inicializamos el tipo de estilo
  //Si el inicio del texto seleccionado es 0 entonces no tiene estilo pq no esta rodeado por asteriscos
  if(startTextSelect>0){
    if (markdownInput.value.substring(startTextSelect-1, startTextSelect) == "*" && markdownInput.value.substring(endTextSelect, endTextSelect+1) =="*") {
      if (startTextSelect>1 && markdownInput.value.substring(startTextSelect-2, startTextSelect-1) == "*" && markdownInput.value.substring(endTextSelect+1, endTextSelect+2) =="*") {
        tipeStyle = "bold"; // Rodeado por dos asteriscos (**texto**)
      } else {
        tipeStyle = "italic"; // Rodeado por un asterisco (*texto*)
      }
    } else {
      tipeStyle = "none"; // Sin formato
    }
  }else{
    tipeStyle = "none"; // Sin formato
  }
  console.log(`Tipo de estilo detectado: ${tipeStyle}`);
  aplicationFormatStyle(tipeStyle,startTextSelect,endTextSelect);
}


function aplicationFormatStyle(typeStyle,startTextSelect,endTextSelect){
  let textSelect=markdownInput.value.substring(startTextSelect, endTextSelect);
  switch (typeStyle){
    case "none":
      markdownInput.value = markdownInput.value.substring(0,startTextSelect)+`**${textSelect}**`+markdownInput.value.substring(endTextSelect);
      startTextSelect=startTextSelect+2;
      endTextSelect=endTextSelect+2;
      break;
    case "italic"://En el caso de italic tiene un asterisco,debo adicionar un asterisco para que sea negrita
      markdownInput.value = markdownInput.value.substring(0,startTextSelect)+`*${textSelect}*`+markdownInput.value.substring(endTextSelect);
      startTextSelect=startTextSelect+1;
      endTextSelect=endTextSelect+1;
      break;
    case "bold": //En el caso de bold tiene dos asteriscos,debo quitar un asterisco osea cortar
      markdownInput.value = markdownInput.value.substring(0,startTextSelect-1)+textSelect+markdownInput.value.substring(endTextSelect+1);
      startTextSelect=startTextSelect-1;
      endTextSelect=endTextSelect-1;
      break;
  }
    markdownInput.setSelectionRange(startTextSelect, endTextSelect);
    markdownInput.focus(); // Asegura que el textarea reciba el foco nuevamente, no quita la seleccion
}

