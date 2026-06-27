// public/js/history.js — Delete analysis from history

let analysisIdToDelete = null;
let cardToRemove = null;
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));

function deleteAnalysis(id, btn) {
  analysisIdToDelete = id;
  // Find the parent card to remove it from DOM after deletion
  cardToRemove = btn.closest(".col-md-6");
  deleteModal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  if (!analysisIdToDelete) return;

  try {
    // Send DELETE request to the API
    const res = await fetch(`/analysis/${analysisIdToDelete}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      deleteModal.hide();
      // Remove the card from the page without refreshing
      if (cardToRemove) {
        cardToRemove.style.transition = "opacity 0.3s ease";
        cardToRemove.style.opacity = "0";
        setTimeout(() => cardToRemove.remove(), 300);
      }
    } else {
      alert("Delete failed: " + data.message);
    }
  } catch (err) {
    alert("Delete failed. Please try again.");
  }
});
