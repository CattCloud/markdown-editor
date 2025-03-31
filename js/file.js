/*----------------------------------Funcion para Exportar PDF----------------------------------------*/
  // Función para mostrar el spinner
  function showLoadingSpinner() {
    const modal = document.createElement("div");
    modal.id = "loading-modal";
    modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
        <div class="bg-[#2c2c3c] p-6 rounded-lg flex flex-col items-center">
          <p class="text-lg font-semibold">Exportando...</p>
          <div class="mt-2 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Función para ocultar el spinner
  function hideLoadingSpinner() {
    const modal = document.getElementById("loading-modal");
    if (modal) {
      modal.remove();
    }
  }
  
  
/*----------------------------------Funcion para Importar Archivo Markdown----------------------------------------*/
  
// Función para leer archivos con FileReader y promesas
export function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
}

  
// Función para exportar el PDF
export function exportToPDF() {
  const pdfFilenameInput = document.getElementById("pdfFilename");
  const previewSection = document.querySelector("#preview-section");

    const filename = pdfFilenameInput.value.trim() || "documento"; // Nombre por defecto si está vacío
  
    showLoadingSpinner(); // Mostrar el spinner
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        html2pdf()
          .from(previewSection)
          .set({
            margin: 10,
            filename: filename + ".pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save()
          .then(() => {
            hideLoadingSpinner(); // Ocultar el spinner cuando se completa
            resolve();
          })
          .catch((error) => {
            hideLoadingSpinner();
            alert("No se pudo generar el PDF");
            reject(error);
          });
      }, 2000); // Simulación de proceso asíncrono
    });
  }


  
