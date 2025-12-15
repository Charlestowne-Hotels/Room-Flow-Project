// The firebaseConfig object is now expected to be in Config.js
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services ONCE at the top
const auth = firebase.auth();
const db = firebase.firestore();

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


// --- DOM ELEMENT REFERENCES ---
let loginContainer, appContainer, signinBtn, signoutBtn, emailInput, passwordInput, errorMessage, clearAnalyticsBtn;
// New references for saving rules
let saveRulesBtn, saveStatus;

// --- STATE MANAGEMENT & PROFILES ---
// These serve as DEFAULTS. If Firebase has data, it will overwrite these.
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
    }
};

// --- MASTER INVENTORIES ---
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
    ]
};


let currentCsvContent = null;
let currentFileName = null; // Stored to check against SNT format
let currentRules = null;
let currentRecommendations = [];
let acceptedUpgrades = [];
let completedUpgrades = [];
let oooRecords = []; // <--- NEW OOO STATE

// --- FUNCTIONS ---

function resetAppState() {
    currentCsvContent = null;
    currentFileName = null;
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
    populateOooDropdown(); // Re-populate OOO dropdown based on hierarchy
}

// --- OOO MANAGEMENT FUNCTIONS ---

// Load OOO records from Firebase for the current profile
// UPDATED: Now filters out expired records automatically
async function loadOooRecords() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    const listContainer = document.getElementById('ooo-list');
    
    oooRecords = []; // Reset local state
    if(listContainer) listContainer.innerHTML = '<p>Loading...</p>';

    // Get today's date (at midnight) to compare
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const snapshot = await db.collection('ooo_logs')
            .where('profile', '==', currentProfile)
            .get();

        snapshot.forEach(doc => {
            const data = doc.data();
            const endDate = data.endDate.toDate();

            // ONLY add to the list if the end date is today or in the future
            if (endDate >= today) {
                oooRecords.push({
                    id: doc.id,
                    roomType: data.roomType,
                    count: data.count || 1, // Default to 1 if missing
                    startDate: data.startDate.toDate(),
                    endDate: endDate,
                    profile: data.profile
                });
            }
        });

        renderOooList();
        populateOooDropdown(); 
    } catch (error) {
        console.error("Error loading OOO records:", error);
        if(listContainer) listContainer.innerHTML = '<p style="color:red">Error loading OOO records.</p>';
    }
}

// Add a new OOO Record
async function handleAddOoo() {
    const profile = document.getElementById('profile-dropdown').value;
    const roomType = document.getElementById('ooo-room-type').value;
    const countInput = document.getElementById('ooo-count');
    const startStr = document.getElementById('ooo-start-date').value;
    const endStr = document.getElementById('ooo-end-date').value;
    
    const count = parseInt(countInput.value, 10);

    if (!roomType || !startStr || !endStr || isNaN(count) || count < 1) {
        alert("Please fill in all OOO fields correctly.");
        return;
    }

    const startDate = new Date(startStr); 
    // Fix timezone offset for accurate date storage (store as UTC noon to avoid shifting)
    const utcStart = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0));
    
    const endDate = new Date(endStr);
    const utcEnd = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12, 0, 0));

    if (utcEnd < utcStart) {
        alert("End date cannot be before start date.");
        return;
    }

    const newRecord = {
        profile: profile,
        roomType: roomType,
        count: count,
        startDate: utcStart,
        endDate: utcEnd
    };

    const btn = document.getElementById('add-ooo-btn');
    btn.disabled = true;
    btn.textContent = "Adding...";

    try {
        const docRef = await db.collection('ooo_logs').add(newRecord);
        
        // Add to local state immediately so we see it without refresh
        oooRecords.push({ ...newRecord, id: docRef.id });
        
        renderOooList();
        
        // Reset inputs
        document.getElementById('ooo-room-type').value = "";
        countInput.value = "1";
        document.getElementById('ooo-start-date').value = "";
        document.getElementById('ooo-end-date').value = "";
    } catch (error) {
        console.error("Error adding OOO:", error);
        alert("Failed to save. Ensure you are an Admin.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Add";
    }
}

// Delete an OOO Record
async function handleDeleteOoo(id) {
    if(!confirm("Remove this OOO record? This will add the room back to inventory.")) return;

    try {
        await db.collection('ooo_logs').doc(id).delete();
        // Remove from local array
        oooRecords = oooRecords.filter(r => r.id !== id);
        renderOooList();
    } catch (error) {
        console.error("Error deleting OOO:", error);
        alert("Failed to delete.");
    }
}

