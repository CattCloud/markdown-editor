import { getTextFromTextArea,formatHeading,toggleTextFormat } from './format.js';
import { getSelectedText } from './block.js';


/**
 * Variables para obtener elementos HTML
 */
const generateHtml = document.querySelector("#generate-html");
const toggleContrastButton = document.getElementById("toggle-contrast");
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const toggleStyleTextButton=document.getElementById("toggle-styleText");
let textSelect="";
let startTextSelect,endTextSelect=0;

// TODO: Cuando hagamos click en el boton generateHtml, tenemos que obtener el texto del textarea y trasnformalo a HTML y eso mostrarlo el preview
generateHtml.addEventListener("click", function () {
  getTextFromTextArea(); // Obtiene el value del textarea
});


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
    textSelect = "";
    startTextSelect = 0;
    endTextSelect = 0;
    console.log("Fragmento deseleccionado. Valores reiniciados.");
  }
});
