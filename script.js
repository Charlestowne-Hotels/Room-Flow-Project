// The firebaseConfig object is now expected to be in Config.js
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// --- CONSTANTS & CONFIGURATION ---
const CONSTANTS = {
    ADMIN_UIDS: [
        "7BdsGq6vJ7UTmAQgVoiEesgEiao1", // jryan
        "WDOdrOdpcrPjVGyN5VmBEs4KdvW2", // mspangler
        "HjYycTyitXe10iN05MK1grYoklw2", // jcapps
        "X8GhArhO62YyqSGLgrDznMlHTdv2", // pbeam
        "uk1RjvuRfsen7mG9Z69q0AWxZv63", // kchouinard
        "p3X9TJob5adaeGgfteXUqpBHBIQ2", // bhill
        "RtUsePG61cWLIct2NAHTunMyLx52", // alane
        "5GpiVNFuoJMIgY7yHuY421XfXfk2", // smaley
        "mvnlLEc3w5VafHxqbGsFbrKpErk1", // kdehaven
        "LpryX2KYn1fJMD1tqHYrjNef8tZ2", // ndonnell
        "YgGvmU25eZbNfByPhIwy8IZvRBK2"  // nknott
    ],
    REQUIRED_CSV_HEADERS: ['Guest Name', 'Res ID', 'Room Type', 'Rate Name', 'Rate', 'Arrival Date', 'Departure Date', 'Status']
};

