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
// Maps the Profile ID (dropdown value) to the required File Prefix (from Firestore)
const SNT_PROPERTY_MAP = {
    'sts': 'LTRL',     // STS requires file starting with LTRL
    'rcn': 'VERD',     // RCN requires file starting with VERD
    'cby': 'LCKWD',    // CBY requires file starting with LCKWD
    'bri': 'TBH',      // BRI requires file starting with TBH
    'dar': 'DARLING'   // DAR requires file starting with DARLING
};

// --- DOM ELEMENT REFERENCES ---
let loginContainer, appContainer, signinBtn, signoutBtn, emailInput, passwordInput, errorMessage, clearAnalyticsBtn;
// New references for saving rules
let saveRulesBtn, saveStatus;

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
        ineligibleUpgrades: 'TKHC,TQHC'
    },
    col: {
        hierarchy: 'QGST-Q, ADA-Q, KGST-K, QSTE-Q/POC, KGSTV-K, KSTE-K/POC, KSTEV-K/POC, 2BRDM-K/Q/POC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'ADA-Q,2BRDM-K/Q/POC' 
    },
    ivy: {
        hierarchy: 'SQ, KS, KSO, DQS, CSQ, CKS, DQSA, KSA, SQA',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, HotelTonight, Priceline', 
        ineligibleUpgrades: 'DQSA, KSA, SQA'
    },
    msi: {
        hierarchy: 'Q, RD, RDCY, DQ, DD, HHK, TQACC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS', 
        ineligibleUpgrades: 'TQACC'
    },
    indjh: {
        hierarchy: 'QNV, QQ, QAV, QQAV, DK, CHQ, MHS-Q, MHD-Q, MHF-Q',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS', 
        ineligibleUpgrades: 'MHF-Q'
    },
    sts: {
        hierarchy: 'PKR, TKR, QQR, LKR, CKR, KS, PKS, AKR, AQQ',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    rcn: {
        hierarchy: 'KING, KINGADA, DQUEEN, ADADQ, LVKING, ADALV, JRSTE, LVJRSTE, PRES',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: 'KINGADA, ADADQ, ADALV'
    },
    cby: {
        hierarchy: 'KNR, KND, QQNR, KAR, QQAR, K1S, K1AS',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    bri: {
        hierarchy: 'PQNN, PKNG, STQQ, SQAC, SKNG, SKAC, HERT, AMER, LEST, LEAC, GPST',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    dar: {
        hierarchy: 'RQR, RKR, RQQ, SKR, AKS, EXE, DAR',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    dpi: {
        hierarchy: 'PKING-K, PQUEEN-Q, NKING-K, NKINGACC-K, NQQ-QQ, RKINGACC-K, RQQ-QQ, RQQACC-QQ, MHQQ-QQ, MHQSTE-Q, MHSTE-K, MHSTEKIT-K, RSTE-K, BUCKSTE-K, CORNSTE-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    asu: {
        hierarchy: '1K-K/SB, 1QQ-QQ, 1QQF-QQ, 1KF-K, 1KJ-K, 2KQQ-K/QQ, 1KH-K, 1QQH-Q, 1QQD-QQ',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    ehi: {
        hierarchy: 'TRADQUEEN-Q, TRADKING-K, QNN-Q, KNN-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    palms: {
        hierarchy: 'TRAK-K, TRAQQ-QQ, TRAKH-K, CBREEQQ-QQ, COASK-K, COASQQ-QQ, ISLAND-K, OFKN-K, OFQQ-QQ',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    csh: {
        hierarchy: 'SQ, QQ, DS, KS, EX',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    cgt: {
        hierarchy: 'PDBL-D, QUEEN-Q, QUEENADA-Q, KING-K, EKING-K, QNQN-QQ, KSTE-K, KSTWN-K/T, KSTSB-K/POC, KSS-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    gsl: {
        hierarchy: 'SQHC, QQ1-E, K11-E, DD20-P, K12-P, QQ2-I, DD2-B, K13-F, K1-B, K3, SQQ4',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    one: {
        hierarchy: 'QNQN-QQ, KING-K, QQNQN-QQ, KSTE-K, KINGADA-K, QNQNADA-QQ, DBDBADA-DD, KKING-K, CORNSTE-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    ich: {
        hierarchy: 'STAND-K, KINGSB-K, DOUBLE-QQ, EURO-D, ACCESS-K, SENIOR-K, JUNIOR-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    maj: {
        hierarchy: 'SQ, QS, KS, SS, QQ, EX',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    mcs: {
        hierarchy: 'KING, ADAKING, QQ, KSUITE, EXEC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    sea: {
        hierarchy: 'Q-Q, KING-K, QQ-QQ, DKING-K, DQQ-QQ, KINGOF-K, QADA-Q',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    sci: {
        hierarchy: '2QMRSH, KMrsh, DKMrsh-K, 2QCrk, 2QCrk ADA, KCrk, DKCrk, JRSTE-K/POC',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    soh: {
        hierarchy: '1-2Q-NB-Stan-QQ, 3-King-NB-K, 4-ADAQueenRS-Q, 5-ADAQueen-Q, 6-2Q-PV-Bal-QQ, 7-2Q-PV-Bal-QQ, 8-JrSuite-QQ, 9-King-PV-Bal-K, 10-King-OV-B-K, 11-KingSuite-K/SOFA',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    },
    abr: {
        hierarchy: 'KING-K, KINGADA-K, KINGFULL, PREMIUM-K, DABO-K',
        targetRooms: '',
        prioritizedRates: 'Best Available, BAR, Rack',
        otaRates: 'Expedia, Booking.com, Priceline, GDS',
        ineligibleUpgrades: ''
    }
};

// --- MASTER INVENTORIES ---
// (Your existing Master Inventories are assumed here - kept short for brevity in this response, 
// but in your file KEEP ALL THE MASTER INVENTORY DATA you had in the prompt)
const MASTER_INVENTORIES = {
    fqi: [

        // TQ-QQ (11 Total)

        { roomNumber: '103', code: 'TQ-QQ' }, { roomNumber: '203', code: 'TQ-QQ' }, { roomNumber: '207', code: 'TQ-QQ' },

        { roomNumber: '210', code: 'TQ-QQ' }, { roomNumber: '215', code: 'TQ-QQ' }, { roomNumber: '216', code: 'TQ-QQ' },

        { roomNumber: '217', code: 'TQ-QQ' }, { roomNumber: '314', code: 'TQ-QQ' }, { roomNumber: '315', code: 'TQ-QQ' },

        { roomNumber: '316', code: 'TQ-QQ' }, { roomNumber: '317', code: 'TQ-QQ' },

        // TQHC-QQ (2 Total)

        { roomNumber: '206', code: 'TQHC-QQ' }, { roomNumber: '218', code: 'TQHC-QQ' },

        // TK-K (8 Total)

        { roomNumber: '108', code: 'TK-K' }, { roomNumber: '208', code: 'TK-K' }, { roomNumber: '209', code: 'TK-K' },

        { roomNumber: '211', code: 'TK-K' }, { roomNumber: '221', code: 'TK-K' }, { roomNumber: '307', code: 'TK-K' },

        { roomNumber: '308', code: 'TK-K' }, { roomNumber: '309', code: 'TK-K' },

        // DK-K (11 Total)

        { roomNumber: '102', code: 'DK-K' }, { roomNumber: '202', code: 'DK-K' }, { roomNumber: '204', code: 'DK-K' },

        { roomNumber: '205', code: 'DK-K' }, { roomNumber: '222', code: 'DK-K' }, { roomNumber: '302', code: 'DK-K' },

        { roomNumber: '303', code: 'DK-K' }, { roomNumber: '304', code: 'DK-K' }, { roomNumber: '305', code: 'DK-K' },

        { roomNumber: '306', code: 'DK-K' }, { roomNumber: '310', code: 'DK-K' },

        // KJS-K/POC (2 Total)

        { roomNumber: '219', code: 'KJS-K/POC' }, { roomNumber: '318', code: 'KJS-K/POC' },

        // QJS-QQ/POC (3 Total)

        { roomNumber: '105', code: 'QJS-QQ/POC' }, { roomNumber: '106', code: 'QJS-QQ/POC' }, { roomNumber: '107', code: 'QJS-QQ/POC' },

        // CTK-K (2 Total)

        { roomNumber: '301', code: 'CTK-K' }, { roomNumber: '320', code: 'CTK-K' },

        // KBS-K/POC (2 Total)

        { roomNumber: '220', code: 'KBS-K/POC' }, { roomNumber: '319', code: 'KBS-K/POC' },

        // PMVB-QQ (2 Total)

        { roomNumber: '312', code: 'PMVB-QQ' }, { roomNumber: '313', code: 'PMVB-QQ' },

        // DMVT-QQ (2 Total)

        { roomNumber: '213', code: 'DMVT-QQ' }, { roomNumber: '214', code: 'DMVT-QQ' },

        // GMVC-QQ (1 Total)

        { roomNumber: '104', code: 'GMVC-QQ' },

        // LKBS-K/POC (2 Total)

        { roomNumber: '101', code: 'LKBS-K/POC' }, { roomNumber: '201', code: 'LKBS-K/POC' },

        // GMVB-QQ/POC (1 Total)

        { roomNumber: '311', code: 'GMVB-QQ/POC' },

        // GMVT-QQ/POC (1 Total)

        { roomNumber: '212', code: 'GMVT-QQ/POC' }

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

    col: [

        { roomNumber: 'W101', code: '2BRDM-K/Q/POC' },

        { roomNumber: 'S101', code: 'ADA-Q' }, { roomNumber: 'S102', code: 'ADA-Q' },

        { roomNumber: 'C203', code: 'KGST-K' }, { roomNumber: 'D102', code: 'KGST-K' }, { roomNumber: 'H204', code: 'KGST-K' }, { roomNumber: 'R205', code: 'KGST-K' }, { roomNumber: 'S103', code: 'KGST-K' },

        { roomNumber: 'R203', code: 'KGSTV-K' }, { roomNumber: 'S205', code: 'KGSTV-K' },

        { roomNumber: 'C102', code: 'KSTE-K/POC' }, { roomNumber: 'C204', code: 'KSTE-K/POC' }, { roomNumber: 'D203', code: 'KSTE-K/POC' }, { roomNumber: 'H102', code: 'KSTE-K/POC' }, { roomNumber: 'H203', code: 'KSTE-K/POC' }, { roomNumber: 'M101', code: 'KSTE-K/POC' }, { roomNumber: 'M103', code: 'KSTE-K/POC' }, { roomNumber: 'M204', code: 'KSTE-K/POC' },

        { roomNumber: 'D101', code: 'KSTEV-K/POC' }, { roomNumber: 'H101', code: 'KSTEV-K/POC' }, { roomNumber: 'R101', code: 'KSTEV-K/POC' }, { roomNumber: 'R102', code: 'KSTEV-K/POC' }, { roomNumber: 'S207', code: 'KSTEV-K/POC' }, { roomNumber: 'W202', code: 'KSTEV-K/POC' }, { roomNumber: 'W203', code: 'KSTEV-K/POC' },

        { roomNumber: 'C101', code: 'QGST-Q' }, { roomNumber: 'R204', code: 'QGST-Q' }, { roomNumber: 'S206', code: 'QGST-Q' },

        { roomNumber: 'M102', code: 'QSTE-Q/POC' }, { roomNumber: 'S104', code: 'QSTE-Q/POC' }

    ],

    ivy: [

        { roomNumber: '1401', code: 'CKS' }, { roomNumber: '1402', code: 'CKS' }, { roomNumber: '1404', code: 'CKS' }, { roomNumber: '1405', code: 'CKS' },

        { roomNumber: '1403', code: 'CSQ' },

        { roomNumber: '201', code: 'DQS' }, { roomNumber: '205', code: 'DQS' }, { roomNumber: '301', code: 'DQS' }, { roomNumber: '305', code: 'DQS' }, { roomNumber: '401', code: 'DQS' },

        { roomNumber: '405', code: 'DQSA' },

        { roomNumber: '1001', code: 'KS' }, { roomNumber: '1002', code: 'KS' }, { roomNumber: '1101', code: 'KS' }, { roomNumber: '1102', code: 'KS' }, { roomNumber: '1202', code: 'KS' }, { roomNumber: '1301', code: 'KS' }, { roomNumber: '1302', code: 'KS' },

        { roomNumber: '202', code: 'KS' }, { roomNumber: '302', code: 'KS' }, { roomNumber: '402', code: 'KS' }, { roomNumber: '501', code: 'KS' }, { roomNumber: '601', code: 'KS' }, { roomNumber: '602', code: 'KS' },

        { roomNumber: '701', code: 'KS' }, { roomNumber: '702', code: 'KS' }, { roomNumber: '801', code: 'KS' }, { roomNumber: '802', code: 'KS' }, { roomNumber: '901', code: 'KS' }, { roomNumber: '902', code: 'KS' },

        { roomNumber: '1201', code: 'KSA' }, { roomNumber: '502', code: 'KSA' },

        { roomNumber: '1004', code: 'KSO' }, { roomNumber: '1005', code: 'KSO' }, { roomNumber: '1104', code: 'KSO' }, { roomNumber: '1105', code: 'KSO' }, { roomNumber: '1204', code: 'KSO' }, { roomNumber: '1205', code: 'KSO' }, { roomNumber: '1304', code: 'KSO' }, { roomNumber: '1305', code: 'KSO' },

        { roomNumber: '204', code: 'KSO' }, { roomNumber: '304', code: 'KSO' }, { roomNumber: '404', code: 'KSO' }, { roomNumber: '504', code: 'KSO' }, { roomNumber: '505', code: 'KSO' }, { roomNumber: '604', code: 'KSO' }, { roomNumber: '605', code: 'KSO' },

        { roomNumber: '704', code: 'KSO' }, { roomNumber: '705', code: 'KSO' }, { roomNumber: '804', code: 'KSO' }, { roomNumber: '805', code: 'KSO' }, { roomNumber: '904', code: 'KSO' }, { roomNumber: '905', code: 'KSO' },

        { roomNumber: '1003', code: 'SQ' }, { roomNumber: '1103', code: 'SQ' }, { roomNumber: '1203', code: 'SQ' }, { roomNumber: '1303', code: 'SQ' }, { roomNumber: '403', code: 'SQ' }, { roomNumber: '503', code: 'SQ' }, { roomNumber: '603', code: 'SQ' }, { roomNumber: '703', code: 'SQ' }, { roomNumber: '903', code: 'SQ' },

        { roomNumber: '803', code: 'SQA' }

    ],

    msi: [

        // Q Rooms (27 Total)

        { roomNumber: '211', code: 'Q' }, { roomNumber: '212', code: 'Q' }, { roomNumber: '213', code: 'Q' }, { roomNumber: '214', code: 'Q' }, { roomNumber: '215', code: 'Q' },

        { roomNumber: '305', code: 'Q' }, { roomNumber: '306', code: 'Q' }, { roomNumber: '307', code: 'Q' }, { roomNumber: '308', code: 'Q' }, { roomNumber: '309', code: 'Q' },

        { roomNumber: '310', code: 'Q' }, { roomNumber: '311', code: 'Q' }, { roomNumber: '312', code: 'Q' }, { roomNumber: '313', code: 'Q' }, { roomNumber: '314', code: 'Q' }, { roomNumber: '315', code: 'Q' },

        { roomNumber: '402', code: 'Q' }, { roomNumber: '403', code: 'Q' }, { roomNumber: '404', code: 'Q' }, { roomNumber: '405', code: 'Q' }, { roomNumber: '406', code: 'Q' },

        { roomNumber: '407', code: 'Q' }, { roomNumber: '408', code: 'Q' }, { roomNumber: '409', code: 'Q' }, { roomNumber: '410', code: 'Q' }, { roomNumber: '411', code: 'Q' }, { roomNumber: '412', code: 'Q' },

        // RD Rooms (8 Total)

        { roomNumber: '101', code: 'RD' }, { roomNumber: '110', code: 'RD' }, { roomNumber: '205', code: 'RD' }, 

        { roomNumber: '206', code: 'RD' }, { roomNumber: '207', code: 'RD' }, { roomNumber: '208', code: 'RD' }, 

        { roomNumber: '209', code: 'RD' }, { roomNumber: '210', code: 'RD' },

        // RDCY Rooms (8 Total)

        { roomNumber: '102', code: 'RDCY' }, { roomNumber: '103', code: 'RDCY' }, { roomNumber: '104', code: 'RDCY' }, 

        { roomNumber: '105', code: 'RDCY' }, { roomNumber: '106', code: 'RDCY' }, { roomNumber: '107', code: 'RDCY' }, 

        { roomNumber: '108', code: 'RDCY' }, { roomNumber: '109', code: 'RDCY' },

        // DQ Rooms (2 Total)

        { roomNumber: '204', code: 'DQ' }, { roomNumber: '216', code: 'DQ' },

        // DD Rooms (4 Total)

        { roomNumber: '304', code: 'DD' }, { roomNumber: '316', code: 'DD' }, { roomNumber: '401', code: 'DD' }, { roomNumber: '413', code: 'DD' },

        // HHK Rooms (6 Total)

        { roomNumber: '201', code: 'HHK' }, { roomNumber: '202', code: 'HHK' }, { roomNumber: '203', code: 'HHK' },

        { roomNumber: '301', code: 'HHK' }, { roomNumber: '302', code: 'HHK' }, { roomNumber: '303', code: 'HHK' },

        // TQACC Room (1 Total)

        { roomNumber: '111', code: 'TQACC' }

    ],

    indjh: [

        // CHQ Rooms (4 Total)

        { roomNumber: 'J1', code: 'CHQ' }, { roomNumber: 'J2', code: 'CHQ' }, { roomNumber: 'J3', code: 'CHQ' }, { roomNumber: 'J4', code: 'CHQ' },

        // DK Rooms (6 Total)

        { roomNumber: 'I101', code: 'DK' }, { roomNumber: 'I112', code: 'DK' }, { roomNumber: 'I201', code: 'DK' }, 

        { roomNumber: 'I212', code: 'DK' }, { roomNumber: 'I301', code: 'DK' }, { roomNumber: 'I312', code: 'DK' },

        // MHD-Q Rooms (4 Total)

        { roomNumber: 'J101E', code: 'MHD-Q' }, { roomNumber: 'J101W', code: 'MHD-Q' }, 

        { roomNumber: 'J201E', code: 'MHD-Q' }, { roomNumber: 'J201W', code: 'MHD-Q' },

        // MHF-Q Rooms (1 Total)

        { roomNumber: 'J3F', code: 'MHF-Q' },

        // MHS-Q Rooms (2 Total)

        { roomNumber: 'J102NW', code: 'MHS-Q' }, { roomNumber: 'J202NW', code: 'MHS-Q' },

        // QAV Rooms (10 Total)

        { roomNumber: 'I104', code: 'QAV' }, { roomNumber: 'I106', code: 'QAV' }, { roomNumber: 'I107', code: 'QAV' }, 

        { roomNumber: 'I109', code: 'QAV' }, { roomNumber: 'I205', code: 'QAV' }, { roomNumber: 'I206', code: 'QAV' }, 

        { roomNumber: 'I207', code: 'QAV' }, { roomNumber: 'I306', code: 'QAV' }, { roomNumber: 'I307', code: 'QAV' }, 

        { roomNumber: 'I309', code: 'QAV' },

        // QNV Rooms (4 Total)

        { roomNumber: 'I1200', code: 'QNV' }, { roomNumber: 'I214', code: 'QNV' }, { roomNumber: 'I300', code: 'QNV' }, 

        { roomNumber: 'I314', code: 'QNV' },

        // QQ Rooms (6 Total)

        { roomNumber: 'I102', code: 'QQ' }, { roomNumber: 'I111', code: 'QQ' }, { roomNumber: 'I202', code: 'QQ' }, 

        { roomNumber: 'I211', code: 'QQ' }, { roomNumber: 'I302', code: 'QQ' }, { roomNumber: 'I311', code: 'QQ' },

        // QQAV Rooms (14 Total)

        { roomNumber: 'I103', code: 'QQAV' }, { roomNumber: 'I105', code: 'QQAV' }, { roomNumber: 'I108', code: 'QQAV' }, 

        { roomNumber: 'I110', code: 'QQAV' }, { roomNumber: 'I203', code: 'QQAV' }, { roomNumber: 'I204', code: 'QQAV' }, 

        { roomNumber: 'I208', code: 'QQAV' }, { roomNumber: 'I209', code: 'QQAV' }, { roomNumber: 'I210', code: 'QQAV' }, 

        { roomNumber: 'I303', code: 'QQAV' }, { roomNumber: 'I304', code: 'QQAV' }, { roomNumber: 'I305', code: 'QQAV' }, 

        { roomNumber: 'I308', code: 'QQAV' }, { roomNumber: 'I310', code: 'QQAV' }

    ],

    sts: [

        // PKR (1 Room)

        { roomNumber: '215', code: 'PKR' },

        // TKR (23 Rooms)

        { roomNumber: '203', code: 'TKR' }, { roomNumber: '204', code: 'TKR' }, { roomNumber: '206', code: 'TKR' },

        { roomNumber: '207', code: 'TKR' }, { roomNumber: '208', code: 'TKR' }, { roomNumber: '209', code: 'TKR' },

        { roomNumber: '211', code: 'TKR' }, { roomNumber: '212', code: 'TKR' }, { roomNumber: '213', code: 'TKR' },

        { roomNumber: '214', code: 'TKR' }, { roomNumber: '303', code: 'TKR' }, { roomNumber: '304', code: 'TKR' },

        { roomNumber: '307', code: 'TKR' }, { roomNumber: '308', code: 'TKR' }, { roomNumber: '309', code: 'TKR' },

        { roomNumber: '311', code: 'TKR' }, { roomNumber: '312', code: 'TKR' }, { roomNumber: '314', code: 'TKR' },

        { roomNumber: '319', code: 'TKR' }, { roomNumber: '402', code: 'TKR' }, { roomNumber: '403', code: 'TKR' },

        { roomNumber: '406', code: 'TKR' }, { roomNumber: '407', code: 'TKR' },

        // QQR (11 Rooms)

        { roomNumber: '202', code: 'QQR' }, { roomNumber: '210', code: 'QQR' }, { roomNumber: '218', code: 'QQR' },

        { roomNumber: '220', code: 'QQR' }, { roomNumber: '302', code: 'QQR' }, { roomNumber: '306', code: 'QQR' },

        { roomNumber: '310', code: 'QQR' }, { roomNumber: '317', code: 'QQR' }, { roomNumber: '401', code: 'QQR' },

        { roomNumber: '405', code: 'QQR' }, { roomNumber: '408', code: 'QQR' },

        // LKR (4 Rooms)

        { roomNumber: '201', code: 'LKR' }, { roomNumber: '221', code: 'LKR' }, { roomNumber: '301', code: 'LKR' },

        { roomNumber: '316', code: 'LKR' },

        // CKR (3 Rooms)

        { roomNumber: '205', code: 'CKR' }, { roomNumber: '305', code: 'CKR' }, { roomNumber: '404', code: 'CKR' },

        // KS (5 Rooms)

        { roomNumber: '217', code: 'KS' }, { roomNumber: '219', code: 'KS' }, { roomNumber: '313', code: 'KS' },

        { roomNumber: '315', code: 'KS' }, { roomNumber: '318', code: 'KS' },

        // PKS (1 Room)

        { roomNumber: '409', code: 'PKS' },

        // AKR (1 Room)

        { roomNumber: '216', code: 'AKR' },

        // AQQ (1 Room)

        { roomNumber: '320', code: 'AQQ' }

    ],

    rcn: [

        // KING (34 Rooms)

        { roomNumber: '429', code: 'KING' }, { roomNumber: '427', code: 'KING' }, { roomNumber: '426', code: 'KING' }, { roomNumber: '423', code: 'KING' }, { roomNumber: '422', code: 'KING' },

        { roomNumber: '419', code: 'KING' }, { roomNumber: '418', code: 'KING' }, { roomNumber: '417', code: 'KING' }, { roomNumber: '416', code: 'KING' }, { roomNumber: '403', code: 'KING' },

        { roomNumber: '402', code: 'KING' }, { roomNumber: '401', code: 'KING' }, { roomNumber: '330', code: 'KING' }, { roomNumber: '327', code: 'KING' }, { roomNumber: '326', code: 'KING' },

        { roomNumber: '323', code: 'KING' }, { roomNumber: '322', code: 'KING' }, { roomNumber: '320', code: 'KING' }, { roomNumber: '303', code: 'KING' }, { roomNumber: '302', code: 'KING' },

        { roomNumber: '301', code: 'KING' }, { roomNumber: '230', code: 'KING' }, { roomNumber: '229', code: 'KING' }, { roomNumber: '227', code: 'KING' }, { roomNumber: '226', code: 'KING' },

        { roomNumber: '223', code: 'KING' }, { roomNumber: '222', code: 'KING' }, { roomNumber: '219', code: 'KING' }, { roomNumber: '215', code: 'KING' }, { roomNumber: '214', code: 'KING' },

        { roomNumber: '212', code: 'KING' }, { roomNumber: '203', code: 'KING' }, { roomNumber: '202', code: 'KING' }, { roomNumber: '201', code: 'KING' },

        // KINGADA (4 Rooms)

        { roomNumber: '220', code: 'KINGADA' }, { roomNumber: '319', code: 'KINGADA' }, { roomNumber: '329', code: 'KINGADA' }, { roomNumber: '430', code: 'KINGADA' },

        // DQUEEN (28 Rooms)

        { roomNumber: '205', code: 'DQUEEN' }, { roomNumber: '206', code: 'DQUEEN' }, { roomNumber: '207', code: 'DQUEEN' }, { roomNumber: '208', code: 'DQUEEN' }, { roomNumber: '209', code: 'DQUEEN' },

        { roomNumber: '210', code: 'DQUEEN' }, { roomNumber: '221', code: 'DQUEEN' }, { roomNumber: '224', code: 'DQUEEN' }, { roomNumber: '228', code: 'DQUEEN' }, { roomNumber: '305', code: 'DQUEEN' },

        { roomNumber: '306', code: 'DQUEEN' }, { roomNumber: '307', code: 'DQUEEN' }, { roomNumber: '308', code: 'DQUEEN' }, { roomNumber: '309', code: 'DQUEEN' }, { roomNumber: '310', code: 'DQUEEN' },

        { roomNumber: '321', code: 'DQUEEN' }, { roomNumber: '324', code: 'DQUEEN' }, { roomNumber: '325', code: 'DQUEEN' }, { roomNumber: '328', code: 'DQUEEN' }, { roomNumber: '405', code: 'DQUEEN' },

        { roomNumber: '406', code: 'DQUEEN' }, { roomNumber: '407', code: 'DQUEEN' }, { roomNumber: '408', code: 'DQUEEN' }, { roomNumber: '409', code: 'DQUEEN' }, { roomNumber: '410', code: 'DQUEEN' },

        { roomNumber: '424', code: 'DQUEEN' }, { roomNumber: '425', code: 'DQUEEN' }, { roomNumber: '428', code: 'DQUEEN' },

        // ADADQ (1 Room)

        { roomNumber: '225', code: 'ADADQ' },

        // LVKING (6 Rooms)

        { roomNumber: '312', code: 'LVKING' }, { roomNumber: '314', code: 'LVKING' }, { roomNumber: '315', code: 'LVKING' },

        { roomNumber: '412', code: 'LVKING' }, { roomNumber: '414', code: 'LVKING' }, { roomNumber: '415', code: 'LVKING' },

        // JRSTE (4 Rooms)

        { roomNumber: '204', code: 'JRSTE' }, { roomNumber: '211', code: 'JRSTE' }, { roomNumber: '304', code: 'JRSTE' }, { roomNumber: '404', code: 'JRSTE' },

        // LVJRSTE (2 Rooms)

        { roomNumber: '311', code: 'LVJRSTE' }, { roomNumber: '411', code: 'LVJRSTE' },

        // PRES (1 Room)

        { roomNumber: '421', code: 'PRES' }

    ],

    cby: [

        // KNR (16 Rooms)

        { roomNumber: '205', code: 'KNR' }, { roomNumber: '207', code: 'KNR' }, { roomNumber: '209', code: 'KNR' }, { roomNumber: '214', code: 'KNR' }, { roomNumber: '216', code: 'KNR' },

        { roomNumber: '305', code: 'KNR' }, { roomNumber: '307', code: 'KNR' }, { roomNumber: '309', code: 'KNR' }, { roomNumber: '314', code: 'KNR' }, { roomNumber: '316', code: 'KNR' },

        { roomNumber: '405', code: 'KNR' }, { roomNumber: '407', code: 'KNR' }, { roomNumber: '409', code: 'KNR' }, { roomNumber: '411', code: 'KNR' }, { roomNumber: '414', code: 'KNR' }, { roomNumber: '416', code: 'KNR' },

        // KND (6 Rooms)

        { roomNumber: '201', code: 'KND' }, { roomNumber: '202', code: 'KND' }, { roomNumber: '301', code: 'KND' }, { roomNumber: '302', code: 'KND' }, { roomNumber: '401', code: 'KND' }, { roomNumber: '402', code: 'KND' },

        // QQNR (25 Rooms)

        { roomNumber: '203', code: 'QQNR' }, { roomNumber: '204', code: 'QQNR' }, { roomNumber: '206', code: 'QQNR' }, { roomNumber: '211', code: 'QQNR' }, { roomNumber: '215', code: 'QQNR' }, { roomNumber: '217', code: 'QQNR' }, { roomNumber: '219', code: 'QQNR' }, { roomNumber: '221', code: 'QQNR' },

        { roomNumber: '303', code: 'QQNR' }, { roomNumber: '304', code: 'QQNR' }, { roomNumber: '306', code: 'QQNR' }, { roomNumber: '311', code: 'QQNR' }, { roomNumber: '312', code: 'QQNR' }, { roomNumber: '315', code: 'QQNR' }, { roomNumber: '317', code: 'QQNR' }, { roomNumber: '319', code: 'QQNR' }, { roomNumber: '321', code: 'QQNR' },

        { roomNumber: '403', code: 'QQNR' }, { roomNumber: '404', code: 'QQNR' }, { roomNumber: '406', code: 'QQNR' }, { roomNumber: '412', code: 'QQNR' }, { roomNumber: '415', code: 'QQNR' }, { roomNumber: '417', code: 'QQNR' }, { roomNumber: '419', code: 'QQNR' }, { roomNumber: '421', code: 'QQNR' },

        // KAR (2 Rooms)

        { roomNumber: '213', code: 'KAR' }, { roomNumber: '313', code: 'KAR' },

        // QQAR (1 Room)

        { roomNumber: '413', code: 'QQAR' },

        // K1S (2 Rooms)

        { roomNumber: '308', code: 'K1S' }, { roomNumber: '408', code: 'K1S' },

        // K1AS (1 Room)

        { roomNumber: '208', code: 'K1AS' }

    ],

    bri: [

        // PQNN (5 Rooms)

        { roomNumber: '210', code: 'PQNN' }, { roomNumber: '310', code: 'PQNN' }, { roomNumber: '409', code: 'PQNN' }, { roomNumber: '509', code: 'PQNN' }, { roomNumber: '609', code: 'PQNN' },

        // PKNG (5 Rooms)

        { roomNumber: '209', code: 'PKNG' }, { roomNumber: '309', code: 'PKNG' }, { roomNumber: '408', code: 'PKNG' }, { roomNumber: '508', code: 'PKNG' }, { roomNumber: '608', code: 'PKNG' },

        // STQQ (21 Rooms)

        { roomNumber: '205', code: 'STQQ' }, { roomNumber: '206', code: 'STQQ' }, { roomNumber: '211', code: 'STQQ' }, { roomNumber: '305', code: 'STQQ' }, { roomNumber: '306', code: 'STQQ' }, { roomNumber: '311', code: 'STQQ' },

        { roomNumber: '402', code: 'STQQ' }, { roomNumber: '404', code: 'STQQ' }, { roomNumber: '405', code: 'STQQ' }, { roomNumber: '410', code: 'STQQ' }, { roomNumber: '502', code: 'STQQ' }, { roomNumber: '505', code: 'STQQ' },

        { roomNumber: '510', code: 'STQQ' }, { roomNumber: '602', code: 'STQQ' }, { roomNumber: '604', code: 'STQQ' }, { roomNumber: '605', code: 'STQQ' }, { roomNumber: '610', code: 'STQQ' }, { roomNumber: '702', code: 'STQQ' },

        { roomNumber: '704', code: 'STQQ' }, { roomNumber: '705', code: 'STQQ' }, { roomNumber: '708', code: 'STQQ' },

        // SQAC (1 Room)

        { roomNumber: '504', code: 'SQAC' },

        // SKNG (20 Rooms)

        { roomNumber: '204', code: 'SKNG' }, { roomNumber: '208', code: 'SKNG' }, { roomNumber: '212', code: 'SKNG' }, { roomNumber: '301', code: 'SKNG' }, { roomNumber: '308', code: 'SKNG' }, { roomNumber: '312', code: 'SKNG' },

        { roomNumber: '401', code: 'SKNG' }, { roomNumber: '403', code: 'SKNG' }, { roomNumber: '406', code: 'SKNG' }, { roomNumber: '411', code: 'SKNG' }, { roomNumber: '501', code: 'SKNG' }, { roomNumber: '503', code: 'SKNG' },

        { roomNumber: '506', code: 'SKNG' }, { roomNumber: '511', code: 'SKNG' }, { roomNumber: '601', code: 'SKNG' }, { roomNumber: '603', code: 'SKNG' }, { roomNumber: '606', code: 'SKNG' }, { roomNumber: '611', code: 'SKNG' },

        { roomNumber: '701', code: 'SKNG' }, { roomNumber: '709', code: 'SKNG' },

        // SKAC (2 Rooms)

        { roomNumber: '304', code: 'SKAC' }, { roomNumber: '703', code: 'SKAC' },

        // HERT (6 Rooms)

        { roomNumber: '207', code: 'HERT' }, { roomNumber: '307', code: 'HERT' }, { roomNumber: '407', code: 'HERT' }, { roomNumber: '507', code: 'HERT' }, { roomNumber: '607', code: 'HERT' }, { roomNumber: '706', code: 'HERT' },

        // AMER (2 Rooms)

        { roomNumber: '203', code: 'AMER' }, { roomNumber: '303', code: 'AMER' },

        // LEST (1 Room)

        { roomNumber: '202', code: 'LEST' },

        // LEAC (1 Room)

        { roomNumber: '302', code: 'LEAC' },

        // GPST (1 Room)

        { roomNumber: '707', code: 'GPST' }

    ],

    dar: [

        // RQR (4 Rooms)

        { roomNumber: '101', code: 'RQR' }, { roomNumber: '102', code: 'RQR' }, { roomNumber: '103', code: 'RQR' }, { roomNumber: '104', code: 'RQR' },

        // RKR (17 Rooms)

        { roomNumber: '205', code: 'RKR' }, { roomNumber: '206', code: 'RKR' }, { roomNumber: '207', code: 'RKR' }, { roomNumber: '208', code: 'RKR' }, { roomNumber: '209', code: 'RKR' },

        { roomNumber: '210', code: 'RKR' }, { roomNumber: '213', code: 'RKR' }, { roomNumber: '314', code: 'RKR' }, { roomNumber: '315', code: 'RKR' }, { roomNumber: '316', code: 'RKR' },

        { roomNumber: '318', code: 'RKR' }, { roomNumber: '319', code: 'RKR' }, { roomNumber: '320', code: 'RKR' }, { roomNumber: '321', code: 'RKR' }, { roomNumber: '324', code: 'RKR' },

        { roomNumber: '425', code: 'RKR' }, { roomNumber: '432', code: 'RKR' },

        // RQQ (1 Room)

        { roomNumber: '431', code: 'RQQ' },

        // SKR (6 Rooms)

        { roomNumber: '211', code: 'SKR' }, { roomNumber: '212', code: 'SKR' }, { roomNumber: '317', code: 'SKR' }, { roomNumber: '323', code: 'SKR' }, { roomNumber: '426', code: 'SKR' }, { roomNumber: '427', code: 'SKR' },

        // AKS (2 Rooms)

        { roomNumber: '322', code: 'AKS' }, { roomNumber: '428', code: 'AKS' },

        // EXE (1 Room)

        { roomNumber: '430', code: 'EXE' },

        // DAR (1 Room)

        { roomNumber: '429', code: 'DAR' }

    ],

    dpi: [

        // PKING-K (2 Rooms)

        { roomNumber: '325', code: 'PKING-K' }, { roomNumber: '328', code: 'PKING-K' },

        // PQUEEN-Q (1 Room)

        { roomNumber: '225', code: 'PQUEEN-Q' },

        // NKING-K (23 Rooms)

        { roomNumber: '101', code: 'NKING-K' }, { roomNumber: '102', code: 'NKING-K' }, { roomNumber: '103', code: 'NKING-K' }, { roomNumber: '105', code: 'NKING-K' }, { roomNumber: '201', code: 'NKING-K' },

        { roomNumber: '202', code: 'NKING-K' }, { roomNumber: '203', code: 'NKING-K' }, { roomNumber: '205', code: 'NKING-K' }, { roomNumber: '214', code: 'NKING-K' }, { roomNumber: '216', code: 'NKING-K' },

        { roomNumber: '218', code: 'NKING-K' }, { roomNumber: '220', code: 'NKING-K' }, { roomNumber: '228', code: 'NKING-K' }, { roomNumber: '232', code: 'NKING-K' }, { roomNumber: '234', code: 'NKING-K' },

        { roomNumber: '311', code: 'NKING-K' }, { roomNumber: '314', code: 'NKING-K' }, { roomNumber: '316', code: 'NKING-K' }, { roomNumber: '318', code: 'NKING-K' }, { roomNumber: '330', code: 'NKING-K' },

        { roomNumber: '332', code: 'NKING-K' }, { roomNumber: '334', code: 'NKING-K' }, { roomNumber: '336', code: 'NKING-K' },

        // NKINGACC-K (1 Room)

        { roomNumber: '236', code: 'NKINGACC-K' },

        // NQQ-QQ (7 Rooms)

        { roomNumber: '109', code: 'NQQ-QQ' }, { roomNumber: '111', code: 'NQQ-QQ' }, { roomNumber: '209', code: 'NQQ-QQ' }, { roomNumber: '211', code: 'NQQ-QQ' }, { roomNumber: '230', code: 'NQQ-QQ' },

        { roomNumber: '306', code: 'NQQ-QQ' }, { roomNumber: '323', code: 'NQQ-QQ' },

        // RKINGACC-K (1 Room)

        { roomNumber: '213', code: 'RKINGACC-K' },

        // RQQ-QQ (5 Rooms)

        { roomNumber: '104', code: 'RQQ-QQ' }, { roomNumber: '113', code: 'RQQ-QQ' }, { roomNumber: '204', code: 'RQQ-QQ' }, { roomNumber: '223', code: 'RQQ-QQ' }, { roomNumber: '310', code: 'RQQ-QQ' },

        // RQQACC-QQ (1 Room)

        { roomNumber: '313', code: 'RQQACC-QQ' },

        // MHQQ-QQ (1 Room)

        { roomNumber: '309', code: 'MHQQ-QQ' },

        // MHQSTE-Q (1 Room)

        { roomNumber: '337', code: 'MHQSTE-Q' },

        // MHSTE-K (5 Rooms)

        { roomNumber: '217', code: 'MHSTE-K' }, { roomNumber: '227', code: 'MHSTE-K' }, { roomNumber: '301', code: 'MHSTE-K' }, { roomNumber: '302', code: 'MHSTE-K' }, { roomNumber: '317', code: 'MHSTE-K' },

        // MHSTEKIT-K (2 Rooms)

        { roomNumber: '108', code: 'MHSTEKIT-K' }, { roomNumber: '208', code: 'MHSTEKIT-K' },

        // RSTE-K (5 Rooms)

        { roomNumber: '215', code: 'RSTE-K' }, { roomNumber: '221', code: 'RSTE-K' }, { roomNumber: '315', code: 'RSTE-K' }, { roomNumber: '321', code: 'RSTE-K' }, { roomNumber: '327', code: 'RSTE-K' },

        // BUCKSTE-K (1 Room)

        { roomNumber: '241', code: 'BUCKSTE-K' },

        // CORNSTE-K (1 Room)

        { roomNumber: '239', code: 'CORNSTE-K' }

    ],

    asu: [

        // 1K-K/SB (6 Rooms)

        { roomNumber: '101', code: '1K-K/SB' }, { roomNumber: '102', code: '1K-K/SB' }, { roomNumber: '201', code: '1K-K/SB' }, { roomNumber: '202', code: '1K-K/SB' }, { roomNumber: '209', code: '1K-K/SB' }, { roomNumber: '210', code: '1K-K/SB' },

        // 1KF-K (2 Rooms)

        { roomNumber: '109', code: '1KF-K' }, { roomNumber: '110', code: '1KF-K' },

        // 1KH-K (2 Rooms)

        { roomNumber: '119', code: '1KH-K' }, { roomNumber: '219', code: '1KH-K' },

        // 1KJ-K (1 Room)

        { roomNumber: '127', code: '1KJ-K' },

        // 1QQ-QQ (42 Rooms)

        { roomNumber: '105', code: '1QQ-QQ' }, { roomNumber: '106', code: '1QQ-QQ' }, { roomNumber: '107', code: '1QQ-QQ' }, { roomNumber: '108', code: '1QQ-QQ' }, { roomNumber: '111', code: '1QQ-QQ' }, { roomNumber: '112', code: '1QQ-QQ' },

        { roomNumber: '115', code: '1QQ-QQ' }, { roomNumber: '116', code: '1QQ-QQ' }, { roomNumber: '117', code: '1QQ-QQ' }, { roomNumber: '118', code: '1QQ-QQ' }, { roomNumber: '121', code: '1QQ-QQ' }, { roomNumber: '122', code: '1QQ-QQ' },

        { roomNumber: '123', code: '1QQ-QQ' }, { roomNumber: '124', code: '1QQ-QQ' }, { roomNumber: '205', code: '1QQ-QQ' }, { roomNumber: '206', code: '1QQ-QQ' }, { roomNumber: '208', code: '1QQ-QQ' }, { roomNumber: '211', code: '1QQ-QQ' },

        { roomNumber: '212', code: '1QQ-QQ' }, { roomNumber: '213', code: '1QQ-QQ' }, { roomNumber: '214', code: '1QQ-QQ' }, { roomNumber: '215', code: '1QQ-QQ' }, { roomNumber: '216', code: '1QQ-QQ' }, { roomNumber: '217', code: '1QQ-QQ' },

        { roomNumber: '218', code: '1QQ-QQ' }, { roomNumber: '221', code: '1QQ-QQ' }, { roomNumber: '223', code: '1QQ-QQ' }, { roomNumber: '224', code: '1QQ-QQ' },

        // 1QQD-QQ (2 Rooms)

        { roomNumber: '113', code: '1QQD-QQ' }, { roomNumber: '114', code: '1QQD-QQ' },

        // 1QQF-QQ (2 Rooms)

        { roomNumber: '207', code: '1QQF-QQ' }, { roomNumber: '222', code: '1QQF-QQ' },

        // 1QQH-Q (2 Rooms)

        { roomNumber: '120', code: '1QQH-Q' }, { roomNumber: '220', code: '1QQH-Q' },

        // 2KQQ-K/QQ (8 Rooms)

        { roomNumber: '103', code: '2KQQ-K/QQ' }, { roomNumber: '104', code: '2KQQ-K/QQ' }, { roomNumber: '125', code: '2KQQ-K/QQ' }, { roomNumber: '126', code: '2KQQ-K/QQ' }, { roomNumber: '203', code: '2KQQ-K/QQ' }, { roomNumber: '204', code: '2KQQ-K/QQ' },

        { roomNumber: '225', code: '2KQQ-K/QQ' }, { roomNumber: '226', code: '2KQQ-K/QQ' }

    ],

    ehi: [

        // TRADQUEEN-Q (2 Rooms)

        { roomNumber: '11', code: 'TRADQUEEN-Q' }, { roomNumber: '21', code: 'TRADQUEEN-Q' },

        // TRADKING-K (3 Rooms)

        { roomNumber: '10', code: 'TRADKING-K' }, { roomNumber: '31', code: 'TRADKING-K' }, { roomNumber: '32', code: 'TRADKING-K' },

        // QNN-Q (6 Rooms)

        { roomNumber: '12', code: 'QNN-Q' }, { roomNumber: '14', code: 'QNN-Q' }, { roomNumber: '23', code: 'QNN-Q' }, { roomNumber: '25', code: 'QNN-Q' }, { roomNumber: '33', code: 'QNN-Q' }, { roomNumber: '34', code: 'QNN-Q' },

        // KNN-K (15 Rooms)

        { roomNumber: '15', code: 'KNN-K' }, { roomNumber: '16', code: 'KNN-K' }, { roomNumber: '17', code: 'KNN-K' }, { roomNumber: '18', code: 'KNN-K' }, { roomNumber: '19', code: 'KNN-K' },

        { roomNumber: '20', code: 'KNN-K' }, { roomNumber: '22', code: 'KNN-K' }, { roomNumber: '24', code: 'KNN-K' }, { roomNumber: '26', code: 'KNN-K' }, { roomNumber: '27', code: 'KNN-K' },

        { roomNumber: '28', code: 'KNN-K' }, { roomNumber: '29', code: 'KNN-K' }, { roomNumber: '30', code: 'KNN-K' }, { roomNumber: '35', code: 'KNN-K' }, { roomNumber: '36', code: 'KNN-K' }

    ],

    palms: [

        // TRAK-K (7 Rooms)

        { roomNumber: '112', code: 'TRAK-K' }, { roomNumber: '120', code: 'TRAK-K' }, { roomNumber: '205', code: 'TRAK-K' }, { roomNumber: '212', code: 'TRAK-K' }, { roomNumber: '220', code: 'TRAK-K' }, { roomNumber: '305', code: 'TRAK-K' }, { roomNumber: '312', code: 'TRAK-K' }, { roomNumber: '320', code: 'TRAK-K' },

        // TRAQQ-QQ (18 Rooms)

        { roomNumber: '114', code: 'TRAQQ-QQ' }, { roomNumber: '116', code: 'TRAQQ-QQ' }, { roomNumber: '118', code: 'TRAQQ-QQ' }, { roomNumber: '122', code: 'TRAQQ-QQ' }, { roomNumber: '203', code: 'TRAQQ-QQ' }, { roomNumber: '207', code: 'TRAQQ-QQ' }, { roomNumber: '209', code: 'TRAQQ-QQ' }, { roomNumber: '214', code: 'TRAQQ-QQ' }, { roomNumber: '216', code: 'TRAQQ-QQ' }, { roomNumber: '218', code: 'TRAQQ-QQ' }, { roomNumber: '222', code: 'TRAQQ-QQ' }, { roomNumber: '303', code: 'TRAQQ-QQ' }, { roomNumber: '307', code: 'TRAQQ-QQ' }, { roomNumber: '309', code: 'TRAQQ-QQ' }, { roomNumber: '314', code: 'TRAQQ-QQ' }, { roomNumber: '316', code: 'TRAQQ-QQ' }, { roomNumber: '318', code: 'TRAQQ-QQ' }, { roomNumber: '322', code: 'TRAQQ-QQ' },

        // TRAKH-K (1 Room)

        { roomNumber: '109', code: 'TRAKH-K' },

        // CBREEQQ-QQ (3 Rooms)

        { roomNumber: '111', code: 'CBREEQQ-QQ' }, { roomNumber: '113', code: 'CBREEQQ-QQ' }, { roomNumber: '115', code: 'CBREEQQ-QQ' },

        // COASK-K (9 Rooms)

        { roomNumber: '117', code: 'COASK-K' }, { roomNumber: '119', code: 'COASK-K' }, { roomNumber: '121', code: 'COASK-K' }, { roomNumber: '217', code: 'COASK-K' }, { roomNumber: '219', code: 'COASK-K' }, { roomNumber: '221', code: 'COASK-K' }, { roomNumber: '317', code: 'COASK-K' }, { roomNumber: '319', code: 'COASK-K' }, { roomNumber: '321', code: 'COASK-K' },

        // COASQQ-QQ (9 Rooms)

        { roomNumber: '123', code: 'COASQQ-QQ' }, { roomNumber: '211', code: 'COASQQ-QQ' }, { roomNumber: '213', code: 'COASQQ-QQ' }, { roomNumber: '215', code: 'COASQQ-QQ' }, { roomNumber: '223', code: 'COASQQ-QQ' }, { roomNumber: '311', code: 'COASQQ-QQ' }, { roomNumber: '313', code: 'COASQQ-QQ' }, { roomNumber: '315', code: 'COASQQ-QQ' }, { roomNumber: '323', code: 'COASQQ-QQ' },

        // ISLAND-K (2 Rooms)

        { roomNumber: '201', code: 'ISLAND-K' }, { roomNumber: '301', code: 'ISLAND-K' },

        // OFKN-K (9 Rooms)

        { roomNumber: '124', code: 'OFKN-K' }, { roomNumber: '126', code: 'OFKN-K' }, { roomNumber: '129', code: 'OFKN-K' }, { roomNumber: '224', code: 'OFKN-K' }, { roomNumber: '226', code: 'OFKN-K' }, { roomNumber: '229', code: 'OFKN-K' }, { roomNumber: '324', code: 'OFKN-K' }, { roomNumber: '326', code: 'OFKN-K' }, { roomNumber: '329', code: 'OFKN-K' },

        // OFQQ-QQ (9 Rooms)

        { roomNumber: '125', code: 'OFQQ-QQ' }, { roomNumber: '127', code: 'OFQQ-QQ' }, { roomNumber: '128', code: 'OFQQ-QQ' }, { roomNumber: '225', code: 'OFQQ-QQ' }, { roomNumber: '227', code: 'OFQQ-QQ' }, { roomNumber: '228', code: 'OFQQ-QQ' }, { roomNumber: '325', code: 'OFQQ-QQ' }, { roomNumber: '327', code: 'OFQQ-QQ' }, { roomNumber: '328', code: 'OFQQ-QQ' }

    ],

    csh: [

        // SQ (15 Rooms)

        { roomNumber: '201', code: 'SQ' }, { roomNumber: '210', code: 'SQ' }, { roomNumber: '211', code: 'SQ' }, { roomNumber: '221', code: 'SQ' }, { roomNumber: '222', code: 'SQ' },

        { roomNumber: '301', code: 'SQ' }, { roomNumber: '310', code: 'SQ' }, { roomNumber: '311', code: 'SQ' }, { roomNumber: '321', code: 'SQ' }, { roomNumber: '322', code: 'SQ' },

        { roomNumber: '401', code: 'SQ' }, { roomNumber: '410', code: 'SQ' }, { roomNumber: '411', code: 'SQ' }, { roomNumber: '418', code: 'SQ' }, { roomNumber: '421', code: 'SQ' }, { roomNumber: '422', code: 'SQ' },

        // QQ (3 Rooms)

        { roomNumber: '226', code: 'QQ' }, { roomNumber: '326', code: 'QQ' }, { roomNumber: '426', code: 'QQ' },

        // DS (16 Rooms)

        { roomNumber: '204', code: 'DS' }, { roomNumber: '206', code: 'DS' }, { roomNumber: '208', code: 'DS' }, { roomNumber: '216', code: 'DS' }, { roomNumber: '218', code: 'DS' }, { roomNumber: '220', code: 'DS' },

        { roomNumber: '304', code: 'DS' }, { roomNumber: '306', code: 'DS' }, { roomNumber: '308', code: 'DS' }, { roomNumber: '316', code: 'DS' }, { roomNumber: '318', code: 'DS' }, { roomNumber: '320', code: 'DS' },

        { roomNumber: '404', code: 'DS' }, { roomNumber: '406', code: 'DS' }, { roomNumber: '408', code: 'DS' }, { roomNumber: '420', code: 'DS' },

        // KS (9 Rooms)

        { roomNumber: '202', code: 'KS' }, { roomNumber: '214', code: 'KS' }, { roomNumber: '224', code: 'KS' },

        { roomNumber: '302', code: 'KS' }, { roomNumber: '314', code: 'KS' }, { roomNumber: '324', code: 'KS' },

        { roomNumber: '402', code: 'KS' }, { roomNumber: '414', code: 'KS' }, { roomNumber: '424', code: 'KS' },

        // EX (1 Room)

        { roomNumber: '416', code: 'EX' }

    ],

    cgt: [

        // PDBL-D (2 Rooms)

        { roomNumber: '15', code: 'PDBL-D' }, { roomNumber: '35', code: 'PDBL-D' },

        // QUEEN-Q (11 Rooms)

        { roomNumber: '02', code: 'QUEEN-Q' }, { roomNumber: '05', code: 'QUEEN-Q' }, { roomNumber: '09', code: 'QUEEN-Q' }, { roomNumber: '10', code: 'QUEEN-Q' }, { roomNumber: '11', code: 'QUEEN-Q' }, { roomNumber: '12', code: 'QUEEN-Q' },

        { roomNumber: '25', code: 'QUEEN-Q' }, { roomNumber: '29', code: 'QUEEN-Q' }, { roomNumber: '30', code: 'QUEEN-Q' }, { roomNumber: '31', code: 'QUEEN-Q' }, { roomNumber: '32', code: 'QUEEN-Q' },

        // QUEENADA-Q (2 Rooms)

        { roomNumber: '07', code: 'QUEENADA-Q' }, { roomNumber: '27', code: 'QUEENADA-Q' },

        // KING-K (10 Rooms)

        { roomNumber: '01', code: 'KING-K' }, { roomNumber: '03', code: 'KING-K' }, { roomNumber: '06', code: 'KING-K' }, { roomNumber: '08', code: 'KING-K' }, { roomNumber: '14', code: 'KING-K' },

        { roomNumber: '17', code: 'KING-K' }, { roomNumber: '23', code: 'KING-K' }, { roomNumber: '26', code: 'KING-K' }, { roomNumber: '34', code: 'KING-K' }, { roomNumber: '37', code: 'KING-K' },

        // EKING-K (4 Rooms)

        { roomNumber: '16', code: 'EKING-K' }, { roomNumber: '21', code: 'EKING-K' }, { roomNumber: '22', code: 'EKING-K' }, { roomNumber: '36', code: 'EKING-K' },

        // QNQN-QQ (1 Room)

        { roomNumber: '28', code: 'QNQN-QQ' },

        // KSTE-K (2 Rooms)

        { roomNumber: '19', code: 'KSTE-K' }, { roomNumber: '39', code: 'KSTE-K' },

        // KSTWN-K/T (2 Rooms)

        { roomNumber: '13', code: 'KSTWN-K/T' }, { roomNumber: '33', code: 'KSTWN-K/T' },

        // KSTSB-K/POC (2 Rooms)

        { roomNumber: '20', code: 'KSTSB-K/POC' }, { roomNumber: '40', code: 'KSTSB-K/POC' },

        // KSS-K (4 Rooms)

        { roomNumber: '04', code: 'KSS-K' }, { roomNumber: '18', code: 'KSS-K' }, { roomNumber: '24', code: 'KSS-K' }, { roomNumber: '38', code: 'KSS-K' }

    ],

    gsl: [

        // SQHC (4 Rooms)

        { roomNumber: '194', code: 'SQHC' }, { roomNumber: '195', code: 'SQHC' }, { roomNumber: '196', code: 'SQHC' }, { roomNumber: '197', code: 'SQHC' },

        

        // QQ1-E (59 Rooms)

        { roomNumber: '140', code: 'QQ1-E' }, { roomNumber: '142', code: 'QQ1-E' }, { roomNumber: '144', code: 'QQ1-E' }, { roomNumber: '146', code: 'QQ1-E' }, { roomNumber: '148', code: 'QQ1-E' }, { roomNumber: '150', code: 'QQ1-E' }, 

        { roomNumber: '152', code: 'QQ1-E' }, { roomNumber: '154', code: 'QQ1-E' }, { roomNumber: '155', code: 'QQ1-E' }, { roomNumber: '156', code: 'QQ1-E' }, { roomNumber: '157', code: 'QQ1-E' }, { roomNumber: '158', code: 'QQ1-E' }, 

        { roomNumber: '159', code: 'QQ1-E' }, { roomNumber: '160', code: 'QQ1-E' }, { roomNumber: '161', code: 'QQ1-E' }, { roomNumber: '162', code: 'QQ1-E' }, { roomNumber: '163', code: 'QQ1-E' }, { roomNumber: '164', code: 'QQ1-E' }, 

        { roomNumber: '190', code: 'QQ1-E' }, { roomNumber: '191', code: 'QQ1-E' }, { roomNumber: '192', code: 'QQ1-E' }, { roomNumber: '193', code: 'QQ1-E' }, { roomNumber: '240', code: 'QQ1-E' }, { roomNumber: '242', code: 'QQ1-E' }, 

        { roomNumber: '244', code: 'QQ1-E' }, { roomNumber: '246', code: 'QQ1-E' }, { roomNumber: '248', code: 'QQ1-E' }, { roomNumber: '250', code: 'QQ1-E' }, { roomNumber: '252', code: 'QQ1-E' }, { roomNumber: '254', code: 'QQ1-E' }, 

        { roomNumber: '255', code: 'QQ1-E' }, { roomNumber: '256', code: 'QQ1-E' }, { roomNumber: '257', code: 'QQ1-E' }, { roomNumber: '258', code: 'QQ1-E' }, { roomNumber: '259', code: 'QQ1-E' }, { roomNumber: '260', code: 'QQ1-E' }, 

        { roomNumber: '261', code: 'QQ1-E' }, { roomNumber: '262', code: 'QQ1-E' }, { roomNumber: '263', code: 'QQ1-E' }, { roomNumber: '264', code: 'QQ1-E' }, { roomNumber: '340', code: 'QQ1-E' }, { roomNumber: '342', code: 'QQ1-E' }, 

        { roomNumber: '344', code: 'QQ1-E' }, { roomNumber: '346', code: 'QQ1-E' }, { roomNumber: '348', code: 'QQ1-E' }, { roomNumber: '350', code: 'QQ1-E' }, { roomNumber: '352', code: 'QQ1-E' }, { roomNumber: '354', code: 'QQ1-E' }, 

        { roomNumber: '355', code: 'QQ1-E' }, { roomNumber: '356', code: 'QQ1-E' }, { roomNumber: '357', code: 'QQ1-E' }, { roomNumber: '358', code: 'QQ1-E' }, { roomNumber: '359', code: 'QQ1-E' }, { roomNumber: '360', code: 'QQ1-E' }, 

        { roomNumber: '361', code: 'QQ1-E' }, { roomNumber: '362', code: 'QQ1-E' }, { roomNumber: '363', code: 'QQ1-E' }, { roomNumber: '364', code: 'QQ1-E' },



        // K11-E (9 Rooms)

        { roomNumber: '138', code: 'K11-E' }, { roomNumber: '165', code: 'K11-E' }, { roomNumber: '166', code: 'K11-E' }, { roomNumber: '238', code: 'K11-E' }, { roomNumber: '265', code: 'K11-E' }, { roomNumber: '266', code: 'K11-E' }, 

        { roomNumber: '338', code: 'K11-E' }, { roomNumber: '365', code: 'K11-E' }, { roomNumber: '366', code: 'K11-E' },



        // DD20-P (24 Rooms)

        { roomNumber: '139', code: 'DD20-P' }, { roomNumber: '141', code: 'DD20-P' }, { roomNumber: '143', code: 'DD20-P' }, { roomNumber: '145', code: 'DD20-P' }, { roomNumber: '147', code: 'DD20-P' }, { roomNumber: '149', code: 'DD20-P' }, 

        { roomNumber: '151', code: 'DD20-P' }, { roomNumber: '153', code: 'DD20-P' }, { roomNumber: '239', code: 'DD20-P' }, { roomNumber: '241', code: 'DD20-P' }, { roomNumber: '243', code: 'DD20-P' }, { roomNumber: '245', code: 'DD20-P' }, 

        { roomNumber: '247', code: 'DD20-P' }, { roomNumber: '249', code: 'DD20-P' }, { roomNumber: '251', code: 'DD20-P' }, { roomNumber: '253', code: 'DD20-P' }, { roomNumber: '339', code: 'DD20-P' }, { roomNumber: '341', code: 'DD20-P' }, 

        { roomNumber: '343', code: 'DD20-P' }, { roomNumber: '345', code: 'DD20-P' }, { roomNumber: '347', code: 'DD20-P' }, { roomNumber: '349', code: 'DD20-P' }, { roomNumber: '351', code: 'DD20-P' }, { roomNumber: '353', code: 'DD20-P' },



        // K12-P (3 Rooms)

        { roomNumber: '137', code: 'K12-P' }, { roomNumber: '237', code: 'K12-P' }, { roomNumber: '337', code: 'K12-P' },



        // QQ2-I (41 Rooms)

        { roomNumber: '102', code: 'QQ2-I' }, { roomNumber: '104', code: 'QQ2-I' }, { roomNumber: '106', code: 'QQ2-I' }, { roomNumber: '108', code: 'QQ2-I' }, { roomNumber: '201', code: 'QQ2-I' }, { roomNumber: '203', code: 'QQ2-I' }, 

        { roomNumber: '209', code: 'QQ2-I' }, { roomNumber: '223', code: 'QQ2-I' }, { roomNumber: '225', code: 'QQ2-I' }, { roomNumber: '227', code: 'QQ2-I' }, { roomNumber: '229', code: 'QQ2-I' }, { roomNumber: '301', code: 'QQ2-I' }, 

        { roomNumber: '303', code: 'QQ2-I' }, { roomNumber: '309', code: 'QQ2-I' }, { roomNumber: '311', code: 'QQ2-I' }, { roomNumber: '313', code: 'QQ2-I' }, { roomNumber: '315', code: 'QQ2-I' }, { roomNumber: '317', code: 'QQ2-I' }, 

        { roomNumber: '319', code: 'QQ2-I' }, { roomNumber: '321', code: 'QQ2-I' }, { roomNumber: '323', code: 'QQ2-I' }, { roomNumber: '325', code: 'QQ2-I' }, { roomNumber: '327', code: 'QQ2-I' }, { roomNumber: '329', code: 'QQ2-I' }, 

        { roomNumber: '401', code: 'QQ2-I' }, { roomNumber: '403', code: 'QQ2-I' }, { roomNumber: '409', code: 'QQ2-I' }, { roomNumber: '411', code: 'QQ2-I' }, { roomNumber: '413', code: 'QQ2-I' }, { roomNumber: '415', code: 'QQ2-I' }, 

        { roomNumber: '417', code: 'QQ2-I' }, { roomNumber: '419', code: 'QQ2-I' }, { roomNumber: '421', code: 'QQ2-I' }, { roomNumber: '423', code: 'QQ2-I' }, { roomNumber: '425', code: 'QQ2-I' }, { roomNumber: '427', code: 'QQ2-I' }, 

        { roomNumber: '429', code: 'QQ2-I' }, { roomNumber: '513', code: 'QQ2-I' }, { roomNumber: '515', code: 'QQ2-I' }, { roomNumber: '521', code: 'QQ2-I' }, { roomNumber: '523', code: 'QQ2-I' },



        // DD2-B (52 Rooms)

        { roomNumber: '200', code: 'DD2-B' }, { roomNumber: '202', code: 'DD2-B' }, { roomNumber: '204', code: 'DD2-B' }, { roomNumber: '206', code: 'DD2-B' }, { roomNumber: '208', code: 'DD2-B' }, { roomNumber: '210', code: 'DD2-B' }, 

        { roomNumber: '212', code: 'DD2-B' }, { roomNumber: '222', code: 'DD2-B' }, { roomNumber: '224', code: 'DD2-B' }, { roomNumber: '226', code: 'DD2-B' }, { roomNumber: '228', code: 'DD2-B' }, { roomNumber: '230', code: 'DD2-B' }, 

        { roomNumber: '232', code: 'DD2-B' }, { roomNumber: '234', code: 'DD2-B' }, { roomNumber: '236', code: 'DD2-B' }, { roomNumber: '300', code: 'DD2-B' }, { roomNumber: '302', code: 'DD2-B' }, { roomNumber: '304', code: 'DD2-B' }, 

        { roomNumber: '306', code: 'DD2-B' }, { roomNumber: '308', code: 'DD2-B' }, { roomNumber: '310', code: 'DD2-B' }, { roomNumber: '312', code: 'DD2-B' }, { roomNumber: '322', code: 'DD2-B' }, { roomNumber: '324', code: 'DD2-B' }, 

        { roomNumber: '326', code: 'DD2-B' }, { roomNumber: '328', code: 'DD2-B' }, { roomNumber: '330', code: 'DD2-B' }, { roomNumber: '332', code: 'DD2-B' }, { roomNumber: '334', code: 'DD2-B' }, { roomNumber: '336', code: 'DD2-B' }, 

        { roomNumber: '400', code: 'DD2-B' }, { roomNumber: '402', code: 'DD2-B' }, { roomNumber: '404', code: 'DD2-B' }, { roomNumber: '406', code: 'DD2-B' }, { roomNumber: '408', code: 'DD2-B' }, { roomNumber: '410', code: 'DD2-B' }, 

        { roomNumber: '412', code: 'DD2-B' }, { roomNumber: '422', code: 'DD2-B' }, { roomNumber: '424', code: 'DD2-B' }, { roomNumber: '426', code: 'DD2-B' }, { roomNumber: '428', code: 'DD2-B' }, { roomNumber: '430', code: 'DD2-B' }, 

        { roomNumber: '432', code: 'DD2-B' }, { roomNumber: '434', code: 'DD2-B' }, { roomNumber: '436', code: 'DD2-B' }, { roomNumber: '504', code: 'DD2-B' }, { roomNumber: '506', code: 'DD2-B' }, { roomNumber: '512', code: 'DD2-B' }, 

        { roomNumber: '522', code: 'DD2-B' }, { roomNumber: '528', code: 'DD2-B' }, { roomNumber: '530', code: 'DD2-B' },



        // K13-F (9 Rooms)

        { roomNumber: '501', code: 'K13-F' }, { roomNumber: '503', code: 'K13-F' }, { roomNumber: '509', code: 'K13-F' }, { roomNumber: '511', code: 'K13-F' }, { roomNumber: '517', code: 'K13-F' }, { roomNumber: '519', code: 'K13-F' }, 

        { roomNumber: '525', code: 'K13-F' }, { roomNumber: '527', code: 'K13-F' }, { roomNumber: '529', code: 'K13-F' },



        // K1-B (9 Rooms)

        { roomNumber: '500', code: 'K1-B' }, { roomNumber: '502', code: 'K1-B' }, { roomNumber: '508', code: 'K1-B' }, { roomNumber: '510', code: 'K1-B' }, { roomNumber: '524', code: 'K1-B' }, { roomNumber: '526', code: 'K1-B' }, 

        { roomNumber: '532', code: 'K1-B' }, { roomNumber: '534', code: 'K1-B' }, { roomNumber: '536', code: 'K1-B' },



        // K3 (4 Rooms)

        { roomNumber: '207', code: 'K3' }, { roomNumber: '307', code: 'K3' }, { roomNumber: '407', code: 'K3' }, { roomNumber: '507', code: 'K3' },



        // SQQ4 (3 Rooms)

        { roomNumber: '235', code: 'SQQ4' }, { roomNumber: '335', code: 'SQQ4' }, { roomNumber: '435', code: 'SQQ4' }

    ],

    one: [

        // CORNSTE-K (1 Room)

        { roomNumber: '234', code: 'CORNSTE-K' },

        // DBDBADA-DD (4 Rooms)

        { roomNumber: '102', code: 'DBDBADA-DD' }, { roomNumber: '104', code: 'DBDBADA-DD' }, { roomNumber: '128', code: 'DBDBADA-DD' }, { roomNumber: '129', code: 'DBDBADA-DD' },

        // KING-K (10 Rooms)

        { roomNumber: '109', code: 'KING-K' }, { roomNumber: '110', code: 'KING-K' }, { roomNumber: '137', code: 'KING-K' }, { roomNumber: '203', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' },

        { roomNumber: '213', code: 'KING-K' }, { roomNumber: '214', code: 'KING-K' }, { roomNumber: '230', code: 'KING-K' }, { roomNumber: '237', code: 'KING-K' }, { roomNumber: '245', code: 'KING-K' },

        // KINGADA-K (1 Room)

        { roomNumber: '103', code: 'KINGADA-K' },

        // KKING-K (5 Rooms)

        { roomNumber: '106', code: 'KKING-K' }, { roomNumber: '111', code: 'KKING-K' }, { roomNumber: '122', code: 'KKING-K' }, { roomNumber: '207', code: 'KKING-K' }, { roomNumber: '224', code: 'KKING-K' },

        // KSTE-K (1 Room)

        { roomNumber: '232', code: 'KSTE-K' },

        // QNQN-QQ (66 Rooms)

        { roomNumber: '105', code: 'QNQN-QQ' }, { roomNumber: '107', code: 'QNQN-QQ' }, { roomNumber: '108', code: 'QNQN-QQ' }, { roomNumber: '113', code: 'QNQN-QQ' }, { roomNumber: '115', code: 'QNQN-QQ' }, { roomNumber: '116', code: 'QNQN-QQ' },

        { roomNumber: '117', code: 'QNQN-QQ' }, { roomNumber: '118', code: 'QNQN-QQ' }, { roomNumber: '119', code: 'QNQN-QQ' }, { roomNumber: '120', code: 'QNQN-QQ' }, { roomNumber: '121', code: 'QNQN-QQ' }, { roomNumber: '123', code: 'QNQN-QQ' },

        { roomNumber: '124', code: 'QNQN-QQ' }, { roomNumber: '125', code: 'QNQN-QQ' }, { roomNumber: '126', code: 'QNQN-QQ' }, { roomNumber: '127', code: 'QNQN-QQ' }, { roomNumber: '130', code: 'QNQN-QQ' }, { roomNumber: '131', code: 'QNQN-QQ' },

        { roomNumber: '132', code: 'QNQN-QQ' }, { roomNumber: '133', code: 'QNQN-QQ' }, { roomNumber: '134', code: 'QNQN-QQ' }, { roomNumber: '135', code: 'QNQN-QQ' }, { roomNumber: '138', code: 'QNQN-QQ' }, { roomNumber: '139', code: 'QNQN-QQ' },

        { roomNumber: '140', code: 'QNQN-QQ' }, { roomNumber: '141', code: 'QNQN-QQ' }, { roomNumber: '142', code: 'QNQN-QQ' }, { roomNumber: '143', code: 'QNQN-QQ' }, { roomNumber: '145', code: 'QNQN-QQ' }, { roomNumber: '201', code: 'QNQN-QQ' },

        { roomNumber: '202', code: 'QNQN-QQ' }, { roomNumber: '205', code: 'QNQN-QQ' }, { roomNumber: '206', code: 'QNQN-QQ' }, { roomNumber: '208', code: 'QNQN-QQ' }, { roomNumber: '211', code: 'QNQN-QQ' }, { roomNumber: '215', code: 'QNQN-QQ' },

        { roomNumber: '216', code: 'QNQN-QQ' }, { roomNumber: '217', code: 'QNQN-QQ' }, { roomNumber: '218', code: 'QNQN-QQ' }, { roomNumber: '219', code: 'QNQN-QQ' }, { roomNumber: '220', code: 'QNQN-QQ' }, { roomNumber: '221', code: 'QNQN-QQ' },

        { roomNumber: '222', code: 'QNQN-QQ' }, { roomNumber: '223', code: 'QNQN-QQ' }, { roomNumber: '225', code: 'QNQN-QQ' }, { roomNumber: '226', code: 'QNQN-QQ' }, { roomNumber: '227', code: 'QNQN-QQ' }, { roomNumber: '228', code: 'QNQN-QQ' },

        { roomNumber: '238', code: 'QNQN-QQ' }, { roomNumber: '239', code: 'QNQN-QQ' }, { roomNumber: '240', code: 'QNQN-QQ' }, { roomNumber: '241', code: 'QNQN-QQ' }, { roomNumber: '242', code: 'QNQN-QQ' }, { roomNumber: '243', code: 'QNQN-QQ' },

        { roomNumber: '247', code: 'QNQN-QQ' }, { roomNumber: '248', code: 'QNQN-QQ' }, { roomNumber: '249', code: 'QNQN-QQ' }, { roomNumber: '250', code: 'QNQN-QQ' }, { roomNumber: '251', code: 'QNQN-QQ' }, { roomNumber: '252', code: 'QNQN-QQ' },

        { roomNumber: '253', code: 'QNQN-QQ' }, { roomNumber: '254', code: 'QNQN-QQ' }, { roomNumber: '255', code: 'QNQN-QQ' },

        // QNQNADA-QQ (1 Room)

        { roomNumber: '101', code: 'QNQNADA-QQ' },

        // QQNQN-QQ (6 Rooms)

        { roomNumber: '136', code: 'QQNQN-QQ' }, { roomNumber: '209', code: 'QQNQN-QQ' }, { roomNumber: '210', code: 'QQNQN-QQ' }, { roomNumber: '212', code: 'QQNQN-QQ' }, { roomNumber: '244', code: 'QQNQN-QQ' }, { roomNumber: '246', code: 'QQNQN-QQ' }

    ],

    ich: [

        // ACCESS-K (2 Rooms)

        { roomNumber: '112', code: 'ACCESS-K' }, { roomNumber: '114', code: 'ACCESS-K' },

        // DOUBLE-QQ (8 Rooms)

        { roomNumber: '202', code: 'DOUBLE-QQ' }, { roomNumber: '203', code: 'DOUBLE-QQ' }, { roomNumber: '212', code: 'DOUBLE-QQ' }, { roomNumber: '225', code: 'DOUBLE-QQ' }, { roomNumber: '301', code: 'DOUBLE-QQ' }, { roomNumber: '309', code: 'DOUBLE-QQ' }, { roomNumber: '315', code: 'DOUBLE-QQ' }, { roomNumber: '317', code: 'DOUBLE-QQ' },

        // EURO-D (2 Rooms)

        { roomNumber: '221', code: 'EURO-D' }, { roomNumber: '312', code: 'EURO-D' },

        // JUNIOR-K (1 Room)

        { roomNumber: '217', code: 'JUNIOR-K' },

        // KINGSB-K (13 Rooms)

        { roomNumber: '204', code: 'KINGSB-K' }, { roomNumber: '205', code: 'KINGSB-K' }, { roomNumber: '215', code: 'KINGSB-K' }, { roomNumber: '216', code: 'KINGSB-K' }, { roomNumber: '223', code: 'KINGSB-K' }, { roomNumber: '224', code: 'KINGSB-K' }, { roomNumber: '226', code: 'KINGSB-K' }, { roomNumber: '302', code: 'KINGSB-K' }, { roomNumber: '303', code: 'KINGSB-K' }, { roomNumber: '304', code: 'KINGSB-K' }, { roomNumber: '310', code: 'KINGSB-K' }, { roomNumber: '311', code: 'KINGSB-K' }, { roomNumber: '316', code: 'KINGSB-K' },

        // SENIOR-K (1 Room)

        { roomNumber: '218', code: 'SENIOR-K' },

        // STAND-K (22 Rooms)

        { roomNumber: '101', code: 'STAND-K' }, { roomNumber: '102', code: 'STAND-K' }, { roomNumber: '103', code: 'STAND-K' }, { roomNumber: '104', code: 'STAND-K' }, { roomNumber: '105', code: 'STAND-K' }, { roomNumber: '106', code: 'STAND-K' }, { roomNumber: '201', code: 'STAND-K' }, { roomNumber: '206', code: 'STAND-K' }, { roomNumber: '207', code: 'STAND-K' }, { roomNumber: '208', code: 'STAND-K' }, { roomNumber: '209', code: 'STAND-K' }, { roomNumber: '210', code: 'STAND-K' }, { roomNumber: '211', code: 'STAND-K' }, { roomNumber: '214', code: 'STAND-K' }, { roomNumber: '219', code: 'STAND-K' }, { roomNumber: '220', code: 'STAND-K' }, { roomNumber: '222', code: 'STAND-K' }, { roomNumber: '305', code: 'STAND-K' }, { roomNumber: '306', code: 'STAND-K' }, { roomNumber: '307', code: 'STAND-K' }, { roomNumber: '308', code: 'STAND-K' }, { roomNumber: '314', code: 'STAND-K' }

    ],

    maj: [

        // EX (1 Room)

        { roomNumber: '401', code: 'EX' },

        // KS (6 Rooms)

        { roomNumber: '102', code: 'KS' }, { roomNumber: '120', code: 'KS' }, { roomNumber: '202', code: 'KS' }, { roomNumber: '220', code: 'KS' }, { roomNumber: '302', code: 'KS' }, { roomNumber: '320', code: 'KS' },

        // QQ (1 Room)

        { roomNumber: '403', code: 'QQ' },

        // QS (10 Rooms)

        { roomNumber: '104', code: 'QS' }, { roomNumber: '106', code: 'QS' }, { roomNumber: '118', code: 'QS' }, { roomNumber: '204', code: 'QS' }, { roomNumber: '206', code: 'QS' }, { roomNumber: '218', code: 'QS' }, { roomNumber: '304', code: 'QS' }, { roomNumber: '306', code: 'QS' }, { roomNumber: '318', code: 'QS' }, { roomNumber: '402', code: 'QS' },

        // SQ (28 Rooms)

        { roomNumber: '108', code: 'SQ' }, { roomNumber: '109', code: 'SQ' }, { roomNumber: '110', code: 'SQ' }, { roomNumber: '111', code: 'SQ' }, { roomNumber: '112', code: 'SQ' }, { roomNumber: '114', code: 'SQ' }, { roomNumber: '115', code: 'SQ' }, { roomNumber: '116', code: 'SQ' }, { roomNumber: '117', code: 'SQ' },

        { roomNumber: '208', code: 'SQ' }, { roomNumber: '209', code: 'SQ' }, { roomNumber: '210', code: 'SQ' }, { roomNumber: '211', code: 'SQ' }, { roomNumber: '212', code: 'SQ' }, { roomNumber: '214', code: 'SQ' }, { roomNumber: '215', code: 'SQ' }, { roomNumber: '216', code: 'SQ' }, { roomNumber: '217', code: 'SQ' },

        { roomNumber: '308', code: 'SQ' }, { roomNumber: '309', code: 'SQ' }, { roomNumber: '310', code: 'SQ' }, { roomNumber: '311', code: 'SQ' }, { roomNumber: '312', code: 'SQ' }, { roomNumber: '314', code: 'SQ' }, { roomNumber: '315', code: 'SQ' }, { roomNumber: '316', code: 'SQ' }, { roomNumber: '317', code: 'SQ' },

        { roomNumber: '404', code: 'SQ' },

        // SS (6 Rooms)

        { roomNumber: '101', code: 'SS' }, { roomNumber: '122', code: 'SS' }, { roomNumber: '201', code: 'SS' }, { roomNumber: '222', code: 'SS' }, { roomNumber: '301', code: 'SS' }, { roomNumber: '322', code: 'SS' }

    ],

    mcs: [

        // ADAKING (3 Rooms)

        { roomNumber: '119', code: 'ADAKING' }, { roomNumber: '219', code: 'ADAKING' }, { roomNumber: '319', code: 'ADAKING' },

        

        // EXEC (2 Rooms)

        { roomNumber: '200', code: 'EXEC' }, { roomNumber: '222', code: 'EXEC' },



        // KING (37 Rooms)

        { roomNumber: '104', code: 'KING' }, { roomNumber: '105', code: 'KING' }, { roomNumber: '106', code: 'KING' }, { roomNumber: '107', code: 'KING' }, { roomNumber: '108', code: 'KING' }, { roomNumber: '109', code: 'KING' }, 

        { roomNumber: '111', code: 'KING' }, { roomNumber: '121', code: 'KING' }, { roomNumber: '123', code: 'KING' }, { roomNumber: '125', code: 'KING' }, { roomNumber: '204', code: 'KING' }, { roomNumber: '205', code: 'KING' }, 

        { roomNumber: '206', code: 'KING' }, { roomNumber: '207', code: 'KING' }, { roomNumber: '208', code: 'KING' }, { roomNumber: '209', code: 'KING' }, { roomNumber: '210', code: 'KING' }, { roomNumber: '211', code: 'KING' }, 

        { roomNumber: '221', code: 'KING' }, { roomNumber: '223', code: 'KING' }, { roomNumber: '224', code: 'KING' }, { roomNumber: '225', code: 'KING' }, { roomNumber: '226', code: 'KING' }, { roomNumber: '304', code: 'KING' }, 

        { roomNumber: '305', code: 'KING' }, { roomNumber: '306', code: 'KING' }, { roomNumber: '307', code: 'KING' }, { roomNumber: '308', code: 'KING' }, { roomNumber: '309', code: 'KING' }, { roomNumber: '310', code: 'KING' }, 

        { roomNumber: '311', code: 'KING' }, { roomNumber: '321', code: 'KING' }, { roomNumber: '322', code: 'KING' }, { roomNumber: '323', code: 'KING' }, { roomNumber: '324', code: 'KING' }, { roomNumber: '325', code: 'KING' }, 

        { roomNumber: '326', code: 'KING' },



        // KSUITE (3 Rooms)

        { roomNumber: '215', code: 'KSUITE' }, { roomNumber: '314', code: 'KSUITE' }, { roomNumber: '315', code: 'KSUITE' },



        // QQ (30 Rooms)

        { roomNumber: '100', code: 'QQ' }, { roomNumber: '101', code: 'QQ' }, { roomNumber: '102', code: 'QQ' }, { roomNumber: '103', code: 'QQ' }, { roomNumber: '113', code: 'QQ' }, { roomNumber: '127', code: 'QQ' }, 

        { roomNumber: '128', code: 'QQ' }, { roomNumber: '129', code: 'QQ' }, { roomNumber: '130', code: 'QQ' }, { roomNumber: '201', code: 'QQ' }, { roomNumber: '202', code: 'QQ' }, { roomNumber: '203', code: 'QQ' }, 

        { roomNumber: '212', code: 'QQ' }, { roomNumber: '213', code: 'QQ' }, { roomNumber: '217', code: 'QQ' }, { roomNumber: '227', code: 'QQ' }, { roomNumber: '228', code: 'QQ' }, { roomNumber: '229', code: 'QQ' }, 

        { roomNumber: '230', code: 'QQ' }, { roomNumber: '300', code: 'QQ' }, { roomNumber: '301', code: 'QQ' }, { roomNumber: '302', code: 'QQ' }, { roomNumber: '303', code: 'QQ' }, { roomNumber: '312', code: 'QQ' }, 

        { roomNumber: '313', code: 'QQ' }, { roomNumber: '316', code: 'QQ' }, { roomNumber: '317', code: 'QQ' }, { roomNumber: '327', code: 'QQ' }, { roomNumber: '328', code: 'QQ' }, { roomNumber: '329', code: 'QQ' }, 

        { roomNumber: '330', code: 'QQ' }

    ],

    sea: [

        // DKING-K (5 Rooms)

        { roomNumber: '213', code: 'DKING-K' }, { roomNumber: '215', code: 'DKING-K' }, { roomNumber: '305', code: 'DKING-K' }, { roomNumber: '311', code: 'DKING-K' }, { roomNumber: '313', code: 'DKING-K' },

        // DQQ-QQ (6 Rooms)

        { roomNumber: '114', code: 'DQQ-QQ' }, { roomNumber: '115', code: 'DQQ-QQ' }, { roomNumber: '212', code: 'DQQ-QQ' }, { roomNumber: '214', code: 'DQQ-QQ' }, { roomNumber: '314', code: 'DQQ-QQ' }, { roomNumber: '315', code: 'DQQ-QQ' },

        // KING-K (13 Rooms)

        { roomNumber: '105', code: 'KING-K' }, { roomNumber: '107', code: 'KING-K' }, { roomNumber: '109', code: 'KING-K' }, { roomNumber: '111', code: 'KING-K' }, { roomNumber: '202', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' }, 

        { roomNumber: '205', code: 'KING-K' }, { roomNumber: '207', code: 'KING-K' }, { roomNumber: '209', code: 'KING-K' }, { roomNumber: '211', code: 'KING-K' }, { roomNumber: '306', code: 'KING-K' }, { roomNumber: '307', code: 'KING-K' }, 

        { roomNumber: '309', code: 'KING-K' },

        // KINGOF-K (6 Rooms)

        { roomNumber: '116', code: 'KINGOF-K' }, { roomNumber: '117', code: 'KINGOF-K' }, { roomNumber: '216', code: 'KINGOF-K' }, { roomNumber: '217', code: 'KINGOF-K' }, { roomNumber: '316', code: 'KINGOF-K' }, { roomNumber: '317', code: 'KINGOF-K' },

        // Q-Q (2 Rooms)

        { roomNumber: '201', code: 'Q-Q' }, { roomNumber: '301', code: 'Q-Q' },

        // QADA-Q (1 Room)

        { roomNumber: '101', code: 'QADA-Q' },

        // QQ-QQ (18 Rooms)

        { roomNumber: '102', code: 'QQ-QQ' }, { roomNumber: '103', code: 'QQ-QQ' }, { roomNumber: '104', code: 'QQ-QQ' }, { roomNumber: '106', code: 'QQ-QQ' }, { roomNumber: '108', code: 'QQ-QQ' }, { roomNumber: '110', code: 'QQ-QQ' }, 

        { roomNumber: '112', code: 'QQ-QQ' }, { roomNumber: '113', code: 'QQ-QQ' }, { roomNumber: '203', code: 'QQ-QQ' }, { roomNumber: '206', code: 'QQ-QQ' }, { roomNumber: '208', code: 'QQ-QQ' }, { roomNumber: '210', code: 'QQ-QQ' }, 

        { roomNumber: '302', code: 'QQ-QQ' }, { roomNumber: '303', code: 'QQ-QQ' }, { roomNumber: '304', code: 'QQ-QQ' }, { roomNumber: '308', code: 'QQ-QQ' }, { roomNumber: '310', code: 'QQ-QQ' }, { roomNumber: '312', code: 'QQ-QQ' }

    ],

    sci: [

        // 2QCrk (14 Rooms)

        { roomNumber: '222', code: '2QCrk' }, { roomNumber: '122', code: '2QCrk' }, { roomNumber: '206', code: '2QCrk' }, { roomNumber: '116', code: '2QCrk' }, { roomNumber: '210', code: '2QCrk' }, 

        { roomNumber: '110', code: '2QCrk' }, { roomNumber: '118', code: '2QCrk' }, { roomNumber: '106', code: '2QCrk' }, { roomNumber: '114', code: '2QCrk' }, { roomNumber: '208', code: '2QCrk' }, 

        { roomNumber: '104', code: '2QCrk' }, { roomNumber: '102', code: '2QCrk' }, { roomNumber: '220', code: '2QCrk' }, { roomNumber: '204', code: '2QCrk' },

        

        // 2QCrk ADA (2 Rooms)

        { roomNumber: '225', code: '2QCrk ADA' }, { roomNumber: '226', code: '2QCrk ADA' },



        // 2QMrsh (13 Rooms)

        { roomNumber: '109', code: '2QMRSH' }, { roomNumber: '209', code: '2QMRSH' }, { roomNumber: '115', code: '2QMRSH' }, { roomNumber: '101', code: '2QMRSH' }, { roomNumber: '105', code: '2QMRSH' }, 

        { roomNumber: '215', code: '2QMRSH' }, { roomNumber: '217', code: '2QMRSH' }, { roomNumber: '121', code: '2QMRSH' }, { roomNumber: '201', code: '2QMRSH' }, { roomNumber: '117', code: '2QMRSH' }, 

        { roomNumber: '205', code: '2QMRSH' }, { roomNumber: '113', code: '2QMRSH' }, { roomNumber: '221', code: '2QMRSH' }, { roomNumber: '103', code: '2QMRSH' },



        // DKCrk (4 Rooms)

        { roomNumber: '212', code: 'DKCrk' }, { roomNumber: '112', code: 'DKCrk' }, { roomNumber: '124', code: 'DKCrk' }, { roomNumber: '224', code: 'DKCrk' },



        // DKMrsh-K (1 Room)

        { roomNumber: '123', code: 'DKMrsh-K' },



        // JRSTE-K/POC (1 Room)

        { roomNumber: '227', code: 'JRSTE-K/POC' },



        // KCrk (6 Rooms)

        { roomNumber: '214', code: 'KCrk' }, { roomNumber: '216', code: 'KCrk' }, { roomNumber: '218', code: 'KCrk' }, { roomNumber: '108', code: 'KCrk' }, { roomNumber: '120', code: 'KCrk' }, 

        { roomNumber: '202', code: 'KCrk' },



        // KMrsh (9 Rooms)

        { roomNumber: '203', code: 'KMrsh' }, { roomNumber: '207', code: 'KMrsh' }, { roomNumber: '213', code: 'KMrsh' }, { roomNumber: '119', code: 'KMrsh' }, { roomNumber: '107', code: 'KMrsh' }, 

        { roomNumber: '219', code: 'KMrsh' }, { roomNumber: '111', code: 'KMrsh' }, { roomNumber: '223', code: 'KMrsh' }, { roomNumber: '211', code: 'KMrsh' }

    ],

    soh: [

        // 1-2Q-NB-Stan-QQ (8 Rooms)

        { roomNumber: '204', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '206', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '208', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '210', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '212', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '223', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '225', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '227', code: '1-2Q-NB-Stan-QQ' },

        

        // 10-King-OV-B-K (16 Rooms)

        { roomNumber: '314', code: '10-King-OV-B-K' }, { roomNumber: '414', code: '10-King-OV-B-K' }, { roomNumber: '504', code: '10-King-OV-B-K' }, { roomNumber: '508', code: '10-King-OV-B-K' }, { roomNumber: '514', code: '10-King-OV-B-K' }, { roomNumber: '604', code: '10-King-OV-B-K' }, { roomNumber: '606', code: '10-King-OV-B-K' }, { roomNumber: '608', code: '10-King-OV-B-K' }, { roomNumber: '614', code: '10-King-OV-B-K' }, 

        { roomNumber: '704', code: '10-King-OV-B-K' }, { roomNumber: '706', code: '10-King-OV-B-K' }, { roomNumber: '708', code: '10-King-OV-B-K' }, { roomNumber: '714', code: '10-King-OV-B-K' }, { roomNumber: '804', code: '10-King-OV-B-K' }, { roomNumber: '808', code: '10-King-OV-B-K' }, { roomNumber: '814', code: '10-King-OV-B-K' },



        // 11-KingSuite-K/SOFA (1 Room)

        { roomNumber: '201', code: '11-KingSuite-K/SOFA' },



        // 3-King-NB-K (1 Room)

        { roomNumber: '214', code: '3-King-NB-K' },



        // 4-ADAQueenRS-Q (2 Rooms)

        { roomNumber: '323', code: '4-ADAQueenRS-Q' }, { roomNumber: '327', code: '4-ADAQueenRS-Q' },



        // 5-ADAQueen-Q (6 Rooms)

        { roomNumber: '423', code: '5-ADAQueen-Q' }, { roomNumber: '427', code: '5-ADAQueen-Q' }, { roomNumber: '523', code: '5-ADAQueen-Q' }, { roomNumber: '527', code: '5-ADAQueen-Q' }, { roomNumber: '623', code: '5-ADAQueen-Q' }, { roomNumber: '627', code: '5-ADAQueen-Q' },



        // 6-2Q-PV-Bal-QQ (58 Rooms)

        { roomNumber: '301', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '303', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '305', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '307', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '309', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '311', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '313', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '315', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '321', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '325', code: '6-2Q-PV-Bal-QQ' },

        { roomNumber: '401', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '403', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '405', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '407', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '409', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '411', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '413', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '415', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '421', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '425', code: '6-2Q-PV-Bal-QQ' },

        { roomNumber: '501', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '503', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '505', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '507', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '509', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '511', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '513', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '515', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '521', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '525', code: '6-2Q-PV-Bal-QQ' },

        { roomNumber: '601', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '603', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '605', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '607', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '609', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '611', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '613', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '615', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '621', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '625', code: '6-2Q-PV-Bal-QQ' },

        { roomNumber: '701', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '703', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '705', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '707', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '709', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '711', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '713', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '715', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '721', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '725', code: '6-2Q-PV-Bal-QQ' },

        { roomNumber: '801', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '803', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '805', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '809', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '811', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '813', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '815', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '821', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '825', code: '6-2Q-PV-Bal-QQ' },



        // 7-2Q-PV-Bal-QQ (44 Rooms)

        { roomNumber: '304', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '306', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '308', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '310', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '312', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '316', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '322', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '324', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '326', code: '7-2Q-PV-Bal-QQ' },

        { roomNumber: '404', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '406', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '408', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '410', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '412', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '416', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '422', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '424', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '426', code: '7-2Q-PV-Bal-QQ' },

        { roomNumber: '506', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '510', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '512', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '516', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '522', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '524', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '526', code: '7-2Q-PV-Bal-QQ' },

        { roomNumber: '610', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '612', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '616', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '622', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '624', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '626', code: '7-2Q-PV-Bal-QQ' },

        { roomNumber: '710', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '712', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '716', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '722', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '724', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '726', code: '7-2Q-PV-Bal-QQ' },

        { roomNumber: '806', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '810', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '812', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '816', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '822', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '824', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '826', code: '7-2Q-PV-Bal-QQ' },



        // 8-JrSuite-QQ (18 Rooms)

        { roomNumber: '317', code: '8-JrSuite-QQ' }, { roomNumber: '318', code: '8-JrSuite-QQ' }, { roomNumber: '319', code: '8-JrSuite-QQ' },

        { roomNumber: '417', code: '8-JrSuite-QQ' }, { roomNumber: '418', code: '8-JrSuite-QQ' }, { roomNumber: '419', code: '8-JrSuite-QQ' },

        { roomNumber: '517', code: '8-JrSuite-QQ' }, { roomNumber: '518', code: '8-JrSuite-QQ' }, { roomNumber: '519', code: '8-JrSuite-QQ' },

        { roomNumber: '617', code: '8-JrSuite-QQ' }, { roomNumber: '618', code: '8-JrSuite-QQ' }, { roomNumber: '619', code: '8-JrSuite-QQ' },

        { roomNumber: '717', code: '8-JrSuite-QQ' }, { roomNumber: '718', code: '8-JrSuite-QQ' }, { roomNumber: '719', code: '8-JrSuite-QQ' },

        { roomNumber: '817', code: '8-JrSuite-QQ' }, { roomNumber: '818', code: '8-JrSuite-QQ' }, { roomNumber: '819', code: '8-JrSuite-QQ' },



        // 9-King-PV-Bal-K (5 Rooms)

        { roomNumber: '723', code: '9-King-PV-Bal-K' }, { roomNumber: '727', code: '9-King-PV-Bal-K' }, { roomNumber: '807', code: '9-King-PV-Bal-K' }, { roomNumber: '823', code: '9-King-PV-Bal-K' }, { roomNumber: '827', code: '9-King-PV-Bal-K' }

    ],

    abr: [

        // KING-K (28 Rooms)

        { roomNumber: '103', code: 'KING-K' }, { roomNumber: '202', code: 'KING-K' }, { roomNumber: '203', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' }, { roomNumber: '205', code: 'KING-K' }, { roomNumber: '206', code: 'KING-K' }, { roomNumber: '207', code: 'KING-K' }, { roomNumber: '208', code: 'KING-K' }, { roomNumber: '209', code: 'KING-K' },

        { roomNumber: '302', code: 'KING-K' }, { roomNumber: '303', code: 'KING-K' }, { roomNumber: '304', code: 'KING-K' }, { roomNumber: '305', code: 'KING-K' }, { roomNumber: '306', code: 'KING-K' }, { roomNumber: '307', code: 'KING-K' }, { roomNumber: '308', code: 'KING-K' }, { roomNumber: '309', code: 'KING-K' },

        { roomNumber: '402', code: 'KING-K' }, { roomNumber: '403', code: 'KING-K' }, { roomNumber: '404', code: 'KING-K' }, { roomNumber: '405', code: 'KING-K' }, { roomNumber: '406', code: 'KING-K' }, { roomNumber: '407', code: 'KING-K' }, { roomNumber: '408', code: 'KING-K' }, { roomNumber: '409', code: 'KING-K' }, { roomNumber: '410', code: 'KING-K' }, { roomNumber: '411', code: 'KING-K' }, { roomNumber: '412', code: 'KING-K' },



        // KINGADA-K (2 Rooms)

        { roomNumber: '101', code: 'KINGADA-K' }, { roomNumber: '102', code: 'KINGADA-K' },



        // KINGFULL (8 Rooms)

        { roomNumber: '104', code: 'KINGFULL' }, { roomNumber: '105', code: 'KINGFULL' }, { roomNumber: '210', code: 'KINGFULL' }, { roomNumber: '211', code: 'KINGFULL' }, { roomNumber: '212', code: 'KINGFULL' },

        { roomNumber: '310', code: 'KINGFULL' }, { roomNumber: '311', code: 'KINGFULL' }, { roomNumber: '312', code: 'KINGFULL' },



        // PREMIUM-K (2 Rooms)

        { roomNumber: '201', code: 'PREMIUM-K' }, { roomNumber: '301', code: 'PREMIUM-K' },



        // DABO-K (1 Room)

        { roomNumber: '401', code: 'DABO-K' }

    ]

};
// ... (Your existing Config, ADMIN_UIDS, SNT_PROPERTY_MAP, DOM References, profiles, and MASTER_INVENTORIES remain above this) ...

// --- STATE MANAGEMENT ---
let currentCsvContent = null;
let currentFileName = null; 
let currentRules = null;
let currentScenarios = {}; 
let currentAllReservations = []; 
let acceptedUpgrades = [];
let completedUpgrades = [];
let oooRecords = [];
let currentInventoryMap = null; 

// --- FUNCTIONS ---
function resetAppState() {
    currentCsvContent = null;
    currentFileName = null; 
    currentRules = null;
    currentScenarios = {};
    currentAllReservations = [];
    acceptedUpgrades = [];
    currentInventoryMap = null; 
    
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

    displayAcceptedUpgrades();
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
                const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
                displayResults(results);
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

    if (addPropBtn) addPropBtn.addEventListener('click', () => addPropModal.classList.remove('hidden'));
    if (closeAddPropBtn) closeAddPropBtn.addEventListener('click', () => addPropModal.classList.add('hidden'));
    if (saveNewPropBtn) saveNewPropBtn.addEventListener('click', handleSaveNewProperty);
    window.addEventListener('click', (e) => { if (e.target === addPropModal) addPropModal.classList.add('hidden'); });

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
        } else {
            loginContainer.classList.remove('hidden'); appContainer.classList.add('hidden');
            setAdminControls(false);
        }
    });

    if(settingsTriggerBtn) {
        settingsTriggerBtn.addEventListener('click', () => { settingsModal.classList.remove('hidden'); populateOooDropdown(); });
    }

    // CLOSE SETTINGS -> REFRESH DATA
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
    
    // Function to check if button should be visible (SNT only)
    const updateAutoLoadButtonVisibility = () => {
        const currentProfile = profileDropdown.value;
        const autoLoadBtn = document.getElementById('auto-load-btn');
        if (autoLoadBtn) {
            // Hide if not in SNT map
            autoLoadBtn.style.display = SNT_PROPERTY_MAP[currentProfile] ? 'inline-block' : 'none'; 
        }
    };

    profileDropdown.addEventListener('change', (event) => {
        updateRulesForm(event.target.value);
        resetAppState();
        displayCompletedUpgrades();
        displayDemandInsights(); 
        loadOooRecords(); 
        updateAutoLoadButtonVisibility(); // Check visibility on change
    });
    
    updateRulesForm('fqi'); 
    updateAutoLoadButtonVisibility(); // Check visibility on init

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

    const subTabs = document.querySelectorAll('[data-sub-tab-target]');
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSelector = tab.dataset.subTabTarget;
            const target = document.querySelector(targetSelector);
            subTabs.forEach(t => t.classList.remove('active'));
            const completedView = document.querySelector('#completed-container')?.parentElement;
            const demandView = document.querySelector('#demand-insights-container')?.parentElement;
            if(document.querySelector('#completed-container')) document.querySelector('#completed-container').style.display = 'none';
            if(document.querySelector('#demand-insights-container')) document.querySelector('#demand-insights-container').style.display = 'none';
            tab.classList.add('active');
            if(target) {
                target.style.display = 'block';
                if (target.id === 'demand-insights-container') displayDemandInsights();
                else if (target.id === 'completed-container') displayCompletedUpgrades();
            }
        });
    });
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

// NEW: Accept Scenario Logic
function handleAcceptScenario(scenarioName) {
    const scenario = currentScenarios[scenarioName];
    if (!scenario || !scenario.length) { alert("No upgrades available."); return; }
    if(!confirm(`Accept all ${scenario.length} upgrades in ${scenarioName}?`)) return;

    acceptedUpgrades.push(...scenario);
    currentScenarios = {}; // Clear scenarios to force re-gen

    showLoader(true, "Processing...");
    setTimeout(() => {
        try {
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
            displayResults(results);
        } catch (err) { showError(err); }
    }, 50);
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
    
    displayAcceptedUpgrades();
    // Use data.inventory and data.matrixData (optional, but mainly scenario display now does matrix)
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

// NEW: Display Scenario Tabs + Double Matrix (Projected & Current)
function displayScenarios(scenarios) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';
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

// Helper to render HTML table for matrix (UPDATED STYLING)
function generateMatrixHTML(title, rows, headers, colTotals) {
    // Aesthetic Palette
    const styleTable = 'width:100%; border-collapse:collapse; font-size:13px; font-family:sans-serif; min-width:100%;';
    const styleTh = 'padding:12px 8px; background-color:#f8f9fa; color:#495057; font-weight:600; border-bottom:2px solid #e9ecef; text-align:center;';
    const styleTd = 'padding:10px 8px; border-bottom:1px solid #e9ecef; text-align:center; color:#333;';
    const styleRowLabel = 'padding:10px 8px; border-bottom:1px solid #e9ecef; text-align:left; font-weight:600; color:#333; background-color:#fff; position:sticky; left:0;';
    const styleTotalRow = 'background-color:#f1f3f5; font-weight:bold;';

    // Helper for cell color
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

    // Totals Row
    html += `<tr style="${styleTotalRow}">
                <td style="${styleRowLabel} background-color:#f1f3f5;">TOTAL</td>`;
    colTotals.forEach(total => {
        html += `<td style="${styleTd}">${total}</td>`;
    });
    html += '</tr></tbody></table></div></div>';

    return html;
}

function renderScenarioContent(name, recs, parent) {
    const old = parent.querySelector('.scenario-content'); if(old) old.remove();
    const wrapper = document.createElement('div'); wrapper.className = 'scenario-content';
    
    const totalRev = recs.reduce((sum,r)=>sum+r.score,0);
    const head = document.createElement('div');
    head.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding:15px; background:#f9f9f9; border-radius:8px;';
    head.innerHTML = `<div><h3 style="margin:0;">${name} Path</h3><span style="color:#666;">${recs.length} Upgrades | Potential: <strong>$${totalRev.toLocaleString()}</strong></span></div>`;
    
    const btn = document.createElement('button');
    btn.textContent = "Accept Entire Path";
    btn.style.cssText = 'background:#28a745; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;';
    btn.addEventListener('click', () => handleAcceptScenario(name));
    head.appendChild(btn); wrapper.appendChild(head);

    // --- CALC MATRICES ---
    const startDate = parseDate(currentRules.selectedDate);
    const hierarchy = currentRules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const baseReservations = buildReservationsByDate(currentAllReservations);
    const masterInv = getMasterInventory(currentRules.profile);
    
    const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i); return d; });
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
            
            // BASE CALC
            let baseAvail = 0;
            if (currentInventoryMap && currentInventoryMap[dateString] && currentInventoryMap[dateString][roomCode] !== undefined) {
                baseAvail = currentInventoryMap[dateString][roomCode];
            } else {
                const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
                const oooCount = oooRecords.reduce((t, r) => { const rS=r.startDate.getTime(); const rE=r.endDate.getTime(); if(r.roomType===roomCode && dTime>=rS && dTime<=rE) return t+(r.count||1); return t; }, 0);
                baseAvail = (masterInv[roomCode] || 0) - (baseReservations[dateString]?.[roomCode] || 0) - oooCount;
            }

            // PROJECTED DELTA
            // Strict ISO string comparison to avoid TZ issues
            let projAvail = baseAvail;
            recs.forEach(upgrade => {
                // upgrade dates are stored as ISO strings in the new logic: "2026-01-12"
                // dateString is also: "2026-01-12"
                // Simple string comparison works for inclusion logic
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

    // --- RENDER MATRICES ---
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
            // VIP RED TEXT
            const vipHtml = rec.vipStatus ? `<div style="color: red; font-weight: bold; margin-bottom: 4px; font-size: 14px;">${rec.vipStatus}</div>` : '';
            card.innerHTML = `<div class="rec-info"><h3>${rec.name} (${rec.resId})</h3>${vipHtml}<div class="rec-details">Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br>Value: <strong>${rec.revenue}</strong></div></div><div class="rec-actions"><button class="pms-btn" data-index="${i}" style="margin-right:5px;">Mark as PMS Updated</button></div>`;
            container.appendChild(card);
        });
        container.querySelectorAll('.pms-btn').forEach(btn => btn.addEventListener('click', handlePmsUpdateClick));
    } else container.innerHTML = '<p>No accepted upgrades.</p>';
}

// ... (Display Demand Insights, Completed Upgrades, Matrix, Loader, ShowError, ParseCSV remain same) ...
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

    // Save to global state for matrix recalculation in displayScenarios
    currentAllReservations = allReservations;

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
    let nameIndex, resIdIndex, roomTypeIndex, rateNameIndex, arrivalIndex, departureIndex, statusIndex, rateIndex, firstNameIndex, lastNameIndex, marketCodeIndex, vipIndex = -1;

    if (isSnt) {
        firstNameIndex = header.indexOf('First Name'); lastNameIndex = header.indexOf('Last Name'); resIdIndex = header.indexOf('Reservation Id'); roomTypeIndex = header.indexOf('Arrival Room Type'); rateNameIndex = header.indexOf('Arrival Rate Code'); arrivalIndex = header.indexOf('Arrival Date'); departureIndex = header.indexOf('Departure Date'); statusIndex = header.indexOf('Reservation Status'); rateIndex = header.indexOf('Adr'); marketCodeIndex = header.indexOf('Market Code'); vipIndex = header.indexOf('VIPDescription');
        if (firstNameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) throw new Error("Missing SNT columns.");
    } else {
        nameIndex = header.indexOf('Guest Name'); resIdIndex = header.indexOf('Res ID'); roomTypeIndex = header.indexOf('Room Type'); rateNameIndex = header.indexOf('Rate Name'); arrivalIndex = header.indexOf('Arrival Date'); departureIndex = header.indexOf('Departure Date'); statusIndex = header.indexOf('Status'); rateIndex = header.indexOf('Rate'); vipIndex = header.indexOf('VIPDescription');
        if (nameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) throw new Error("Missing CSV columns.");
    }

    return data.map(values => {
        if (values.length < header.length) return null;
        const arrival = values[arrivalIndex] ? parseDate(values[arrivalIndex]) : null;
        const departure = values[departureIndex] ? parseDate(values[departureIndex]) : null;
        let nights = 0; if (arrival && departure) nights = Math.max(1, Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)));
        const dailyRate = parseFloat(values[rateIndex]) || 0;
        let fullName = isSnt ? `${values[firstNameIndex] || ''} ${values[lastNameIndex] || ''}`.trim() : values[nameIndex];
        let status = values[statusIndex] ? values[statusIndex].trim().toUpperCase() : '';
        if (isSnt && status === 'RESERVED') status = 'RESERVATION';
        let marketCode = (isSnt && marketCodeIndex > -1) ? values[marketCodeIndex] : '';
        let vipStatus = (vipIndex > -1 && values[vipIndex]) ? values[vipIndex].trim() : "";

        return { name: fullName, resId: values[resIdIndex]?.trim(), roomType: values[roomTypeIndex]?.trim().toUpperCase(), rate: values[rateNameIndex]?.trim(), nights, arrival, departure, status, revenue: (dailyRate * nights).toLocaleString('en-US', {style:'currency',currency:'USD'}), marketCode, vipStatus };
    }).filter(r => r && r.roomType && r.arrival && r.departure && r.nights > 0);
}

// --- GENERATE SCENARIOS (SIMULATION) ---
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

    // Build Dynamic Inventory Map for 14 Days (Extended for robust checking)
    const simInventory = {};
    for(let i=0; i<14; i++) {
        const d = new Date(startDate); d.setUTCDate(d.getUTCDate()+i);
        const dStr = d.toISOString().split('T')[0];
        simInventory[dStr] = {};
        for(let room in masterInv) {
            const dTime = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).getTime();
            const existingCount = allReservations.reduce((acc, res) => { if(res.roomType === room && res.arrival <= d && res.departure > d) return acc + 1; return acc; }, 0);
            const oooCount = oooRecords.reduce((acc, rec) => { const rStart = rec.startDate.getTime(); const rEnd = rec.endDate.getTime(); if(rec.roomType === room && dTime >= rStart && dTime <= rEnd) return acc + (rec.count || 1); return acc; }, 0);
            if (currentInventoryMap && currentInventoryMap[dStr] && currentInventoryMap[dStr][room] !== undefined) simInventory[dStr][room] = currentInventoryMap[dStr][room]; 
            else simInventory[dStr][room] = (masterInv[room] || 0) - existingCount - oooCount;
        }
    }

    let candidates = [];
    for(let i=0; i<7; i++) {
        const d = new Date(startDate); d.setUTCDate(d.getUTCDate()+i);
        const dTime = d.getTime();
        const dailyArrivals = allReservations.filter(r => r.arrival && r.arrival.getTime() === dTime && r.status === 'RESERVATION');
        
        dailyArrivals.forEach(res => {
            if (completedIds.has(res.resId)) return;
            if (ineligible.includes(res.roomType)) return;
            if (otaRates.some(ota => res.rate.toLowerCase().includes(ota))) return;
            if (rules.profile === 'sts' && res.marketCode === 'Internet Merchant Model') return;

            const currentIdx = hierarchy.indexOf(res.roomType);
            if (currentIdx === -1) return;
            const bedType = getBedType(res.roomType);
            if (bedType === 'OTHER') return;

            for(let u=currentIdx+1; u<hierarchy.length; u++) {
                const upRoom = hierarchy[u];
                if (ineligible.includes(upRoom)) continue;
                if (getBedType(upRoom) !== bedType) continue;
                candidates.push({
                    reservation: res, upgradeTo: upRoom, score: parseFloat(res.revenue.replace(/[$,]/g, '')) || 0,
                    vip: res.vipStatus ? 1 : 0, nights: res.nights, distance: u - currentIdx, dateStr: d.toISOString().split('T')[0]
                });
            }
        });
    }

    if (strategy === 'Revenue Focus') candidates.sort((a, b) => b.score - a.score);
    else if (strategy === 'VIP Focus') candidates.sort((a, b) => { if (b.vip !== a.vip) return b.vip - a.vip; return b.score - a.score; });
    else candidates.sort((a, b) => a.nights - b.nights); 

    const processedResIds = new Set();
    const recommendations = [];

    candidates.forEach(cand => {
        if (processedResIds.has(cand.reservation.resId)) return;
        let canUpgrade = true;
        let checkDate = new Date(cand.reservation.arrival);
        while(checkDate < cand.reservation.departure) {
            const dStr = checkDate.toISOString().split('T')[0];
            if (!simInventory[dStr] || (simInventory[dStr][cand.upgradeTo] || 0) <= 0) { canUpgrade = false; break; }
            checkDate.setUTCDate(checkDate.getUTCDate()+1);
        }

        if (canUpgrade) {
            recommendations.push({
                name: cand.reservation.name, resId: cand.reservation.resId, revenue: cand.reservation.revenue,
                room: cand.reservation.roomType, rate: cand.reservation.rate, nights: cand.reservation.nights,
                upgradeTo: cand.upgradeTo, score: cand.score,
                arrivalDate: cand.reservation.arrival.toLocaleDateString('en-US', { timeZone: 'UTC' }),
                departureDate: cand.reservation.departure.toLocaleDateString('en-US', { timeZone: 'UTC' }),
                isoArrival: cand.reservation.arrival.toISOString().split('T')[0], // Store for Matrix calc
                isoDeparture: cand.reservation.departure.toISOString().split('T')[0], // Store for Matrix calc
                vipStatus: cand.reservation.vipStatus
            });
            processedResIds.add(cand.reservation.resId);
            checkDate = new Date(cand.reservation.arrival);
            while(checkDate < cand.reservation.departure) {
                const dStr = checkDate.toISOString().split('T')[0];
                if (simInventory[dStr]) simInventory[dStr][cand.upgradeTo]--;
                checkDate.setUTCDate(checkDate.getUTCDate()+1);
            }
        }
    });

    return recommendations;
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












