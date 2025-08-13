const API_KEY = '$2a$10$oiOZ2p1JqErlZWeIJmDn1uhv/alUfND8CQK2e4m5/e7GIXsC2Em7y'; // X-master key from json bin
const BIN_ID = localStorage.getItem("binId");
if (!BIN_ID) {
  alert("Missing bin ID. Please log in again.");
  throw new Error("Missing BIN_ID");
}

// 👉 change if your updater is on a different host/port
const UPDATER_URL = 'http://localhost:5001/update';

function saveChanges() {
  const values = {
    // send numbers for lux/cct
    lux: Number(document.getElementById('lux').value),
    cct: Number(document.getElementById('cct').value),
    user_id: localStorage.getItem("userId")
  };

  // --- 1) Download locally (unchanged) ---
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

  // --- 2a) Save to your Linux file via Flask updater ---
  const updaterPromise = fetch(UPDATER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  }).then(res => {
    if (!res.ok) throw new Error('Local updater failed');
    return res.json();
  });

  // --- 2b) Upload to JSONBin.io (existing) ---
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

  // Run both network ops in parallel and report results
  Promise.allSettled([updaterPromise, cloudPromise]).then(results => {
    const [localRes, cloudRes] = results;

    const localOK = localRes.status === 'fulfilled';
    const cloudOK = cloudRes.status === 'fulfilled';

    if (localOK && cloudOK) {
      alert('Saved locally (Linux file) and to cloud (JSONBin).');
    } else if (localOK && !cloudOK) {
      console.error('JSONBin error:', cloudRes.reason);
      alert('Saved to Linux file, but cloud upload failed.');
    } else if (!localOK && cloudOK) {
      console.error('Updater error:', localRes.reason);
      alert('Saved to cloud, but Linux file update failed.');
    } else {
      console.error('Both failed:', { local: localRes.reason, cloud: cloudRes.reason });
      alert('Both local and cloud saves failed.');
    }
  }).catch(err => {
    console.error(err);
    alert('Unexpected error after saving.');
  });
}