// Default Profiles
const DEFAULT_PROFILES = {
    fqi: { hierarchy: 'TQ-QQ,TQHC-QQ,TK-K, DK-K, KJS-K/POC, QJS-QQ/POC, CTK-K, KBS-K/POC, PMVB-QQ, DMVT-QQ, GMVC-QQ, LKBS-K/POC, GMVB-QQ/POC, GMVT-QQ/POC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TQHC-QQ' },
    hvi: { hierarchy: '1QST-Q, QQST-QQ, KGST-K, KHAN-K, QQD-QQ, KGD-K, KGDB-K, QQDB-QQ, QQHI-QQ, KGHI-K, PKB-K, SUITE-K', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'KHAN-K' },
    spec: { hierarchy: 'TQ, TQHC, TK, TKHC, DK, DKS, DKB, DKC, PKSB, GKS', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TKHC,TQHC' },
    col: { hierarchy: 'QGST-Q, ADA-Q, KGST-K, QSTE-Q/POC, KGSTV-K, KSTE-K/POC, KSTEV-K/POC, 2BRDM-K/Q/POC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'ADA-Q,2BRDM-K/Q/POC' },
    ivy: { hierarchy: 'SQ, KS, KSO, DQS, CSQ, CKS, DQSA, KSA, SQA', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, HotelTonight, Priceline', ineligibleUpgrades: 'DQSA, KSA, SQA' },
    msi: { hierarchy: 'Q, RD, RDCY, DQ, DD, HHK, TQACC', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'TQACC' },
    indjh: { hierarchy: 'QNV, QQ, QAV, QQAV, DK, CHQ, MHS-Q, MHD-Q, MHF-Q', targetRooms: '', prioritizedRates: 'Best Available, BAR, Rack', otaRates: 'Expedia, Booking.com, Priceline, GDS', ineligibleUpgrades: 'MHF-Q' }
};

// Master Inventories (Collapsed for brevity, using the provided data)
const MASTER_INVENTORIES = {
    fqi: [ { roomNumber: '103', code: 'TQ-QQ' }, { roomNumber: '203', code: 'TQ-QQ' }, { roomNumber: '207', code: 'TQ-QQ' }, { roomNumber: '210', code: 'TQ-QQ' }, { roomNumber: '215', code: 'TQ-QQ' }, { roomNumber: '216', code: 'TQ-QQ' }, { roomNumber: '217', code: 'TQ-QQ' }, { roomNumber: '314', code: 'TQ-QQ' }, { roomNumber: '315', code: 'TQ-QQ' }, { roomNumber: '316', code: 'TQ-QQ' }, { roomNumber: '317', code: 'TQ-QQ' }, { roomNumber: '206', code: 'TQHC-QQ' }, { roomNumber: '218', code: 'TQHC-QQ' }, { roomNumber: '108', code: 'TK-K' }, { roomNumber: '208', code: 'TK-K' }, { roomNumber: '209', code: 'TK-K' }, { roomNumber: '211', code: 'TK-K' }, { roomNumber: '221', code: 'TK-K' }, { roomNumber: '307', code: 'TK-K' }, { roomNumber: '308', code: 'TK-K' }, { roomNumber: '309', code: 'TK-K' }, { roomNumber: '102', code: 'DK-K' }, { roomNumber: '202', code: 'DK-K' }, { roomNumber: '204', code: 'DK-K' }, { roomNumber: '205', code: 'DK-K' }, { roomNumber: '222', code: 'DK-K' }, { roomNumber: '302', code: 'DK-K' }, { roomNumber: '303', code: 'DK-K' }, { roomNumber: '304', code: 'DK-K' }, { roomNumber: '305', code: 'DK-K' }, { roomNumber: '306', code: 'DK-K' }, { roomNumber: '310', code: 'DK-K' }, { roomNumber: '219', code: 'KJS-K/POC' }, { roomNumber: '318', code: 'KJS-K/POC' }, { roomNumber: '105', code: 'QJS-QQ/POC' }, { roomNumber: '106', code: 'QJS-QQ/POC' }, { roomNumber: '107', code: 'QJS-QQ/POC' }, { roomNumber: '301', code: 'CTK-K' }, { roomNumber: '320', code: 'CTK-K' }, { roomNumber: '220', code: 'KBS-K/POC' }, { roomNumber: '319', code: 'KBS-K/POC' }, { roomNumber: '312', code: 'PMVB-QQ' }, { roomNumber: '313', code: 'PMVB-QQ' }, { roomNumber: '213', code: 'DMVT-QQ' }, { roomNumber: '214', code: 'DMVT-QQ' }, { roomNumber: '104', code: 'GMVC-QQ' }, { roomNumber: '101', code: 'LKBS-K/POC' }, { roomNumber: '201', code: 'LKBS-K/POC' }, { roomNumber: '311', code: 'GMVB-QQ/POC' }, { roomNumber: '212', code: 'GMVT-QQ/POC' } ],
    hvi: [ { roomNumber: '301', code: '1QST-Q' }, { roomNumber: '302', code: 'KGD-K' }, { roomNumber: '303', code: 'KGD-K' }, { roomNumber: '304', code: 'KGD-K' }, { roomNumber: '305', code: 'KGD-K' }, { roomNumber: '309', code: 'KGD-K' }, { roomNumber: '107', code: 'KGDB-K' }, { roomNumber: '108', code: 'KGDB-K' }, { roomNumber: '112', code: 'KGDB-K' }, { roomNumber: '201', code: 'KGDB-K' }, { roomNumber: '202', code: 'KGDB-K' }, { roomNumber: '203', code: 'KGDB-K' }, { roomNumber: '208', code: 'KGDB-K' }, { roomNumber: '105', code: 'KGHI-K' }, { roomNumber: '106', code: 'KGHI-K' }, { roomNumber: '113', code: 'KGST-K' }, { roomNumber: '209', code: 'KGST-K' }, { roomNumber: '314', code: 'KGST-K' }, { roomNumber: '406', code: 'KGST-K' }, { roomNumber: '407', code: 'KGST-K' }, { roomNumber: '408', code: 'KGST-K' }, { roomNumber: '409', code: 'KGST-K' }, { roomNumber: '116', code: 'KHAN-K' }, { roomNumber: '213', code: 'KHAN-K' }, { roomNumber: '401', code: 'PKB-K' }, { roomNumber: '402', code: 'PKB-K' }, { roomNumber: '403', code: 'PKB-K' }, { roomNumber: '404', code: 'PKB-K' }, { roomNumber: '306', code: 'QQD-QQ' }, { roomNumber: '307', code: 'QQD-QQ' }, { roomNumber: '308', code: 'QQD-QQ' }, { roomNumber: '109', code: 'QQDB-QQ' }, { roomNumber: '110', code: 'QQDB-QQ' }, { roomNumber: '111', code: 'QQDB-QQ' }, { roomNumber: '204', code: 'QQDB-QQ' }, { roomNumber: '205', code: 'QQDB-QQ' }, { roomNumber: '206', code: 'QQDB-QQ' }, { roomNumber: '207', code: 'QQDB-QQ' }, { roomNumber: '101', code: 'QQHI-QQ' }, { roomNumber: '102', code: 'QQHI-QQ' }, { roomNumber: '103', code: 'QQHI-QQ' }, { roomNumber: '104', code: 'QQHI-QQ' }, { roomNumber: '114', code: 'QQST-QQ' }, { roomNumber: '115', code: 'QQST-QQ' }, { roomNumber: '210', code: 'QQST-QQ' }, { roomNumber: '211', code: 'QQST-QQ' }, { roomNumber: '212', code: 'QQST-QQ' }, { roomNumber: '310', code: 'QQST-QQ' }, { roomNumber: '311', code: 'QQST-QQ' }, { roomNumber: '312', code: 'QQST-QQ' }, { roomNumber: '313', code: 'QQST-QQ' }, { roomNumber: '405', code: 'SUITE-K' } ],
    spec: [ { roomNumber: '203', code: 'DK' }, { roomNumber: '303', code: 'DK' }, { roomNumber: '305', code: 'DKB' }, { roomNumber: '306', code: 'DKB' }, { roomNumber: '309', code: 'DKB' }, { roomNumber: '310', code: 'DKB' }, { roomNumber: '311', code: 'DKB' }, { roomNumber: '101', code: 'DKC' }, { roomNumber: '102', code: 'DKC' }, { roomNumber: '103', code: 'DKC' }, { roomNumber: '201', code: 'DKS' }, { roomNumber: '301', code: 'DKS' }, { roomNumber: '104', code: 'GKS' }, { roomNumber: '204', code: 'GKS' }, { roomNumber: '107', code: 'PKSB' }, { roomNumber: '207', code: 'PKSB' }, { roomNumber: '307', code: 'PKSB' }, { roomNumber: '105', code: 'TK' }, { roomNumber: '106', code: 'TK' }, { roomNumber: '109', code: 'TK' }, { roomNumber: '110', code: 'TK' }, { roomNumber: '111', code: 'TK' }, { roomNumber: '202', code: 'TK' }, { roomNumber: '205', code: 'TK' }, { roomNumber: '206', code: 'TK' }, { roomNumber: '209', code: 'TK' }, { roomNumber: '210', code: 'TK' }, { roomNumber: '211', code: 'TK' }, { roomNumber: '214', code: 'TK' }, { roomNumber: '302', code: 'TK' }, { roomNumber: '314', code: 'TK' }, { roomNumber: '114', code: 'TKHC' }, { roomNumber: '108', code: 'TQ' }, { roomNumber: '112', code: 'TQ' }, { roomNumber: '208', code: 'TQ' }, { roomNumber: '212', code: 'TQ' }, { roomNumber: '213', code: 'TQ' }, { roomNumber: '308', code: 'TQ' }, { roomNumber: '312', code: 'TQ' }, { roomNumber: '313', code: 'TQ' }, { roomNumber: '113', code: 'TQHC' } ],
    col: [ { roomNumber: 'W101', code: '2BRDM-K/Q/POC' }, { roomNumber: 'S101', code: 'ADA-Q' }, { roomNumber: 'S102', code: 'ADA-Q' }, { roomNumber: 'C203', code: 'KGST-K' }, { roomNumber: 'D102', code: 'KGST-K' }, { roomNumber: 'H204', code: 'KGST-K' }, { roomNumber: 'R205', code: 'KGST-K' }, { roomNumber: 'S103', code: 'KGST-K' }, { roomNumber: 'R203', code: 'KGSTV-K' }, { roomNumber: 'S205', code: 'KGSTV-K' }, { roomNumber: 'C102', code: 'KSTE-K/POC' }, { roomNumber: 'C204', code: 'KSTE-K/POC' }, { roomNumber: 'D203', code: 'KSTE-K/POC' }, { roomNumber: 'H102', code: 'KSTE-K/POC' }, { roomNumber: 'H203', code: 'KSTE-K/POC' }, { roomNumber: 'M101', code: 'KSTE-K/POC' }, { roomNumber: 'M103', code: 'KSTE-K/POC' }, { roomNumber: 'M204', code: 'KSTE-K/POC' }, { roomNumber: 'D101', code: 'KSTEV-K/POC' }, { roomNumber: 'H101', code: 'KSTEV-K/POC' }, { roomNumber: 'R101', code: 'KSTEV-K/POC' }, { roomNumber: 'R102', code: 'KSTEV-K/POC' }, { roomNumber: 'S207', code: 'KSTEV-K/POC' }, { roomNumber: 'W202', code: 'KSTEV-K/POC' }, { roomNumber: 'W203', code: 'KSTEV-K/POC' }, { roomNumber: 'C101', code: 'QGST-Q' }, { roomNumber: 'R204', code: 'QGST-Q' }, { roomNumber: 'S206', code: 'QGST-Q' }, { roomNumber: 'M102', code: 'QSTE-Q/POC' }, { roomNumber: 'S104', code: 'QSTE-Q/POC' } ],
    ivy: [ { roomNumber: '1401', code: 'CKS' }, { roomNumber: '1402', code: 'CKS' }, { roomNumber: '1404', code: 'CKS' }, { roomNumber: '1405', code: 'CKS' }, { roomNumber: '1403', code: 'CSQ' }, { roomNumber: '201', code: 'DQS' }, { roomNumber: '205', code: 'DQS' }, { roomNumber: '301', code: 'DQS' }, { roomNumber: '305', code: 'DQS' }, { roomNumber: '401', code: 'DQS' }, { roomNumber: '405', code: 'DQSA' }, { roomNumber: '1001', code: 'KS' }, { roomNumber: '1002', code: 'KS' }, { roomNumber: '1101', code: 'KS' }, { roomNumber: '1102', code: 'KS' }, { roomNumber: '1202', code: 'KS' }, { roomNumber: '1301', code: 'KS' }, { roomNumber: '1302', code: 'KS' }, { roomNumber: '202', code: 'KS' }, { roomNumber: '302', code: 'KS' }, { roomNumber: '402', code: 'KS' }, { roomNumber: '501', code: 'KS' }, { roomNumber: '601', code: 'KS' }, { roomNumber: '602', code: 'KS' }, { roomNumber: '701', code: 'KS' }, { roomNumber: '702', code: 'KS' }, { roomNumber: '801', code: 'KS' }, { roomNumber: '802', code: 'KS' }, { roomNumber: '901', code: 'KS' }, { roomNumber: '902', code: 'KS' }, { roomNumber: '1201', code: 'KSA' }, { roomNumber: '502', code: 'KSA' }, { roomNumber: '1004', code: 'KSO' }, { roomNumber: '1005', code: 'KSO' }, { roomNumber: '1104', code: 'KSO' }, { roomNumber: '1105', code: 'KSO' }, { roomNumber: '1204', code: 'KSO' }, { roomNumber: '1205', code: 'KSO' }, { roomNumber: '1304', code: 'KSO' }, { roomNumber: '1305', code: 'KSO' }, { roomNumber: '204', code: 'KSO' }, { roomNumber: '304', code: 'KSO' }, { roomNumber: '404', code: 'KSO' }, { roomNumber: '504', code: 'KSO' }, { roomNumber: '505', code: 'KSO' }, { roomNumber: '604', code: 'KSO' }, { roomNumber: '605', code: 'KSO' }, { roomNumber: '704', code: 'KSO' }, { roomNumber: '705', code: 'KSO' }, { roomNumber: '804', code: 'KSO' }, { roomNumber: '805', code: 'KSO' }, { roomNumber: '904', code: 'KSO' }, { roomNumber: '905', code: 'KSO' }, { roomNumber: '1003', code: 'SQ' }, { roomNumber: '1103', code: 'SQ' }, { roomNumber: '1203', code: 'SQ' }, { roomNumber: '1303', code: 'SQ' }, { roomNumber: '403', code: 'SQ' }, { roomNumber: '503', code: 'SQ' }, { roomNumber: '603', code: 'SQ' }, { roomNumber: '703', code: 'SQ' }, { roomNumber: '903', code: 'SQ' }, { roomNumber: '803', code: 'SQA' } ],
    msi: [ { roomNumber: '211', code: 'Q' }, { roomNumber: '212', code: 'Q' }, { roomNumber: '213', code: 'Q' }, { roomNumber: '214', code: 'Q' }, { roomNumber: '215', code: 'Q' }, { roomNumber: '305', code: 'Q' }, { roomNumber: '306', code: 'Q' }, { roomNumber: '307', code: 'Q' }, { roomNumber: '308', code: 'Q' }, { roomNumber: '309', code: 'Q' }, { roomNumber: '310', code: 'Q' }, { roomNumber: '311', code: 'Q' }, { roomNumber: '312', code: 'Q' }, { roomNumber: '313', code: 'Q' }, { roomNumber: '314', code: 'Q' }, { roomNumber: '315', code: 'Q' }, { roomNumber: '402', code: 'Q' }, { roomNumber: '403', code: 'Q' }, { roomNumber: '404', code: 'Q' }, { roomNumber: '405', code: 'Q' }, { roomNumber: '406', code: 'Q' }, { roomNumber: '407', code: 'Q' }, { roomNumber: '408', code: 'Q' }, { roomNumber: '409', code: 'Q' }, { roomNumber: '410', code: 'Q' }, { roomNumber: '411', code: 'Q' }, { roomNumber: '412', code: 'Q' }, { roomNumber: '101', code: 'RD' }, { roomNumber: '110', code: 'RD' }, { roomNumber: '205', code: 'RD' }, { roomNumber: '206', code: 'RD' }, { roomNumber: '207', code: 'RD' }, { roomNumber: '208', code: 'RD' }, { roomNumber: '209', code: 'RD' }, { roomNumber: '210', code: 'RD' }, { roomNumber: '102', code: 'RDCY' }, { roomNumber: '103', code: 'RDCY' }, { roomNumber: '104', code: 'RDCY' }, { roomNumber: '105', code: 'RDCY' }, { roomNumber: '106', code: 'RDCY' }, { roomNumber: '107', code: 'RDCY' }, { roomNumber: '108', code: 'RDCY' }, { roomNumber: '109', code: 'RDCY' }, { roomNumber: '204', code: 'DQ' }, { roomNumber: '216', code: 'DQ' }, { roomNumber: '304', code: 'DD' }, { roomNumber: '316', code: 'DD' }, { roomNumber: '401', code: 'DD' }, { roomNumber: '413', code: 'DD' }, { roomNumber: '201', code: 'HHK' }, { roomNumber: '202', code: 'HHK' }, { roomNumber: '203', code: 'HHK' }, { roomNumber: '301', code: 'HHK' }, { roomNumber: '302', code: 'HHK' }, { roomNumber: '303', code: 'HHK' }, { roomNumber: '111', code: 'TQACC' } ],
    indjh: [ { roomNumber: 'J1', code: 'CHQ' }, { roomNumber: 'J2', code: 'CHQ' }, { roomNumber: 'J3', code: 'CHQ' }, { roomNumber: 'J4', code: 'CHQ' }, { roomNumber: 'I101', code: 'DK' }, { roomNumber: 'I112', code: 'DK' }, { roomNumber: 'I201', code: 'DK' }, { roomNumber: 'I212', code: 'DK' }, { roomNumber: 'I301', code: 'DK' }, { roomNumber: 'I312', code: 'DK' }, { roomNumber: 'J101E', code: 'MHD-Q' }, { roomNumber: 'J101W', code: 'MHD-Q' }, { roomNumber: 'J201E', code: 'MHD-Q' }, { roomNumber: 'J201W', code: 'MHD-Q' }, { roomNumber: 'J3F', code: 'MHF-Q' }, { roomNumber: 'J102NW', code: 'MHS-Q' }, { roomNumber: 'J202NW', code: 'MHS-Q' }, { roomNumber: 'I104', code: 'QAV' }, { roomNumber: 'I106', code: 'QAV' }, { roomNumber: 'I107', code: 'QAV' }, { roomNumber: 'I109', code: 'QAV' }, { roomNumber: 'I205', code: 'QAV' }, { roomNumber: 'I206', code: 'QAV' }, { roomNumber: 'I207', code: 'QAV' }, { roomNumber: 'I306', code: 'QAV' }, { roomNumber: 'I307', code: 'QAV' }, { roomNumber: 'I309', code: 'QAV' }, { roomNumber: 'I1200', code: 'QNV' }, { roomNumber: 'I214', code: 'QNV' }, { roomNumber: 'I300', code: 'QNV' }, { roomNumber: 'I314', code: 'QNV' }, { roomNumber: 'I102', code: 'QQ' }, { roomNumber: 'I111', code: 'QQ' }, { roomNumber: 'I202', code: 'QQ' }, { roomNumber: 'I211', code: 'QQ' }, { roomNumber: 'I302', code: 'QQ' }, { roomNumber: 'I311', code: 'QQ' }, { roomNumber: 'I103', code: 'QQAV' }, { roomNumber: 'I105', code: 'QQAV' }, { roomNumber: 'I108', code: 'QQAV' }, { roomNumber: 'I110', code: 'QQAV' }, { roomNumber: 'I203', code: 'QQAV' }, { roomNumber: 'I204', code: 'QQAV' }, { roomNumber: 'I208', code: 'QQAV' }, { roomNumber: 'I209', code: 'QQAV' }, { roomNumber: 'I210', code: 'QQAV' }, { roomNumber: 'I303', code: 'QQAV' }, { roomNumber: 'I304', code: 'QQAV' }, { roomNumber: 'I305', code: 'QQAV' }, { roomNumber: 'I308', code: 'QQAV' }, { roomNumber: 'I310', code: 'QQAV' } ]
};

// --- STATE MANAGEMENT ---
const State = {
    profiles: { ...DEFAULT_PROFILES },
    currentCsvContent: null,
    currentRules: null,
    currentRecommendations: [],
    acceptedUpgrades: [],
    completedUpgrades: [],
    oooRecords: [],
    user: null
};

// --- UTILITIES ---
const Utils = {
    // Shows a toast notification instead of alert()
    showToast: (type, message) => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    // Ensures dates are set to UTC Midnight to avoid off-by-one errors
    normalizeDate: (dateInput) => {
        if (!dateInput) return null;
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return null;
        return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    },

    parseDate: (dateStr) => {
        if (!dateStr) return null;
        if (dateStr.includes(' ')) dateStr = dateStr.split(' ')[0];
        const parts = dateStr.split(/[-\/]/);
        if (parts.length === 3) {
            if (parts[0].length === 4) return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
            else return new Date(Date.UTC(parts[2], parts[0] - 1, parts[1]));
        }
        const fallback = new Date(dateStr);
        return isNaN(fallback.getTime()) ? null : new Date(Date.UTC(fallback.getFullYear(), fallback.getMonth(), fallback.getDate()));
    },

    // Robust CSV Parser (Regex based) - handles "Smith, John" correctly
    parseCsv: (text) => {
        const pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g; // Basic, but let's use a stronger manual split for quotes
        const lines = text.trim().split('\n');
        const parseLine = (line) => {
            const row = [];
            let inQuotes = false;
            let currentToken = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') { inQuotes = !inQuotes; }
                else if (char === ',' && !inQuotes) { row.push(currentToken.trim()); currentToken = ''; }
                else { currentToken += char; }
            }
            row.push(currentToken.trim());
            return row.map(cell => cell.replace(/^"|"$/g, '').trim()); // Remove surrounding quotes
        };

        const headerLine = lines.shift();
        if (!headerLine) throw new Error("Empty CSV");
        const header = parseLine(headerLine);
        const data = lines.map(line => parseLine(line));
        return { header, data };
    },

    // Generates the Bed Type string based on Room Code
    getBedType: (roomCode) => {
        if (!roomCode) return 'OTHER';
        const rc = roomCode.toUpperCase();
        if (rc.includes('2BRDM')) return 'K';
        if (rc.includes('-K')) return 'K';
        if (rc.includes('-QQ')) return 'QQ';
        if (rc.includes('-Q')) return 'Q';
        if (rc.startsWith('DK') || rc.startsWith('GK') || rc.startsWith('PK') || rc.startsWith('TK') || rc.startsWith('KS') || rc === 'CKS') return 'K';
        if (rc.startsWith('TQ') || rc.startsWith('DQ') || rc === 'DD' || rc === 'QQ' || rc === 'QQAV') return 'QQ';
        if (rc.startsWith('SQ') || rc === 'CSQ' || rc === 'Q' || rc === 'QAV' || rc === 'QNV' || rc === 'CHQ') return 'Q';
        if (rc === 'RD' || rc === 'RDCY' || rc === 'HHK') return 'K';
        return 'OTHER';
    }
};

// --- DATA SERVICES (Firebase) ---
const DataService = {
    loadRemoteProfiles: async () => {
        try {
            const doc = await db.collection('app_settings').doc('profile_rules').get();
            if (doc.exists) {
                const savedData = doc.data();
                Object.keys(savedData).forEach(key => {
                    if (State.profiles[key]) State.profiles[key] = { ...State.profiles[key], ...savedData[key] };
                });
                console.log("Remote profiles merged.");
            }
            UI.updateRulesForm(document.getElementById('profile-dropdown').value);
        } catch (e) {
            console.error("Profile load error", e);
        }
    },

    saveRules: async (profileName, rules) => {
        try {
            await db.collection('app_settings').doc('profile_rules').set({ [profileName]: rules }, { merge: true });
            Utils.showToast('success', 'Rules saved successfully!');
        } catch (e) {
            Utils.showToast('error', 'Failed to save rules: ' + e.message);
        }
    },

    loadOooRecords: async () => {
        const currentProfile = document.getElementById('profile-dropdown').value;
        const listContainer = document.getElementById('ooo-list');
        State.oooRecords = [];
        listContainer.innerHTML = '<p>Loading...</p>';

        const today = new Date();
        today.setHours(0,0,0,0);

        try {
            const snapshot = await db.collection('ooo_logs').where('profile', '==', currentProfile).get();
            snapshot.forEach(doc => {
                const data = doc.data();
                const endDate = data.endDate.toDate();
                // Filter expired records
                if (endDate >= today) {
                    State.oooRecords.push({
                        id: doc.id,
                        roomType: data.roomType,
                        count: data.count || 1,
                        startDate: data.startDate.toDate(),
                        endDate: endDate,
                        profile: data.profile
                    });
                }
            });
            UI.renderOooList();
        } catch (e) {
            listContainer.innerHTML = '<p style="color:red">Error loading OOO.</p>';
        }
    },

    addOooRecord: async (record) => {
        try {
            const docRef = await db.collection('ooo_logs').add(record);
            State.oooRecords.push({ ...record, id: docRef.id });
            UI.renderOooList();
            Utils.showToast('success', 'OOO record added.');
            return true;
        } catch (e) {
            Utils.showToast('error', 'Failed to add OOO. Are you an admin?');
            return false;
        }
    },

    deleteOooRecord: async (id) => {
        try {
            await db.collection('ooo_logs').doc(id).delete();
            State.oooRecords = State.oooRecords.filter(r => r.id !== id);
            UI.renderOooList();
            Utils.showToast('success', 'OOO record removed.');
        } catch (e) {
            Utils.showToast('error', 'Failed to remove record.');
        }
    },

    loadCompletedUpgrades: async (uid) => {
        State.completedUpgrades = [];
        try {
            const snapshot = await db.collection('users').doc(uid).collection('completedUpgrades').get();
            snapshot.forEach(doc => {
                const data = doc.data();
                data.firestoreId = doc.id;
                if (data.completedTimestamp?.toDate) data.completedTimestamp = data.completedTimestamp.toDate();
                State.completedUpgrades.push(data);
            });
            UI.displayCompletedUpgrades();
        } catch (e) { console.error(e); }
    }
};

// --- CORE BUSINESS LOGIC ---
const BusinessLogic = {
    // 1. Process Raw Data
    processData: (csvContent, rules) => {
        const { header, data } = Utils.parseCsv(csvContent);
        
        // Validate Header
        const missing = CONSTANTS.REQUIRED_CSV_HEADERS.filter(h => !header.includes(h));
        if (missing.length > 0) throw new Error(`Missing columns: ${missing.join(', ')}`);

        // Map Data
        const indices = {};
        CONSTANTS.REQUIRED_CSV_HEADERS.forEach(h => indices[h] = header.indexOf(h));

        const allReservations = data.map(row => {
            if (row.length < header.length) return null;
            const arr = Utils.parseDate(row[indices['Arrival Date']]);
            const dep = Utils.parseDate(row[indices['Departure Date']]);
            let nights = 0;
            if (arr && dep) nights = Math.max(1, Math.ceil((dep - arr) / (86400000)));

            return {
                name: row[indices['Guest Name']],
                resId: row[indices['Res ID']],
                roomType: row[indices['Room Type']].toUpperCase(),
                rateName: row[indices['Rate Name']],
                rateVal: parseFloat(row[indices['Rate']]) || 0,
                arrival: arr,
                departure: dep,
                nights: nights,
                status: row[indices['Status']].toUpperCase(),
                revenueRaw: (parseFloat(row[indices['Rate']]) || 0) * nights,
                revenueFmt: ((parseFloat(row[indices['Rate']]) || 0) * nights).toLocaleString('en-US', {style:'currency', currency:'USD'})
            };
        }).filter(r => r && r.arrival && r.departure && r.status === 'RESERVATION');

        return BusinessLogic.generateRecommendations(allReservations, rules);
    },

    // 2. Algorithm
    generateRecommendations: (allReservations, rules) => {
        const masterInv = Utils.getMasterInventory(rules.profile);
        if (!Object.keys(masterInv).length) throw new Error("No master inventory found.");

        const startDate = Utils.normalizeDate(rules.selectedDate);
        const resByDate = BusinessLogic.buildReservationMap(allReservations);
        const matrixData = BusinessLogic.buildMatrix(masterInv, resByDate, startDate, rules.hierarchy);

        // Logic Setup
        const targetRooms = rules.targetRooms.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        const ineligible = rules.ineligibleUpgrades.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        const otaRates = rules.otaRates.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        const hierarchy = rules.hierarchy.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        
        // Completed Filter
        const completedIds = new Set(State.completedUpgrades.filter(u => u.profile === rules.profile).map(u => u.resId));

        let recommendations = [];

        // Check availability function
        const checkAvailability = (roomCode, res) => {
            let d = new Date(res.arrival);
            while (d < res.departure) {
                const dStr = d.toISOString().split('T')[0];
                const physical = resByDate[dStr]?.[roomCode] || 0;
                
                // Calculate OOO
                const dTime = d.getTime();
                const oooCount = State.oooRecords.reduce((acc, rec) => {
                    if (rec.roomType !== roomCode) return acc;
                    return (dTime >= rec.startDate.getTime() && dTime <= rec.endDate.getTime()) ? acc + rec.count : acc;
                }, 0);

                if ((physical + oooCount) >= (masterInv[roomCode] || 0)) return false;
                d.setUTCDate(d.getUTCDate() + 1);
            }
            return true;
        };

        // Iterate 7 days
        for (let i = 0; i < 7; i++) {
            let checkDate = new Date(startDate);
            checkDate.setUTCDate(checkDate.getUTCDate() + i);
            let checkTime = checkDate.getTime();

            const todaysArrivals = allReservations.filter(r => r.arrival.getTime() === checkTime);

            // Determine Processing Queue
            let queue = targetRooms.length > 0 ? [...targetRooms] : [...hierarchy];
            if (targetRooms.length > 0) {
                 // Logic: If target room has no arrivals, try to upgrade the next tier up to make space implicitly? 
                 // (Keeping user logic simplified: just check target rooms, then iterate hierarchy if needed)
                 // For now, adhere to strictly processing queue based on inputs
            }

            queue.forEach(targetCode => {
                const candidates = todaysArrivals.filter(r => 
                    r.roomType === targetCode && 
                    !otaRates.some(ota => r.rateName.toLowerCase().includes(ota)) &&
                    !completedIds.has(r.resId) &&
                    !ineligible.includes(r.roomType)
                );

                candidates.forEach(res => {
                    const idx = hierarchy.indexOf(res.roomType);
                    if (idx === -1) return;
                    const bed = Utils.getBedType(res.roomType);
                    if (bed === 'OTHER') return;

                    // Look up hierarchy
                    for (let j = idx + 1; j < hierarchy.length; j++) {
                        const upRoom = hierarchy[j];
                        if (ineligible.includes(upRoom)) continue;
                        if (Utils.getBedType(upRoom) !== bed) continue;

                        if (checkAvailability(upRoom, res)) {
                            recommendations.push({
                                name: res.name, resId: res.resId, revenue: res.revenueFmt,
                                room: res.roomType, rate: res.rateName, nights: res.nights,
                                upgradeTo: upRoom, score: res.revenueRaw, distance: j - idx,
                                arrivalDate: checkDate.toLocaleDateString(),
                                departureDate: res.departure.toLocaleDateString()
                            });
                            break; // Find first valid upgrade only
                        }
                    }
                });
            });
        }

        // Sort: High Value first, then shortest jump
        recommendations.sort((a,b) => b.score - a.score || a.distance - b.distance);

        return {
            recommendations,
            matrixData,
            inventory: BusinessLogic.getSingleDayInventory(masterInv, resByDate, startDate),
            message: recommendations.length ? null : "No suitable upgrades found."
        };
    },

    buildReservationMap: (list) => {
        const map = {};
        list.forEach(r => {
            let d = new Date(r.arrival);
            while (d < r.departure) {
                const s = d.toISOString().split('T')[0];
                if (!map[s]) map[s] = {};
                map[s][r.roomType] = (map[s][r.roomType] || 0) + 1;
                d.setUTCDate(d.getUTCDate() + 1);
            }
        });
        return map;
    },

    buildMatrix: (masterInv, resMap, startDate, hierarchyStr) => {
        const h = hierarchyStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        const matrix = { headers: ['Room'], rows: [] };
        
        const dates = [];
        for(let i=0; i<14; i++) {
            let d = new Date(startDate);
            d.setUTCDate(d.getUTCDate()+i);
            dates.push(d);
            matrix.headers.push(`${d.getUTCMonth()+1}/${d.getUTCDate()}`);
        }

        h.forEach(room => {
            const row = { roomCode: room, availability: [] };
            dates.forEach(d => {
                const dStr = d.toISOString().split('T')[0];
                const dTime = d.getTime();
                
                const phys = resMap[dStr]?.[room] || 0;
                const ooo = State.oooRecords.reduce((acc, r) => {
                    return (r.roomType === room && dTime >= r.startDate.getTime() && dTime <= r.endDate.getTime()) ? acc + r.count : acc;
                }, 0);
                
                row.availability.push((masterInv[room] || 0) - phys - ooo);
            });
            matrix.rows.push(row);
        });
        return matrix;
    },

    getSingleDayInventory: (masterInv, resMap, date) => {
        const inv = {};
        const dStr = date.toISOString().split('T')[0];
        const dTime = date.getTime();
        
        Object.keys(masterInv).forEach(room => {
            const phys = resMap[dStr]?.[room] || 0;
            const ooo = State.oooRecords.reduce((acc, r) => {
                return (r.roomType === room && dTime >= r.startDate.getTime() && dTime <= r.endDate.getTime()) ? acc + r.count : acc;
            }, 0);
            inv[room] = (masterInv[room] || 0) - phys - ooo;
        });
        return inv;
    }
};

// Add Inventory Helper to Utils to fix scope
Utils.getMasterInventory = (profile) => {
    const list = MASTER_INVENTORIES[profile];
    if (!list) return {};
    const inv = {};
    list.forEach(r => inv[r.code.toUpperCase()] = (inv[r.code.toUpperCase()] || 0) + 1);
    return inv;
};

// --- UI CONTROLLER ---
const UI = {
    init: () => {
        // Event Listeners
        document.getElementById('signin-btn').addEventListener('click', UI.handleSignIn);
        document.getElementById('signout-btn').addEventListener('click', () => auth.signOut());
        
        document.getElementById('settings-trigger-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
            UI.populateOooDropdown();
        });
        document.getElementById('close-settings-btn').addEventListener('click', () => document.getElementById('settings-modal').classList.add('hidden'));
        
        document.getElementById('profile-dropdown').addEventListener('change', UI.handleProfileChange);
        document.getElementById('generate-btn').addEventListener('click', UI.handleGenerate);
        document.getElementById('save-rules-btn').addEventListener('click', UI.handleSaveRules);
        document.getElementById('add-ooo-btn').addEventListener('click', UI.handleAddOoo);
        document.getElementById('clear-analytics-btn').addEventListener('click', UI.handleClearAnalytics);

        // Tab Switching
        document.querySelectorAll('.tab').forEach(t => {
            t.addEventListener('click', (e) => {
                document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelector(e.target.dataset.tabTarget).classList.add('active');
            });
        });

        // Date Init
        const d = new Date();
        d.setDate(d.getDate() + 3);
        document.getElementById('selected-date').valueAsDate = d;

        // Listener for Sort Dropdown
        document.getElementById('sort-date-dropdown').addEventListener('change', UI.displayCompletedUpgrades);
    },

    handleSignIn: () => {
        const e = document.getElementById('email-input').value;
        const p = document.getElementById('password-input').value;
        auth.signInWithEmailAndPassword(e, p).catch(err => document.getElementById('error-message').textContent = err.message);
    },

    handleProfileChange: (e) => {
        UI.updateRulesForm(e.target.value);
        State.currentCsvContent = null;
        State.currentRecommendations = [];
        State.acceptedUpgrades = [];
        UI.resetDisplay();
        DataService.loadOooRecords();
        UI.displayCompletedUpgrades(); // Filter for new profile
    },

    updateRulesForm: (profile) => {
        const p = State.profiles[profile];
        if(!p) return;
        document.getElementById('hierarchy').value = p.hierarchy;
        document.getElementById('target-rooms').value = p.targetRooms;
        document.getElementById('prioritized-rates').value = p.prioritizedRates;
        document.getElementById('ota-rates').value = p.otaRates;
        document.getElementById('ineligible-upgrades').value = p.ineligibleUpgrades;
    },

    handleSaveRules: () => {
        const profile = document.getElementById('profile-dropdown').value;
        const rules = {
            hierarchy: document.getElementById('hierarchy').value,
            targetRooms: document.getElementById('target-rooms').value,
            prioritizedRates: document.getElementById('prioritized-rates').value,
            otaRates: document.getElementById('ota-rates').value,
            ineligibleUpgrades: document.getElementById('ineligible-upgrades').value
        };
        // Update local state
        State.profiles[profile] = { ...State.profiles[profile], ...rules };
        DataService.saveRules(profile, rules);
    },

    handleAddOoo: async () => {
        const type = document.getElementById('ooo-room-type').value;
        const count = parseInt(document.getElementById('ooo-count').value);
        const s = document.getElementById('ooo-start-date').value;
        const e = document.getElementById('ooo-end-date').value;

        if (!type || !s || !e) return alert("Missing fields");
        if (new Date(e) < new Date(s)) return alert("End date cannot be before start date");

        const btn = document.getElementById('add-ooo-btn');
        btn.disabled = true;
        btn.textContent = "Adding...";

        await DataService.addOooRecord({
            profile: document.getElementById('profile-dropdown').value,
            roomType: type,
            count: count,
            startDate: Utils.normalizeDate(s),
            endDate: Utils.normalizeDate(e)
        });

        // Clear form
        document.getElementById('ooo-room-type').value = "";
        document.getElementById('ooo-start-date').value = "";
        document.getElementById('ooo-end-date').value = "";
        btn.disabled = false;
        btn.textContent = "Add Record";
    },

    renderOooList: () => {
        const div = document.getElementById('ooo-list');
        if (State.oooRecords.length === 0) { div.innerHTML = '<p style="color:#888; font-size:13px;">No active OOO records.</p>'; return; }
        
        State.oooRecords.sort((a,b) => a.startDate - b.startDate);
        let html = '<ul style="list-style:none; padding:0; margin:0;">';
        State.oooRecords.forEach(r => {
            html += `<li style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee; font-size:13px; background:white;">
                <span><strong>${r.roomType}</strong> (x${r.count})<br><small>${r.startDate.toISOString().split('T')[0]} to ${r.endDate.toISOString().split('T')[0]}</small></span>
                <button onclick="DataService.deleteOooRecord('${r.id}')" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
            </li>`;
        });
        div.innerHTML = html + '</ul>';
    },

    populateOooDropdown: () => {
        const sel = document.getElementById('ooo-room-type');
        const hierarchy = document.getElementById('hierarchy').value.split(',');
        sel.innerHTML = '<option value="">Select Room</option>';
        hierarchy.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.trim().toUpperCase();
            opt.textContent = h.trim().toUpperCase();
            sel.appendChild(opt);
        });
    },

    handleGenerate: () => {
        const file = document.getElementById('csv-file').files[0];
        if (!file) return Utils.showToast('error', 'Please upload a CSV.');
        
        UI.toggleLoader(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                State.currentCsvContent = e.target.result;
                State.currentRules = {
                    profile: document.getElementById('profile-dropdown').value,
                    selectedDate: document.getElementById('selected-date').value,
                    hierarchy: document.getElementById('hierarchy').value,
                    targetRooms: document.getElementById('target-rooms').value,
                    prioritizedRates: document.getElementById('prioritized-rates').value,
                    otaRates: document.getElementById('ota-rates').value,
                    ineligibleUpgrades: document.getElementById('ineligible-upgrades').value
                };
                
                // Reset accepted list on new generate
                State.acceptedUpgrades = [];
                UI.renderAccepted();

                const results = BusinessLogic.processData(State.currentCsvContent, State.currentRules);
                State.currentRecommendations = results.recommendations;
                
                UI.renderResults(results);
            } catch (err) {
                Utils.showToast('error', err.message);
                console.error(err);
            } finally {
                UI.toggleLoader(false);
            }
        };
        reader.readAsText(file);
    },

    renderResults: (data) => {
        document.getElementById('output').style.display = 'block';
        document.getElementById('message').style.display = data.message ? 'block' : 'none';
        document.getElementById('message').innerText = data.message || '';
        
        UI.renderRecommendations(data.recommendations);
        UI.renderMatrix(data.matrixData);
        UI.renderInventory(data.inventory);
    },

    renderRecommendations: (recs) => {
        const con = document.getElementById('recommendations-container');
        con.innerHTML = '';
        if (!recs.length) { con.innerHTML = '<p>No recommendations.</p>'; return; }

        const byDate = {};
        recs.forEach(r => { if(!byDate[r.arrivalDate]) byDate[r.arrivalDate] = []; byDate[r.arrivalDate].push(r); });
        
        Object.keys(byDate).sort((a,b) => new Date(a)-new Date(b)).forEach(d => {
            const h2 = document.createElement('h2');
            h2.className = 'date-header'; h2.textContent = `Arrivals: ${d}`;
            con.appendChild(h2);
            byDate[d].forEach(r => {
                const idx = State.currentRecommendations.indexOf(r);
                const el = document.createElement('div');
                el.className = 'rec-card';
                el.innerHTML = `
                    <div class="rec-info">
                        <h3>${r.name} (${r.resId})</h3>
                        <div class="rec-details">Booked: <b>${r.room}</b> (${r.nights}n) @ ${r.rate} <br> Value: <strong>${r.revenue}</strong></div>
                    </div>
                    <div class="rec-actions">
                        <div class="rec-upgrade-to">Upgrade To <br> <strong>${r.upgradeTo}</strong></div>
                        <button class="accept-btn" onclick="UI.acceptUpgrade(${idx})">Accept</button>
                    </div>`;
                con.appendChild(el);
            });
        });
    },

    acceptUpgrade: (idx) => {
        const rec = State.currentRecommendations[idx];
        State.acceptedUpgrades.push(rec);
        State.currentRecommendations.splice(idx, 1); // Remove from suggestions
        
        // Re-render
        UI.renderRecommendations(State.currentRecommendations);
        UI.renderAccepted();
        
        // Optional: Recalculate matrix availability here if desired (complex, skipped for brevity)
    },

    renderAccepted: () => {
        const con = document.getElementById('accepted-container');
        con.innerHTML = '';
        if(!State.acceptedUpgrades.length) { con.innerHTML = '<p>No upgrades accepted.</p>'; return; }

        // CSV Download Button
        const btn = document.createElement('button');
        btn.textContent = "Download CSV";
        btn.onclick = UI.downloadAcceptedCsv;
        btn.style.marginBottom = "15px";
        con.appendChild(btn);

        State.acceptedUpgrades.forEach((r, idx) => {
            const el = document.createElement('div');
            el.className = 'rec-card';
            el.innerHTML = `
                <div class="rec-info"><h3>${r.name}</h3> <div class="rec-details">${r.room} -> <strong>${r.upgradeTo}</strong></div></div>
                <div class="rec-actions">
                    <button class="pms-btn" onclick="UI.markCompleted(${idx})">Mark Updated</button>
                    <button class="undo-btn" onclick="UI.undoAccept(${idx})" style="background:#EF4444; color:white;">Undo</button>
                </div>`;
            con.appendChild(el);
        });
    },

    undoAccept: (idx) => {
        const item = State.acceptedUpgrades.splice(idx, 1)[0];
        State.currentRecommendations.push(item); // Add back to suggestions
        // Re-sort recommendations? Ideally yes, but append is fine for now
        UI.renderAccepted();
        UI.renderRecommendations(State.currentRecommendations);
    },

    markCompleted: async (idx) => {
        const item = State.acceptedUpgrades[idx];
        item.completedTimestamp = new Date();
        item.profile = document.getElementById('profile-dropdown').value;
        
        try {
            await db.collection('users').doc(State.user.uid).collection('completedUpgrades').add(item);
            State.acceptedUpgrades.splice(idx, 1);
            State.completedUpgrades.push(item);
            UI.renderAccepted();
            UI.displayCompletedUpgrades();
            Utils.showToast('success', 'Saved to Analytics');
        } catch (e) {
            Utils.showToast('error', 'Save failed');
        }
    },

    displayCompletedUpgrades: () => {
        const con = document.getElementById('completed-container');
        const sel = document.getElementById('sort-date-dropdown');
        const prof = document.getElementById('profile-dropdown').value;
        
        // Filter by profile
        const list = State.completedUpgrades.filter(u => u.profile === prof);
        
        // Populate Dropdown
        const dates = [...new Set(list.map(u => u.completedTimestamp.toLocaleDateString()))];
        sel.innerHTML = '<option value="all">All Dates</option>';
        dates.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d; opt.textContent = d;
            sel.appendChild(opt);
        });

        // Filter by Date
        const filterDate = sel.value; // Note: logic needs to check if this was triggered by event or direct call
        // For simplicity, re-read value or pass arg. Here we just read DOM.
        
        const displayList = (sel.value === 'all') ? list : list.filter(u => u.completedTimestamp.toLocaleDateString() === sel.value);
        
        con.innerHTML = '';
        if(!displayList.length) { con.innerHTML='<p>No data.</p>'; return; }

        let total = 0;
        displayList.forEach(r => {
            total += parseFloat(r.revenue.replace(/[$,]/g, '')) || 0;
            const el = document.createElement('div');
            el.className = 'rec-card completed';
            el.innerHTML = `
                <div class="rec-info"><h3>${r.name}</h3> <div class="rec-details">${r.room} -> ${r.upgradeTo} <br> Completed: ${r.completedTimestamp.toLocaleDateString()}</div></div>
                <div class="rec-actions"><strong style="color:var(--success-color);">✓ Done</strong></div>`;
            con.appendChild(el);
        });
        
        const h3 = document.createElement('h3');
        h3.style.textAlign='right';
        h3.textContent = `Total Value: $${total.toLocaleString()}`;
        con.appendChild(h3);
    },

    handleClearAnalytics: async () => {
        if (!confirm("Delete all history for this profile?")) return;
        const prof = document.getElementById('profile-dropdown').value;
        UI.toggleLoader(true);
        try {
            const q = await db.collection('users').doc(State.user.uid).collection('completedUpgrades').where('profile','==',prof).get();
            const b = db.batch();
            q.forEach(d => b.delete(d.ref));
            await b.commit();
            DataService.loadCompletedUpgrades(State.user.uid);
            Utils.showToast('success', 'Cleared');
        } catch (e) { Utils.showToast('error', 'Error clearing'); }
        UI.toggleLoader(false);
    },

    downloadAcceptedCsv: () => {
        const headers = ['Guest Name', 'Res ID', 'Current Room', 'Upgrade To', 'Arrival', 'Departure'];
        const rows = State.acceptedUpgrades.map(r => 
            `"${r.name}","${r.resId}","${r.room}","${r.upgradeTo}","${r.arrivalDate}","${r.departureDate}"`
        );
        const blob = new Blob([headers.join(',') + '\n' + rows.join('\n')], {type:'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `upgrades_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    },

    renderMatrix: (matrix) => {
        const con = document.getElementById('matrix-container');
        let h = '<table><thead><tr>' + matrix.headers.map(hdr => `<th>${hdr}</th>`).join('') + '</tr></thead><tbody>';
        matrix.rows.forEach(row => {
            h += `<tr><td>${row.roomCode}</td>` + row.availability.map(v => {
                let c = 'matrix-low';
                if(v < 0) c = 'matrix-neg';
                else if(v >= 3) c = 'matrix-high';
                return `<td class="${c}">${v}</td>`;
            }).join('') + '</tr>';
        });
        con.innerHTML = h + '</tbody></table>';
    },

    renderInventory: (inv) => {
        const con = document.getElementById('inventory');
        const items = Object.entries(inv).filter(([k,v]) => v > 0).map(([k,v]) => `<b>${k}:</b> ${v}`);
        con.innerHTML = items.length ? items.join(' | ') : 'No rooms available today.';
    },

    toggleLoader: (show) => {
        document.getElementById('loader').style.display = show ? 'block' : 'none';
        document.getElementById('output').style.display = show ? 'none' : 'block';
    },

    resetDisplay: () => {
        document.getElementById('output').style.display = 'none';
        document.getElementById('recommendations-container').innerHTML = '';
        document.getElementById('matrix-container').innerHTML = '';
    }
};

// --- AUTH STATE OBSERVER ---
auth.onAuthStateChanged(async (user) => {
    State.user = user;
    if (user) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        
        await DataService.loadRemoteProfiles();
        await DataService.loadOooRecords();
        DataService.loadCompletedUpgrades(user.uid);

        // Admin Checks
        const isAdmin = CONSTANTS.ADMIN_UIDS.includes(user.uid);
        document.getElementById('admin-rules-container').style.display = isAdmin ? 'block' : 'none';
        document.getElementById('save-rules-btn').classList.toggle('hidden', !isAdmin);
        document.getElementById('add-ooo-btn').disabled = !isAdmin;
        document.getElementById('clear-analytics-btn').classList.toggle('hidden', !isAdmin);
        document.getElementById('settings-trigger-btn').classList.toggle('hidden', !isAdmin);
        
    } else {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    }
});

// Start App
document.addEventListener('DOMContentLoaded', UI.init);
