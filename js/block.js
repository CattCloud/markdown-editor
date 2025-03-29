export function getSelectedText(event) {
    const start = event.target.selectionStart; //Posicion inicial del texto seleccionado
    const end = event.target.selectionEnd; //Posicion final del texto seleccionado
    const selectedText = event.target.value.substring(start, end);
    console.log("Primero:"+start+"-"+end);
    return selectedText;
  }

