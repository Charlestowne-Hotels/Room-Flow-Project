// The firebaseConfig object is now expected to be in Config.js
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services ONCE at the top
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// --- ADMIN UIDS ---
const ADMIN_UIDS = [
    "7BdsGq6vJ7UTmAQgVoiEesgEiao1",    // jryan@charlestownehotels.com
    "WDOdrOdpcrPjVGyN5VmBEs4KdvW2",    // mspangler@charlestownehotels.com
    "HjYycTyitXe10iN05MK1grYoklw2",    // jcapps@charlestownehotels.com
    "X8GhArhO62YyqSGLgrDznMlHTdv2",    // pbeam@charlestownehotels.com
    "uk1RjvuRfsen7mG9Z69q0AWxZv63",    // kchouinard@charlestownehotels.com
    "p3X9TJob5adaeGgfteXUqpBHBIQ2",    // bhill@charlestownehotels.com
    "RtUsePG61cWLIct2NAHTunMyLx52",    // alane@charlestownehotels.com
    "5GpiVNFuoJMIgY7yHuY421XfXfk2",    // smaley@charlestownehotels.com
    "mvnlLEc3w5VafHxqbGsFbrKpErk1",    // kdehaven@charlestownehotels.com
    "LpryX2KYn1fJMD1tqHYrjNef8tZ2",      // ndonnell@charlestownehotels.com
    "YgGvmU25eZbNfByPhIwy8IZvRBK2"        //nknott@charlestownwhotels.com  
];

// --- SNT FILE MAPPING ---
const SNT_PROPERTY_MAP = {
    'sts': 'LTRL',
    'rcn': 'VERD',
    'cby': 'LCKWD',
    'bri': 'TBH',
    'dar': 'DARLING'
};

// --- DOM ELEMENT REFERENCES ---
let loginContainer, appContainer, signinBtn, signoutBtn, emailInput, passwordInput, errorMessage, clearAnalyticsBtn;
// New references for saving rules
let saveRulesBtn, saveStatus;

// --- STATE MANAGEMENT & PROFILES ---
// (Note: Ensure your 'profiles' object from your original code is here. 
// I am keeping the logic updates below, assuming 'profiles' and 'MASTER_INVENTORIES' exist globally as before.)

