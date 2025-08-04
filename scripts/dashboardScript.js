const API_KEY = '$2a$10$wkq6duJgxGCzRhwU7UsbHeq21NTSjKl/wx8t.j67pRjnFLNzE1hr.'; // Replace this with your real key
const BIN_ID = '6890e3b1ae596e708fc1785a';           // Replace with your created bin ID

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
  .then(res => res.json())
  .then(data => {
    console.log("Uploaded to JSONBin:", data);
    alert("Saved to cloud and downloaded locally!");
  })
  .catch(err => {
    console.error("Cloud upload failed:", err);
    alert("Saved locally, but cloud upload failed.");
  });
}
