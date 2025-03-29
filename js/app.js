import { getTextFromTextArea,formatHeading,toggleTextFormat } from './format.js';
import { getSelectedText } from './block.js';


/**
 * Variables para obtener elementos HTML
 */
//const generateHtml = document.querySelector("#generate-html");
const toggleContrastButton = document.getElementById("toggle-contrast");
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const wordCount=document.getElementById("word-count");
const charCount=document.getElementById("char-count");
const toggleStyleTextButton=document.getElementById("toggle-styleText");
const cleanButton=document.getElementById("btn-clean");
let textSelect="";
let startTextSelect,endTextSelect=0;


/*
generateHtml.addEventListener("click", function () {
  getTextFromTextArea(); // Obtiene el value del textarea
});
*/
function resetValores(){
  textSelect = "";
  startTextSelect = 0;
  endTextSelect = 0;
}

//Manejador de eventos cuando realizas una seleccion dentro del TextArea
markdownInput.addEventListener("select", function (event) {
  textSelect = getSelectedText(event);
  if(textSelect){
    startTextSelect = event.target.selectionStart; //Posicion inicial del texto seleccionado
    //Posicion final del texto seleccionado
    textSelect.endsWith(" ")?endTextSelect=event.target.selectionEnd-1:endTextSelect=event.target.selectionEnd;
    console.log(textSelect+": "+startTextSelect+"-"+endTextSelect);
  }
});


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
   formatHeading();
});


//Manejo del evento cuando escribes en el textArea
markdownInput.addEventListener("input", function () {
  getTextFromTextArea(); // Obtiene el value del textarea
});


toggleStyleTextButton.addEventListener("click",function(event){
  if(textSelect){
    toggleTextFormat(startTextSelect,endTextSelect);
    getTextFromTextArea();
  }
});


document.body.addEventListener("mousedown", function (event) {
  // Comprobar si el click es fuera del botón de cambiar estilo
  if ( textSelect != "" &&
    event.target !== toggleStyleTextButton // No está en el botón de cambiar estilo
  ) {
    // Reiniciar valores de selección
    resetValores();
    console.log("Fragmento deseleccionado. Valores reiniciados.");
  }
});



cleanButton.addEventListener("click",function(event){
    markdownInput.value=""
    previewSection.innerHTML=""
    resetValores();
    markdownInput.focus(); // Asegura que el textarea reciba el foco nuevamente
});


// Función para actualizar el contador
const updateCounter = () => {
  const text = markdownInput.value.trim();
  wordCount.textContent = `Palabras: ${text ? text.split(/\s+/).length : 0}`;
  charCount.textContent = `Caracteres: ${text.length}`;
};

// Agregar eventos para capturar cualquier ingreso o modificación del texto
["input", "paste", "drop", "cut"].forEach(event => {
  markdownInput.addEventListener(event, () => {
    updateCounter(); // Se usa setTimeout para capturar el texto después del evento
    getTextFromTextArea();
  });
});