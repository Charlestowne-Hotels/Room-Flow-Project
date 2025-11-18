// The firebaseConfig object is now expected to be in Config.js
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services ONCE at the top
const auth = firebase.auth();
const db = firebase.firestore();

// --- NEW: An array to hold all Admin UIDs ---
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
    "LpryX2KYn1fJMD1tqHYrjNef8tZ2"     // ndonnell@charlestownehotels.com
];


// --- DOM ELEMENT REFERENCES ---
let loginContainer, appContainer, signinBtn, signoutBtn, emailInput, passwordInput, errorMessage, clearAnalyticsBtn;

// --- STATE MANAGEMENT & PROFILES ---
const profiles = {
    fqi: {
        hierarchy: 'TQ-QQ,TQHC-QQ,TK-K, DK-K, KJS-K/POC, QJS-QQ/POC, CTK-K, KBS-K/POC, PMVB-QQ, DMVT-QQ, GMVC-QQ, LKBS-K/POC, GMVB-QQ/POC, GMVT-QQ/POC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'TQHC-QQ'
    },
    hvi: {
        hierarchy: '1QST-Q, QQST-QQ, KGST-K, KHAN-K, QQD-QQ, KGD-K, KGDB-K, QQDB-QQ, QQHI-QQ, KGHI-K, PKB-K, SUITE-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'KHAN-K'
    },
    spec: {
        hierarchy: 'TQ, TQHC, TK, TKHC, DK, DKS, DKB, DKC, PKSB, GKS',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'TKHC,TQHC' // Defaulted HC rooms to ineligible
    },
    // --- NEW "COL" PROFILE ADDED ---
    col: {
        hierarchy: 'QGST-Q, ADA-Q, KGST-K, QSTE-Q/POC, KGSTV-K, KSTE-K/POC, KSTEV-K/POC, 2BRDM-K/Q/POC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'ADA-Q,2BRDM-K/Q/POC' 
    }
    // --- END OF NEW PROFILE ---
};