// Render the running list in the HTML
function renderOooList() {
    const container = document.getElementById('ooo-list');
    if(!container) return;

    if (oooRecords.length === 0) {
        container.innerHTML = '<p style="color: #888; font-size: 13px;">No active OOO records.</p>';
        return;
    }

    // Sort by start date
    oooRecords.sort((a, b) => a.startDate - b.startDate);

    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
    oooRecords.forEach(rec => {
        const start = rec.startDate.toISOString().split('T')[0];
        const end = rec.endDate.toISOString().split('T')[0];
        // Show count if greater than 1
        const countDisplay = rec.count > 1 ? `<strong style="color: #d63384;">(x${rec.count})</strong>` : '';
        
        html += `
            <li style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 8px; border-bottom: 1px solid #eee; margin-bottom: 4px; font-size: 13px;">
                <span>
                    <strong>${rec.roomType}</strong> ${countDisplay} <br>
                    <small>${start} to ${end}</small>
                </span>
                <button onclick="handleDeleteOoo('${rec.id}')" style="color: red; background: none; border: none; cursor: pointer; font-weight: bold; font-size: 14px;">&times;</button>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

// Populate the OOO dropdown based on current profile hierarchy
function populateOooDropdown() {
    const dropdown = document.getElementById('ooo-room-type');
    const hierarchyVal = document.getElementById('hierarchy').value;
    if(!dropdown || !hierarchyVal) return;

    const hierarchy = hierarchyVal.split(',');
    
    dropdown.innerHTML = '<option value="">Select Room</option>';
    
    hierarchy.forEach(code => {
        const cleanCode = code.trim().toUpperCase();
        if(cleanCode) {
            const opt = document.createElement('option');
            opt.value = cleanCode;
            opt.textContent = cleanCode;
            dropdown.appendChild(opt);
        }
    });
}

/**
 * Enables or disables all admin-only controls.
 */
function setAdminControls(isAdmin) {
    const shouldBeDisabled = !isAdmin;
    const elementsToToggle = [
        document.getElementById('hierarchy'),
        document.getElementById('target-rooms'),
        document.getElementById('prioritized-rates'),
        document.getElementById('ota-rates'),
        document.getElementById('ineligible-upgrades'),
        document.getElementById('ooo-start-date'),
        document.getElementById('ooo-end-date'),
        document.getElementById('ooo-room-type'),
        document.getElementById('ooo-count'),
        document.getElementById('add-ooo-btn')
    ];

    elementsToToggle.forEach(el => {
        if (el) {
            el.disabled = shouldBeDisabled;
        }
    });
    
    const rulesContainer = document.getElementById('admin-rules-container');
    if(rulesContainer) {
        rulesContainer.style.display = isAdmin ? 'block' : 'none';
    }
}

// --- NEW: LOAD SAVED RULES FROM CLOUD ---
async function loadRemoteProfiles() {
    try {
        const docRef = db.collection('app_settings').doc('profile_rules');
        const doc = await docRef.get();

        if (doc.exists) {
            const savedData = doc.data();
            Object.keys(savedData).forEach(profileKey => {
                if (profiles[profileKey]) {
                    profiles[profileKey] = { 
                        ...profiles[profileKey], 
                        ...savedData[profileKey] 
                    };
                }
            });
            console.log("Remote rules loaded and merged from Firebase.");
        }
        
        const currentProfile = document.getElementById('profile-dropdown').value;
        updateRulesForm(currentProfile);

    } catch (error) {
        console.error("Error loading remote profiles:", error);
    }
}

// --- NEW: SAVE RULES TO CLOUD ---
async function handleSaveRules() {
    const currentProfile = document.getElementById('profile-dropdown').value;
    const btn = document.getElementById('save-rules-btn');
    const status = document.getElementById('save-status');

    // 1. Capture current values from DOM
    const newRules = {
        hierarchy: document.getElementById('hierarchy').value,
        targetRooms: document.getElementById('target-rooms').value,
        prioritizedRates: document.getElementById('prioritized-rates').value,
        otaRates: document.getElementById('ota-rates').value,
        ineligibleUpgrades: document.getElementById('ineligible-upgrades').value
    };

    // 2. Update local state immediately
    if (profiles[currentProfile]) {
        Object.assign(profiles[currentProfile], newRules);
    }

    // 3. UI Feedback
    btn.disabled = true;
    btn.textContent = "Saving...";
    status.textContent = "";

    try {
        await db.collection('app_settings').doc('profile_rules').set({
            [currentProfile]: newRules
        }, { merge: true });

        status.textContent = "Saved successfully!";
        status.style.color = "green";
        setTimeout(() => { status.textContent = ""; }, 3000);

    } catch (error) {
        console.error("Error saving rules:", error);
        status.textContent = "Error saving.";
        status.style.color = "red";
        alert("Failed to save rules: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Save Rules";
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
            // Capture the Firestore ID to enable undoing later
            upgrade.firestoreId = doc.id;
            
            if (upgrade.completedTimestamp && upgrade.completedTimestamp.toDate) {
                upgrade.completedTimestamp = upgrade.completedTimestamp.toDate();
            }
            completedUpgrades.push(upgrade);
        });
        console.log(`Loaded ${completedUpgrades.length} completed upgrades from Firestore.`);
        displayCompletedUpgrades();
        displayDemandInsights(); // Also refresh insights
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
    // --- 1. DOM REFERENCES ---
    loginContainer = document.getElementById('login-container');
    appContainer = document.getElementById('app-container');
    signinBtn = document.getElementById('signin-btn');
    signoutBtn = document.getElementById('signout-btn');
    emailInput = document.getElementById('email-input');
    passwordInput = document.getElementById('password-input');
    errorMessage = document.getElementById('error-message');
    clearAnalyticsBtn = document.getElementById('clear-analytics-btn');
    saveRulesBtn = document.getElementById('save-rules-btn');
    saveStatus = document.getElementById('save-status');

    // --- MODAL REFERENCES ---
    const settingsModal = document.getElementById('settings-modal');
    const settingsTriggerBtn = document.getElementById('settings-trigger-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const generateBtn = document.getElementById('generate-btn');

    // --- 2. AUTH LISTENER ---
    auth.onAuthStateChanged(async user => {
        const adminButton = document.getElementById('clear-analytics-btn');
        const saveBtn = document.getElementById('save-rules-btn'); 

        if (user) {
            console.log("User is signed in:", user.uid);
            if (loginContainer) loginContainer.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');

            await loadRemoteProfiles(); 
            await loadOooRecords(); // <--- LOAD OOO HERE

            const isUserAdmin = ADMIN_UIDS.includes(user.uid);

            if (isUserAdmin) {
                console.log("User is an admin!");
                if(adminButton) adminButton.classList.remove('hidden');
                if(saveBtn) saveBtn.classList.remove('hidden');
                // SHOW SETTINGS ICON FOR ADMIN
                if(settingsTriggerBtn) settingsTriggerBtn.classList.remove('hidden');
            } else {
                if(saveBtn) saveBtn.classList.add('hidden');
                if(adminButton) adminButton.classList.add('hidden');
                // HIDE SETTINGS ICON FOR NON-ADMIN
                if(settingsTriggerBtn) settingsTriggerBtn.classList.add('hidden');
            }

            setAdminControls(isUserAdmin);
            loadCompletedUpgrades(user.uid);
        } else {
            console.log("User is signed out.");
            if (loginContainer) loginContainer.classList.remove('hidden');
            if (appContainer) appContainer.classList.add('hidden');
            if (adminButton) adminButton.classList.add('hidden');
            if (saveBtn) saveBtn.classList.add('hidden');
            // HIDE SETTINGS ICON ON LOGOUT
            if(settingsTriggerBtn) settingsTriggerBtn.classList.add('hidden');

            setAdminControls(false);
        }
    });

    // --- 3. MODAL LISTENERS ---
    if(settingsTriggerBtn) {
        settingsTriggerBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            populateOooDropdown(); // Populate dropdown when opening modal
        });
    }

    if(closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // Generate Listener
    if(generateBtn) {
        generateBtn.addEventListener('click', handleGenerateClick);
    }


    // --- 4. OTHER LISTENERS ---
    const profileDropdown = document.getElementById('profile-dropdown');
    profileDropdown.addEventListener('change', (event) => {
        updateRulesForm(event.target.value);
        resetAppState();
        displayCompletedUpgrades();
        displayDemandInsights(); // Update insights on profile change
        loadOooRecords(); // <--- RELOAD OOO ON PROFILE CHANGE
    });
    updateRulesForm('fqi'); 

    if(saveRulesBtn) {
        saveRulesBtn.addEventListener('click', handleSaveRules);
    }

    const addOooBtn = document.getElementById('add-ooo-btn');
    if (addOooBtn) {
        addOooBtn.addEventListener('click', handleAddOoo);
    }

    const triggerSignInOnEnter = (event) => {
        if (event.key === 'Enter') {
            handleSignIn();
        }
    };

    if (emailInput) emailInput.addEventListener('keydown', triggerSignInOnEnter);
    if (passwordInput) passwordInput.addEventListener('keydown', triggerSignInOnEnter);

    signinBtn.addEventListener('click', handleSignIn);
    signoutBtn.addEventListener('click', handleSignOut);
    clearAnalyticsBtn.addEventListener('click', handleClearAnalytics);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    document.getElementById('selected-date').value = futureDate.toISOString().slice(0, 10);
    
    // Listen for date changes on Analytics tab to refresh both sub-views
    document.getElementById('sort-date-dropdown').addEventListener('change', () => {
        displayCompletedUpgrades();
        displayDemandInsights();
    });
    
    // --- MAIN TABS ---
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

    // --- NEW: ANALYTICS SUB-TABS LOGIC ---
    // Looks for elements with data-sub-tab-target (make sure your HTML buttons have this attribute)
    const subTabs = document.querySelectorAll('[data-sub-tab-target]');
    
    // If you name your view containers properly in HTML, this generic logic will work
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSelector = tab.dataset.subTabTarget;
            const target = document.querySelector(targetSelector);
            
            // 1. Deactivate all sub-tabs
            subTabs.forEach(t => t.classList.remove('active'));
            // 2. Hide all analytics views (we assume they share a class, or we hide specific ones)
            const completedView = document.querySelector('#completed-container')?.parentElement;
            const demandView = document.querySelector('#demand-insights-container')?.parentElement;
            
            // Ideally, your HTML structure wraps these containers in "tab-view" divs.
            // If strictly using the provided containers as targets:
            if(document.querySelector('#completed-container')) document.querySelector('#completed-container').style.display = 'none';
            if(document.querySelector('#demand-insights-container')) document.querySelector('#demand-insights-container').style.display = 'none';

            // 3. Activate clicked tab
            tab.classList.add('active');
            
            // 4. Show target
            if(target) {
                target.style.display = 'block';
                // Trigger refresh based on which tab was clicked
                if (target.id === 'demand-insights-container') {
                    displayDemandInsights();
                } else if (target.id === 'completed-container') {
                    displayCompletedUpgrades();
                }
            }
        });
    });
});

function handleGenerateClick() {
    const fileInput = document.getElementById('csv-file');
    // Validation: Check if file is uploaded
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a PMS export file first.');
        return;
    }
    
    // CAPTURE FILE NAME
    currentFileName = fileInput.files[0].name;

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
                // Pass fileName to processing
                const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
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

    acceptedUpgrades.push(acceptedRec);

    setTimeout(() => {
        try {
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
            displayResults(results);
        } catch (err) {
            showError(err);
            acceptedUpgrades.pop(); 
            card.style.opacity = '1';
            button.disabled = false;
            button.textContent = 'Accept';
        }
    }, 50);
}

function handleUndoClick(event) {
    const button = event.target;
    const index = parseInt(button.dataset.index, 10);

    acceptedUpgrades.splice(index, 1);
    showLoader(true, 'Reverting...');

    setTimeout(() => {
        try {
            const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
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
                // Update local object with new ID
                upgradeToComplete.firestoreId = docRef.id;
                displayCompletedUpgrades(); // Re-render list
                displayDemandInsights(); // Re-render insights
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

// --- NEW FUNCTION: UNDO A COMPLETED UPGRADE ---
async function handleUndoCompletedClick(event) {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm("This will remove this record from Analytics and move it back to the 'Accepted Upgrades' list. Continue?")) {
        return;
    }

    const btn = event.target;
    const firestoreId = btn.dataset.firestoreId;
    
    // 1. Find the local object
    const itemIndex = completedUpgrades.findIndex(u => u.firestoreId === firestoreId);
    if (itemIndex === -1) {
        alert("Error: Item not found locally.");
        return;
    }
    
    const itemToRestore = completedUpgrades[itemIndex];
    btn.disabled = true;
    btn.textContent = "Reverting...";

    try {
        // 2. Delete from Firestore
        await db.collection('users').doc(user.uid).collection('completedUpgrades').doc(firestoreId).delete();

        // 3. Remove from local Completed array
        completedUpgrades.splice(itemIndex, 1);

        // 4. Move back to Accepted Upgrades array
        // We remove the timestamp and ID so it looks like a fresh accepted upgrade
        delete itemToRestore.completedTimestamp;
        delete itemToRestore.firestoreId; 
        
        acceptedUpgrades.push(itemToRestore);

        // 5. Update UI
        displayCompletedUpgrades(); // Refresh Analytics tab
        displayDemandInsights();    // Refresh Insights tab
        displayAcceptedUpgrades();  // Refresh Accepted tab
        
        // 6. Recalculate matrix if needed (if a CSV is loaded)
        if (currentCsvContent && currentRules) {
             const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
             displayResults(results);
        }

    } catch (error) {
        console.error("Error undoing completed upgrade:", error);
        alert("Failed to undo. Please check console.");
        btn.disabled = false;
        btn.textContent = "Undo";
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

function displayAcceptedUpgrades() {
    const container = document.getElementById('accepted-container');
    container.innerHTML = '';
    
    if (acceptedUpgrades && acceptedUpgrades.length > 0) {

        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.justifyContent = 'flex-end'; 
        controlsContainer.style.alignItems = 'center';
        controlsContainer.style.marginBottom = '20px';
        controlsContainer.style.padding = '10px';
        controlsContainer.style.backgroundColor = '#f8f9fa';
        controlsContainer.style.borderRadius = '5px';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Download CSV';
        exportBtn.style.backgroundColor = '#4343FF'; 
        exportBtn.style.color = 'white';
        exportBtn.style.border = 'none';
        exportBtn.style.padding = '10px 15px';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.style.fontSize = '14px';
        exportBtn.addEventListener('click', downloadAcceptedUpgradesCsv); 

        controlsContainer.appendChild(exportBtn);
        container.appendChild(controlsContainer);

        acceptedUpgrades.forEach((rec, index) => {
            const card = document.createElement('div');
            card.className = 'rec-card';
            
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
        
        container.querySelectorAll('.pms-btn').forEach(btn => {
            btn.addEventListener('click', handlePmsUpdateClick);
        });
        
        container.querySelectorAll('.undo-btn').forEach(btn => {
            btn.addEventListener('click', handleUndoClick);
        });

    } else {
        container.innerHTML = '<p>No upgrades have been accepted yet.</p>';
    }
}

// --- NEW FUNCTION: DISPLAY DEMAND INSIGHTS ---
function displayDemandInsights() {
    const container = document.getElementById('demand-insights-container');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (!container || !profileDropdown) return;
    
    const currentProfile = profileDropdown.value;
    const profileUpgrades = completedUpgrades.filter(rec => rec.profile === currentProfile);
    
    container.innerHTML = '';
    
    if (profileUpgrades.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No completed upgrade data available for Demand Insights.</p>';
        return;
    }

    // 1. Calculate Statistics
    const roomTypeCounts = {};
    let totalRevenue = 0;
    
    profileUpgrades.forEach(rec => {
        // Count upgrades to specific room types
        const type = rec.upgradeTo;
        roomTypeCounts[type] = (roomTypeCounts[type] || 0) + 1;
        
        // Sum revenue
        const val = parseFloat(rec.revenue.replace(/[$,]/g, '')) || 0;
        totalRevenue += val;
    });

    const sortedRooms = Object.entries(roomTypeCounts)
        .sort((a, b) => b[1] - a[1]); // Sort by count descending

    const avgRevenue = profileUpgrades.length > 0 ? (totalRevenue / profileUpgrades.length) : 0;

    // 2. Build HTML
    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">Total Completed Upgrades</h4>
                <div style="font-size: 24px; font-weight: bold; color: #4343FF;">${profileUpgrades.length}</div>
            </div>
            <div style="background: #f0fff4; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">Total Revenue Value</h4>
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            </div>
            <div style="background: #fff8f0; padding: 15px; border-radius: 8px; text-align: center;">
                <h4 style="margin:0; color:#555;">Avg. Upgrade Value</h4>
                <div style="font-size: 24px; font-weight: bold; color: #fd7e14;">${avgRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            </div>
        </div>
        
        <h3>Top Performing Upgrade Rooms</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background: #f8f9fa; text-align: left;">
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Room Type</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Upgrade Count</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">% of Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedRooms.forEach(([room, count]) => {
        const percentage = ((count / profileUpgrades.length) * 100).toFixed(1);
        html += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${room}</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${count}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center;">
                        <span style="width: 40px;">${percentage}%</span>
                        <div style="flex-grow: 1; height: 6px; background: #eee; border-radius: 3px; margin-left: 10px;">
                            <div style="width: ${percentage}%; height: 100%; background: #4343FF; border-radius: 3px;"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

function displayCompletedUpgrades() {
    const container = document.getElementById('completed-container');
    const dateDropdown = document.getElementById('sort-date-dropdown');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (!container || !dateDropdown || !profileDropdown) {
        console.warn('displayCompletedUpgrades called before DOM was ready.');
        return;
    }

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
                                <div class="rec-actions" style="flex-direction: column; align-items: flex-end;">
                                    <div style="color: var(--success-color); margin-bottom: 5px;">
                                        <strong style="color: #4343FF;">✓ Completed</strong>
                                    </div>
                                    <button class="undo-completed-btn" data-firestore-id="${rec.firestoreId}" style="background-color: #dc3545; color: white; padding: 5px 10px; font-size: 12px; border: none; border-radius: 4px; cursor: pointer;">Undo</button>
                                </div>
            `;
            container.appendChild(card);
        });
        const totalHeader = document.createElement('h3');
        totalHeader.style.textAlign = 'right';
        totalHeader.style.marginTop = '20px';
        totalHeader.textContent = `Total Value: ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        container.appendChild(totalHeader);

        // Attach listeners for the new undo buttons
        container.querySelectorAll('.undo-completed-btn').forEach(btn => {
            btn.addEventListener('click', handleUndoCompletedClick);
        });

    } else {
        container.innerHTML = '<p>No upgrades have been marked as completed for this profile and date.</p>';
    }
}

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
            html += `<td>${avail}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    colorMatrixCells();
}

