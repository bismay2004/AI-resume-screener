// public/js/upload.js — Client-side JS for the upload page

const resumeInput = document.getElementById("resume");
const dropZone = document.getElementById("dropZone");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const uploadForm = document.getElementById("uploadForm");
const submitBtn = document.getElementById("submitBtn");

// ── Show selected file name ─────────────────────────────────
resumeInput.addEventListener("change", function () {
  if (this.files.length > 0) {
    fileNameDisplay.textContent = "✓ " + this.files[0].name;
    fileNameDisplay.classList.remove("d-none");
  }
});

// ── Drag and drop support ───────────────────────────────────
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === "application/pdf") {
    // Set the file input programmatically
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);
    resumeInput.files = dataTransfer.files;
    fileNameDisplay.textContent = "✓ " + files[0].name;
    fileNameDisplay.classList.remove("d-none");
  } else {
    alert("Please drop a PDF file.");
  }
});

// ── Click anywhere on drop zone to open file picker ────────
dropZone.addEventListener("click", (e) => {
  if (e.target.tagName !== "LABEL" && e.target.tagName !== "INPUT") {
    resumeInput.click();
  }
});

// ── Show loading overlay on form submit ────────────────────
uploadForm.addEventListener("submit", function (e) {
  if (!resumeInput.files.length) {
    e.preventDefault();
    alert("Please select a PDF file.");
    return;
  }

  // Show a loading spinner while AI analyzes
  const overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary mb-4" style="width:3.5rem;height:3.5rem;" role="status"></div>
      <h5 class="fw-bold">Analyzing your resume...</h5>
      <p class="text-muted">Google Gemini AI is processing your resume against the job description.</p>
      <p class="text-muted small">This may take 5–15 seconds.</p>
    </div>
  `;
  document.body.appendChild(overlay);
  submitBtn.disabled = true;
});