// --- NEW: A central object for all master inventory lists ---
const MASTER_INVENTORIES = {
    fqi: [
        { roomNumber: '301', code: 'CTK-K' }, { roomNumber: '320', code: 'CTK-K' }, { roomNumber: '102', code: 'DK-K' },
        { roomNumber: '202', code: 'DK-K' }, { roomNumber: '204', code: 'DK-K' }, { roomNumber: '205', code: 'DK-K' },
        { roomNumber: '222', code: 'DK-K' }, { roomNumber: '302', code: 'DK-K' }, { roomNumber: '303', code: 'DK-K' },
        { roomNumber: '304', code: 'DK-K' }, { roomNumber: '305', code: 'DK-K' }, { roomNumber: '306', code: 'DK-K' },
        { roomNumber: '310', code: 'DK-K' }, { roomNumber: '213', code: 'DMVT-QQ' },
        { roomNumber: '214', code: 'DMVT-QQ' }, { roomNumber: '311', code: 'GMVB-QQ/POC' }, { roomNumber: '104', code: 'GMVC-QQ' },
        { roomNumber: '212', code: 'GMVT-QQ/POC' }, { roomNumber: '220', code: 'KBS-K/POC' }, { roomNumber: '319', code: 'KBS-K/POC' },
        { roomNumber: '219', code: 'KJS-K/POC' }, { roomNumber: '318', code: 'KJS-K/POC' }, { roomNumber: '101', code: 'LKBS-K/POC' },
        { roomNumber: '201', code: 'LKBS-K/POC' }, { roomNumber: '312', code: 'PMVB-QQ' }, { roomNumber: '313', code: 'PMVB-QQ' },
        { roomNumber: '105', code: 'QJS-QQ/POC' }, { roomNumber: '106', code: 'QJS-QQ/POC' }, { roomNumber: '107', code: 'QJS-QQ/POC' },
        { roomNumber: '108', code: 'TK-K' }, { roomNumber: '208', code: 'TK-K' }, { roomNumber: '209', code: 'TK-K' },
        { roomNumber: '211', code: 'TK-K' }, { roomNumber: '221', code: 'TK-K' }, { roomNumber: '307', code: 'TK-K' }, { roomNumber: '308', code: 'TK-K' }, { roomNumber: '309', code: 'TK-K' },
        { roomNumber: '103', code: 'TQ-QQ' }, { roomNumber: '314', code: 'TQ-QQ' }, { roomNumber: '203', code: 'TQ-QQ' },
        { roomNumber: '207', code: 'TQ-QQ' }, { roomNumber: '215', code: 'TQ-QQ' }, { roomNumber: '216', code: 'TQ-QQ' },
        { roomNumber: '217', code: 'TQ-QQ' }, { roomNumber: '316', code: 'TQ-QQ' }, { roomNumber: '315', code: 'TQ-QQ' }, { roomNumber: '317', code: 'TQ-QQ' }, { roomNumber: '210', code: 'TQ-QQ' },
        { roomNumber: '206', code: 'TQHC-QQ' }, { roomNumber: '218', code: 'TQHC-QQ' }
    ],
    hvi: [
        { roomNumber: '301', code: '1QST-Q' },
        { roomNumber: '302', code: 'KGD-K' }, { roomNumber: '303', code: 'KGD-K' }, { roomNumber: '304', code: 'KGD-K' }, { roomNumber: '305', code: 'KGD-K' }, { roomNumber: '309', code: 'KGD-K' },
        { roomNumber: '107', code: 'KGDB-K' }, { roomNumber: '108', code: 'KGDB-K' }, { roomNumber: '112', code: 'KGDB-K' }, { roomNumber: '201', code: 'KGDB-K' }, { roomNumber: '202', code: 'KGDB-K' }, { roomNumber: '203', code: 'KGDB-K' }, { roomNumber: '208', code: 'KGDB-K' },
        { roomNumber: '105', code: 'KGHI-K' }, { roomNumber: '106', code: 'KGHI-K' },
        { roomNumber: '113', code: 'KGST-K' }, { roomNumber: '209', code: 'KGST-K' }, { roomNumber: '314', code: 'KGST-K' }, { roomNumber: '406', code: 'KGST-K' }, { roomNumber: '407', code: 'KGST-K' }, { roomNumber: '408', code: 'KGST-K' }, { roomNumber: '409', code: 'KGST-K' },
        { roomNumber: '116', code: 'KHAN-K' }, { roomNumber: '213', code: 'KHAN-K' },
        { roomNumber: '401', code: 'PKB-K' }, { roomNumber: '402', code: 'PKB-K' }, { roomNumber: '403', code: 'PKB-K' }, { roomNumber: '404', code: 'PKB-K' },
        { roomNumber: '306', code: 'QQD-QQ' }, { roomNumber: '307', code: 'QQD-QQ' }, { roomNumber: '308', code: 'QQD-QQ' },
        { roomNumber: '109', code: 'QQDB-QQ' }, { roomNumber: '110', code: 'QQDB-QQ' }, { roomNumber: '111', code: 'QQDB-QQ' }, { roomNumber: '204', code: 'QQDB-QQ' }, { roomNumber: '205', code: 'QQDB-QQ' }, { roomNumber: '206', code: 'QQDB-QQ' }, { roomNumber: '207', code: 'QQDB-QQ' },
        { roomNumber: '101', code: 'QQHI-QQ' }, { roomNumber: '102', code: 'QQHI-QQ' }, { roomNumber: '103', code: 'QQHI-QQ' }, { roomNumber: '104', code: 'QQHI-QQ' },
        { roomNumber: '114', code: 'QQST-QQ' }, { roomNumber: '115', code: 'QQST-QQ' }, { roomNumber: '210', code: 'QQST-QQ' }, { roomNumber: '211', code: 'QQST-QQ' }, { roomNumber: '212', code: 'QQST-QQ' }, { roomNumber: '310', code: 'QQST-QQ' }, { roomNumber: '311', code: 'QQST-QQ' }, { roomNumber: '312', code: 'QQST-QQ' }, { roomNumber: '313', code: 'QQST-QQ' },
        { roomNumber: '405', code: 'SUITE-K' }
    ],
    spec: [
        { roomNumber: '203', code: 'DK' }, { roomNumber: '303', code: 'DK' },
        { roomNumber: '305', code: 'DKB' }, { roomNumber: '306', code: 'DKB' }, { roomNumber: '309', code: 'DKB' }, { roomNumber: '310', code: 'DKB' }, { roomNumber: '311', code: 'DKB' },
        { roomNumber: '101', code: 'DKC' }, { roomNumber: '102', code: 'DKC' }, { roomNumber: '103', code: 'DKC' },
        { roomNumber: '201', code: 'DKS' }, { roomNumber: '301', code: 'DKS' },
        { roomNumber: '104', code: 'GKS' }, { roomNumber: '204', code: 'GKS' },
        { roomNumber: '107', code: 'PKSB' }, { roomNumber: '207', code: 'PKSB' }, { roomNumber: '307', code: 'PKSB' },
        { roomNumber: '105', code: 'TK' }, { roomNumber: '106', code: 'TK' }, { roomNumber: '109', code: 'TK' }, { roomNumber: '110', code: 'TK' }, { roomNumber: '111', code: 'TK' }, { roomNumber: '202', code: 'TK' }, { roomNumber: '205', code: 'TK' }, { roomNumber: '206', code: 'TK' }, { roomNumber: '209', code: 'TK' }, { roomNumber: '210', code: 'TK' }, { roomNumber: '211', code: 'TK' }, { roomNumber: '214', code: 'TK' }, { roomNumber: '302', code: 'TK' }, { roomNumber: '314', code: 'TK' },
        { roomNumber: '114', code: 'TKHC' },
        { roomNumber: '108', code: 'TQ' }, { roomNumber: '112', code: 'TQ' }, { roomNumber: '208', code: 'TQ' }, { roomNumber: '212', code: 'TQ' }, { roomNumber: '213', code: 'TQ' }, { roomNumber: '308', code: 'TQ' }, { roomNumber: '312', code: 'TQ' }, { roomNumber: '313', code: 'TQ' },
        { roomNumber: '113', code: 'TQHC' }
    ],
    // --- NEW "COL" INVENTORY ADDED ---
    col: [
        { roomNumber: 'W101', code: '2BRDM-K/Q/POC' },
        { roomNumber: 'S101', code: 'ADA-Q' }, { roomNumber: 'S102', code: 'ADA-Q' },
        { roomNumber: 'C203', code: 'KGST-K' }, { roomNumber: 'D102', code: 'KGST-K' }, { roomNumber: 'H204', code: 'KGST-K' }, { roomNumber: 'R205', code: 'KGST-K' }, { roomNumber: 'S103', code: 'KGST-K' },
        { roomNumber: 'R203', code: 'KGSTV-K' }, { roomNumber: 'S205', code: 'KGSTV-K' },
        { roomNumber: 'C102', code: 'KSTE-K/POC' }, { roomNumber: 'C204', code: 'KSTE-K/POC' }, { roomNumber: 'D203', code: 'KSTE-K/POC' }, { roomNumber: 'H102', code: 'KSTE-K/POC' }, { roomNumber: 'H203', code: 'KSTE-K/POC' }, { roomNumber: 'M101', code: 'KSTE-K/POC' }, { roomNumber: 'M103', code: 'KSTE-K/POC' }, { roomNumber: 'M204', code: 'KSTE-K/POC' },
        { roomNumber: 'D101', code: 'KSTEV-K/POC' }, { roomNumber: 'H101', code: 'KSTEV-K/POC' }, { roomNumber: 'R101', code: 'KSTEV-K/POC' }, { roomNumber: 'R102', code: 'KSTEV-K/POC' }, { roomNumber: 'S207', code: 'KSTEV-K/POC' }, { roomNumber: 'W202', code: 'KSTEV-K/POC' }, { roomNumber: 'W203', code: 'KSTEV-K/POC' },
        { roomNumber: 'C101', code: 'QGST-Q' }, { roomNumber: 'R204', code: 'QGST-Q' }, { roomNumber: 'S206', code: 'QGST-Q' },
        { roomNumber: 'M102', code: 'QSTE-Q/POC' }, { roomNumber: 'S104', code: 'QSTE-Q/POC' }
    ]
    // --- END OF NEW INVENTORY ---
};


