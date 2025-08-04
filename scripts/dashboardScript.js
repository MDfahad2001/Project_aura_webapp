const API_KEY = '$2a$10$oiOZ2p1JqErlZWeIJmDn1uhv/alUfND8CQK2e4m5/e7GIXsC2Em7y';
const BIN_ID = '6890ef3bae596e708fc1800d'; // use after you create the bin

function updateValue() {
  const values = {
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value,
    w: document.getElementById('w').value,
    lux: document.getElementById('lux').value,
    cct: document.getElementById('cct').value
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
  .then(data => alert('Saved to cloud!'))
  .catch(err => console.error('Save failed', err));
}
