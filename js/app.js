import { getTextFromTextArea,formatHeading,detectTextFormat} from './format.js';
import { getSelectedText } from './block.js';
import {exportToPDF,readFileAsync} from './file.js';

/**
 * Variables para obtener elementos HTML
 */
//const generateHtml = document.querySelector("#generate-html");
const toggleContrastButton = document.getElementById("toggle-contrast");
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const wordCount=document.getElementById("word-count");
const charCount=document.getElementById("char-count");
//const toggleStyleTextButton=document.getElementById("toggle-styleText");
const cleanButton=document.getElementById("btn-clean");
const newFileButton=document.getElementById("btn-new-file");
const exportPdfButton=document.getElementById("btn-exportar-pdf");

const boldTextButton=document.getElementById("btn-boldtext");
const italicTextButton=document.getElementById("btn-italictext");
//const modeDarkLightButton=document.getElementById("btn-mode");
const pdfFilenameInput = document.getElementById("pdfFilename");
const headingButton = document.getElementById("dropdown-btn");
const headingOptionMenu = document.querySelectorAll("#dropdown-menu button");


//Elementos del modal
const fileModal = document.getElementById("fileModal");
const fileInput = document.getElementById("fileInput");
const acceptButton = document.getElementById("acceptButton");
const cancelButton = document.getElementById("cancelButton");
const loadingSpinner = document.getElementById("loadingSpinner");


let textSelect="";
let startTextSelect,endTextSelect=0;
let cursorPosition = null; // Variable para almacenar la posición del cursor


// Evento al presionar el botón Heading: Insercion de Heading al codigo
headingOptionMenu.forEach(button => {
  button.addEventListener("click", (event) => {
    let headingSelect = event.target.dataset.tag.toUpperCase();
    console.log("Seleccionó: " + headingSelect);
    insertCodeMarkdown(headingSelect);
    getTextFromTextArea();
    document.getElementById("dropdown-menu").classList.add("hidden");
  });
});  

// Evento para mostrar/ocultar el menú
headingButton.addEventListener("click", () => {
  document.getElementById("dropdown-menu").classList.toggle("hidden");
});


function resetValores(){
  textSelect = "";
  startTextSelect = 0;
  endTextSelect = 0;
}

//Manejador de eventos cuando realizas una seleccion dentro del TextArea
markdownInput.addEventListener("select", function (event) {
  textSelect = getSelectedText(event);
  if(textSelect){
    //startTextSelect = event.target.selectionStart;
    //Posicion inicial del texto seleccionado
    textSelect.startsWith(" ")?startTextSelect=event.target.selectionStart+1:startTextSelect=event.target.selectionStart;
    //Posicion final del texto seleccionado
    textSelect.endsWith(" ")?endTextSelect=event.target.selectionEnd-1:endTextSelect=event.target.selectionEnd;
    //console.log(textSelect+": "+startTextSelect+"-"+endTextSelect);
  }
});


// Función para actualizar el atributo `fill` según el tema activo
function actualizarColorFill() {
  // Detectar si el modo oscuro está activo en <html>
  const isDarkMode = document.documentElement.classList.contains("dark");
  console.log("Modo oscuro activado: " + isDarkMode);

  // Seleccionar todos los botones con la clase `icon-markdown`
  const botones = document.querySelectorAll(".icon-markdown");

  // Iterar sobre los botones y cambiar el atributo `fill` de los SVG
  botones.forEach((boton) => {
    const svg = boton.querySelector("svg"); // Seleccionar el SVG dentro del botón
    if (svg) {
      svg.setAttribute("fill", isDarkMode ?"#6df2d2": "#574a87" );
    }
  });
}

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", function () {
  const modeDarkLightButton = document.getElementById("btn-mode");

  // Establecer el texto inicial correcto del botón
  if (document.documentElement.classList.contains("dark")) {
    modeDarkLightButton.textContent = "LIGHT";
  } else {
    modeDarkLightButton.textContent = "DARK";
  }

  // Alternar el modo oscuro al hacer clic en el botón
  modeDarkLightButton.addEventListener("click", () => {
    const html = document.documentElement;
    html.classList.toggle("dark"); // Alternar la clase `dark`
    actualizarColorFill(); // Actualizar los SVG
    if (html.classList.contains("dark")) {
      modeDarkLightButton.textContent = "LIGHT";
    } else {
      modeDarkLightButton.textContent = "DARK";
    }
  });
});