let currentCsvContent = null;
let currentRules = null;
let currentRecommendations = [];
let acceptedUpgrades = [];
let completedUpgrades = [];

// --- FUNCTIONS ---

function resetAppState() {
    currentCsvContent = null;
    currentRules = null;
    currentRecommendations = [];
    acceptedUpgrades = [];
    document.getElementById('csv-file').value = '';
    const outputEl = document.getElementById('output');
    if (outputEl) {
        outputEl.style.display = 'none';
    }
    if (document.getElementById('recommendations-container')) document.getElementById('recommendations-container').innerHTML = '';
    if (document.getElementById('matrix-container')) document.getElementById('matrix-container').innerHTML = '';
    if (document.getElementById('inventory')) document.getElementById('inventory').innerHTML = '';
    if (document.getElementById('message')) document.getElementById('message').innerHTML = '';
    displayAcceptedUpgrades();
}

function updateRulesForm(profileName) {
    const profile = profiles[profileName];
    if (!profile) return;
    document.getElementById('hierarchy').value = profile.hierarchy;
    document.getElementById('target-rooms').value = profile.targetRooms;
    document.getElementById('prioritized-rates').value = profile.prioritizedRates;
    document.getElementById('ota-rates').value = profile.otaRates;
    document.getElementById('ineligible-upgrades').value = profile.ineligibleUpgrades;
}

/**
 * NEW FUNCTION: Enables or disables all admin-only controls.
 * @param {boolean} isAdmin - True if the user is an admin, false otherwise.
 */
function setAdminControls(isAdmin) {
    // We want to DISABLE the controls if the user is NOT an admin.
    const shouldBeDisabled = !isAdmin;

    // Get all the elements to lock
    const elementsToToggle = [
        // "Define Upgrade Rules" section
        document.getElementById('hierarchy'),
        document.getElementById('target-rooms'),
        document.getElementById('prioritized-rates'),
        document.getElementById('ota-rates'),
        document.getElementById('ineligible-upgrades'),


    ];

    // Loop through each element and set its 'disabled' state
    elementsToToggle.forEach(el => {
        // This 'if (el)' check is crucial.
        // It prevents errors if this function runs before the DOM is loaded.
        if (el) {
            el.disabled = shouldBeDisabled;
        }
    });
}


async function loadCompletedUpgrades(userId) {
    if (!userId) return;
    completedUpgrades = [];
    const upgradesRef = db.collection('users').doc(userId).collection('completedUpgrades');
    try {
        const snapshot = await upgradesRef.get();
        snapshot.forEach(doc => {
            const upgrade = doc.data();
            if (upgrade.completedTimestamp && upgrade.completedTimestamp.toDate) {
                upgrade.completedTimestamp = upgrade.completedTimestamp.toDate();
            }
            completedUpgrades.push(upgrade);
        });
        console.log(`Loaded ${completedUpgrades.length} completed upgrades from Firestore.`);
        displayCompletedUpgrades();
    } catch (error) {
        console.error("Error loading completed upgrades: ", error);
    }
}

const handleSignIn = () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = '';
    if (!email || !password) {
        errorMessage.textContent = "Please enter both email and password.";
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            console.error("Firebase sign-in error:", error);
            errorMessage.textContent = error.message;
        });
};

const handleSignOut = () => {
    auth.signOut();
};

