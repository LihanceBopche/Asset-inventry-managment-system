const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.username;
document.getElementById('userRole').textContent = `System ${user.role}`;

let allAssets = [];

// Initialize Socket.io
const socket = io();
socket.on('asset_updated', () => {
    console.log('Real-time update received: Fetching assets...');
    fetchAssets();
});

function openModal(id, isEdit = false) {
    document.getElementById(id).style.display = 'flex';
    if (!isEdit) {
        document.getElementById('assetForm').reset();
        document.getElementById('assetId').value = '';
        document.getElementById('modalTitle').textContent = 'New Company Asset Entry';
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show toast-${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// Data Handling
async function fetchAssets() {
    try {
        const res = await fetch('/api/assets', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
            if (res.status === 401) logout();
            throw new Error('API error');
        }

        const data = await res.json();
        allAssets = Array.isArray(data) ? data : [];
        renderAssets(allAssets);
    } catch (err) {
        console.error('Fetch error:', err);
        showToast('Failed to load company data', 'error');
    }
}

function renderAssets(assets) {
    const tbody = document.getElementById('assetTableBody');
    tbody.innerHTML = '';
    
    assets.forEach(asset => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600; color: var(--primary);">${asset.pc_name || '-'}</td>
            <td style="opacity: 0.8; font-family: monospace;">${asset.serial_no || '-'}</td>
            <td>${asset.asset_type || '-'} <br><span style="opacity:0.5; font-size: 0.75rem;">${asset.model_name || '-'}</span></td>
            <td>${asset.department || '-'}</td>
            <td>${asset.work_location || '-'}</td>
            <td>${asset.ram || '-'}<br><span style="opacity:0.5; font-size: 0.75rem;">${asset.storage || '-'}</span></td>
            <td>${asset.os || '-'}</td>
            <td style="font-family: monospace; font-size: 0.75rem;">${asset.mac_address || '-'}</td>
            <td><span class="status-badge ${asset.status}">${asset.status}</span></td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button onclick="editAsset(${asset.id})" style="color:var(--primary); background:rgba(0,210,255,0.1); border:1px solid rgba(0,210,255,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteAsset(${asset.id})" style="color:var(--error); background:rgba(255,75,43,0.1); border:1px solid rgba(255,75,43,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Search
document.getElementById('assetSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allAssets.filter(a => 
        (a.pc_name && a.pc_name.toLowerCase().includes(term)) || 
        (a.serial_no && a.serial_no.toLowerCase().includes(term)) ||
        (a.department && a.department.toLowerCase().includes(term)) ||
        (a.model_name && a.model_name.toLowerCase().includes(term)) ||
        (a.mac_address && a.mac_address.toLowerCase().includes(term)) ||
        (a.work_location && a.work_location.toLowerCase().includes(term))
    );
    renderAssets(filtered);
});

async function editAsset(id) {
    const res = await fetch(`/api/assets/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const asset = await res.json();
    
    document.getElementById('assetId').value = asset.id;
    document.getElementById('pc_name').value = asset.pc_name || '';
    document.getElementById('serial_no').value = asset.serial_no || '';
    document.getElementById('model_name').value = asset.model_name || '';
    document.getElementById('asset_type').value = asset.asset_type || 'Workstation';
    document.getElementById('department').value = asset.department || '';
    document.getElementById('work_location').value = asset.work_location || '';
    document.getElementById('ram').value = asset.ram || '';
    document.getElementById('storage').value = asset.storage || '';
    document.getElementById('os').value = asset.os || '';
    // Optional: Mac Address Field (Assuming the form has it or we can add it)
    if(document.getElementById('mac_address')) document.getElementById('mac_address').value = asset.mac_address || '';
    document.getElementById('status').value = asset.status || 'Active';
    document.getElementById('remarks').value = asset.remarks || '';
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-pen-to-square"></i> Update Asset Record';
    openModal('assetModal', true);
}

async function deleteAsset(id) {
    if (!confirm('Are you sure you want to permanently delete this asset?')) return;
    try {
        const res = await fetch(`/api/assets/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Asset deleted successfully', 'success');
            // Fetch assets will be handled by socket real-time update
        }
    } catch (err) {
        showToast('Failed to delete asset', 'error');
    }
}

document.getElementById('assetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('assetId').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const url = id ? `/api/assets/${id}` : '/api/assets';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            showToast(id ? 'Asset updated successfully!' : 'Asset registered successfully!', 'success');
            closeModal('assetModal');
            // Fetch assets will be handled by socket real-time update
        }
    } catch (err) {
        showToast('Operation failed', 'error');
    }
});

fetchAssets();
