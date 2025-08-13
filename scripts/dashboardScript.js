const API_KEY = '$2a$10$oiOZ2p1JqErlZWeIJmDn1uhv/alUfND8CQK2e4m5/e7GIXsC2Em7y'; // Replace this with your actual key
const BIN_ID = localStorage.getItem("binId");
if (!BIN_ID) {
  alert("Missing bin ID. Please log in again.");
  throw new Error("Missing BIN_ID");
}

function saveChanges() {
  const values = {
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value,
    w: document.getElementById('w').value,
    lux: document.getElementById('lux').value,
    cct: document.getElementById('cct').value,
    user_id: localStorage.getItem("userId")
  };

    // 1. Download locally
  const jsonData = JSON.stringify(values, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'aura_values.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 2. Upload to JSONBin.io using PUT (corrected)
  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify(values)
  })
  .then(res => {
    if (!res.ok) throw new Error('Cloud upload failed');
    return res.json();
  })
  .then(data => {
    console.log("Uploaded to JSONBin:", data);
    alert("Saved to cloud");
  })
  .catch(err => {
    console.error(err);
    alert("cloud upload failed.");
  });
}