async function handleClearAnalytics() {
    if (!confirm("Are you sure you want to permanently delete ALL completed upgrades for this profile? This cannot be undone.")) {
        return;
    }

    const user = auth.currentUser;
    const currentProfile = document.getElementById('profile-dropdown').value;
    if (!user) return;

    showLoader(true, 'Clearing Data...');
    const upgradesRef = db.collection('users').doc(user.uid).collection('completedUpgrades');
    const query = upgradesRef.where('profile', '==', currentProfile);

    try {
        const snapshot = await query.get();
        if (snapshot.empty) {
            alert("No data to clear for this profile.");
            showLoader(false);
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        alert(`Successfully deleted ${snapshot.size} records for the ${currentProfile.toUpperCase()} profile.`);
        await loadCompletedUpgrades(user.uid);
        showLoader(false);

    } catch (error) {
        console.error("Error clearing analytics data: ", error);
        showError({ message: "Failed to clear analytics data." });
        showLoader(false);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // --- 1. ALL DOM ELEMENT REFERENCES ARE ASSIGNED FIRST ---
    loginContainer = document.getElementById('login-container');
    appContainer = document.getElementById('app-container');
    signinBtn = document.getElementById('signin-btn');
    signoutBtn = document.getElementById('signout-btn');
    emailInput = document.getElementById('email-input');
    passwordInput = document.getElementById('password-input');
    errorMessage = document.getElementById('error-message');
    clearAnalyticsBtn = document.getElementById('clear-analytics-btn');

    // --- 2. THE AUTH LISTENER IS NOW *INSIDE* DOMCONTENTLOADED ---
    // This guarantees all elements above are found BEFORE this code runs.
    auth.onAuthStateChanged(user => {
        const adminButton = document.getElementById('clear-analytics-btn');

        if (user) {
            console.log("User is signed in:", user.uid);
            if (loginContainer) loginContainer.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');

            // --- NEW LOGIC ---
            // 1. Check if the user is an admin and store it in a variable
            const isUserAdmin = ADMIN_UIDS.includes(user.uid);

            // Check if the signed-in user's UID is in the admin list
            if (isUserAdmin && adminButton) {
                console.log("User is an admin!");
                adminButton.classList.remove('hidden');
            }

            // 2. Call our new function to lock or unlock controls
            setAdminControls(isUserAdmin);
            // --- END NEW LOGIC ---

            loadCompletedUpgrades(user.uid);
        } else {
            console.log("User is signed out.");
            if (loginContainer) loginContainer.classList.remove('hidden');
            if (appContainer) appContainer.classList.add('hidden');
            if (adminButton) adminButton.classList.add('hidden');

            // 3. Call our new function to lock controls for signed-out users
            setAdminControls(false);
        }
    });
    // --- END OF MOVED AUTH LISTENER ---


    // --- 3. ALL OTHER EVENT LISTENERS ARE ADDED ---
    const profileDropdown = document.getElementById('profile-dropdown');
    profileDropdown.addEventListener('change', (event) => {
        updateRulesForm(event.target.value);
        resetAppState();
        displayCompletedUpgrades();
    });
    updateRulesForm('fqi'); // Default to FQI on load

    signinBtn.addEventListener('click', handleSignIn);
    signoutBtn.addEventListener('click', handleSignOut);
    clearAnalyticsBtn.addEventListener('click', handleClearAnalytics);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    document.getElementById('selected-date').value = futureDate.toISOString().slice(0, 10);
    document.getElementById('generate-btn').addEventListener('click', handleGenerateClick);
    document.getElementById('sort-date-dropdown').addEventListener('change', displayCompletedUpgrades);
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
});

function handleGenerateClick() {
    const fileInput = document.getElementById('csv-file');
    if (fileInput.files.length === 0) {
        alert('Please upload a CSV file.');
        return;
    }
    acceptedUpgrades = [];
    displayAcceptedUpgrades();

    const rules = {
        hierarchy: document.getElementById('hierarchy').value,
        targetRooms: document.getElementById('target-rooms').value,
        prioritizedRates: document.getElementById('prioritized-rates').value,
        otaRates: document.getElementById('ota-rates').value,
        ineligibleUpgrades: document.getElementById('ineligible-upgrades').value,
        selectedDate: document.getElementById('selected-date').value,
        profile: document.getElementById('profile-dropdown').value // <-- ***MODIFICATION 1: Profile is added to rules***
    };
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCsvContent = e.target.result;
        currentRules = rules;
        showLoader(true, 'Generating...');
        setTimeout(() => {
            try {
                const results = processUpgradeData(currentCsvContent, currentRules);
                displayResults(results);
            } catch (err) {
                showError(err);
            }
        }, 50);
    };
    reader.readAsText(fileInput.files[0]);
}

function handleAcceptClick(event) {
    const button = event.target;
    const recIndex = button.dataset.index;
    const acceptedRec = currentRecommendations[recIndex];
    if (!acceptedRec) {
        showError({ message: 'Could not find the recommendation to accept.' });
        return;
    }
    const card = button.closest('.rec-card');
    card.style.opacity = '0.5';
    button.disabled = true;
    button.textContent = 'Accepted';

    // --- UPDATED LOGIC FOR UNDO SUPPORT ---
    // 1. Add to our global accepted array immediately
    acceptedUpgrades.push(acceptedRec);

    setTimeout(() => {
        try {
            // 2. Recalculate based on the updated global array
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules);
            displayResults(results);
        } catch (err) {
            showError(err);
            // If error, revert UI changes
            acceptedUpgrades.pop(); // Remove the failed add
            card.style.opacity = '1';
            button.disabled = false;
            button.textContent = 'Accept';
        }
    }, 50);
}

// --- NEW FUNCTION FOR UNDO ---
function handleUndoClick(event) {
    const button = event.target;
    const index = parseInt(button.dataset.index, 10);

    // 1. Remove the item from the acceptedUpgrades array
    acceptedUpgrades.splice(index, 1);

    // 2. Show loader momentarily
    showLoader(true, 'Reverting...');

    // 3. Recalculate everything based on the REMAINING accepted upgrades
    setTimeout(() => {
        try {
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules);
            displayResults(results);
        } catch (err) {
            showError(err);
        }
    }, 50);
}

function handlePmsUpdateClick(event) {
    const user = auth.currentUser;
    if (!user) {
        showError({ message: "You must be logged in to save." });
        return;
    }
    const recIndex = event.target.dataset.index;
    const resIdToComplete = acceptedUpgrades[recIndex].resId;
    const itemIndex = acceptedUpgrades.findIndex(item => item.resId === resIdToComplete);
    if (itemIndex > -1) {
        const upgradeToComplete = acceptedUpgrades.splice(itemIndex, 1)[0];
        upgradeToComplete.completedTimestamp = new Date();
        upgradeToComplete.profile = document.getElementById('profile-dropdown').value;
        completedUpgrades.push(upgradeToComplete);
        const upgradesRef = db.collection('users').doc(user.uid).collection('completedUpgrades');
        upgradesRef.add(upgradeToComplete)
            .then((docRef) => {
                console.log(`Upgrade saved to Firestore with ID: ${docRef.id} under profile: ${upgradeToComplete.profile}`);
            })
            .catch((error) => {
                console.error("Error saving upgrade: ", error);
                completedUpgrades.pop();
                acceptedUpgrades.splice(itemIndex, 0, upgradeToComplete);
                showError({ message: "Could not save upgrade to cloud." });
            });
        displayAcceptedUpgrades();
        displayCompletedUpgrades();
    }
}

function displayResults(data) {
    showLoader(false);
    if (data.error) { showError({ message: data.error }); return; }
    if (data.acceptedUpgrades) {
        acceptedUpgrades = data.acceptedUpgrades;
    }
    currentRecommendations = data.recommendations || [];
    displayAcceptedUpgrades();
    displayRecommendations(currentRecommendations);
    document.getElementById('output').style.display = 'block';
    const messageEl = document.getElementById('message');
    messageEl.style.display = data.message ? 'block' : 'none';
    messageEl.innerHTML = data.message || '';
    displayInventory(data.inventory);
    displayMatrix(data.matrixData);
}