// Actualizar los colores al cargar la página
actualizarColorFill();

//Manejo del TAB dentro del TextArea
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


 // Abrir modal al hacer clic en "New File"
  newFileButton.addEventListener("click",function(event){
      fileModal.classList.remove("hidden");
  });


// Cerrar modal al hacer clic en "Cancelar"
  cancelButton.addEventListener("click", () => {
     fileModal.classList.add("hidden");
     fileInput.value = ""; // Limpia el input
  });


 // Leer archivo al hacer clic en "Aceptar"
 acceptButton.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, seleccione un archivo .md");
    return;
  }

  loadingSpinner.classList.remove("hidden"); // Mostrar spinner

  try {
    const content = await readFileAsync(file);
    markdownInput.value = content; // Cargar en el editor
    fileModal.classList.add("hidden"); // Cerrar modal
    fileInput.value = ""; // Limpiar input
    getTextFromTextArea();
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    alert("Error al cargar el archivo. Asegúrate de que es un .md válido.");
  } finally {
    loadingSpinner.classList.add("hidden"); // Ocultar spinner
  }
});




function positionCursor(){
  if (cursorPosition == null) {
    cursorPosition = markdownInput.value.length;
  }else{
    cursorPosition = markdownInput.selectionStart; // Guardar posición del cursor
  }
  //console.log("Posicion del cursor->",cursorPosition);
}


function insertCodeMarkdown(typeMarkdown){
   // Si la posición no se detecta, usar el final del texto por defecto
  positionCursor();
  let textToInsert;
  let addIndice ;
  let positionInitial,positionEnd;
  switch(typeMarkdown){
    case "bold":
    textToInsert="**strong text**";
    addIndice=2;
    positionEnd=cursorPosition + textToInsert.length-2;
    break;
    case "italic":
      textToInsert="*italic text*";
      addIndice=1;
      positionEnd=cursorPosition + textToInsert.length-1;
      break;
    case "H1":
        textToInsert="# HEADING1";
        addIndice=2;
        positionEnd=cursorPosition + textToInsert.length+2;
      break;
    case "H2":
        textToInsert="## HEADING2";
        addIndice=3;
        positionEnd=cursorPosition + textToInsert.length+3;
        break;
    case "H3":
        textToInsert="### HEADING3";
        addIndice=4;
        positionEnd=cursorPosition + textToInsert.length+4;
        break;
  }
 
  // Dividir el texto en partes y hacer la inserción
  const beforeCursor = markdownInput.value.substring(0, cursorPosition);
  const afterCursor = markdownInput.value.substring(cursorPosition);

  markdownInput.value = beforeCursor + textToInsert + afterCursor;
  // Recuperar el foco y resaltar el texto insertado
  positionInitial=cursorPosition+addIndice;
  
  markdownInput.setSelectionRange(positionInitial,positionEnd);
  markdownInput.focus();
  // Resetear posición del cursor para la próxima acción
  cursorPosition = null;
}


// Detectar clic o movimiento dentro del TextArea para obtener la posición correcta del cursor
markdownInput.addEventListener("click", function () {
  cursorPosition = markdownInput.selectionStart;
  console.log("Click en TextArea. Posición actual del cursor -> " + cursorPosition);
});




boldTextButton.addEventListener("click",function(){
  if(textSelect){
    detectTextFormat("bold",startTextSelect,endTextSelect);
    getTextFromTextArea();
  }
  else{
    insertCodeMarkdown("bold");//Insertar linea en negrita
  }
});