const profiles = {
    fqi: { hierarchy: 'TQ-QQ,TQHC-QQ,TK-K, DK-K, KJS-K/POC, QJS-QQ/POC, CTK-K, KBS-K/POC, PMVB-QQ, DMVT-QQ, GMVC-QQ, LKBS-K/POC, GMVB-QQ/POC, GMVT-QQ/POC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TQHC-QQ' },
    hvi: { hierarchy: '1QST-Q, QQST-QQ, KGST-K, KHAN-K, QQD-QQ, KGD-K, KGDB-K, QQDB-QQ, QQHI-QQ, KGHI-K, PKB-K, SUITE-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'KHAN-K' },
    spec: { hierarchy: 'TQ, TQHC, TK, TKHC, DK, DKS, DKB, DKC, PKSB, GKS', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TKHC,TQHC' },
    col: { hierarchy: 'QGST-Q, ADA-Q, KGST-K, QSTE-Q/POC, KGSTV-K, KSTE-K/POC, KSTEV-K/POC, 2BRDM-K/Q/POC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'ADA-Q,2BRDM-K/Q/POC' },
    ivy: { hierarchy: 'SQ, KS, KSO, DQS, CSQ, CKS, DQSA, KSA, SQA', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, HotelTonight, Priceline', ineligibleUpgrades: 'DQSA, KSA, SQA' },
    msi: { hierarchy: 'Q, RD, RDCY, DQ, DD, HHK, TQACC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TQACC' },
    indjh: { hierarchy: 'QNV, QQ, QAV, QQAV, DK, CHQ, MHS-Q, MHD-Q, MHF-Q', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'MHF-Q' },
    sts: { hierarchy: 'PKR, TKR, QQR, LKR, CKR, KS, PKS, AKR, AQQ', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    rcn: { hierarchy: 'KING, KINGADA, DQUEEN, ADADQ, LVKING, ADALV, JRSTE, LVJRSTE, PRES', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'KINGADA, ADADQ, ADALV' },
    cby: { hierarchy: 'KNR, KND, QQNR, KAR, QQAR, K1S, K1AS', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    bri: { hierarchy: 'PQNN, PKNG, STQQ, SQAC, SKNG, SKAC, HERT, AMER, LEST, LEAC, GPST', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    dar: { hierarchy: 'RQR, RKR, RQQ, SKR, AKS, EXE, DAR', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    dpi: { hierarchy: 'PKING-K, PQUEEN-Q, NKING-K, NKINGACC-K, NQQ-QQ, RKINGACC-K, RQQ-QQ, RQQACC-QQ, MHQQ-QQ, MHQSTE-Q, MHSTE-K, MHSTEKIT-K, RSTE-K, BUCKSTE-K, CORNSTE-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    asu: { hierarchy: '1K-K/SB, 1QQ-QQ, 1QQF-QQ, 1KF-K, 1KJ-K, 2KQQ-K/QQ, 1KH-K, 1QQH-Q, 1QQD-QQ', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    ehi: { hierarchy: 'TRADQUEEN-Q, TRADKING-K, QNN-Q, KNN-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    palms: { hierarchy: 'TRAK-K, TRAQQ-QQ, TRAKH-K, CBREEQQ-QQ, COASK-K, COASQQ-QQ, ISLAND-K, OFKN-K, OFQQ-QQ', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    csh: { hierarchy: 'SQ, QQ, DS, KS, EX', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    cgt: { hierarchy: 'PDBL-D, QUEEN-Q, QUEENADA-Q, KING-K, EKING-K, QNQN-QQ, KSTE-K, KSTWN-K/T, KSTSB-K/POC, KSS-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    gsl: { hierarchy: 'SQHC, QQ1-E, K11-E, DD20-P, K12-P, QQ2-I, DD2-B, K13-F, K1-B, K3, SQQ4', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    one: { hierarchy: 'QNQN-QQ, KING-K, QQNQN-QQ, KSTE-K, KINGADA-K, QNQNADA-QQ, DBDBADA-DD, KKING-K, CORNSTE-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    ich: { hierarchy: 'STAND-K, KINGSB-K, DOUBLE-QQ, EURO-D, ACCESS-K, SENIOR-K, JUNIOR-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    maj: { hierarchy: 'SQ, QS, KS, SS, QQ, EX', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    mcs: { hierarchy: 'KING, ADAKING, QQ, KSUITE, EXEC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    sea: { hierarchy: 'Q-Q, KING-K, QQ-QQ, DKING-K, DQQ-QQ, KINGOF-K, QADA-Q', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    sci: { hierarchy: '2QMRSH, KMrsh, DKMrsh-K, 2QCrk, 2QCrk ADA, KCrk, DKCrk, JRSTE-K/POC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    soh: { hierarchy: '1-2Q-NB-Stan-QQ, 3-King-NB-K, 4-ADAQueenRS-Q, 5-ADAQueen-Q, 6-2Q-PV-Bal-QQ, 7-2Q-PV-Bal-QQ, 8-JrSuite-QQ, 9-King-PV-Bal-K, 10-King-OV-B-K, 11-KingSuite-K/SOFA', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' },
    abr: { hierarchy: 'KING-K, KINGADA-K, KINGFULL, PREMIUM-K, DABO-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: '' }
};

// --- MASTER INVENTORIES ---
// (Ensure your full MASTER_INVENTORIES object is defined here. Using placeholders for brevity in this response, 
// but in your file, KEEP ALL THE MASTER INVENTORY DATA you had in the original prompt).
const MASTER_INVENTORIES = {
    // ... [PASTE YOUR FULL MASTER_INVENTORIES OBJECT HERE] ...
    // Note: I am not repeating the 2000 lines of inventory data to keep the response concise, 
    // but the logic below REQUIRES it to function.
};
// If you deleted the inventories, please paste them back in from your original code.


// --- STATE MANAGEMENT ---
let currentCsvContent = null;
let currentFileName = null; 
let currentRules = null;
let currentScenarios = {}; 
let currentAllReservations = []; 
let originalAllReservations = []; 
let acceptedUpgrades = [];
let completedUpgrades = [];
let oooRecords = [];
let currentInventoryMap = null; 
// NEW: State for Lead Time
let currentLeadTimeData = {};

// --- FUNCTIONS ---

function resetAppState() {
    currentCsvContent = null;
    currentFileName = null; 
    currentRules = null;
    currentScenarios = {};
    currentAllReservations = [];
    originalAllReservations = [];
    acceptedUpgrades = [];
    currentInventoryMap = null; 
    currentLeadTimeData = {}; // Reset Lead Time

    document.getElementById('csv-file').value = '';

    const outputEl = document.getElementById('output');
    if (outputEl) outputEl.style.display = 'block'; 

    const placeholderMsg = '<p style="padding: 20px; text-align: center; color: #666; font-style: italic;">Please upload and generate a PMS file to view data.</p>';

    const recContainer = document.getElementById('recommendations-container');
    if (recContainer) recContainer.innerHTML = placeholderMsg;

    const matrixContainer = document.getElementById('matrix-container');
    if (matrixContainer) matrixContainer.innerHTML = ''; 

    const inventoryContainer = document.getElementById('inventory');
    if (inventoryContainer) inventoryContainer.innerHTML = ''; 

    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.innerHTML = '';

    const acceptedContainer = document.getElementById('accepted-container');
    if(acceptedContainer) acceptedContainer.style.display = 'block';
    
    displayAcceptedUpgrades();
    
    // Clear Lead Time UI if active
    const leadTimeArea = document.getElementById('leadtime-table-area');
    if(leadTimeArea) leadTimeArea.innerHTML = '';
}

function handleRefresh() {
    if (currentCsvContent) {
        currentRules = {
            hierarchy: document.getElementById('hierarchy').value,
            targetRooms: document.getElementById('target-rooms').value,
            prioritizedRates: document.getElementById('prioritized-rates').value,
            otaRates: document.getElementById('ota-rates').value,
            ineligibleUpgrades: document.getElementById('ineligible-upgrades').value,
            selectedDate: document.getElementById('selected-date').value,
            profile: document.getElementById('profile-dropdown').value 
        };

        showLoader(true, 'Refreshing Data...');
        
        setTimeout(() => {
            try {
                if (acceptedUpgrades.length > 0) {
                     const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
                     displayMatrixOnlyView(results); 
                } else {
                    const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
                    displayResults(results); 
                }
            } catch (err) {
                console.error("Refresh error:", err);
                showLoader(false);
            }
        }, 50);
    }
}

function updateRulesForm(profileName) {
    const profile = profiles[profileName];
    if (!profile) return;
    document.getElementById('hierarchy').value = profile.hierarchy;
    document.getElementById('target-rooms').value = profile.targetRooms;
    document.getElementById('prioritized-rates').value = profile.prioritizedRates;
    document.getElementById('ota-rates').value = profile.otaRates;
    document.getElementById('ineligible-upgrades').value = profile.ineligibleUpgrades;
    populateOooDropdown(); 
}

function parseInventoryInput(inputText) {
    const inventoryList = [];
    if (!inputText) return inventoryList;
    const groups = inputText.split(',');
    groups.forEach(group => {
        const parts = group.trim().split(/\s+/); 
        if (parts.length < 2) return; 
        const code = parts.pop(); 
        parts.forEach(roomNum => {
            if (roomNum) inventoryList.push({ roomNumber: roomNum, code: code });
        });
    });
    return inventoryList;
}

function parseSynxisInventory(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const dateIndex = headers.indexOf('Cal_Dt');
    const roomIndex = headers.indexOf('Rm_Typ_Nm');
    const availIndex = headers.indexOf('Avail_Qty');

    if (dateIndex === -1 || roomIndex === -1 || availIndex === -1) return null;

    const inventoryMap = {}; 

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(','); 
        if (row.length < headers.length) continue;

        const dateRaw = row[dateIndex]; 
        const roomRaw = row[roomIndex];
        const availRaw = row[availIndex];

        if (!dateRaw || !roomRaw) continue;

        const dateObj = new Date(dateRaw);
        if (isNaN(dateObj)) continue;
        const dateKey = dateObj.toISOString().split('T')[0];

        const codeMatch = roomRaw.match(/\(([^)]+)\)$/);
        const roomCode = codeMatch ? codeMatch[1].trim().toUpperCase() : roomRaw.trim().toUpperCase();

        const qty = parseInt(availRaw, 10);

        if (!inventoryMap[dateKey]) inventoryMap[dateKey] = {};
        inventoryMap[dateKey][roomCode] = (isNaN(qty) ? 0 : qty);
    }

    return inventoryMap;
}

async function handleSaveNewProperty() {
    const codeInput = document.getElementById('new-prop-code');
    const hierarchyInput = document.getElementById('new-prop-hierarchy');
    const inventoryInput = document.getElementById('new-prop-inventory');
    const ineligibleInput = document.getElementById('new-prop-ineligible'); 
    const btn = document.getElementById('save-new-prop-btn');
    const code = codeInput.value.trim().toLowerCase();
    
    if (!code || !hierarchyInput.value || !inventoryInput.value) { alert("Please fill in Code, Hierarchy, and Inventory."); return; }

    btn.disabled = true; btn.textContent = "Parsing & Saving...";

    try {
        const parsedInventory = parseInventoryInput(inventoryInput.value);
        if (parsedInventory.length === 0) throw new Error("Could not parse inventory data.");

        const newPropertyData = {
            code: code,
            hierarchy: hierarchyInput.value,
            inventory: parsedInventory,
            rules: {
                hierarchy: hierarchyInput.value,
                targetRooms: document.getElementById('new-prop-target').value,
                prioritizedRates: document.getElementById('new-prop-rates').value,
                otaRates: 'Expedia, Booking.com, Priceline, GDS', 
                ineligibleUpgrades: ineligibleInput ? ineligibleInput.value : '' 
            }
        };

        await db.collection('custom_properties').doc(code).set(newPropertyData);
        profiles[code] = newPropertyData.rules;
        MASTER_INVENTORIES[code] = parsedInventory;

        rebuildProfileDropdown();
        document.getElementById('profile-dropdown').value = code;
        updateRulesForm(code);

        alert(`Property ${code.toUpperCase()} saved successfully!`);
        document.getElementById('add-property-modal').classList.add('hidden');
        
        codeInput.value = ''; hierarchyInput.value = ''; inventoryInput.value = '';
        if(ineligibleInput) ineligibleInput.value = '';

    } catch (error) {
        console.error("Error saving property:", error);
        alert("Error saving: " + error.message);
    } finally {
        btn.disabled = false; btn.textContent = "Save Property to Cloud";
    }
}

async function loadCustomProperties() {
    try {
        const snapshot = await db.collection('custom_properties').get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const code = doc.id;
            if (data.rules) profiles[code] = data.rules;
            if (data.inventory) MASTER_INVENTORIES[code] = data.inventory;
        });
        rebuildProfileDropdown();
    } catch (error) { console.error("Error loading custom properties:", error); }
}

function rebuildProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    const currentVal = dropdown.value;
    dropdown.innerHTML = '';
    Object.keys(profiles).sort().forEach(key => {
        const option = document.createElement('option');
        option.value = key; option.textContent = key.toUpperCase();
        dropdown.appendChild(option);
    });
    if (profiles[currentVal]) dropdown.value = currentVal;
    else if (dropdown.options.length > 0) {
        dropdown.value = dropdown.options[0].value;
        updateRulesForm(dropdown.value);
    }
}

async function loadOooRecords() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    const listContainer = document.getElementById('ooo-list');
    oooRecords = []; 
    if(listContainer) listContainer.innerHTML = '<p>Loading...</p>';
    const today = new Date(); today.setHours(0, 0, 0, 0);

    try {
        const snapshot = await db.collection('ooo_logs').where('profile', '==', currentProfile).get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const endDate = data.endDate.toDate();
            if (endDate >= today) {
                oooRecords.push({
                    id: doc.id, roomType: data.roomType, count: data.count || 1, 
                    startDate: data.startDate.toDate(), endDate: endDate, profile: data.profile
                });
            }
        });
        renderOooList(); populateOooDropdown(); 
    } catch (error) {
        console.error("Error loading OOO:", error);
        if(listContainer) listContainer.innerHTML = '<p style="color:red">Error.</p>';
    }
}

async function handleAddOoo() {
    const profile = document.getElementById('profile-dropdown').value;
    const roomType = document.getElementById('ooo-room-type').value;
    const countInput = document.getElementById('ooo-count');
    const startStr = document.getElementById('ooo-start-date').value;
    const endStr = document.getElementById('ooo-end-date').value;
    const count = parseInt(countInput.value, 10);

    if (!roomType || !startStr || !endStr || isNaN(count) || count < 1) {
        alert("Please fill in all OOO fields correctly."); return;
    }

    const startDate = new Date(startStr); 
    const utcStart = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0));
    const endDate = new Date(endStr);
    const utcEnd = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12, 0, 0));

    if (utcEnd < utcStart) { alert("End date cannot be before start date."); return; }

    const newRecord = { profile, roomType, count, startDate: utcStart, endDate: utcEnd };
    const btn = document.getElementById('add-ooo-btn');
    btn.disabled = true; btn.textContent = "Adding...";

    try {
        const docRef = await db.collection('ooo_logs').add(newRecord);
        oooRecords.push({ ...newRecord, id: docRef.id });
        renderOooList();
        document.getElementById('ooo-room-type').value = ""; countInput.value = "1";
        document.getElementById('ooo-start-date').value = ""; document.getElementById('ooo-end-date').value = "";
    } catch (error) { console.error("Error adding OOO:", error); alert("Failed to save."); } 
    finally { btn.disabled = false; btn.textContent = "Add"; }
}

async function handleDeleteOoo(id) {
    if(!confirm("Remove this OOO record?")) return;
    try {
        await db.collection('ooo_logs').doc(id).delete();
        oooRecords = oooRecords.filter(r => r.id !== id);
        renderOooList();
    } catch (error) { console.error("Error deleting OOO:", error); alert("Failed to delete."); }
}

function renderOooList() {
    const container = document.getElementById('ooo-list');
    if(!container) return;
    if (oooRecords.length === 0) { container.innerHTML = '<p style="color: #888; font-size: 13px;">No active OOO records.</p>'; return; }
    oooRecords.sort((a, b) => a.startDate - b.startDate);
    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
    oooRecords.forEach(rec => {
        const start = rec.startDate.toISOString().split('T')[0];
        const end = rec.endDate.toISOString().split('T')[0];
        const countDisplay = rec.count > 1 ? `<strong style="color: #d63384;">(x${rec.count})</strong>` : '';
        html += `<li style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 8px; border-bottom: 1px solid #eee; margin-bottom: 4px; font-size: 13px;">
                <span><strong>${rec.roomType}</strong> ${countDisplay} <br><small>${start} to ${end}</small></span>
                <button onclick="handleDeleteOoo('${rec.id}')" style="color: red; background: none; border: none; cursor: pointer; font-weight: bold; font-size: 14px;">&times;</button>
            </li>`;
    });
    html += '</ul>'; container.innerHTML = html;
}

function populateOooDropdown() {
    const dropdown = document.getElementById('ooo-room-type');
    const hierarchyVal = document.getElementById('hierarchy').value;
    if(!dropdown || !hierarchyVal) return;
    const hierarchy = hierarchyVal.split(',');
    dropdown.innerHTML = '<option value="">Select Room</option>';
    hierarchy.forEach(code => {
        const cleanCode = code.trim().toUpperCase();
        if(cleanCode) {
            const opt = document.createElement('option'); opt.value = cleanCode; opt.textContent = cleanCode; dropdown.appendChild(opt);
        }
    });
}

function setAdminControls(isAdmin) {
    const shouldBeDisabled = !isAdmin;
    const elements = [
        document.getElementById('hierarchy'), document.getElementById('target-rooms'),
        document.getElementById('prioritized-rates'), document.getElementById('ota-rates'),
        document.getElementById('ineligible-upgrades'), document.getElementById('ooo-start-date'),
        document.getElementById('ooo-end-date'), document.getElementById('ooo-room-type'),
        document.getElementById('ooo-count'), document.getElementById('add-ooo-btn')
    ];
    elements.forEach(el => { if (el) el.disabled = shouldBeDisabled; });
    const rulesContainer = document.getElementById('admin-rules-container');
    if(rulesContainer) rulesContainer.style.display = isAdmin ? 'block' : 'none';
}

async function loadRemoteProfiles() {
    try {
        const docRef = db.collection('app_settings').doc('profile_rules');
        const doc = await docRef.get();
        if (doc.exists) {
            const savedData = doc.data();
            Object.keys(savedData).forEach(key => {
                if (profiles[key]) profiles[key] = { ...profiles[key], ...savedData[key] };
            });
        }
        updateRulesForm(document.getElementById('profile-dropdown').value);
    } catch (error) { console.error("Error loading remote profiles:", error); }
}

async function handleSaveRules() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    const btn = document.getElementById('save-rules-btn');
    const status = document.getElementById('save-status');
    const newRules = {
        hierarchy: document.getElementById('hierarchy').value,
        targetRooms: document.getElementById('target-rooms').value,
        prioritizedRates: document.getElementById('prioritized-rates').value,
        otaRates: document.getElementById('ota-rates').value,
        ineligibleUpgrades: document.getElementById('ineligible-upgrades').value
    };
    if (profiles[currentProfile]) Object.assign(profiles[currentProfile], newRules);
    
    btn.disabled = true; btn.textContent = "Saving..."; status.textContent = "";
    try {
        await db.collection('app_settings').doc('profile_rules').set({ [currentProfile]: newRules }, { merge: true });
        status.textContent = "Saved successfully!"; status.style.color = "green";
        setTimeout(() => { status.textContent = ""; }, 3000);
    } catch (error) {
        console.error("Error saving rules:", error);
        status.textContent = "Error saving."; status.style.color = "red";
    } finally {
        btn.disabled = false; btn.textContent = "Save Rules";
    }
}

async function loadCompletedUpgrades(userId) {
    if (!userId) return;
    completedUpgrades = [];
    const upgradesRef = db.collection('users').doc(userId).collection('completedUpgrades');
    try {
        const snapshot = await upgradesRef.get();
        snapshot.forEach(doc => {
            const upgrade = doc.data();
            upgrade.firestoreId = doc.id;
            if (upgrade.completedTimestamp?.toDate) upgrade.completedTimestamp = upgrade.completedTimestamp.toDate();
            completedUpgrades.push(upgrade);
        });
        displayCompletedUpgrades(); displayDemandInsights(); 
    } catch (error) { console.error("Error loading completed upgrades: ", error); }
}

const handleSignIn = () => {
    const email = emailInput.value; const password = passwordInput.value;
    errorMessage.textContent = '';
    if (!email || !password) { errorMessage.textContent = "Please enter both email and password."; return; }
    auth.signInWithEmailAndPassword(email, password).catch(error => { errorMessage.textContent = error.message; });
};

const handleSignOut = () => auth.signOut();

async function handleClearAnalytics() {
    if (!confirm("Permanently delete ALL completed upgrades for this profile?")) return;
    const user = auth.currentUser;
    const currentProfile = document.getElementById('profile-dropdown').value;
    if (!user) return;
    showLoader(true, 'Clearing Data...');
    const upgradesRef = db.collection('users').doc(user.uid).collection('completedUpgrades');
    const query = upgradesRef.where('profile', '==', currentProfile);
    try {
        const snapshot = await query.get();
        if (snapshot.empty) { alert("No data to clear."); showLoader(false); return; }
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        alert(`Deleted ${snapshot.size} records.`);
        await loadCompletedUpgrades(user.uid);
    } catch (error) { console.error(error); alert("Failed to clear."); } 
    finally { showLoader(false); }
}

// ==========================================
// --- NEW: LEAD TIME FUNCTIONS ---
// ==========================================

/**
 * Renders the editable Lead Time table based on current property hierarchy
 */
function renderLeadTimeTable(savedData = {}) {
    const container = document.getElementById('leadtime-table-area');
    if (!container) return;

    const hierarchyVal = document.getElementById('hierarchy').value;
    const hierarchy = hierarchyVal.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (hierarchy.length === 0) {
        container.innerHTML = '<p style="padding:20px; color:#888;">Please select a property with a valid hierarchy first.</p>';
        return;
    }

    let html = `
        <div style="background:#fff; border:1px solid #eee; border-radius:8px; padding:15px; margin-top:15px;">
            <p style="font-size:13px; color:#666; margin-bottom:15px;">
                Enter the <strong>Average Lead Time (Days)</strong> for last year. <br>
                <em>This data is stored securely in the cloud for this specific property.</em>
            </p>
            <div style="overflow-x: auto; max-height: 500px;">
                <table id="leadtime-table" style="width:100%; border-collapse: separate; border-spacing: 0; font-size: 12px; min-width:800px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left; position:sticky; top:0; left:0; background:#f8f9fa; z-index:2; border-bottom: 2px solid #ddd;">Room Type</th>
                            ${months.map(m => `<th style="padding: 10px; border: 1px solid #dee2e6; text-align:center; position:sticky; top:0; background:#f8f9fa; z-index:1; border-bottom: 2px solid #ddd;">${m}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
    `;

    hierarchy.forEach(room => {
        html += `<tr data-room-type="${room}">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; background: #fff; position:sticky; left:0; z-index:1;">${room}</td>`;
        
        months.forEach(month => {
            const val = (savedData[room] && savedData[room][month] !== undefined && savedData[room][month] !== null) ? savedData[room][month] : "";
            html += `
                <td style="padding: 0; border: 1px solid #dee2e6;">
                    <input type="number" data-month="${month}" value="${val}" placeholder="-" 
                    style="width: 100%; border: none; padding: 10px; text-align: center; box-sizing: border-box; font-size:13px; outline:none;"
                    onfocus="this.style.background='#e3f2fd'" onblur="this.style.background='white'">
                </td>`;
        });
        html += `</tr>`;
    });

    html += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 20px; display: flex; align-items: center; gap: 15px;">
                <button id="save-leadtime-btn" class="pms-btn" style="background: #4343FF; width:auto; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Save Lead Time Data</button>
                <span id="leadtime-status" style="font-size: 13px; font-weight:bold;"></span>
            </div>
        </div>
    `;

    container.innerHTML = html;

    const saveBtn = document.getElementById('save-leadtime-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveLeadTimeData);
}

/**
 * Loads property-specific lead time data from Firestore
 */
async function loadLeadTimeData() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    
    // Inject area if missing
    let targetArea = document.getElementById('leadtime-table-area');
    const parentContainer = document.getElementById('leadtime-insights-container');
    if (parentContainer && !targetArea) {
        const div = document.createElement('div');
        div.id = 'leadtime-table-area';
        parentContainer.appendChild(div);
        targetArea = div;
    }
    
    if (!targetArea) return;

    targetArea.innerHTML = '<div class="spinner"></div><p style="padding:20px; color:#666;">Loading historical metrics...</p>';

    try {
        const doc = await db.collection('historical_metrics').doc(currentProfile).get();
        currentLeadTimeData = doc.exists ? doc.data().leadTimeAverages : {};
        renderLeadTimeTable(currentLeadTimeData);
    } catch (error) {
        console.error("Error loading lead times:", error);
        targetArea.innerHTML = '<p style="color:red; padding:20px;">Error loading data from database.</p>';
    }
}

/**
 * Saves the current table state to Firestore
 */
async function saveLeadTimeData() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    const btn = document.getElementById('save-leadtime-btn');
    const status = document.getElementById('leadtime-status');
    
    const leadTimeData = {};
    const rows = document.querySelectorAll('#leadtime-table tbody tr');
    
    rows.forEach(row => {
        const roomType = row.dataset.roomType;
        leadTimeData[roomType] = {};
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                leadTimeData[roomType][input.dataset.month] = parseFloat(input.value);
            }
        });
    });

    btn.disabled = true;
    btn.textContent = "Saving...";

    try {
        await db.collection('historical_metrics').doc(currentProfile).set({
            leadTimeAverages: leadTimeData,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        status.textContent = "✓ Saved Successfully";
        status.style.color = "green";
        setTimeout(() => { status.textContent = ""; }, 3000);
    } catch (error) {
        console.error("Error saving lead times:", error);
        status.textContent = "✕ Error Saving";
        status.style.color = "red";
    } finally {
        btn.disabled = false;
        btn.textContent = "Save Lead Time Data";
    }
}

// --- DOM READY & EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', function() {
    loginContainer = document.getElementById('login-container'); appContainer = document.getElementById('app-container');
    signinBtn = document.getElementById('signin-btn'); signoutBtn = document.getElementById('signout-btn');
    emailInput = document.getElementById('email-input'); passwordInput = document.getElementById('password-input');
    errorMessage = document.getElementById('error-message'); clearAnalyticsBtn = document.getElementById('clear-analytics-btn');
    saveRulesBtn = document.getElementById('save-rules-btn'); saveStatus = document.getElementById('save-status');

    const settingsModal = document.getElementById('settings-modal');
    const settingsTriggerBtn = document.getElementById('settings-trigger-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const generateBtn = document.getElementById('generate-btn');
    const addPropBtn = document.getElementById('add-property-btn');
    const addPropModal = document.getElementById('add-property-modal');
    const closeAddPropBtn = document.getElementById('close-add-prop-btn');
    const saveNewPropBtn = document.getElementById('save-new-prop-btn');
    
    // Auto-Refresh on Date Change
    const dateInput = document.getElementById('selected-date');
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            if (currentCsvContent) handleRefresh();
        });
    }

    // Manual Toggle Logic
    const manualToggle = document.getElementById('manual-upgrade-toggle');
    const manualTabBtn = document.querySelector('[data-tab-target="#Mupgrade"]');
    const updateManualTabVisibility = (isEnabled) => {
        if (manualTabBtn) {
            manualTabBtn.style.display = isEnabled ? 'inline-block' : 'none'; 
            if (!isEnabled && manualTabBtn.classList.contains('active')) {
                const firstTab = document.querySelector('[data-tab-target]');
                if (firstTab) firstTab.click();
            }
        }
    };
    const savedManualState = localStorage.getItem('enableManualUpgrades') === 'true'; 
    if (manualToggle) {
        manualToggle.checked = savedManualState;
        updateManualTabVisibility(savedManualState);
        manualToggle.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            localStorage.setItem('enableManualUpgrades', isChecked);
            updateManualTabVisibility(isChecked);
        });
    }

    if (addPropBtn) addPropBtn.addEventListener('click', () => addPropModal.classList.remove('hidden'));
    if (closeAddPropBtn) closeAddPropBtn.addEventListener('click', () => addPropModal.classList.add('hidden'));
    if (saveNewPropBtn) saveNewPropBtn.addEventListener('click', handleSaveNewProperty);
    window.addEventListener('click', (e) => { if (e.target === addPropModal) addPropModal.classList.add('hidden'); });

    // --- SETUP MANUAL UPLOAD WRAPPERS ---
    const fileInput = document.getElementById('csv-file');
    const genBtnRef = document.getElementById('generate-btn');
    
    const manualUploadWrapper = document.createElement('div');
    manualUploadWrapper.id = 'manual-upload-wrapper';
    
    const uploadTitle = document.createElement('h3');
    uploadTitle.id = 'manual-upload-title';
    uploadTitle.textContent = "Manual PMS Upload";
    uploadTitle.style.marginBottom = "15px";
    uploadTitle.style.color = '#333';
    manualUploadWrapper.appendChild(uploadTitle);

    if (fileInput && fileInput.parentNode) {
        fileInput.parentNode.insertBefore(manualUploadWrapper, fileInput);
        manualUploadWrapper.appendChild(fileInput);
        if (genBtnRef) manualUploadWrapper.appendChild(genBtnRef);
    }

    const mainPagePlaceholder = document.createElement('div');
    mainPagePlaceholder.id = 'manual-upload-placeholder';
    if (manualUploadWrapper.parentNode) {
        manualUploadWrapper.parentNode.insertBefore(mainPagePlaceholder, manualUploadWrapper);
    }

    const updateUIForProfile = () => {
        const currentProfile = document.getElementById('profile-dropdown').value;
        const isSnt = !!SNT_PROPERTY_MAP[currentProfile];
        const autoLoadBtn = document.getElementById('auto-load-btn');
        
        if (autoLoadBtn) autoLoadBtn.style.display = isSnt ? 'inline-block' : 'none';

        if (isSnt) {
            const settingsContent = settingsModal.firstElementChild; 
            if (settingsContent && manualUploadWrapper.parentNode !== settingsContent) {
                settingsContent.appendChild(manualUploadWrapper);
            }
            manualUploadWrapper.style.marginTop = '20px';
            manualUploadWrapper.style.padding = '15px';
            manualUploadWrapper.style.border = '1px solid #eee';
            manualUploadWrapper.style.borderRadius = '5px';
            manualUploadWrapper.style.backgroundColor = '#fafafa';
            manualUploadWrapper.style.textAlign = 'left';
            manualUploadWrapper.style.display = 'block';
            manualUploadWrapper.style.minHeight = 'auto';
            manualUploadWrapper.style.background = '#fafafa'; 
            manualUploadWrapper.style.boxShadow = 'none';
            manualUploadWrapper.style.gap = '0';
            
            uploadTitle.style.fontSize = '16px';
            uploadTitle.style.textAlign = 'left';
            uploadTitle.style.margin = '0 0 10px 0';
            
            if (fileInput) {
                fileInput.style.flexGrow = '0';
                fileInput.style.width = 'auto';
                fileInput.style.border = '1px solid #ccc';
            }
            if (genBtnRef) {
                genBtnRef.style.width = 'auto';
                genBtnRef.style.display = 'inline-block';
                genBtnRef.style.marginTop = '10px';
                genBtnRef.style.fontSize = '14px';
                genBtnRef.style.padding = '8px 15px';
            }
        } else {
            if (mainPagePlaceholder && mainPagePlaceholder.parentNode) {
                mainPagePlaceholder.parentNode.insertBefore(manualUploadWrapper, mainPagePlaceholder.nextSibling);
            }
            manualUploadWrapper.style.marginTop = '20px';
            manualUploadWrapper.style.marginBottom = '20px';
            manualUploadWrapper.style.padding = '25px 30px'; 
            manualUploadWrapper.style.border = '2px dashed #ccc'; 
            manualUploadWrapper.style.borderRadius = '12px';
            manualUploadWrapper.style.backgroundColor = '#f8f9fa';
            manualUploadWrapper.style.background = 'linear-gradient(to right, #ffffff, #f4f6f8)'; 
            manualUploadWrapper.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            manualUploadWrapper.style.display = 'flex';
            manualUploadWrapper.style.flexDirection = 'row';
            manualUploadWrapper.style.alignItems = 'center';
            manualUploadWrapper.style.justifyContent = 'space-between';
            manualUploadWrapper.style.gap = '20px';
            manualUploadWrapper.style.minHeight = 'auto'; 
            
            uploadTitle.style.fontSize = '18px';
            uploadTitle.style.fontWeight = '600';
            uploadTitle.style.color = '#333';
            uploadTitle.style.margin = '0'; 
            uploadTitle.style.whiteSpace = 'nowrap'; 

            if (fileInput) {
                fileInput.style.flexGrow = '1';
                fileInput.style.maxWidth = 'none';
                fileInput.style.padding = '10px';
                fileInput.style.border = '1px solid #ddd';
                fileInput.style.borderRadius = '6px';
                fileInput.style.backgroundColor = '#fff';
            }
            if (genBtnRef) {
                genBtnRef.style.width = 'auto';
                genBtnRef.style.maxWidth = 'none';
                genBtnRef.style.fontSize = '15px';
                genBtnRef.style.padding = '10px 25px';
                genBtnRef.style.marginTop = '0'; 
            }
        }
    };

    auth.onAuthStateChanged(async user => {
        const adminButton = document.getElementById('clear-analytics-btn');
        const saveBtn = document.getElementById('save-rules-btn'); 
        if (user) {
            loginContainer.classList.add('hidden'); appContainer.classList.remove('hidden');
            await loadCustomProperties(); await loadRemoteProfiles(); await loadOooRecords(); 
            const isUserAdmin = ADMIN_UIDS.includes(user.uid);
            if (isUserAdmin) {
                if(adminButton) adminButton.classList.remove('hidden');
                if(saveBtn) saveBtn.classList.remove('hidden');
                if(settingsTriggerBtn) settingsTriggerBtn.classList.remove('hidden');
                if(addPropBtn) addPropBtn.classList.remove('hidden'); 
            } else {
                if(saveBtn) saveBtn.classList.add('hidden');
                if(adminButton) adminButton.classList.add('hidden');
                if(settingsTriggerBtn) settingsTriggerBtn.classList.add('hidden');
                if(addPropBtn) addPropBtn.classList.add('hidden'); 
            }
            setAdminControls(isUserAdmin);
            loadCompletedUpgrades(user.uid);
            resetAppState();
            updateUIForProfile(); 
        } else {
            loginContainer.classList.remove('hidden'); appContainer.classList.add('hidden');
            setAdminControls(false);
        }
    });

    if(settingsTriggerBtn) {
        settingsTriggerBtn.addEventListener('click', () => { settingsModal.classList.remove('hidden'); populateOooDropdown(); });
    }

    if(closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            handleRefresh();
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
            handleRefresh();
        }
    });

    if(generateBtn) generateBtn.addEventListener('click', handleGenerateClick);

    const autoLoadBtn = document.getElementById('auto-load-btn');
    if (autoLoadBtn) autoLoadBtn.addEventListener('click', handleAutoLoad);

    const profileDropdown = document.getElementById('profile-dropdown');
    
    profileDropdown.addEventListener('change', (event) => {
        updateRulesForm(event.target.value);
        resetAppState();
        displayCompletedUpgrades();
        displayDemandInsights(); 
        loadOooRecords(); 
        updateUIForProfile(); 

        // UPDATED: Check if lead time tab is active and reload data
        const activeSubTab = document.querySelector('.sub-tabs button.active');
        if (activeSubTab && activeSubTab.dataset.subTabTarget === '#leadtime-insights-container') {
            loadLeadTimeData();
        }
    });
    
    updateRulesForm('fqi'); 
    updateUIForProfile(); 

    if(saveRulesBtn) saveRulesBtn.addEventListener('click', handleSaveRules);
    const addOooBtn = document.getElementById('add-ooo-btn');
    if (addOooBtn) addOooBtn.addEventListener('click', handleAddOoo);

    if (emailInput) emailInput.addEventListener('keydown', (e) => { if(e.key==='Enter') handleSignIn(); });
    if (passwordInput) passwordInput.addEventListener('keydown', (e) => { if(e.key==='Enter') handleSignIn(); });

    signinBtn.addEventListener('click', handleSignIn);
    signoutBtn.addEventListener('click', handleSignOut);
    clearAnalyticsBtn.addEventListener('click', handleClearAnalytics);

    const futureDate = new Date(); futureDate.setDate(futureDate.getDate() + 3);
    document.getElementById('selected-date').value = futureDate.toISOString().slice(0, 10);
    
    document.getElementById('sort-date-dropdown').addEventListener('change', () => {
        displayCompletedUpgrades(); displayDemandInsights();
    });
    
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tc => tc.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

  // --- UPDATED SUB-TAB LOGIC (INCLUDES LEAD TIME) ---
    const subTabs = document.querySelectorAll('[data-sub-tab-target]');
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSelector = tab.dataset.subTabTarget;
            const target = document.querySelector(targetSelector);
            
            // 1. Update Button State (Visual Active Tab)
            subTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. Explicitly Hide ALL Sub-Containers
            const containers = [
                '#completed-container', 
                '#demand-insights-container', 
                '#historical-demand-insights-container',
                '#leadtime-insights-container' // Added ID
            ];
            
            containers.forEach(id => {
                const el = document.querySelector(id);
                if(el) el.style.display = 'none';
            });

            // 3. Show the Selected Target & Load Data
            if(target) {
                target.style.display = 'block';
                
                if (target.id === 'demand-insights-container') displayDemandInsights();
                else if (target.id === 'completed-container') displayCompletedUpgrades();
                else if (target.id === 'leadtime-insights-container') loadLeadTimeData(); // Added Load Trigger
            }
        });
    });

    const manualTab = document.querySelector('[data-tab-target="#Mupgrade"]');
    if (manualTab) {
        manualTab.addEventListener('click', () => {
        renderManualUpgradeView();
    });
    }

    const historicalInput = document.getElementById('historical-csv-file');
    if (historicalInput) {
        historicalInput.addEventListener('change', handleHistoricalUpload);
    }
});

async function handleAutoLoad() {
    const btn = document.getElementById('auto-load-btn');
    const originalText = btn.textContent;
    const currentProfile = document.getElementById('profile-dropdown').value;
    const requiredPrefix = SNT_PROPERTY_MAP[currentProfile];

    if (!requiredPrefix) { alert("This property is not configured for Auto-Load."); return; }

    btn.disabled = true; btn.textContent = "Loading..."; showLoader(true, `Fetching ${requiredPrefix}...`);
    currentInventoryMap = null;

    try {
        const docRef = db.collection('SNTData').doc(`${requiredPrefix}_latest`); 
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("No report found.");
        const data = doc.data();
        if (!data.csv_content) throw new Error("Report empty.");

        try {
            const invDocRef = db.collection('SynxisData').doc(`${requiredPrefix}_latest`);
            const invDoc = await invDocRef.get();
            if (invDoc.exists && invDoc.data().csv_content) {
                currentInventoryMap = parseSynxisInventory(invDoc.data().csv_content);
            }
        } catch (invError) { console.warn("Inv load fail", invError); }

        currentCsvContent = data.csv_content;
        currentFileName = data.filename || "Unknown.csv";
        
        currentRules = {
            hierarchy: document.getElementById('hierarchy').value,
            targetRooms: document.getElementById('target-rooms').value,
            prioritizedRates: document.getElementById('prioritized-rates').value,
            otaRates: document.getElementById('ota-rates').value,
            ineligibleUpgrades: document.getElementById('ineligible-upgrades').value,
            selectedDate: document.getElementById('selected-date').value,
            profile: currentProfile 
        };

        setTimeout(() => {
            try {
                const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
                displayResults(results);
                alert(`Loaded: ${currentFileName}\nInventory: ${currentInventoryMap ? "SynXis" : "Calculated"}`);
            } catch (err) { showError(err); } finally { btn.disabled = false; btn.textContent = originalText; }
        }, 50);

    } catch (error) { console.error("Auto-load error:", error); showLoader(false); btn.disabled = false; btn.textContent = originalText; alert(error.message); }
}

function handleGenerateClick() {
    const fileInput = document.getElementById('csv-file');
    if (!fileInput.files.length) { alert('Select file.'); return; }
    
    currentFileName = fileInput.files[0].name;
    currentInventoryMap = null; 
    acceptedUpgrades = [];
    displayAcceptedUpgrades();

    const rules = {
        hierarchy: document.getElementById('hierarchy').value,
        targetRooms: document.getElementById('target-rooms').value,
        prioritizedRates: document.getElementById('prioritized-rates').value,
        otaRates: document.getElementById('ota-rates').value,
        ineligibleUpgrades: document.getElementById('ineligible-upgrades').value,
        selectedDate: document.getElementById('selected-date').value,
        profile: document.getElementById('profile-dropdown').value 
    };
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCsvContent = e.target.result;
        currentRules = rules;
        showLoader(true, 'Generating...');
        setTimeout(() => {
            try {
                const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
                displayResults(results);
            } catch (err) { showError(err); }
        }, 50);
    };
    reader.readAsText(fileInput.files[0]);
}

function handleAcceptScenario(scenarioName) {
    const scenario = currentScenarios[scenarioName];
    if (!scenario || !scenario.length) { alert("No upgrades available."); return; }
    if(!confirm(`Accept all ${scenario.length} upgrades in ${scenarioName}?`)) return;

    acceptedUpgrades.push(...scenario);
    currentScenarios = {}; 

    showLoader(true, "Processing...");
    setTimeout(() => {
        try {
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
            displayMatrixOnlyView(results); 
        } catch (err) { showError(err); }
    }, 50);
}

function displayMatrixOnlyView(results) {
    showLoader(false);
    
    // 1. Show Accepted List
    const acceptedContainer = document.getElementById('accepted-container');
    if(acceptedContainer) acceptedContainer.style.display = 'block';
    displayAcceptedUpgrades(); 

    // 2. Target Container (Clear current content)
    const container = document.getElementById('recommendations-container');
    container.innerHTML = ''; 

    // 3. Render Matrix
    const matDiv = document.createElement('div');
    matDiv.style.marginTop = '20px';
    
    const startDate = parseDate(currentRules.selectedDate);
    const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i); return d; });
    const headers = ['Room Type', ...dates.map(date => `${date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}<br>${date.getUTCMonth() + 1}/${date.getUTCDate()}`)];
    
    const numCols = dates.length;
    const colTotals = new Array(numCols).fill(0);
    
    const rowsForHelper = results.matrixData.rows.map(row => {
        row.availability.forEach((val, i) => colTotals[i] += val);
        return { roomCode: row.roomCode, data: row.availability };
    });

    matDiv.innerHTML = generateMatrixHTML("Updated Availability (Post-Acceptance)", rowsForHelper, headers, colTotals);
    container.appendChild(matDiv);

    // 4. "Continue Reviewing" Button to restore view
    const continueBtn = document.createElement('button');
    continueBtn.textContent = "Continue / Review More";
    continueBtn.style.cssText = "margin-top: 20px; padding: 12px 24px; background: #4343FF; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; display: block; margin-left: auto; margin-right: auto;";
    continueBtn.addEventListener('click', () => {
        displayResults(results); // Go back to standard results view with tabs
    });
    container.appendChild(continueBtn);
}

function handlePmsUpdateClick(event) {
    const user = auth.currentUser; if (!user) { showError({message:"Login req"}); return; }
    const recIndex = event.target.dataset.index;
    const item = acceptedUpgrades[recIndex];
    if (item) {
        const toComplete = acceptedUpgrades.splice(recIndex, 1)[0];
        toComplete.completedTimestamp = new Date();
        toComplete.profile = document.getElementById('profile-dropdown').value;
        completedUpgrades.push(toComplete);
        db.collection('users').doc(user.uid).collection('completedUpgrades').add(toComplete)
            .then((doc) => { toComplete.firestoreId = doc.id; displayCompletedUpgrades(); displayDemandInsights(); })
            .catch((e) => { completedUpgrades.pop(); acceptedUpgrades.splice(recIndex, 0, toComplete); showError({message:"Save failed"}); });
        displayAcceptedUpgrades(); displayCompletedUpgrades();
    }
}

async function handleUndoCompletedClick(event) {
    const user = auth.currentUser; if (!user) return;
    if (!confirm("Undo?")) return;
    const fid = event.target.dataset.firestoreId;
    const idx = completedUpgrades.findIndex(u => u.firestoreId === fid);
    if (idx === -1) return;
    const item = completedUpgrades[idx];
    event.target.disabled = true; 
    try {
        await db.collection('users').doc(user.uid).collection('completedUpgrades').doc(fid).delete();
        completedUpgrades.splice(idx, 1);
        delete item.completedTimestamp; delete item.firestoreId;
        acceptedUpgrades.push(item);
        displayCompletedUpgrades(); displayDemandInsights(); displayAcceptedUpgrades();
        if (currentCsvContent) {
             const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
             displayResults(results);
        }
    } catch (e) { alert("Undo failed."); }
}

function displayResults(data) {
    showLoader(false);
    if (data.error) { showError({ message: data.error }); return; }
    if (data.acceptedUpgrades) acceptedUpgrades = data.acceptedUpgrades;
    
    currentScenarios = data.scenarios || {};
    
    const accCont = document.getElementById('accepted-container');
    if(accCont) accCont.style.display = 'block';

    displayAcceptedUpgrades();
    displayScenarios(currentScenarios); 
    
    document.getElementById('output').style.display = 'block';
    const messageEl = document.getElementById('message');
    messageEl.style.display = data.message ? 'block' : 'none';
    messageEl.innerHTML = data.message || '';
    
    displayInventory(data.inventory);
}

function displayInventory(inventory) {
    const container = document.getElementById('inventory');
    let rooms = []; for (const r in inventory) if (inventory[r]>0) rooms.push(`<strong>${r}:</strong> ${inventory[r]}`);
    container.innerHTML = '<h3>Available Rooms</h3>' + (rooms.length ? rooms.join(' | ') : '<p>None.</p>');
}

function displayScenarios(scenarios) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';

    if (scenarios['Revenue Focus'] && scenarios['VIP Focus']) {
        const revPath = scenarios['Revenue Focus'];
        const vipPath = scenarios['VIP Focus'];
        const getSig = (u) => `${u.resId}|${u.upgradeTo}`;
        let isIdentical = revPath.length === vipPath.length;
        if (isIdentical) {
            const revSet = new Set(revPath.map(getSig));
            for (const u of vipPath) {
                if (!revSet.has(getSig(u))) {
                    isIdentical = false;
                    break;
                }
            }
        }
        if (isIdentical) {
            delete scenarios['VIP Focus'];
        }
    }

    const keys = Object.keys(scenarios);
    if (!keys.length) { container.innerHTML = '<p>No upgrade paths.</p>'; return; }

    const header = document.createElement('div');
    header.style.cssText = 'display:flex; gap:10px; margin-bottom:20px; border-bottom:2px solid #eee; padding-bottom:10px;';

    keys.forEach((key, i) => {
        const tab = document.createElement('button');
        tab.textContent = key;
        tab.style.cssText = `padding:10px 20px; border:none; cursor:pointer; border-radius:5px; background:${i===0?'#4343FF':'#f0f0f0'}; color:${i===0?'white':'#333'};`;
        tab.className = 'scenario-tab';
        tab.addEventListener('click', () => {
            container.querySelectorAll('.scenario-tab').forEach(b => { b.style.background='#f0f0f0'; b.style.color='#333'; });
            tab.style.background='#4343FF'; tab.style.color='white';
            renderScenarioContent(key, scenarios[key], container);
        });
        header.appendChild(tab);
    });
    
    container.appendChild(header);
    renderScenarioContent(keys[0], scenarios[keys[0]], container);
}

function generateMatrixHTML(title, rows, headers, colTotals) {
    const styleTable = 'width:100%; border-collapse:collapse; font-size:13px; font-family:sans-serif; min-width:100%;';
    const styleTh = 'padding:12px 8px; background-color:#f8f9fa; color:#495057; font-weight:600; border-bottom:2px solid #e9ecef; text-align:center;';
    const styleTd = 'padding:10px 8px; border-bottom:1px solid #e9ecef; text-align:center; color:#333;';
    const styleRowLabel = 'padding:10px 8px; border-bottom:1px solid #e9ecef; text-align:left; font-weight:600; color:#333; background-color:#fff; position:sticky; left:0;';
    const styleTotalRow = 'background-color:#f1f3f5; font-weight:bold;';

    const getCellColor = (val) => {
        if (val < 0) return 'background-color:#ffebee; color:#c62828; font-weight:bold;'; // Red
        if (val < 3) return 'background-color:#fff3e0; color:#ef6c00;'; // Orange/Yellow
        return 'background-color:#e8f5e9; color:#2e7d32;'; // Green
    };

    let html = `
        <div style="background:white; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.05); overflow:hidden; margin-bottom:25px; border:1px solid #eee;">
            <div style="padding:15px; border-bottom:1px solid #eee; background:#fff;">
                <h4 style="margin:0; color:#4343FF; font-size:16px;">${title}</h4>
            </div>
            <div style="overflow-x:auto;">
                <table style="${styleTable}">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th style="${styleTh}">${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
    `;

    rows.forEach(row => {
        html += `<tr><td style="${styleRowLabel}">${row.roomCode}</td>`;
        row.data.forEach(avail => {
            html += `<td style="${styleTd} ${getCellColor(avail)}">${avail}</td>`;
        });
        html += '</tr>';
    });

    html += `<tr style="${styleTotalRow}">
                <td style="${styleRowLabel} background-color:#f1f3f5;">TOTAL</td>`;
    colTotals.forEach(total => {
        html += `<td style="${styleTd}">${total}</td>`;
    });
    html += '</tr></tbody></table></div></div>';

    return html;
}

function renderScenarioContent(name, recs, parent) {
    const old = parent.querySelector('.scenario-content');
    if (old) old.remove();
    const wrapper = document.createElement('div');
    wrapper.className = 'scenario-content';

    const totalRev = recs.reduce((sum, r) => sum + r.score, 0);
    const head = document.createElement('div');
    head.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding:15px; background:#f9f9f9; border-radius:8px;';
    head.innerHTML = `<div><h3 style="margin:0;">${name} Path</h3><span style="color:#666;">${recs.length} Upgrades | Potential: <strong>$${totalRev.toLocaleString()}</strong></span></div>`;

    const btn = document.createElement('button');
    btn.textContent = "Accept Entire Path";
    btn.style.cssText = 'background:#4361ee; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;';
    btn.addEventListener('click', () => handleAcceptScenario(name));
    head.appendChild(btn);
    wrapper.appendChild(head);

    const startDate = parseDate(currentRules.selectedDate);
    const hierarchy = currentRules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const baseReservations = buildReservationsByDate(currentAllReservations);
    const masterInv = getMasterInventory(currentRules.profile);

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(startDate);
        d.setUTCDate(d.getUTCDate() + i);
        return d;
    });
    const headers = ['Room Type', ...dates.map(date => `${date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}<br>${date.getUTCMonth() + 1}/${date.getUTCDate()}`)];

    const projectedRows = [];
    const currentRows = [];
    const numCols = dates.length;
    const projColTotals = new Array(numCols).fill(0);
    const currColTotals = new Array(numCols).fill(0);

    hierarchy.forEach(roomCode => {
        const pRow = { roomCode, data: [] };
        const cRow = { roomCode, data: [] };

        dates.forEach((date, i) => {
            const dateString = date.toISOString().split('T')[0];

            let baseAvail = 0;
            if (currentInventoryMap && currentInventoryMap[dateString] && currentInventoryMap[dateString][roomCode] !== undefined) {
                baseAvail = currentInventoryMap[dateString][roomCode];
            } else {
                const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
                const oooCount = oooRecords.reduce((t, r) => {
                    const rS = r.startDate.getTime();
                    const rE = r.endDate.getTime();
                    if (r.roomType === roomCode && dTime >= rS && dTime <= rE) return t + (r.count || 1);
                    return t;
                }, 0);
                baseAvail = (masterInv[roomCode] || 0) - (baseReservations[dateString]?.[roomCode] || 0) - oooCount;
            }

            let projAvail = baseAvail;
            recs.forEach(upgrade => {
                if (dateString >= upgrade.isoArrival && dateString < upgrade.isoDeparture) {
                    if (upgrade.room === roomCode) projAvail += 1; 
                    if (upgrade.upgradeTo === roomCode) projAvail -= 1; 
                }
            });

            pRow.data.push(projAvail);
            cRow.data.push(baseAvail);
            projColTotals[i] += projAvail;
            currColTotals[i] += baseAvail;
        });
        projectedRows.push(pRow);
        currentRows.push(cRow);
    });

    const matrixContainer = document.createElement('div');
    matrixContainer.innerHTML = generateMatrixHTML("Projected Availability (With Scenario)", projectedRows, headers, projColTotals) +
        generateMatrixHTML("Current Availability (Base)", currentRows, headers, currColTotals);

    wrapper.appendChild(matrixContainer);
    parent.appendChild(wrapper);
}

function displayAcceptedUpgrades() {
    const container = document.getElementById('accepted-container'); container.innerHTML = '';
    if (acceptedUpgrades.length > 0) {
        const c = document.createElement('div'); c.style.cssText='display:flex;justify-content:flex-end;margin-bottom:20px;padding:10px;background:#f8f9fa;border-radius:5px;';
        const b = document.createElement('button'); b.textContent='Download CSV'; b.style.cssText='background:#4343FF;color:white;border:none;padding:10px 15px;border-radius:4px;cursor:pointer;';
        b.addEventListener('click', downloadAcceptedUpgradesCsv); c.appendChild(b); container.appendChild(c);

        acceptedUpgrades.forEach((rec, i) => {
            const card = document.createElement('div'); card.className = 'rec-card';
            const vipHtml = rec.vipStatus ? `<div style="color: red; font-weight: bold; margin-bottom: 4px; font-size: 14px;">${rec.vipStatus}</div>` : '';
            card.innerHTML = `<div class="rec-info"><h3>${rec.name} (${rec.resId})</h3>${vipHtml}<div class="rec-details">Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br>Value: <strong>${rec.revenue}</strong></div></div><div class="rec-actions"><button class="pms-btn" data-index="${i}" style="margin-right:5px;">Mark as PMS Updated</button></div>`;
            container.appendChild(card);
        });
        container.querySelectorAll('.pms-btn').forEach(btn => btn.addEventListener('click', handlePmsUpdateClick));
    } else container.innerHTML = '<p>No accepted upgrades.</p>';
}

function displayDemandInsights() { 
    const container = document.getElementById('demand-insights-container'); const profileDropdown = document.getElementById('profile-dropdown'); if (!container || !profileDropdown) return; const currentProfile = profileDropdown.value; const profileUpgrades = completedUpgrades.filter(rec => rec.profile === currentProfile); container.innerHTML = ''; if (profileUpgrades.length === 0) { container.innerHTML = '<p style="text-align:center; color:#888;">No completed upgrade data available for Demand Insights.</p>'; return; } const roomTypeCounts = {}; let totalRevenue = 0; profileUpgrades.forEach(rec => { const type = rec.upgradeTo; roomTypeCounts[type] = (roomTypeCounts[type] || 0) + 1; const val = parseFloat(rec.revenue.replace(/[$,]/g, '')) || 0; totalRevenue += val; }); const sortedRooms = Object.entries(roomTypeCounts).sort((a, b) => b[1] - a[1]); const avgRevenue = profileUpgrades.length > 0 ? (totalRevenue / profileUpgrades.length) : 0; let html = ` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;"> <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center;"> <h4 style="margin:0; color:#555;">Total Completed Upgrades</h4> <div style="font-size: 24px; font-weight: bold; color: #4343FF;">${profileUpgrades.length}</div> </div> <div style="background: #f0fff4; padding: 15px; border-radius: 8px; text-align: center;"> <h4 style="margin:0; color:#555;">Total Revenue Value</h4> <div style="font-size: 24px; font-weight: bold; color: #28a745;">${totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div> </div> <div style="background: #fff8f0; padding: 15px; border-radius: 8px; text-align: center;"> <h4 style="margin:0; color:#555;">Avg. Upgrade Value</h4> <div style="font-size: 24px; font-weight: bold; color: #fd7e14;">${avgRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div> </div> </div> <h3>Top Performing Upgrade Rooms</h3> <table style="width: 100%; border-collapse: collapse; margin-top: 10px;"> <thead> <tr style="background: #f8f9fa; text-align: left;"> <th style="padding: 10px; border-bottom: 2px solid #ddd;">Room Type</th> <th style="padding: 10px; border-bottom: 2px solid #ddd;">Upgrade Count</th> <th style="padding: 10px; border-bottom: 2px solid #ddd;">% of Total</th> </tr> </thead> <tbody> `; sortedRooms.forEach(([room, count]) => { const percentage = ((count / profileUpgrades.length) * 100).toFixed(1); html += ` <tr> <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${room}</strong></td> <td style="padding: 10px; border-bottom: 1px solid #eee;">${count}</td> <td style="padding: 10px; border-bottom: 1px solid #eee;"> <div style="display: flex; align-items: center;"> <span style="width: 40px;">${percentage}%</span> <div style="flex-grow: 1; height: 6px; background: #eee; border-radius: 3px; margin-left: 10px;"> <div style="width: ${percentage}%; height: 100%; background: #4343FF; border-radius: 3px;"></div> </div> </div> </td> </tr> `; }); html += ` </tbody> </table> `; container.innerHTML = html;
}

function displayCompletedUpgrades() {
    const container = document.getElementById('completed-container'); const dateDropdown = document.getElementById('sort-date-dropdown'); const profileDropdown = document.getElementById('profile-dropdown'); if (!container || !dateDropdown || !profileDropdown) return; const selectedDate = dateDropdown.value; const currentProfile = profileDropdown.value; let totalValue = 0; const profileUpgrades = completedUpgrades.filter(rec => rec.profile === currentProfile); while (dateDropdown.options.length > 1) { dateDropdown.remove(1); } const existingOptions = new Set(Array.from(dateDropdown.options).map(opt => opt.value)); const uniqueDates = new Set(profileUpgrades.map(rec => rec.completedTimestamp.toLocaleDateString())); uniqueDates.forEach(date => { if (!existingOptions.has(date)) { const option = document.createElement('option'); option.value = date; option.textContent = date; dateDropdown.appendChild(option); } }); container.innerHTML = ''; const dateFilteredUpgrades = selectedDate === 'all' ? profileUpgrades : profileUpgrades.filter(rec => rec.completedTimestamp.toLocaleDateString() === selectedDate); if (dateFilteredUpgrades && dateFilteredUpgrades.length > 0) { dateFilteredUpgrades.sort((a, b) => b.completedTimestamp - a.completedTimestamp); dateFilteredUpgrades.forEach(rec => { totalValue += parseFloat(rec.revenue.replace(/[$,]/g, '')) || 0; const card = document.createElement('div'); card.className = 'rec-card completed'; card.innerHTML = ` <div class="rec-info"> <h3>${rec.name} (${rec.resId})</h3> <div class="rec-details"> Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br> Value of Reservation: <strong>${rec.revenue}</strong><br> Completed On: <strong>${rec.completedTimestamp.toLocaleDateString()}</strong> </div> </div> <div class="rec-actions" style="flex-direction: column; align-items: flex-end;"> <div style="color: var(--success-color); margin-bottom: 5px;"> <strong style="color: #4343FF;">✓ Completed</strong> </div> <button class="undo-completed-btn" data-firestore-id="${rec.firestoreId}" style="background-color: #dc3545; color: white; padding: 5px 10px; font-size: 12px; border: none; border-radius: 4px; cursor: pointer;">Undo</button> </div> `; container.appendChild(card); }); const totalHeader = document.createElement('h3'); totalHeader.style.textAlign = 'right'; totalHeader.style.marginTop = '20px'; totalHeader.textContent = `Total Value: ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`; container.appendChild(totalHeader); container.querySelectorAll('.undo-completed-btn').forEach(btn => { btn.addEventListener('click', handleUndoCompletedClick); }); } else { container.innerHTML = '<p>No upgrades have been marked as completed for this profile and date.</p>'; }
}

function displayMatrix(matrix) {
    const container = document.getElementById('matrix-container'); if (!matrix || !matrix.headers || !matrix.rows) { container.innerHTML = '<p>Could not generate the availability matrix.</p>'; return; } const numDateColumns = matrix.headers.length - 1; const columnTotals = new Array(numDateColumns).fill(0); let html = '<table><thead><tr>' + matrix.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>'; matrix.rows.forEach(row => { html += `<tr><td><strong>${row.roomCode}</strong></td>`; row.availability.forEach((avail, index) => { html += `<td>${avail}</td>`; columnTotals[index] += (typeof avail === 'number' ? avail : 0); }); html += '</tr>'; }); html += '<tr style="background-color: #f8f9fa; border-top: 2px solid #ccc;">'; html += '<td><strong>TOTAL AVAILABLE</strong></td>'; columnTotals.forEach(total => { html += `<td><strong>${total}</strong></td>`; }); html += '</tr>'; html += '</tbody></table>'; container.innerHTML = html; colorMatrixCells();
}

function colorMatrixCells() { const cells = document.querySelectorAll("#matrix-container td:not(:first-child)"); cells.forEach(cell => { const value = parseInt(cell.textContent, 10); if (isNaN(value)) return; cell.classList.remove('matrix-neg', 'matrix-low', 'matrix-high'); if (value < 0) cell.classList.add('matrix-neg'); else if (value >= 3) cell.classList.add('matrix-high'); else cell.classList.add('matrix-low'); }); }

function showError(error) { showLoader(false); alert(error.message || 'Error'); console.error(error); }

function showLoader(show, text = 'Loading...') { const l=document.getElementById('loader'), o=document.getElementById('output'), g=document.getElementById('generate-btn'); if(l) l.style.display=show?'block':'none'; if(l) l.innerHTML=`<div class="spinner"></div>${text}`; if(o) o.style.display=show?'none':'block'; if(g) g.disabled=show; }

function parseCsv(csvContent) { const lines = csvContent.trim().split('\n'); const headerLine = lines.shift(); const header = headerLine.split(',').map(h => h.trim().replace(/"/g, '')); const data = lines.map(line => { const row = []; let currentField = ''; let inQuotes = false; for (let i = 0; i < line.length; i++) { const char = line[i]; if (char === '"') { inQuotes = !inQuotes; } else if (char === ',' && !inQuotes) { row.push(currentField); currentField = ''; } else { currentField += char; } } row.push(currentField); return row; }); return { data, header }; }

function applyUpgradesAndRecalculate(currentAcceptedList, csvContent, rules, fileName) {
    const { data, header } = parseCsv(csvContent);
    let allReservations = [];
    const isSynxisArrivals = header.includes('Guest_Nm');
    if (isSynxisArrivals) allReservations = parseSynxisArrivals(data, header);
    else allReservations = parseAllReservations(data, header, fileName);

    currentAcceptedList.forEach(rec => {
        const r = allReservations.find(res => res.resId === rec.resId);
        if (r) r.roomType = rec.upgradeTo;
    });

    const results = generateScenariosFromData(allReservations, rules);
    results.acceptedUpgrades = currentAcceptedList;
    return results;
}

function processUpgradeData(csvContent, rules, fileName) {
    const { data, header } = parseCsv(csvContent);
    if (!data || !data.length) throw new Error('Empty CSV');
    
    const isSynxisArrivals = header.includes('Guest_Nm');
    let allReservations = [];
    if (isSynxisArrivals) allReservations = parseSynxisArrivals(data, header);
    else allReservations = parseAllReservations(data, header, fileName);

    currentAllReservations = allReservations;
    originalAllReservations = JSON.parse(JSON.stringify(allReservations)); 

    return generateScenariosFromData(allReservations, rules);
}

function parseSynxisArrivals(data, header) {
    const nameIndex = header.indexOf('Guest_Nm');
    const resIdIndex = header.indexOf('CRS_Confirm_No');
    const roomTypeIndex = header.indexOf('Rm_Typ_Cd');
    const rateNameIndex = header.indexOf('Rate_Type_Name_Code_Offshore');
    const arrivalIndex = header.indexOf('Arrival_Date');
    const departureIndex = header.indexOf('Depart_Date');
    const statusIndex = header.indexOf('Rez_Status');
    const rateIndex = header.indexOf('Avg_Rate_Offshore');
    const ids = new Set();

    return data.map(values => {
        if (values.length < header.length) return null;
        const resId = values[resIdIndex]?.trim();
        if (!resId || ids.has(resId)) return null; 
        ids.add(resId);

        const arrival = values[arrivalIndex] ? parseDate(values[arrivalIndex]) : null;
        const departure = values[departureIndex] ? parseDate(values[departureIndex]) : null;
        let nights = 0; if (arrival && departure) nights = Math.max(1, Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)));
        const dailyRate = parseFloat(values[rateIndex]) || 0;
        let fullName = values[nameIndex] || "";
        if (fullName.includes(',')) { const parts = fullName.split(','); if (parts.length >= 2) fullName = `${parts[1].trim()} ${parts[0].trim()}`; }
        let status = values[statusIndex]?.trim().toUpperCase() || 'RESERVATION';
        if (status === 'CONFIRMED') status = 'RESERVATION'; if (status === 'CANCELLED') status = 'CANCELED';

        return { name: fullName, resId, roomType: values[roomTypeIndex]?.trim().toUpperCase(), rate: values[rateNameIndex]?.trim(), nights, arrival, departure, status, revenue: (dailyRate*nights).toLocaleString('en-US',{style:'currency',currency:'USD'}), marketCode: '' };
    }).filter(r => r && r.roomType && r.arrival && r.departure && r.nights > 0);
}

function parseAllReservations(data, header, fileName) {
    const isSnt = fileName && (fileName.startsWith('SNT') || fileName.startsWith('LTRL') || fileName.startsWith('VERD') || fileName.startsWith('LCKWD') || fileName.startsWith('TBH') || fileName.startsWith('DARLING'));
    
    let nameIndex, resIdIndex, roomTypeIndex, rateNameIndex, arrivalIndex, departureIndex, statusIndex, rateIndex;
    let firstNameIndex, lastNameIndex, marketCodeIndex, vipIndex, dnmIndex = -1;

    if (isSnt) {
        firstNameIndex = header.indexOf('First Name');
        lastNameIndex = header.indexOf('Last Name');
        resIdIndex = header.indexOf('Reservation Id');
        roomTypeIndex = header.indexOf('Arrival Room Type');
        rateNameIndex = header.indexOf('Arrival Rate Code');
        arrivalIndex = header.indexOf('Arrival Date');
        departureIndex = header.indexOf('Departure Date');
        statusIndex = header.indexOf('Reservation Status');
        rateIndex = header.indexOf('Adr');
        marketCodeIndex = header.indexOf('Market Code');
        vipIndex = header.indexOf('Vip'); 
        if (vipIndex === -1) vipIndex = header.indexOf('VIPDescription');
        dnmIndex = header.indexOf('Do Not Move');
        if (firstNameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) throw new Error("Missing SNT columns.");
    } else {
        nameIndex = header.indexOf('Guest Name');
        resIdIndex = header.indexOf('Res ID');
        roomTypeIndex = header.indexOf('Room Type');
        rateNameIndex = header.indexOf('Rate Name');
        arrivalIndex = header.indexOf('Arrival Date');
        departureIndex = header.indexOf('Departure Date');
        statusIndex = header.indexOf('Status');
        rateIndex = header.indexOf('Rate');
        vipIndex = header.indexOf('VIPDescription');
        if (nameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) throw new Error("Missing CSV columns.");
    }

    return data.map(values => {
        if (values.length < header.length) return null;
        
        const arrival = values[arrivalIndex] ? parseDate(values[arrivalIndex]) : null;
        const departure = values[departureIndex] ? parseDate(values[departureIndex]) : null;
        
        let nights = 0; 
        if (arrival && departure) nights = Math.max(1, Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)));
        
        const dailyRate = parseFloat(values[rateIndex]) || 0;
        
        let fullName = isSnt ? `${values[firstNameIndex] || ''} ${values[lastNameIndex] || ''}`.trim() : values[nameIndex];
        
        let status = values[statusIndex] ? values[statusIndex].trim().toUpperCase() : '';
        if (isSnt && status === 'RESERVED') status = 'RESERVATION';
        
        let marketCode = (isSnt && marketCodeIndex > -1) ? values[marketCodeIndex] : '';
        let vipStatus = (vipIndex > -1 && values[vipIndex]) ? values[vipIndex].trim() : "";
        if (vipStatus.toUpperCase() === 'NO') vipStatus = ""; 
        
        let doNotMove = (dnmIndex > -1 && values[dnmIndex]) ? values[dnmIndex].trim().toUpperCase() : "NO";
        const isDoNotMove = (doNotMove === 'YES' || doNotMove === 'TRUE');

        return { 
            name: fullName, 
            resId: values[resIdIndex]?.trim(), 
            roomType: values[roomTypeIndex]?.trim().toUpperCase(), 
            rate: values[rateNameIndex]?.trim(), 
            nights, 
            arrival, 
            departure, 
            status, 
            revenue: (dailyRate * nights).toLocaleString('en-US', {style:'currency',currency:'USD'}), 
            marketCode, 
            vipStatus,
            isDoNotMove 
        };
    }).filter(r => r && r.roomType && r.arrival && r.departure && r.nights > 0);
}

function generateScenariosFromData(allReservations, rules) {
    const masterInventory = getMasterInventory(rules.profile);
    if (!Object.keys(masterInventory).length) return { error: `No inventory for ${rules.profile}` };

    const activeReservations = allReservations.filter(res => res.status !== 'CANCELED' && res.status !== 'CANCELLED' && res.status !== 'NO SHOW');
    const completedResIds = new Set(completedUpgrades.filter(up => up.profile === rules.profile).map(up => up.resId));
    
    const startDate = parseDate(rules.selectedDate);
    const reservationsByDate = buildReservationsByDate(activeReservations);
    const todayInventory = getInventoryForDate(masterInventory, reservationsByDate, startDate);
    const matrixData = generateMatrixData(masterInventory, reservationsByDate, startDate, rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean));

    const strategies = ['Revenue Focus', 'VIP Focus', 'Efficiency (Fill Gaps)'];
    const scenarios = {};

    strategies.forEach(strategy => {
        scenarios[strategy] = runSimulation(strategy, activeReservations, masterInventory, rules, completedResIds);
    });

    return { scenarios, inventory: todayInventory, matrixData, message: null };
}

function runSimulation(strategy, allReservations, masterInv, rules, completedIds) {
    const startDate = parseDate(rules.selectedDate);
    const hierarchy = rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const ineligible = rules.ineligibleUpgrades.toUpperCase().split(',');
    const otaRates = rules.otaRates.toLowerCase().split(',');

    const simInventory = {};
    for (let i = 0; i < 14; i++) {
        const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i);
        const dStr = d.toISOString().split('T')[0];
        simInventory[dStr] = {};
        for (let room in masterInv) {
            const dTime = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).getTime();
            const existingCount = allReservations.reduce((acc, res) => {
                if (res.roomType === room && res.arrival <= d && res.departure > d) return acc + 1;
                return acc;
            }, 0);
            const oooCount = oooRecords.reduce((acc, rec) => {
                const rStart = rec.startDate.getTime(); const rEnd = rec.endDate.getTime();
                if (rec.roomType === room && dTime >= rStart && dTime <= rEnd) return acc + (rec.count || 1);
                return acc;
            }, 0);

            if (currentInventoryMap && currentInventoryMap[dStr] && currentInventoryMap[dStr][room] !== undefined) {
                simInventory[dStr][room] = currentInventoryMap[dStr][room];
            } else {
                simInventory[dStr][room] = (masterInv[room] || 0) - existingCount - oooCount;
            }
        }
    }

    const guestState = {};
    allReservations.forEach(r => guestState[r.resId] = r.roomType);
    const pendingUpgrades = {}; 

    for (let pass = 0; pass < 20; pass++) { 
        let activity = false;
        let candidates = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i);
            const dTime = d.getTime();
            const dailyArrivals = allReservations.filter(r => r.arrival && r.arrival.getTime() === dTime && r.status === 'RESERVATION');

            dailyArrivals.forEach(res => {
                if (completedIds.has(res.resId)) return;
                if (res.isDoNotMove) return; 

                const currentRoom = guestState[res.resId];
                const currentIdx = hierarchy.indexOf(currentRoom);
                if (currentIdx === -1) return;

                const originalBed = getBedType(res.roomType); 
                if (originalBed === 'OTHER') return;

                if (rules.profile === 'sts' && res.marketCode === 'Internet Merchant Model') return;
                if (otaRates.some(ota => res.rate.toLowerCase().includes(ota))) return;
                
                for (let u = currentIdx + 1; u < hierarchy.length; u++) {
                    const targetRoom = hierarchy[u];
                    if (ineligible.includes(targetRoom)) continue;
                    if (getBedType(targetRoom) !== originalBed) continue;

                    candidates.push({
                        resObj: res, 
                        currentRoom: currentRoom,
                        targetRoom: targetRoom,
                        score: parseFloat(res.revenue.replace(/[$,]/g, '')) || 0,
                        vip: res.vipStatus ? 1 : 0,
                        nights: res.nights,
                        rank: u 
                    });
                }
            });
        }

        if (strategy === 'Revenue Focus') {
            candidates.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score; 
                return b.rank - a.rank; 
            });
        } else if (strategy === 'VIP Focus') {
            candidates.sort((a, b) => {
                if (b.vip !== a.vip) return b.vip - a.vip;
                if (b.score !== a.score) return b.score - a.score;
                return b.rank - a.rank;
            });
        } else {
            candidates.sort((a, b) => a.nights - b.nights);
        }

        const processedResIdsThisPass = new Set();
        candidates.forEach(cand => {
            if (processedResIdsThisPass.has(cand.resObj.resId)) return;

            let canMove = true;
            let checkDate = new Date(cand.resObj.arrival);
            while (checkDate < cand.resObj.departure) {
                const dStr = checkDate.toISOString().split('T')[0];
                if (!simInventory[dStr] || (simInventory[dStr][cand.targetRoom] || 0) <= 0) {
                    canMove = false;
                    break;
                }
                checkDate.setUTCDate(checkDate.getUTCDate() + 1);
            }

            if (canMove) {
                activity = true;
                processedResIdsThisPass.add(cand.resObj.resId);

                checkDate = new Date(cand.resObj.arrival);
                while (checkDate < cand.resObj.departure) {
                    const dStr = checkDate.toISOString().split('T')[0];
                    if (simInventory[dStr]) {
                        simInventory[dStr][cand.targetRoom]--; 
                        if (simInventory[dStr][cand.currentRoom] !== undefined) {
                            simInventory[dStr][cand.currentRoom]++;
                        }
                    }
                    checkDate.setUTCDate(checkDate.getUTCDate() + 1);
                }

                guestState[cand.resObj.resId] = cand.targetRoom;

                if (!pendingUpgrades[cand.resObj.resId]) {
                    pendingUpgrades[cand.resObj.resId] = {
                        name: cand.resObj.name,
                        resId: cand.resObj.resId,
                        revenue: cand.resObj.revenue,
                        room: cand.resObj.roomType, 
                        rate: cand.resObj.rate,
                        nights: cand.resObj.nights,
                        upgradeTo: cand.targetRoom, 
                        score: cand.score,
                        arrivalDate: cand.resObj.arrival.toLocaleDateString('en-US', { timeZone: 'UTC' }),
                        departureDate: cand.resObj.departure.toLocaleDateString('en-US', { timeZone: 'UTC' }),
                        isoArrival: cand.resObj.arrival.toISOString().split('T')[0], 
                        isoDeparture: cand.resObj.departure.toISOString().split('T')[0], 
                        vipStatus: cand.resObj.vipStatus
                    };
                } else {
                    pendingUpgrades[cand.resObj.resId].upgradeTo = cand.targetRoom;
                }
            }
        });

        if (!activity) break; 
    }

    return Object.values(pendingUpgrades);
}

function buildReservationsByDate(allReservations) { const reservationsByDate = {}; allReservations.forEach(res => { if (!res.arrival || !res.departure) return; let currentDate = new Date(res.arrival); while (currentDate < res.departure) { const dateString = currentDate.toISOString().split('T')[0]; if (!reservationsByDate[dateString]) reservationsByDate[dateString] = {}; reservationsByDate[dateString][res.roomType] = (reservationsByDate[dateString][res.roomType] || 0) + 1; currentDate.setUTCDate(currentDate.getUTCDate() + 1); } }); return reservationsByDate; }

function getInventoryForDate(masterInventory, reservationsByDate, date) { const inventory = {}; const dateString = date.toISOString().split('T')[0]; for (const roomCode in masterInventory) { const totalPhysical = masterInventory[roomCode]; const reservedCount = reservationsByDate[dateString]?.[roomCode] || 0; const oooDeduction = oooRecords.reduce((total, rec) => { const isMatch = rec.roomType === roomCode; const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime(); const rStart = new Date(Date.UTC(rec.startDate.getUTCFullYear(), rec.startDate.getUTCMonth(), rec.startDate.getUTCDate())).getTime(); const rEnd = new Date(Date.UTC(rec.endDate.getUTCFullYear(), rec.endDate.getUTCMonth(), rec.endDate.getUTCDate())).getTime(); if (isMatch && (dTime >= rStart && dTime <= rEnd)) { return total + (rec.count || 1); } return total; }, 0); inventory[roomCode] = totalPhysical - reservedCount - oooDeduction; } return inventory; }

function getMasterInventory(profileName) { const masterRoomList = MASTER_INVENTORIES[profileName]; if (!masterRoomList) { console.error(`No master inventory found for profile: ${profileName}`); return {}; } const totalInventory = {}; masterRoomList.forEach(room => { totalInventory[room.code.toUpperCase()] = (totalInventory[room.code.toUpperCase()] || 0) + 1; }); return totalInventory; }

function parseDate(dateStr) { if (!dateStr) return null; if (dateStr.includes(' ') && dateStr.includes(':')) { dateStr = dateStr.split(' ')[0]; } const parts = dateStr.split(/[-\/]/); if (parts.length === 3) { if (parts[0].length === 4) return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); else return new Date(Date.UTC(parts[2], parts[0] - 1, parts[1])); } const fallbackDate = new Date(dateStr); return new Date(Date.UTC(fallbackDate.getFullYear(), fallbackDate.getMonth(), fallbackDate.getDate())); }

function generateMatrixData(totalInventory, reservationsByDate, startDate, roomHierarchy) { const matrix = { headers: ['Room Type'], rows: [] }; const dates = Array.from({ length: 14 }, (_, i) => { const date = new Date(startDate); date.setUTCDate(date.getUTCDate() + i); return date; }); matrix.headers.push(...dates.map(date => `${date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}<br>${date.getUTCMonth() + 1}/${date.getUTCDate()}`)); roomHierarchy.forEach(roomCode => { const row = { roomCode, availability: [] }; dates.forEach(date => { const dateString = date.toISOString().split('T')[0]; let finalAvail = 0; if (currentInventoryMap && currentInventoryMap[dateString] && currentInventoryMap[dateString][roomCode] !== undefined) { finalAvail = currentInventoryMap[dateString][roomCode]; } else { const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime(); const oooCount = oooRecords.reduce((total, rec) => { const rStart = new Date(Date.UTC(rec.startDate.getUTCFullYear(), rec.startDate.getUTCMonth(), rec.startDate.getUTCDate())).getTime(); const rEnd = new Date(Date.UTC(rec.endDate.getUTCFullYear(), rec.endDate.getUTCMonth(), rec.endDate.getUTCDate())).getTime(); if (rec.roomType === roomCode && (dTime >= rStart && dTime <= rEnd)) { return total + (rec.count || 1); } return total; }, 0); finalAvail = (totalInventory[roomCode] || 0) - (reservationsByDate[dateString]?.[roomCode] || 0) - oooCount; } row.availability.push(finalAvail); }); matrix.rows.push(row); }); return matrix; }

function getBedType(roomCode) { if (!roomCode) return 'OTHER'; if (roomCode.includes('2BRDM')) return 'K'; if (roomCode.includes('-K')) return 'K'; if (roomCode.includes('-QQ')) return 'QQ'; if (roomCode.includes('-Q')) return 'Q'; if (roomCode.startsWith('DK')) return 'K'; if (roomCode.startsWith('GK')) return 'K'; if (roomCode.startsWith('PK')) return 'K'; if (roomCode.startsWith('TK')) return 'K'; if (roomCode.startsWith('TQ')) return 'QQ'; if (roomCode === 'CKS') return 'K'; if (roomCode === 'CSQ') return 'Q'; if (roomCode.startsWith('KS')) return 'K'; if (roomCode.startsWith('SQ')) return 'Q'; if (roomCode.startsWith('DQ')) return 'QQ'; if (roomCode === 'Q') return 'Q'; if (roomCode === 'DQ') return 'QQ'; if (roomCode === 'DD') return 'QQ'; if (roomCode === 'RD') return 'K'; if (roomCode === 'RDCY') return 'K'; if (roomCode === 'HHK') return 'K'; if (roomCode === 'QNV') return 'Q'; if (roomCode === 'QQ') return 'QQ'; if (roomCode === 'QAV') return 'Q'; if (roomCode === 'QQAV') return 'QQ'; if (roomCode === 'CHQ') return 'Q'; if (roomCode === 'PKR') return 'K'; if (roomCode === 'TKR') return 'K'; if (roomCode === 'QQR') return 'QQ'; if (roomCode === 'LKR') return 'K'; if (roomCode === 'CKR') return 'K'; if (roomCode === 'KS') return 'K'; if (roomCode === 'PKS') return 'K'; if (roomCode === 'AKR') return 'K'; if (roomCode === 'AQQ') return 'QQ'; if (roomCode === 'KING' || roomCode === 'KINGADA' || roomCode === 'LVKING' || roomCode === 'ADALV') return 'K'; if (roomCode === 'DQUEEN' || roomCode === 'ADADQ') return 'QQ'; if (roomCode === 'JRSTE' || roomCode === 'LVJRSTE' || roomCode === 'PRES') return 'K'; if (roomCode === 'KNR' || roomCode === 'KND' || roomCode === 'KAR' || roomCode === 'K1S' || roomCode === 'K1AS') return 'K'; if (roomCode === 'QQNR' || roomCode === 'QQAR') return 'QQ'; if (['PQNN', 'STQQ', 'SQAC'].includes(roomCode)) return 'QQ'; if (['PKNG', 'SKNG', 'SKAC', 'HERT', 'AMER', 'LEST', 'LEAC', 'GPST'].includes(roomCode)) return 'K'; if (['RKR', 'SKR', 'AKS', 'EXE', 'DAR'].includes(roomCode)) return 'K'; if (['RQR', 'RQQ'].includes(roomCode)) return 'QQ'; if (['K11-E', 'K12-P', 'K13-F', 'K1-B', 'K3'].includes(roomCode)) return 'K'; if (['QQ1-E', 'QQ2-I', 'SQQ4', 'DD2-B', 'DD20-P'].includes(roomCode)) return 'QQ'; if (['SQHC'].includes(roomCode)) return 'Q'; if (roomCode === 'DBDBADA-DD') return 'QQ'; if (['STAND-K', 'KINGSB-K', 'ACCESS-K', 'SENIOR-K', 'JUNIOR-K'].includes(roomCode)) return 'K'; if (['DOUBLE-QQ'].includes(roomCode)) return 'QQ'; if (['EURO-D'].includes(roomCode)) return 'D'; if (['QS'].includes(roomCode)) return 'Q'; if (['SS', 'EX'].includes(roomCode)) return 'K'; if (['KING', 'ADAKING', 'KSUITE', 'EXEC'].includes(roomCode)) return 'K'; if (['QQ'].includes(roomCode)) return 'QQ'; if (['KING-K', 'DKING-K', 'KINGOF-K'].includes(roomCode)) return 'K'; if (['QQ-QQ', 'DQQ-QQ'].includes(roomCode)) return 'QQ'; if (['Q-Q', 'QADA-Q'].includes(roomCode)) return 'Q'; if (['KMrsh', 'DKMrsh-K', 'KCrk', 'DKCrk', 'JRSTE-K/POC'].includes(roomCode)) return 'K'; if (['2QMRSH', '2QCrk', '2QCrk ADA'].includes(roomCode)) return 'QQ'; if (roomCode.startsWith('2Q')) return 'QQ'; if (['3-King-NB-K', '9-King-PV-Bal-K', '10-King-OV-B-K', '11-KingSuite-K/SOFA'].includes(roomCode)) return 'K'; if (['1-2Q-NB-Stan-QQ', '6-2Q-PV-Bal-QQ', '7-2Q-PV-Bal-QQ', '8-JrSuite-QQ'].includes(roomCode)) return 'QQ'; if (['4-ADAQueenRS-Q', '5-ADAQueen-Q'].includes(roomCode)) return 'Q'; if (roomCode === 'KINGFULL') return 'K'; return 'OTHER'; }

function downloadAcceptedUpgradesCsv() {
    if (!acceptedUpgrades || acceptedUpgrades.length === 0) { alert("No data to export."); return; }
    const headers = ['Guest Name', 'Res ID', 'Current Room Type', 'Room Type to Upgrade To', 'Arrival Date', 'Departure Date'];
    const rows = acceptedUpgrades.map(rec => { return [`"${rec.name}"`, `"${rec.resId}"`, `"${rec.room}"`, `"${rec.upgradeTo}"`, `"${rec.arrivalDate}"`, `"${rec.departureDate}"`].join(','); });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); const url = URL.createObjectURL(blob); const dateStr = new Date().toISOString().slice(0, 10); link.setAttribute('href', url); link.setAttribute('download', `accepted_upgrades_${dateStr}.csv`); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function renderManualUpgradeView() {
    const container = document.getElementById('manual-upgrade-list-container');
    if (!container) return; 
    if (!currentCsvContent || !currentAllReservations.length) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">Please upload a PMS file and click "Generate Suggestions" first.</p>';
        return;
    }

    const startStr = document.getElementById('selected-date').value;
    const startDate = parseDate(startStr);
    const startIso = startDate.toISOString().split('T')[0];

    const acceptedIds = new Set(acceptedUpgrades.map(u => u.resId));
    const completedIds = new Set(completedUpgrades.map(u => u.resId));
    
    const candidates = currentAllReservations.filter(res => {
        const arrIso = res.arrival.toISOString().split('T')[0];
        if (arrIso !== startIso) return false;
        if (acceptedIds.has(res.resId) || completedIds.has(res.resId)) return false;
        if (['CANCELED', 'CANCELLED', 'NO SHOW', 'CHECKED OUT'].includes(res.status)) return false;
        return true;
    });

    if (candidates.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">No eligible arrivals found for this date.</p>';
        return;
    }

    candidates.sort((a, b) => a.name.localeCompare(b.name));

    const hierarchy = currentRules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const simResult = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
    
    const projectedInvMap = {};
    simResult.matrixData.rows.forEach(row => {
        projectedInvMap[row.roomCode] = row.availability; 
    });

    let rowsHtml = '';
    let rowsGenerated = 0;

    candidates.forEach((guest, index) => {
        const currentIdx = hierarchy.indexOf(guest.roomType);
        const arrStr = guest.arrival.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
        const depStr = guest.departure.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
        const dateDisplay = `${arrStr} - ${depStr}`;
        const vipDisplay = guest.vipStatus 
            ? `<span style="color: #d63384; font-weight: bold; font-size: 12px; text-transform: uppercase;">${guest.vipStatus}</span>` 
            : '';

        let optionsHtml = '';
        let hasValidUpgrade = false;

        if (currentIdx !== -1) {
            for (let i = currentIdx + 1; i < hierarchy.length; i++) {
                const targetRoom = hierarchy[i];
                let isAvailable = true;
                const stayLen = guest.nights;
                
                for (let d = 0; d < stayLen; d++) {
                    if (d < 14) {
                        const avail = projectedInvMap[targetRoom] ? projectedInvMap[targetRoom][d] : 0;
                        if (avail <= 0) {
                            isAvailable = false;
                            break;
                        }
                    }
                }

                if (isAvailable) {
                    hasValidUpgrade = true;
                    optionsHtml += `<option value="${targetRoom}">${targetRoom}</option>`;
                }
            }
        }

        if (!hasValidUpgrade) return; 
        rowsGenerated++;

        const dropdown = `<select id="manual-select-${index}" style="padding:8px; border:1px solid #ccc; border-radius:4px; width:100%; max-width:200px;">
                 ${optionsHtml}
               </select>`;

        rowsHtml += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:12px 15px;">
                    <strong>${guest.name}</strong><br>
                    <span style="font-size:12px; color:#666;">${guest.resId}</span>
                </td>
                <td style="padding:12px 15px; color:#555;">
                    ${dateDisplay}<br>
                    <span style="font-size:11px; color:#888;">(${guest.nights} nts)</span>
                </td>
                <td style="padding:12px 15px;"><span style="background:#eee; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px;">${guest.roomType}</span></td>
                
                <td style="padding:12px 15px;">
                    <strong>${guest.revenue}</strong><br>
                    <span style="font-size:12px; color:#555;">${guest.rate || 'Unknown'}</span>
                </td>
                
                <td style="padding:12px 15px;">${vipDisplay}</td>
                
                <td style="padding:12px 15px;">${dropdown}</td>
                <td style="padding:12px 15px; text-align:right;">
                    <button 
                        onclick="executeManualUpgrade('${guest.resId}', ${index})" 
                        class="pms-btn" 
                        style="background:#4343FF; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">
                        Upgrade
                    </button>
                </td>
            </tr>
        `;
    });

    if (rowsGenerated === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">No upgrades available for any guests arriving on this date (based on current inventory).</p>';
    } else {
        const tableHeader = `
            <table style="width:100%; border-collapse:collapse; font-size:14px; background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-top:10px;">
                <thead style="background:#f8f9fa; border-bottom:2px solid #eee;">
                    <tr>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Guest Name</th>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Dates</th>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Current Room</th>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Rate / Value</th>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Notes</th>
                        <th style="padding:12px 15px; text-align:left; color:#444;">Select Upgrade</th>
                        <th style="padding:12px 15px; text-align:right; color:#444;">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        container.innerHTML = tableHeader + rowsHtml + `</tbody></table>`;
    }
}

function handleHistoricalUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            const { data, header } = parseCsv(content);
            const headerStr = header.join(' ').toLowerCase();
            const fileName = file.name;

            if (headerStr.includes('guest name') || headerStr.includes('arrival date')) {
                const reservations = parseAllReservations(data, header, fileName);
                const validStays = reservations.filter(r => 
                    !['CANCELED', 'CANCELLED', 'NO SHOW'].includes(r.status)
                );
                if (validStays.length === 0) { alert("No valid reservations found."); return; }
                renderHistoricalStats(validStays, 'detailed');
            } 
            else if (isSummaryFormat(header, data)) {
                const summaryData = parseSummaryReport(header, data);
                renderHistoricalStats(summaryData, 'summary');
            }
            else if (header.length >= 4 && (header[1].includes('/') || header[1].includes('-')) && !isNaN(parseFloat(header[2]))) {
                const headlessData = parseHeadlessHistory(header, data);
                renderHistoricalStats(headlessData, 'detailed');
            }
            else {
                alert("Unknown file format. Please upload a Reservation List, Summary Report, or History Dump.");
            }

        } catch (err) {
            console.error(err);
            alert("Error parsing file: " + err.message);
        }
    };
    reader.readAsText(file);
}

function isSummaryFormat(header, data) {
    const checkVal = (row) => row && row.length > 8 && row[9] && row[9].includes('%');
    return checkVal(header) || (data.length > 0 && checkVal(data[0]));
}

function parseSummaryReport(header, data) {
    const rows = [header, ...data];
    const results = [];
    rows.forEach(row => {
        if (row.length < 10) return;
        const roomType = row[1] ? row[1].trim() : null;
        const soldNights = parseInt(row[7], 10);
        const occString = row[9] ? row[9].replace('%', '') : '0';
        
        if (roomType && !isNaN(soldNights)) {
            results.push({
                roomType: roomType,
                count: soldNights, 
                occPct: parseFloat(occString),
                revenue: 0,
                nights: soldNights 
            });
        }
    });
    return results;
}

function parseHeadlessHistory(firstRow, remainingData) {
    const allRows = [firstRow, ...remainingData];
    return allRows.map(row => {
        if (row.length < 4) return null;
        const roomType = row[0].trim().toUpperCase();
        const rate = parseFloat(row[2]) || 0;
        const nights = parseInt(row[3], 10) || 1;
        const revenue = rate * nights; 

        return {
            roomType: roomType,
            revenue: revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            nights: nights,
            count: 1 
        };
    }).filter(Boolean);
}

function renderHistoricalStats(data, type) {
    const container = document.getElementById('historical-results-area');
    if (!container) return;

    let totalRevenue = 0;
    let totalCount = 0; 
    let totalNights = 0; 
    let roomStats = {};

    data.forEach(res => {
        let revVal = 0;
        if (typeof res.revenue === 'number') revVal = res.revenue;
        else if (res.revenue) revVal = parseFloat(res.revenue.replace(/[$,]/g, '')) || 0;

        const nightsVal = res.nights || 0;
        const countVal = (type === 'summary') ? 0 : 1; 

        totalRevenue += revVal;
        totalNights += nightsVal;
        totalCount += countVal;

        if (!roomStats[res.roomType]) {
            roomStats[res.roomType] = { roomType: res.roomType, count: 0, revenue: 0, nights: 0, occ: res.occPct || 0 };
        }
        roomStats[res.roomType].count += (type === 'summary' ? res.count : 1);
        roomStats[res.roomType].nights += nightsVal;
        roomStats[res.roomType].revenue += revVal;
    });

    const displayCount = type === 'summary' ? totalNights : totalCount;
    const countLabel = type === 'summary' ? "Total Sold Nights" : "Total Reservations";
    const globalAdr = totalNights > 0 ? (totalRevenue / totalNights) : 0;
    const sortedRooms = Object.values(roomStats).sort((a, b) => b.nights - a.nights);

    const revDisplay = (type === 'summary') 
        ? '<span style="color:#aaa;">N/A</span>' 
        : totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
        
    const adrDisplay = (type === 'summary') 
        ? '<span style="color:#aaa;">N/A</span>' 
        : globalAdr.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">${countLabel}</h4>
                <div style="font-size: 24px; font-weight: bold; color: #0d6efd;">${displayCount.toLocaleString()}</div>
            </div>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">Total Revenue</h4>
                <div style="font-size: 24px; font-weight: bold; color: #198754;">${revDisplay}</div>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">Historical ADR</h4>
                <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${adrDisplay}</div>
            </div>
        </div>

        <h3>Room Type Performance</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
            <thead>
                <tr style="background: #f8f9fa; text-align: left; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px;">Room Type</th>
                    <th style="padding: 10px;">${type === 'summary' ? 'Sold Nights' : 'Bookings'}</th>
                    <th style="padding: 10px;">Share</th>
                    <th style="padding: 10px;">${type === 'summary' ? 'Occupancy %' : 'Total Revenue'}</th>
                    <th style="padding: 10px;">${type === 'summary' ? '' : 'Avg Rate'}</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedRooms.forEach(stat => {
        const percentage = totalNights > 0 ? ((stat.nights / totalNights) * 100).toFixed(1) : 0;
        const avgRate = stat.nights > 0 ? (stat.revenue / stat.nights) : 0;
        
        let col3Val = '';
        let col4Val = '';

        if (type === 'summary') {
            const color = stat.occ >= 70 ? '#198754' : (stat.occ >= 50 ? '#ffc107' : '#dc3545');
            col3Val = `<span style="font-weight:bold; color:${color}">${stat.occ}%</span>`;
            col4Val = ''; 
        } else {
            col3Val = stat.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
            col4Val = avgRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }

        const volumeDisplay = type === 'summary' ? stat.nights : stat.count;

        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;"><strong>${stat.roomType}</strong></td>
                <td style="padding: 10px;">${volumeDisplay}</td>
                <td style="padding: 10px;">
                    <div style="display: flex; align-items: center;">
                        <span style="width: 45px;">${percentage}%</span>
                        <div style="flex-grow: 1; height: 6px; background: #eee; border-radius: 3px; max-width: 100px;">
                            <div style="width: ${percentage}%; height: 100%; background: #4343FF; border-radius: 3px;"></div>
                        </div>
                    </div>
                </td>
                <td style="padding: 10px;">${col3Val}</td>
                <td style="padding: 10px;">${col4Val}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    
    if (type === 'summary') {
        html += `<p style="margin-top:15px; font-size:12px; color:#666; font-style:italic;">* Revenue data not available in this summary format.</p>`;
    }

    container.innerHTML = html;
}