function displayInventory(inventory) {
    const container = document.getElementById('inventory');
    let availableRooms = [];
    for (const room in inventory) {
        if (inventory[room] > 0) { availableRooms.push(`<strong>${room}:</strong> ${inventory[room]}`); }
    }
    container.innerHTML = '<h3>Available Rooms for Selected Date</h3>' + (availableRooms.length > 0 ? availableRooms.join(' | ') : '<p>No rooms available.</p>');
}

function displayRecommendations(recs) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';
    if (recs && recs.length > 0) {
        const recommendationsByDate = recs.reduce((groups, rec) => {
            const date = rec.arrivalDate;
            if (!groups[date]) { groups[date] = []; }
            groups[date].push(rec);
            return groups;
        }, {});
        const dates = Object.keys(recommendationsByDate).sort((a, b) => new Date(a) - new Date(b));
        dates.forEach(date => {
            const dateHeader = document.createElement('h2');
            dateHeader.className = 'date-header';
            dateHeader.textContent = `Arrivals for ${date}`;
            container.appendChild(dateHeader);
            recommendationsByDate[date].forEach(rec => {
                const originalIndex = currentRecommendations.findIndex(originalRec => originalRec.resId === rec.resId);
                const card = document.createElement('div');
                card.className = 'rec-card';
                card.innerHTML = `
                                <div class="rec-info">
                                    <h3>${rec.name} (${rec.resId})</h3>
                                    <div class="rec-details">
                                        Booked: <b>${rec.room}</b> for ${rec.nights} night(s) | Rate: <i>${rec.rate}</i><br>
                                        Value of Reservation: <strong>${rec.revenue}</strong>
                                    </div>
                                    <div class="rec-reason">Reason: Frees up a high-demand '${rec.room}' room.</div>
                                </div>
                                <div class="rec-actions">
                                    <div class="rec-upgrade-to">Upgrade To<br><strong>${rec.upgradeTo}</strong></div>
                                    <div class="rec-score">${rec.score}</div>
                                    <button class="accept-btn" data-index="${originalIndex}">Accept</button>
                                </div>
                `;
                container.appendChild(card);
            });
        });
        container.querySelectorAll('.accept-btn').forEach(btn => btn.addEventListener('click', handleAcceptClick));
    } else {
        container.innerHTML = '<p>No upgrade recommendations found for the next 7 days.</p>';
    }
}

// --- UPDATED FUNCTION: INCLUDES UNDO BUTTON ---
function displayAcceptedUpgrades() {
    const container = document.getElementById('accepted-container');
    container.innerHTML = '';
    let totalValue = 0;
    if (acceptedUpgrades && acceptedUpgrades.length > 0) {
        const totalHeader = document.createElement('h3');
        container.appendChild(totalHeader);
        acceptedUpgrades.forEach((rec, index) => {
            totalValue += parseFloat(rec.revenue.replace(/[$,]/g, '')) || 0;
            const card = document.createElement('div');
            card.className = 'rec-card';
            //card.style.borderLeft = '5px solid #28a745'; // Visual indicator
            
            card.innerHTML = `
                                <div class="rec-info">
                                    <h3>${rec.name} (${rec.resId})</h3>
                                    <div class="rec-details">
                                        Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br>
                                        Value of Reservation: <strong>${rec.revenue}</strong>
                                    </div>
                                </div>
                                <div class="rec-actions">
                                    <button class="pms-btn" data-index="${index}" style="margin-right: 5px;">Mark as PMS Updated</button>
                                    <button class="undo-btn" data-index="${index}" style="background-color: #dc3545; color: white;">Undo</button>
                                </div>
            `;
            container.appendChild(card);
        });
        totalHeader.textContent = `Total Value of Accepted Upgrades: ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        
        // PMS Update Listeners
        container.querySelectorAll('.pms-btn').forEach(btn => {
            btn.addEventListener('click', handlePmsUpdateClick);
        });
        
        // Undo Listeners
        container.querySelectorAll('.undo-btn').forEach(btn => {
            btn.addEventListener('click', handleUndoClick);
        });

    } else {
        container.innerHTML = '<p>No upgrades have been accepted yet.</p>';
    }
}

function displayCompletedUpgrades() {
    const container = document.getElementById('completed-container');
    const dateDropdown = document.getElementById('sort-date-dropdown');
    const profileDropdown = document.getElementById('profile-dropdown');

    // --- SAFETY CHECK ---
    // This check prevents a crash if elements aren't ready
    if (!container || !dateDropdown || !profileDropdown) {
        console.warn('displayCompletedUpgrades called before DOM was ready.');
        return;
    }
    // --- END SAFETY CHECK ---

    const selectedDate = dateDropdown.value;
    const currentProfile = profileDropdown.value;
    let totalValue = 0;
    const profileUpgrades = completedUpgrades.filter(rec => rec.profile === currentProfile);
    while (dateDropdown.options.length > 1) {
        dateDropdown.remove(1);
    }
    const existingOptions = new Set(Array.from(dateDropdown.options).map(opt => opt.value));
    const uniqueDates = new Set(profileUpgrades.map(rec => rec.completedTimestamp.toLocaleDateString()));
    uniqueDates.forEach(date => {
        if (!existingOptions.has(date)) {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateDropdown.appendChild(option);
        }
    });
    container.innerHTML = '';
    const dateFilteredUpgrades = selectedDate === 'all'
        ? profileUpgrades
        : profileUpgrades.filter(rec => rec.completedTimestamp.toLocaleDateString() === selectedDate);

    if (dateFilteredUpgrades && dateFilteredUpgrades.length > 0) {
        dateFilteredUpgrades.sort((a, b) => b.completedTimestamp - a.completedTimestamp);
        dateFilteredUpgrades.forEach(rec => {
            totalValue += parseFloat(rec.revenue.replace(/[$,]/g, '')) || 0;
            const card = document.createElement('div');
            card.className = 'rec-card completed';
            card.innerHTML = `
                                <div class="rec-info">
                                    <h3>${rec.name} (${rec.resId})</h3>
                                    <div class="rec-details">
                                        Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br>
                                        Value of Reservation: <strong>${rec.revenue}</strong><br>
                                        Completed On: <strong>${rec.completedTimestamp.toLocaleDateString()}</strong>
                                    </div>
                                </div>
                                <div class="rec-actions" style="color: var(--success-color);">
                                    <strong style="color: #4343FF;">✓ Completed</strong>
                                </div>
            `;
            container.appendChild(card);
        });
        const totalHeader = document.createElement('h3');
        totalHeader.style.textAlign = 'right';
        totalHeader.style.marginTop = '20px';
        totalHeader.textContent = `Total Value: ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        container.appendChild(totalHeader);
    } else {
        container.innerHTML = '<p>No upgrades have been marked as completed for this profile and date.</p>';
    }
}