italicTextButton.addEventListener("click",function(){
  if(textSelect){
    detectTextFormat("italic",startTextSelect,endTextSelect);
    getTextFromTextArea();
  }
  //Inserta una linea de texto justo donde se encuentra el puntero
  else{
    insertCodeMarkdown("italic");//Insertar linea en negrita
  }
});




  // Evento para manejar donde hace click y la seleccion
document.body.addEventListener("mousedown", function (event) {
  // Seleccionar los botones por sus IDs
  const botonesIgnorados = ["btn-boldtext", "btn-italictext","dropdown-btn","select-H1","select-H2","select-H3","select-H4","select-H5","select-H6"];
  // Verificar si el clic ocurrió en un botón ignorado o en algún elemento dentro de él
  const boton = event.target.closest("button");
  
  if (boton && botonesIgnorados.includes(boton.id)) {
    console.log("Click en botón ignorado:", boton.id);
    return; // No ejecutar nada más
  }
  cursorPosition = null;
  resetValores();
  console.log("Fragmento deseleccionado. Valores reiniciados.");
});



  // Evento al presionar el botón Limpiar Editor
cleanButton.addEventListener("click",function(event){
    markdownInput.value=""
    previewSection.innerHTML=""
    resetValores();
    markdownInput.focus(); // Asegura que el textarea reciba el foco nuevamente
});



// Función para actualizar el contador palabras - caracteres
const updateCounter = () => {
  const text = markdownInput.value.trim();
  wordCount.textContent = `Palabras: ${text ? text.split(/\s+/).length : 0}`;
  charCount.textContent = `Caracteres: ${text.length}`;
};


// Agregar eventos para capturar cualquier ingreso o modificación del texto en el TextArea
["input", "paste", "drop", "cut"].forEach(event => {
  markdownInput.addEventListener(event, () => {
    updateCounter();
    getTextFromTextArea();
  });
});



  
  // Evento al presionar el botón Exportar PDF
  exportPdfButton.addEventListener("click", async function () {
    try {
      await exportToPDF();
    } catch (error) {
      console.error("Error al exportar PDF:", error);
    }
  });



 // Toggle functionality
 const btnVisualize = document.getElementById('btn-visualize');
 const editorSection = document.getElementById('editor_section');
 
 // Track expanded state
 let isEditorExpanded = true;
 
 btnVisualize.addEventListener('click', () => {
   // Check if we're in mobile or desktop mode
   const isMobile = window.innerWidth < 640; // sm breakpoint in Tailwind (640px)
   
   if (isMobile) {
     // Mobile toggle: show either editor or preview, never both
     editorSection.classList.toggle('hidden');
     previewSection.classList.toggle('hidden');
   } else {
     // Desktop toggle: either 50-50 or full editor
     if (isEditorExpanded) {
       // Switch to 50-50
       editorSection.classList.remove('sm:col-span-2');
       previewSection.classList.remove('sm:hidden');
     } else {
       // Switch to full editor
       editorSection.classList.add('sm:col-span-2');
       previewSection.classList.add('sm:hidden');
     }
     isEditorExpanded = !isEditorExpanded;
   }
 });
 
 // Initial setup for mobile
 if (window.innerWidth < 640) {
   previewSection.classList.add('hidden');
 }
 
 // Listen for window resize to adjust layout
 window.addEventListener('resize', () => {
   const isMobile = window.innerWidth < 640;
   
   if (isMobile) {
     // Reset to mobile defaults if resizing to mobile
     editorSection.classList.remove('hidden');
     previewSection.classList.add('hidden');
   } else {
     // Reset to desktop defaults if resizing to desktop
     if (isEditorExpanded) {
       editorSection.classList.add('sm:col-span-2');
       previewSection.classList.add('sm:hidden');
     } else {
       editorSection.classList.remove('sm:col-span-2');
       previewSection.classList.remove('sm:hidden');
     }
   }
 });