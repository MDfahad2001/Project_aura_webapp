const API_KEY = '$2a$10$oiOZ2p1JqErlZWeIJmDn1uhv/alUfND8CQK2e4m5/e7GIXsC2Em7y'; // X-master key from json bin
const BIN_ID = localStorage.getItem("binId");
if (!BIN_ID) {
  alert("Missing bin ID. Please log in again.");
  throw new Error("Missing BIN_ID");
}

const UPDATER_URL = 'http://localhost:5001/update'; // your Flask updater

function isDynamicSelected() {
  // Try select#mode first
  const sel = document.getElementById('mode');
  if (sel) return sel.value === 'dynamic';

  // Fallback to checkbox#dynamicOption
  const chk = document.getElementById('dynamicOption');
  if (chk) return !!chk.checked;

  // Default if neither input exists
  return false;
}

function saveChanges() {
  // base values
  const values = {
    lux: Number(document.getElementById('lux').value),
    cct: Number(document.getElementById('cct').value),
    user_id: localStorage.getItem("userId"),
    flag:isDynamicSelected(),
  };


  // --- 1) Download locally ---
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

  // --- 2a) Save to Linux file via Flask updater ---
  const updaterPromise = fetch(UPDATER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  }).then(res => {
    if (!res.ok) throw new Error('Local updater failed');
    return res.json();
  });

  // --- 2b) Upload to JSONBin.io ---
  const cloudPromise = fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify(values)
  }).then(res => {
    if (!res.ok) throw new Error('Cloud upload failed');
    return res.json();
  });

  Promise.allSettled([updaterPromise, cloudPromise]).then(([localRes, cloudRes]) => {
    const localOK = localRes.status === 'fulfilled';
    const cloudOK = cloudRes.status === 'fulfilled';

    if (localOK && cloudOK)      alert('Saved locally and to cloud.');
    else if (localOK)            alert('Saved locally; cloud failed.');
    else if (cloudOK)            alert('Saved to cloud; local failed.');
    else                         alert('Both local and cloud saves failed.');
  }).catch(() => alert('Unexpected error after saving.'));
}