// --- MODIFIED FUNCTION ---
// This function now builds the table with simple <td> tags
// and then calls 'colorMatrixCells()' to apply the classes.
function displayMatrix(matrix) {
    const container = document.getElementById('matrix-container');
    if (!matrix || !matrix.headers || !matrix.rows) {
        container.innerHTML = '<p>Could not generate the availability matrix.</p>';
        return;
    }
    let html = '<table><thead><tr>' + matrix.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    matrix.rows.forEach(row => {
        html += `<tr><td><strong>${row.roomCode}</strong></td>`;
        row.availability.forEach(avail => {
            // MODIFICATION: Removed inline style logic.
            // The new 'colorMatrixCells' function will handle styling.
            html += `<td>${avail}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    // NEW: Call the coloring function after the HTML is rendered
    colorMatrixCells();
}

// --- NEW FUNCTION ---
/**
 * Applies color classes to the availability matrix cells based on their
 * numeric value (red for < 0, black for 0-2, blue for 3+).
 */
function colorMatrixCells() {
    // Find all data cells (td) inside the matrix table
    // We skip the first cell in each row (the Room Type) using :not(:first-child)
    const cells = document.querySelectorAll("#matrix-container td:not(:first-child)");

    cells.forEach(cell => {
        // Get the text from the cell and turn it into a number
        const value = parseInt(cell.textContent, 10);

        // Skip cells that aren't numbers (e.g., if they are empty)
        if (isNaN(value)) {
            return;
        }

        // Remove any old classes just in case
        cell.classList.remove('matrix-neg', 'matrix-low', 'matrix-high');

        // Add the correct class based on the value
        if (value < 0) {
            cell.classList.add('matrix-neg'); // Red (from CSS)
        } else if (value >= 3) {
            cell.classList.add('matrix-high'); // Blue (from CSS)
        } else {
            // This will cover 0, 1, and 2
            cell.classList.add('matrix-low'); // Black (from CSS)
        }
    });
}


function showError(error) {
    showLoader(false);
    alert(error.message || 'An unknown error occurred.');
    console.error(error);
}

function showLoader(show, text = 'Loading...') {
    const loader = document.getElementById('loader');
    const output = document.getElementById('output');
    const genBtn = document.getElementById('generate-btn');

    if (loader) loader.style.display = show ? 'block' : 'none';
    if (loader) loader.innerHTML = `<div class="spinner"></div>${text}`;
    if (output) output.style.display = show ? 'none' : 'block';

    if (genBtn) {
        genBtn.disabled = show;
    }
}

function parseCsv(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headerLine = lines.shift();
    const header = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.map(line => {
        const row = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField);
        return row;
    });
    return { data, header };
}

// --- RENAMED AND UPGRADED FUNCTION FOR UNDO SUPPORT ---
function applyUpgradesAndRecalculate(currentAcceptedList, csvContent, rules) {
    // 1. Parse the original clean CSV data
    const { data, header } = parseCsv(csvContent);
    const allReservations = parseAllReservations(data, header);

    // 2. Apply ALL currently accepted upgrades to the clean data
    // This simulates the PMS being updated so the "original" room is now the "upgraded" room
    currentAcceptedList.forEach(rec => {
        const reservationToUpdate = allReservations.find(res => res.resId === rec.resId);
        if (reservationToUpdate) {
            reservationToUpdate.roomType = rec.upgradeTo;
        }
    });

    // 3. Generate new recommendations based on this modified state
    const results = generateRecommendationsFromData(allReservations, rules);
    
    // 4. Ensure the results object contains our updated list
    results.acceptedUpgrades = currentAcceptedList;
    
    return results;
}

function processUpgradeData(csvContent, rules) {
    const { data, header } = parseCsv(csvContent);
    if (!data || data.length === 0) {
        throw new Error('CSV file is empty or could not be parsed.');
    }
    const requiredHeaders = ['Guest Name', 'Res ID', 'Room Type', 'Rate Name', 'Rate', 'Arrival Date', 'Departure Date', 'Status'];
    const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) {
        throw new Error(`The uploaded PMS export is missing required columns. Could not find: '${missingHeaders.join(', ')}'`);
    }
    const allReservations = parseAllReservations(data, header);
    return generateRecommendationsFromData(allReservations, rules);
}

// --- MODIFIED FUNCTION: NOW INCLUDES DISTANCE SORTING ---
function generateRecommendationsFromData(allReservations, rules) {
    // --- 1. Get Master Inventory based on Profile ---
    const masterInventory = getMasterInventory(rules.profile);

    // Safety check if inventory fails to load
    if (Object.keys(masterInventory).length === 0) {
        return {
            error: `Could not load master inventory for profile '${rules.profile}'. Please check the MASTER_INVENTORIES configuration.`
        };
    }

    // --- 2. Filter out already completed upgrades for this specific profile ---
    const currentProfile = rules.profile;
    const completedResIdsForProfile = new Set(
        completedUpgrades
            .filter(up => up.profile === currentProfile)
            .map(up => up.resId)
    );

    // Check if we have reservations to process
    if (allReservations.length === 0) {
        return {
            recommendations: [],
            inventory: getInventoryForDate(masterInventory, buildReservationsByDate([]), parseDate(rules.selectedDate)),
            matrixData: generateMatrixData(masterInventory, buildReservationsByDate([]), parseDate(rules.selectedDate), rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean)),
            message: 'No valid reservations found in the uploaded file matching the criteria.'
        };
    }

    const startDate = parseDate(rules.selectedDate);
    const reservationsByDate = buildReservationsByDate(allReservations);
    const todayInventory = getInventoryForDate(masterInventory, reservationsByDate, startDate);
    const roomHierarchy = rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const matrixData = generateMatrixData(masterInventory, reservationsByDate, startDate, roomHierarchy);
    
    const originalTargetRooms = rules.targetRooms.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const otaRates = rules.otaRates.toLowerCase().split(',').map(r => r.trim()).filter(Boolean);
    const ineligibleUpgrades = rules.ineligibleUpgrades.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const useDefaultLogic = originalTargetRooms.length === 0;

    // Helper to check availability across the entire stay
    const isRoomAvailableForStay = (roomCode, reservation, invByDate, masterInv) => {
        let checkDate = new Date(reservation.arrival);
        while (checkDate < reservation.departure) {
            const dateString = checkDate.toISOString().split('T')[0];
            const occupiedCount = invByDate[dateString]?.[roomCode] || 0;
            if (occupiedCount >= (masterInv[roomCode] || 0)) return false;
            checkDate.setUTCDate(checkDate.getUTCDate() + 1);
        }
        return true;
    };

    let recommendations = [];

    // --- 3. Loop through the next 7 days ---
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(startDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + dayOffset);
        const currentTimestamp = currentDate.getTime();
        
        // Filter for reservations arriving on this specific day
        const arrivalsForThisDay = allReservations.filter(r => r.arrival && r.arrival.getTime() === currentTimestamp && r.status === 'RESERVATION');
        
        let processingQueue = useDefaultLogic ? [...roomHierarchy] : [...originalTargetRooms];

        // Logic to populate processing queue if specific target rooms are defined
        if (!useDefaultLogic) {
            originalTargetRooms.forEach(targetRoom => {
                if (!arrivalsForThisDay.some(res => res.roomType === targetRoom)) {
                    const hierarchyIndex = roomHierarchy.indexOf(targetRoom);
                    if (hierarchyIndex > -1 && hierarchyIndex < roomHierarchy.length - 1) {
                        for (let i = hierarchyIndex + 1; i < roomHierarchy.length; i++) {
                            const nextRoom = roomHierarchy[i];
                            if (!ineligibleUpgrades.includes(nextRoom) && !processingQueue.includes(nextRoom)) {
                                processingQueue.push(nextRoom);
                                break;
                            }
                        }
                    }
                }
            });
        }

        // --- 4. Evaluate Rooms ---
        processingQueue.forEach((roomToEvaluate) => {
            const eligibleReservations = arrivalsForThisDay.filter(res => 
                res.roomType === roomToEvaluate && 
                !otaRates.some(ota => res.rate.toLowerCase().includes(ota)) && 
                !completedResIdsForProfile.has(res.resId) && 
                !ineligibleUpgrades.includes(res.roomType)
            );

            eligibleReservations.forEach(res => {
                const currentRoomIndex = roomHierarchy.indexOf(res.roomType);
                if (currentRoomIndex === -1) return;
                
                const originalBedType = getBedType(res.roomType);
                if (originalBedType === 'OTHER') return;

                // Look for upgrade candidates up the hierarchy
                for (let i = currentRoomIndex + 1; i < roomHierarchy.length; i++) {
                    const potentialUpgradeRoom = roomHierarchy[i];
                    const potentialBedType = getBedType(potentialUpgradeRoom);
                    
                    // Must match bed type and not be ineligible
                    if (originalBedType !== potentialBedType || ineligibleUpgrades.includes(potentialUpgradeRoom)) continue;

                    // Check availability
                    if (isRoomAvailableForStay(potentialUpgradeRoom, res, reservationsByDate, masterInventory)) {
                        const score = parseFloat(res.revenue.replace(/[$,]/g, '')) || 0;
                        
                        // --- NEW: Calculate Hierarchy Distance ---
                        // Calculate how many steps away the upgrade is (e.g., 1 step is better than 5 steps)
                        const distance = i - currentRoomIndex;

                        recommendations.push({
                            name: res.name, 
                            resId: res.resId, 
                            revenue: res.revenue,
                            room: res.roomType, 
                            rate: res.rate, 
                            nights: res.nights,
                            upgradeTo: potentialUpgradeRoom, 
                            score: score,
                            distance: distance, // Store distance for sorting
                            arrivalDate: currentDate.toLocaleDateString('en-US', { timeZone: 'UTC' })
                        });
                        
                        // Stop looking for higher rooms for this guest; we found the first available valid upgrade.
                        break; 
                    }
                }
            });
        });
    }

    // --- 5. Sort Recommendations ---
    // Primary Sort: Revenue (Score) Descending
    // Secondary Sort (Tie-breaker): Distance Ascending (Closest upgrade wins)
    recommendations.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // High revenue first
        }
        return a.distance - b.distance; // If revenue matches, shortest jump first
    });

    return {
        recommendations,
        inventory: todayInventory,
        matrixData,
        message: recommendations.length === 0 ? 'No suitable upgrade candidates found for the next 7 days.' : null
    };
}

// --- END OF MODIFIED FUNCTION ---

// --- ***MODIFICATION 4: Upgraded getBedType function*** ---
/**
 * Gets the bed type from a room code.
 * This is now flexible to support 'TK-K', 'TQ-QQ', '1QST-Q', and 'DK' style codes.
 * @param {string} roomCode - The room type code (e.g., "KGST-K").
 * @returns {string} The bed type ('K', 'QQ', 'Q') or 'OTHER'.
 */
function getBedType(roomCode) {
    if (!roomCode) return 'OTHER';

    // 1. Handle 2BRDM specifically (It is K/Q, usually treated as a Suite/Wildcard)
    // We return 'K' here to allow King upgrades into it, assuming it's the top tier.
    if (roomCode.includes('2BRDM')) return 'K'; 

    // 2. Check for standard suffixes (Checking Includes handles the /POC issue)
    if (roomCode.includes('-K')) return 'K';   // Covers KGST-K, KSTE-K/POC, etc.
    if (roomCode.includes('-QQ')) return 'QQ'; // Covers TQ-QQ, etc.
    if (roomCode.includes('-Q')) return 'Q';   // Covers ADA-Q, QSTE-Q/POC, etc.
    
    // 3. Handle SPEC profile codes (Prefix based)
    if (roomCode.startsWith('DK')) return 'K'; // DK, DKB, DKC, DKS
    if (roomCode.startsWith('GK')) return 'K'; // GKS
    if (roomCode.startsWith('PK')) return 'K'; // PKSB
    if (roomCode.startsWith('TK')) return 'K'; // TK, TKHC
    if (roomCode.startsWith('TQ')) return 'QQ'; // TQ, TQHC

    return 'OTHER';
}

function parseAllReservations(data, header) {
    const nameIndex = header.indexOf('Guest Name');
    const resIdIndex = header.indexOf('Res ID');
    const roomTypeIndex = header.indexOf('Room Type');
    const rateNameIndex = header.indexOf('Rate Name');
    const arrivalIndex = header.indexOf('Arrival Date');
    const departureIndex = header.indexOf('Departure Date');
    const statusIndex = header.indexOf('Status');
    const rateIndex = header.indexOf('Rate');
    if (nameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) {
        throw new Error("One or more critical columns were not found in the CSV header.");
    }
    return data.map(values => {
        if (values.length < header.length) return null;
        const arrival = values[arrivalIndex] ? parseDate(values[arrivalIndex]) : null;
        const departure = values[departureIndex] ? parseDate(values[departureIndex]) : null;
        let nights = 0;
        if (arrival && departure) {
            const diffTime = departure - arrival;
            nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
        const dailyRate = parseFloat(values[rateIndex]) || 0;
        const totalRevenue = dailyRate * nights;
        return {
            name: values[nameIndex],
            resId: values[resIdIndex] ? values[resIdIndex].trim() : '',
            roomType: values[roomTypeIndex] ? values[roomTypeIndex].trim().toUpperCase() : '',
            rate: values[rateNameIndex] ? values[rateNameIndex].trim() : '',
            nights: nights,
            arrival: arrival,
            departure: departure,
            status: values[statusIndex] ? values[statusIndex].trim().toUpperCase() : '',
            revenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        };
    }).filter(r => r && r.roomType && r.arrival && r.departure && r.nights > 0);
}

function buildReservationsByDate(allReservations) {
    const reservationsByDate = {};
    allReservations.forEach(res => {
        if (!res.arrival || !res.departure) return;
        let currentDate = new Date(res.arrival);
        while (currentDate < res.departure) {
            const dateString = currentDate.toISOString().split('T')[0];
            if (!reservationsByDate[dateString]) reservationsByDate[dateString] = {};
            reservationsByDate[dateString][res.roomType] = (reservationsByDate[dateString][res.roomType] || 0) + 1;
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }
    });
    return reservationsByDate;
}

function getInventoryForDate(masterInventory, reservationsByDate, date) {
    const inventory = {};
    const dateString = date.toISOString().split('T')[0];
    for (const roomCode in masterInventory) {
        inventory[roomCode] = masterInventory[roomCode] - (reservationsByDate[dateString]?.[roomCode] || 0);
    }
    return inventory;
}

// --- ***MODIFICATION 5: getMasterInventory is now profile-aware*** ---
/**
 * Gets the master inventory count for a specific hotel profile.
 * @param {string} profileName - The name of the profile (e.g., 'fqi', 'hvi').
 * @returns {Object} An object mapping room codes to their total count.
 */
function getMasterInventory(profileName) {
    // Look up the correct room list based on the profileName
    const masterRoomList = MASTER_INVENTORIES[profileName];

    // Safety check: if no inventory is found, return an empty object.
    if (!masterRoomList) {
        console.error(`No master inventory found for profile: ${profileName}`);
        return {};
    }

    const totalInventory = {};
    masterRoomList.forEach(room => {
        totalInventory[room.code.toUpperCase()] = (totalInventory[room.code.toUpperCase()] || 0) + 1;
    });
    return totalInventory;
}


function parseDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr.includes(' ')) dateStr = dateStr.split(' ')[0];
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        else return new Date(Date.UTC(parts[2], parts[0] - 1, parts[1]));
    }
    const fallbackDate = new Date(dateStr);
    return new Date(Date.UTC(fallbackDate.getFullYear(), fallbackDate.getMonth(), fallbackDate.getDate()));
}

function generateMatrixData(totalInventory, reservationsByDate, startDate, roomHierarchy) {
    const matrix = { headers: ['Room Type'], rows: [] };
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + i);
        return date;
    });
    dates.forEach(date => matrix.headers.push(`${date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}<br>${date.getUTCMonth() + 1}/${date.getUTCDate()}`));
    roomHierarchy.forEach(roomCode => {
        const row = { roomCode, availability: [] };
        dates.forEach(date => {
            const dateString = date.toISOString().split('T')[0];
            row.availability.push((totalInventory[roomCode] || 0) - (reservationsByDate[dateString]?.[roomCode] || 0));
        });
        matrix.rows.push(row);
    });
    return matrix;
}

