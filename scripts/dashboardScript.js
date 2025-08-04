const API_KEY = '$2a$10$wkq6duJgxGCzRhwU7UsbHeq21NTSjKl/wx8t.j67pRjnFLNzE1hr.';
const BIN_ID = '6890ef3bae596e708fc1800d';

function updateValue() {
  const values = {
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value,
    w: document.getElementById('w').value,
    lux: document.getElementById('lux').value,
    cct: document.getElementById('cct').value,
    user_id: localStorage.getItem("userId")
  };

  fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify(values)
  })
  .then(res => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  })
  .then(data => {
    console.log("Uploaded to JSONBin:", data);
    alert("Saved to cloud!");
  })
  .catch(err => {
    console.error("Cloud upload failed:", err);
    alert("Upload failed. Please check CORS or API key.");
  });
}
