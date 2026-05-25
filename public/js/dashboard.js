const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.username;
document.getElementById('userRole').textContent = `System ${user.role}`;

let allAssets = [];
let statusChart = null;
let deptChart = null;

// Initialize Socket.io
const socket = io();
socket.on('asset_updated', () => {
    console.log('Real-time update received: Fetching assets...');
    fetchAssets();
});

socket.on('material_updated', () => {
    console.log('Real-time update received: Fetching materials for alerts...');
    fetchLowStock();
});

async function openModal(id, isEdit = false) {
    document.getElementById(id).style.display = 'flex';
    
    // Load Departments
    const res = await fetch('/api/entities/departments', { headers: { 'Authorization': `Bearer ${token}` }});
    const depts = await res.json();
    const deptSelect = document.getElementById('department');
    deptSelect.innerHTML = '<option value="">-- Select Department --</option>';
    depts.forEach(d => {
        deptSelect.innerHTML += `<option value="${d.dept_name}">${d.dept_name}</option>`;
    });

    if (!isEdit) {
        document.getElementById('assetForm').reset();
        document.getElementById('assetId').value = '';
        document.getElementById('modalTitle').textContent = 'New Company Asset Entry';
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
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
        updateStats(allAssets);
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
            <td style="font-weight: 500;">${asset.pc_name}</td>
            <td style="opacity: 0.7;">${asset.serial_no}</td>
            <td>${asset.department || 'N/A'}</td>
            <td>${asset.ram || '-'}/${asset.storage || '-'}</td>
            <td><span class="status-badge ${asset.status}">${asset.status}</span></td>
            <td>
                <button onclick="editAsset(${asset.id})" style="color:var(--primary); background:none; border:none; cursor:pointer; font-weight:600; margin-right:10px;">Edit</button>
                <button onclick="deleteAsset(${asset.id})" style="color:var(--error); background:none; border:none; cursor:pointer; font-weight:600;">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats(assets) {
    const activeCount = assets.filter(a => (a.status || '').toLowerCase() === 'active').length;
    const inStoreCount = assets.filter(a => (a.status || '').toLowerCase() === 'in-store').length;
    const repairCount = assets.filter(a => (a.status || '').toLowerCase() === 'repair').length;

    const elements = {
        totalAssets: assets.length,
        activeWorkstations: activeCount,
        inStoreCount: inStoreCount,
        pendingRepairs: repairCount
    };

    // Update with animation effect or direct text
    for (const [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = val;
            // Brief highlight effect for real-time feel
            el.style.transition = '0.3s';
            el.style.color = 'var(--primary)';
            setTimeout(() => { el.style.color = ''; }, 500);
        }
    }

    // Update Last Synced Time
    const syncTimeEl = document.getElementById('lastSyncedTime');
    if (syncTimeEl) {
        syncTimeEl.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
    }

    updateCharts(assets, activeCount, inStoreCount, repairCount);
}

function updateCharts(assets, active, inStore, repair) {
    // Status Chart
    const statusCanvas = document.getElementById('statusChart');
    if (statusCanvas) {
        const statusCtx = statusCanvas.getContext('2d');
        if (statusChart) {
            statusChart.data.datasets[0].data = [active, inStore, repair];
            statusChart.update();
        } else {
            statusChart = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'In-Store', 'Repair'],
                    datasets: [{
                        data: [active, inStore, repair],
                        backgroundColor: ['rgba(0, 230, 195, 0.8)', 'rgba(51, 220, 255, 0.8)', 'rgba(255, 117, 94, 0.8)'],
                        borderWidth: 0, hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { color: '#ffffff' } } },
                    cutout: '75%'
                }
            });
        }
    }

    // Department Chart
    const deptCounts = {};
    assets.forEach(a => {
        const dept = a.department || 'Unassigned';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const deptLabels = Object.keys(deptCounts);
    const deptData = Object.values(deptCounts);

    const deptCanvas = document.getElementById('deptChart');
    if (deptCanvas) {
        const deptCtx = deptCanvas.getContext('2d');
        if (deptChart) {
            deptChart.data.labels = deptLabels;
            deptChart.data.datasets[0].data = deptData;
            deptChart.update();
        } else {
            deptChart = new Chart(deptCtx, {
                type: 'bar',
                data: {
                    labels: deptLabels,
                    datasets: [{
                        label: 'Assets per Department',
                        data: deptData,
                        backgroundColor: 'rgba(0, 210, 255, 0.5)',
                        borderColor: 'rgba(0, 210, 255, 1)',
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#aaa' } },
                        x: { grid: { display: false }, ticks: { color: '#aaa' } }
                    }
                }
            });
        }
    }
}

// Search
document.getElementById('assetSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allAssets.filter(a => 
        (a.pc_name || '').toLowerCase().includes(term) || 
        (a.serial_no || '').toLowerCase().includes(term) ||
        (a.department || '').toLowerCase().includes(term)
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
    document.getElementById('mac_address').value = asset.mac_address || '';
    document.getElementById('status').value = asset.status || 'Active';
    document.getElementById('remarks').value = asset.remarks || '';
    
    document.getElementById('modalTitle').textContent = 'Update Company Asset';
    openModal('assetModal', true);
}

async function deleteAsset(id) {
    if (!confirm('Are you sure? This will remove the asset from company records.')) return;
    try {
        const res = await fetch(`/api/assets/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Asset removed', 'success');
            fetchAssets();
        }
    } catch (err) {
        showToast('Delete failed', 'error');
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
            showToast(id ? 'Record updated!' : 'Asset registered!', 'success');
            closeModal('assetModal');
            fetchAssets();
        }
    } catch (err) {
        showToast('Operation failed', 'error');
    }
});

async function fetchLowStock() {
    try {
        const res = await fetch('/api/materials', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const materials = await res.json();
        const lowStock = materials.filter(m => m.available_quantity < 10); // Alert if less than 10
        
        const alertContainer = document.getElementById('lowStockAlerts');
        const alertCount = document.getElementById('alertCount');
        
        alertCount.textContent = lowStock.length;
        alertContainer.innerHTML = '';
        
        if (lowStock.length === 0) {
            alertContainer.innerHTML = '<p style="opacity:0.5; text-align:center; margin-top:100px;">All materials are in good stock.</p>';
            return;
        }

        lowStock.forEach(m => {
            const div = document.createElement('div');
            div.style.background = 'rgba(255, 117, 94, 0.1)';
            div.style.border = '1px solid rgba(255, 117, 94, 0.3)';
            div.style.padding = '12px 15px';
            div.style.borderRadius = '12px';
            div.style.marginBottom = '10px';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            
            div.innerHTML = `
                <div>
                    <h4 style="margin:0; font-size:0.95rem;">${m.material_name}</h4>
                    <small style="opacity:0.6;">Critical Level Alert</small>
                </div>
                <div style="text-align:right;">
                    <span style="color:#ff755e; font-weight:700; font-size:1.1rem;">${m.available_quantity}</span>
                    <small style="display:block; opacity:0.6;">left</small>
                </div>
            `;
            alertContainer.appendChild(div);
        });
    } catch (err) {
        console.error('Failed to fetch low stock alerts');
    }
}

fetchAssets();
fetchLowStock();