function colorMatrixCells() {
    const cells = document.querySelectorAll("#matrix-container td:not(:first-child)");

    cells.forEach(cell => {
        const value = parseInt(cell.textContent, 10);

        if (isNaN(value)) {
            return;
        }

        cell.classList.remove('matrix-neg', 'matrix-low', 'matrix-high');

        if (value < 0) {
            cell.classList.add('matrix-neg'); 
        } else if (value >= 3) {
            cell.classList.add('matrix-high'); 
        } else {
            cell.classList.add('matrix-low'); 
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

function applyUpgradesAndRecalculate(currentAcceptedList, csvContent, rules, fileName) {
    const { data, header } = parseCsv(csvContent);
    // PASS FILE NAME HERE
    const allReservations = parseAllReservations(data, header, fileName);

    currentAcceptedList.forEach(rec => {
        const reservationToUpdate = allReservations.find(res => res.resId === rec.resId);
        if (reservationToUpdate) {
            reservationToUpdate.roomType = rec.upgradeTo;
        }
    });

    const results = generateRecommendationsFromData(allReservations, rules);
    results.acceptedUpgrades = currentAcceptedList;
    return results;
}

function processUpgradeData(csvContent, rules, fileName) {
    const { data, header } = parseCsv(csvContent);
    if (!data || data.length === 0) {
        throw new Error('CSV file is empty or could not be parsed.');
    }
    
    // Update isSnt to include LTRL
    const isSnt = fileName && (fileName.startsWith('SNT') || fileName.startsWith('LTRL') || fileName.startsWith('VERD') || fileName.startsWith('LCKWD') || fileName.startsWith('TBH') || fileName.startsWith('DARLING'));
    let requiredHeaders = [];
    
    if (isSnt) {
        // SNT Specific Headers
        requiredHeaders = ['Arrival Date', 'Departure Date', 'First Name', 'Last Name', 'Arrival Rate Code', 'Adr', 'Reservation Id', 'Arrival Room Type', 'Reservation Status'];
    } else {
        // Standard Headers
        requiredHeaders = ['Guest Name', 'Res ID', 'Room Type', 'Rate Name', 'Rate', 'Arrival Date', 'Departure Date', 'Status'];
    }

    const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) {
        throw new Error(`The uploaded PMS export is missing required columns for ${isSnt ? 'SNT' : 'Standard'} format. Could not find: '${missingHeaders.join(', ')}'`);
    }
    
    // PASS FILE NAME HERE
    const allReservations = parseAllReservations(data, header, fileName);
    return generateRecommendationsFromData(allReservations, rules);
}

function generateRecommendationsFromData(allReservations, rules) {
    const masterInventory = getMasterInventory(rules.profile);

    if (Object.keys(masterInventory).length === 0) {
        return {
            error: `Could not load master inventory for profile '${rules.profile}'. Please check the MASTER_INVENTORIES configuration.`
        };
    }

    const currentProfile = rules.profile;
    const completedResIdsForProfile = new Set(
        completedUpgrades
            .filter(up => up.profile === currentProfile)
            .map(up => up.resId)
    );

    // FILTER FOR RESERVATIONS
    const arrivalsForThisDay = allReservations.filter(r => r.status === 'RESERVATION');
    
    // --- UPDATED LOGIC HERE ---
    // Filter effectively active reservations for inventory calculation
    // EXCLUDE CANCELED RECORDS from the Matrix / Inventory calculation
    const activeReservations = allReservations.filter(res => 
        res.status !== 'CANCELED' && 
        res.status !== 'CANCELLED' && 
        res.status !== 'NO SHOW'
    );
    // --------------------------

    if (allReservations.length === 0) {
        return {
            recommendations: [],
            inventory: getInventoryForDate(masterInventory, buildReservationsByDate([]), parseDate(rules.selectedDate)),
            matrixData: generateMatrixData(masterInventory, buildReservationsByDate([]), parseDate(rules.selectedDate), rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean)),
            message: 'No valid reservations found in the uploaded file matching the criteria.'
        };
    }

    const startDate = parseDate(rules.selectedDate);
    // Use 'activeReservations' instead of 'allReservations'
    const reservationsByDate = buildReservationsByDate(activeReservations);
    const todayInventory = getInventoryForDate(masterInventory, reservationsByDate, startDate);
    const roomHierarchy = rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const matrixData = generateMatrixData(masterInventory, reservationsByDate, startDate, roomHierarchy);
    
    const originalTargetRooms = rules.targetRooms.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const otaRates = rules.otaRates.toLowerCase().split(',').map(r => r.trim()).filter(Boolean);
    const ineligibleUpgrades = rules.ineligibleUpgrades.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
    const useDefaultLogic = originalTargetRooms.length === 0;

    const isRoomAvailableForStay = (roomCode, reservation, invByDate, masterInv) => {
        let checkDate = new Date(reservation.arrival);
        while (checkDate < reservation.departure) {
            const dateString = checkDate.toISOString().split('T')[0];
            
            // 1. Get Physical Reservations
            const occupiedCount = invByDate[dateString]?.[roomCode] || 0;
            
            // 2. Get OOO Deductions (SUM OF COUNTS)
            const oooDeduction = oooRecords.reduce((total, rec) => {
                 const rStart = new Date(Date.UTC(rec.startDate.getUTCFullYear(), rec.startDate.getUTCMonth(), rec.startDate.getUTCDate())).getTime();
                 const rEnd = new Date(Date.UTC(rec.endDate.getUTCFullYear(), rec.endDate.getUTCMonth(), rec.endDate.getUTCDate())).getTime();
                 const cTime = new Date(Date.UTC(checkDate.getUTCFullYear(), checkDate.getUTCMonth(), checkDate.getUTCDate())).getTime();
                 
                 if (rec.roomType === roomCode && (cTime >= rStart && cTime <= rEnd)) {
                     return total + (rec.count || 1);
                 }
                 return total;
            }, 0);

            if ((occupiedCount + oooDeduction) >= (masterInv[roomCode] || 0)) return false;
            
            checkDate.setUTCDate(checkDate.getUTCDate() + 1);
        }
        return true;
    };

    let recommendations = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(startDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + dayOffset);
        const currentTimestamp = currentDate.getTime();
        
        // Use the pre-filtered reservation list
        const dailyArrivals = arrivalsForThisDay.filter(r => r.arrival && r.arrival.getTime() === currentTimestamp);
        
        let processingQueue = useDefaultLogic ? [...roomHierarchy] : [...originalTargetRooms];

        if (!useDefaultLogic) {
            originalTargetRooms.forEach(targetRoom => {
                if (!dailyArrivals.some(res => res.roomType === targetRoom)) {
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

        processingQueue.forEach((roomToEvaluate) => {
            const eligibleReservations = dailyArrivals.filter(res => {
                
                // New Market Code Check for STS Profile
                if (rules.profile === 'sts' && res.marketCode === 'Internet Merchant Model') {
                    return false;
                }

                return res.roomType === roomToEvaluate && 
                    !otaRates.some(ota => res.rate.toLowerCase().includes(ota)) && 
                    !completedResIdsForProfile.has(res.resId) && 
                    !ineligibleUpgrades.includes(res.roomType);
            });

            eligibleReservations.forEach(res => {
                const currentRoomIndex = roomHierarchy.indexOf(res.roomType);
                if (currentRoomIndex === -1) return;
                
                const originalBedType = getBedType(res.roomType);
                if (originalBedType === 'OTHER') return;

                for (let i = currentRoomIndex + 1; i < roomHierarchy.length; i++) {
                    const potentialUpgradeRoom = roomHierarchy[i];
                    const potentialBedType = getBedType(potentialUpgradeRoom);
                    
                    if (originalBedType !== potentialBedType || ineligibleUpgrades.includes(potentialUpgradeRoom)) continue;

                    if (isRoomAvailableForStay(potentialUpgradeRoom, res, reservationsByDate, masterInventory)) {
                        const score = parseFloat(res.revenue.replace(/[$,]/g, '')) || 0;
                        
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
                            distance: distance,
                            arrivalDate: currentDate.toLocaleDateString('en-US', { timeZone: 'UTC' }),
                            departureDate: res.departure.toLocaleDateString('en-US', { timeZone: 'UTC' })
                        });
                        
                        break; 
                    }
                }
            });
        });
    }

    recommendations.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; 
        }
        return a.distance - b.distance; 
    });

    return {
        recommendations,
        inventory: todayInventory,
        matrixData,
        message: recommendations.length === 0 ? 'No suitable upgrade candidates found for the next 7 days.' : null
    };
}

