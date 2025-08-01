function saveChanges() {
  const values = {
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value,
    w: document.getElementById('w').value,
    lux: document.getElementById('lux').value,
    cct: document.getElementById('cct').value
  };

  const jsonData = JSON.stringify(values, null, 2); // formatted JSON
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'aura_values.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url); // Clean up memory
}