function getBedType(roomCode) {
    if (!roomCode) return 'OTHER';

    if (roomCode.includes('2BRDM')) return 'K'; 

    if (roomCode.includes('-K')) return 'K';    
    if (roomCode.includes('-QQ')) return 'QQ'; 
    if (roomCode.includes('-Q')) return 'Q';    
    
    if (roomCode.startsWith('DK')) return 'K'; 
    if (roomCode.startsWith('GK')) return 'K'; 
    if (roomCode.startsWith('PK')) return 'K'; 
    if (roomCode.startsWith('TK')) return 'K'; 
    if (roomCode.startsWith('TQ')) return 'QQ'; 

    if (roomCode === 'CKS') return 'K'; 
    if (roomCode === 'CSQ') return 'Q'; 
    
    if (roomCode.startsWith('KS')) return 'K'; 
    if (roomCode.startsWith('SQ')) return 'Q'; 
    if (roomCode.startsWith('DQ')) return 'QQ'; 

    // --- NEW LOGIC FOR MSI BED TYPES ---
    if (roomCode === 'Q') return 'Q';
    if (roomCode === 'DQ') return 'QQ';
    if (roomCode === 'DD') return 'QQ';
    if (roomCode === 'RD') return 'K'; 
    if (roomCode === 'RDCY') return 'K';
    if (roomCode === 'HHK') return 'K'; // Added HHK mapping

    // --- NEW LOGIC FOR INDJH BED TYPES ---
    if (roomCode === 'QNV') return 'Q'; 
    if (roomCode === 'QQ') return 'QQ';
    if (roomCode === 'QAV') return 'Q';
    if (roomCode === 'QQAV') return 'QQ';
    if (roomCode === 'CHQ') return 'Q';
    
    // --- NEW LOGIC FOR STS BED TYPES ---
    if (roomCode === 'PKR') return 'K';
    if (roomCode === 'TKR') return 'K';
    if (roomCode === 'QQR') return 'QQ';
    if (roomCode === 'LKR') return 'K';
    if (roomCode === 'CKR') return 'K';
    if (roomCode === 'KS') return 'K';
    if (roomCode === 'PKS') return 'K';
    if (roomCode === 'AKR') return 'K';
    if (roomCode === 'AQQ') return 'QQ';

    // --- NEW LOGIC FOR RCN BED TYPES ---
    if (roomCode === 'KING' || roomCode === 'KINGADA' || roomCode === 'LVKING' || roomCode === 'ADALV') return 'K';
    if (roomCode === 'DQUEEN' || roomCode === 'ADADQ') return 'QQ';
    if (roomCode === 'JRSTE' || roomCode === 'LVJRSTE' || roomCode === 'PRES') return 'K';

    // --- NEW LOGIC FOR CBY BED TYPES ---
    if (roomCode === 'KNR' || roomCode === 'KND' || roomCode === 'KAR' || roomCode === 'K1S' || roomCode === 'K1AS') return 'K';
    if (roomCode === 'QQNR' || roomCode === 'QQAR') return 'QQ';

    // --- NEW LOGIC FOR BRI BED TYPES ---
    if (['PQNN', 'STQQ', 'SQAC'].includes(roomCode)) return 'QQ';
    if (['PKNG', 'SKNG', 'SKAC', 'HERT', 'AMER', 'LEST', 'LEAC', 'GPST'].includes(roomCode)) return 'K';

    return 'OTHER';
}

function parseAllReservations(data, header, fileName) {
    // Update isSnt to include LTRL
    const isSnt = fileName && (fileName.startsWith('SNT') || fileName.startsWith('LTRL') || fileName.startsWith('VERD') || fileName.startsWith('LCKWD') || fileName.startsWith('TBH') || fileName.startsWith('DARLING'));
    let nameIndex, resIdIndex, roomTypeIndex, rateNameIndex, arrivalIndex, departureIndex, statusIndex, rateIndex, firstNameIndex, lastNameIndex, marketCodeIndex;

    if (isSnt) {
        // --- SNT MAPPING ---
        firstNameIndex = header.indexOf('First Name');
        lastNameIndex = header.indexOf('Last Name');
        resIdIndex = header.indexOf('Reservation Id');
        roomTypeIndex = header.indexOf('Arrival Room Type');
        rateNameIndex = header.indexOf('Arrival Rate Code');
        arrivalIndex = header.indexOf('Arrival Date');
        departureIndex = header.indexOf('Departure Date');
        statusIndex = header.indexOf('Reservation Status');
        rateIndex = header.indexOf('Adr');
        // Extract Market Code (might be -1 if missing, which is handled)
        marketCodeIndex = header.indexOf('Market Code');

        if (firstNameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) {
            throw new Error("One or more critical columns were not found in the SNT CSV header.");
        }
    } else {
        // --- STANDARD MAPPING ---
        nameIndex = header.indexOf('Guest Name');
        resIdIndex = header.indexOf('Res ID');
        roomTypeIndex = header.indexOf('Room Type');
        rateNameIndex = header.indexOf('Rate Name');
        arrivalIndex = header.indexOf('Arrival Date');
        departureIndex = header.indexOf('Departure Date');
        statusIndex = header.indexOf('Status');
        rateIndex = header.indexOf('Rate');

        if (nameIndex === -1 || resIdIndex === -1 || roomTypeIndex === -1) {
            throw new Error("One or more critical columns were not found in the CSV header.");
        }
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

        // Name Logic
        let fullName = "";
        if (isSnt) {
            const first = values[firstNameIndex] ? values[firstNameIndex].trim() : "";
            const last = values[lastNameIndex] ? values[lastNameIndex].trim() : "";
            fullName = `${first} ${last}`.trim();
        } else {
            fullName = values[nameIndex];
        }

        // Status Normalization
        let status = values[statusIndex] ? values[statusIndex].trim().toUpperCase() : '';
        if (isSnt && status === 'RESERVED') {
            status = 'RESERVATION'; // Normalize SNT 'RESERVED' to 'RESERVATION'
        }

        // Market Code Extraction
        let marketCode = "";
        if (isSnt && marketCodeIndex > -1 && values[marketCodeIndex]) {
            marketCode = values[marketCodeIndex].trim();
        }

        return {
            name: fullName,
            resId: values[resIdIndex] ? values[resIdIndex].trim() : '',
            roomType: values[roomTypeIndex] ? values[roomTypeIndex].trim().toUpperCase() : '',
            rate: values[rateNameIndex] ? values[rateNameIndex].trim() : '',
            nights: nights,
            arrival: arrival,
            departure: departure,
            status: status,
            revenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            marketCode: marketCode 
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
        const totalPhysical = masterInventory[roomCode];
        const reservedCount = reservationsByDate[dateString]?.[roomCode] || 0;
        
        // Calculate OOO deduction (SUM OF COUNTS)
        const oooDeduction = oooRecords.reduce((total, rec) => {
            const isMatch = rec.roomType === roomCode;
            const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
            const rStart = new Date(Date.UTC(rec.startDate.getUTCFullYear(), rec.startDate.getUTCMonth(), rec.startDate.getUTCDate())).getTime();
            const rEnd = new Date(Date.UTC(rec.endDate.getUTCFullYear(), rec.endDate.getUTCMonth(), rec.endDate.getUTCDate())).getTime();
            
            if (isMatch && (dTime >= rStart && dTime <= rEnd)) {
                return total + (rec.count || 1);
            }
            return total;
        }, 0);

        inventory[roomCode] = totalPhysical - reservedCount - oooDeduction;
    }
    return inventory;
}

function getMasterInventory(profileName) {
    const masterRoomList = MASTER_INVENTORIES[profileName];
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
            const dTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime();
            
            // Calculate OOO (SUM OF COUNTS)
            const oooCount = oooRecords.reduce((total, rec) => {
                 const rStart = new Date(Date.UTC(rec.startDate.getUTCFullYear(), rec.startDate.getUTCMonth(), rec.startDate.getUTCDate())).getTime();
                 const rEnd = new Date(Date.UTC(rec.endDate.getUTCFullYear(), rec.endDate.getUTCMonth(), rec.endDate.getUTCDate())).getTime();
                 
                 if (rec.roomType === roomCode && (dTime >= rStart && dTime <= rEnd)) {
                     return total + (rec.count || 1);
                 }
                 return total;
            }, 0);

            const finalAvail = (totalInventory[roomCode] || 0) - (reservationsByDate[dateString]?.[roomCode] || 0) - oooCount;
            row.availability.push(finalAvail);
        });
        matrix.rows.push(row);
    });
    return matrix;
}

function downloadAcceptedUpgradesCsv() {
    if (!acceptedUpgrades || acceptedUpgrades.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = [
        'Guest Name', 
        'Res ID', 
        'Current Room Type', 
        'Room Type to Upgrade To', 
        'Arrival Date', 
        'Departure Date'
    ];
    
    const rows = acceptedUpgrades.map(rec => {
        return [
            `"${rec.name}"`,
            `"${rec.resId}"`,
            `"${rec.room}"`,
            `"${rec.upgradeTo}"`,
            `"${rec.arrivalDate}"`,   
            `"${rec.departureDate}"` 
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `accepted_upgrades_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

