// The firebaseConfig object is now expected to be in Config.js
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services ONCE at the top
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// --- ADMIN UIDS ---
const ADMIN_UIDS = [
  "7BdsGq6vJ7UTmAQgVoiEesgEiao1", // jryan@charlestownehotels.com
  "WDOdrOdpcrPjVGyN5VmBEs4KdvW2", // mspangler@charlestownehotels.com
  "HjYycTyitXe10iN05MK1grYoklw2", // jcapps@charlestownehotels.com
  "X8GhArhO62YyqSGLgrDznMlHTdv2", // pbeam@charlestownehotels.com
  "uk1RjvuRfsen7mG9Z69q0AWxZv63", // kchouinard@charlestownehotels.com
  "p3X9TJob5adaeGgfteXUqpBHBIQ2", // bhill@charlestownehotels.com
  "RtUsePG61cWLIct2NAHTunMyLx52", // alane@charlestownehotels.com
  "5GpiVNFuoJMIgY7yHuY421XfXfk2", // smaley@charlestownehotels.com
  "mvnlLEc3w5VafHxqbGsFbrKpErk1", // kdehaven@charlestownehotels.com
  "LpryX2KYn1fJMD1tqHYrjNef8tZ2", // ndonnell@charlestownehotels.com
  "YgGvmU25eZbNfByPhIwy8IZvRBK2"  // nknott@charlestownwhotels.com  
];

// --- SNT FILE MAPPING ---
const SNT_PROPERTY_MAP = {
  'sts': 'LTRL',    // STS requires file starting with LTRL
  'rcn': 'VERD',    // RCN requires file starting with VERD
  'cby': 'LCKWD',   // CBY requires file starting with LCKWD
  'bri': 'TBH',     // BRI requires file starting with TBH
  'dar': 'DARLING'  // DAR requires file starting with DARLING
};

// --- DOM ELEMENT REFERENCES ---
let loginContainer, appContainer, signinBtn, signoutBtn, emailInput, passwordInput, errorMessage, clearAnalyticsBtn;
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
const MASTER_INVENTORIES = {
  fqi: [
    { roomNumber: '103', code: 'TQ-QQ' }, { roomNumber: '203', code: 'TQ-QQ' }, { roomNumber: '207', code: 'TQ-QQ' },
    { roomNumber: '210', code: 'TQ-QQ' }, { roomNumber: '215', code: 'TQ-QQ' }, { roomNumber: '216', code: 'TQ-QQ' },
    { roomNumber: '217', code: 'TQ-QQ' }, { roomNumber: '314', code: 'TQ-QQ' }, { roomNumber: '315', code: 'TQ-QQ' },
    { roomNumber: '316', code: 'TQ-QQ' }, { roomNumber: '317', code: 'TQ-QQ' },
    { roomNumber: '206', code: 'TQHC-QQ' }, { roomNumber: '218', code: 'TQHC-QQ' },
    { roomNumber: '108', code: 'TK-K' }, { roomNumber: '208', code: 'TK-K' }, { roomNumber: '209', code: 'TK-K' },
    { roomNumber: '211', code: 'TK-K' }, { roomNumber: '221', code: 'TK-K' }, { roomNumber: '307', code: 'TK-K' },
    { roomNumber: '308', code: 'TK-K' }, { roomNumber: '309', code: 'TK-K' },
    { roomNumber: '102', code: 'DK-K' }, { roomNumber: '202', code: 'DK-K' }, { roomNumber: '204', code: 'DK-K' },
    { roomNumber: '205', code: 'DK-K' }, { roomNumber: '222', code: 'DK-K' }, { roomNumber: '302', code: 'DK-K' },
    { roomNumber: '303', code: 'DK-K' }, { roomNumber: '304', code: 'DK-K' }, { roomNumber: '305', code: 'DK-K' },
    { roomNumber: '306', code: 'DK-K' }, { roomNumber: '310', code: 'DK-K' },
    { roomNumber: '219', code: 'KJS-K/POC' }, { roomNumber: '318', code: 'KJS-K/POC' },
    { roomNumber: '105', code: 'QJS-QQ/POC' }, { roomNumber: '106', code: 'QJS-QQ/POC' }, { roomNumber: '107', code: 'QJS-QQ/POC' },
    { roomNumber: '301', code: 'CTK-K' }, { roomNumber: '320', code: 'CTK-K' },
    { roomNumber: '220', code: 'KBS-K/POC' }, { roomNumber: '319', code: 'KBS-K/POC' },
    { roomNumber: '312', code: 'PMVB-QQ' }, { roomNumber: '313', code: 'PMVB-QQ' },
    { roomNumber: '213', code: 'DMVT-QQ' }, { roomNumber: '214', code: 'DMVT-QQ' },
    { roomNumber: '104', code: 'GMVC-QQ' },
    { roomNumber: '101', code: 'LKBS-K/POC' }, { roomNumber: '201', code: 'LKBS-K/POC' },
    { roomNumber: '311', code: 'GMVB-QQ/POC' },
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
    { roomNumber: '211', code: 'Q' }, { roomNumber: '212', code: 'Q' }, { roomNumber: '213', code: 'Q' }, { roomNumber: '214', code: 'Q' }, { roomNumber: '215', code: 'Q' },
    { roomNumber: '305', code: 'Q' }, { roomNumber: '306', code: 'Q' }, { roomNumber: '307', code: 'Q' }, { roomNumber: '308', code: 'Q' }, { roomNumber: '309', code: 'Q' },
    { roomNumber: '310', code: 'Q' }, { roomNumber: '311', code: 'Q' }, { roomNumber: '312', code: 'Q' }, { roomNumber: '313', code: 'Q' }, { roomNumber: '314', code: 'Q' }, { roomNumber: '315', code: 'Q' },
    { roomNumber: '402', code: 'Q' }, { roomNumber: '403', code: 'Q' }, { roomNumber: '404', code: 'Q' }, { roomNumber: '405', code: 'Q' }, { roomNumber: '406', code: 'Q' },
    { roomNumber: '407', code: 'Q' }, { roomNumber: '408', code: 'Q' }, { roomNumber: '409', code: 'Q' }, { roomNumber: '410', code: 'Q' }, { roomNumber: '411', code: 'Q' }, { roomNumber: '412', code: 'Q' },
    { roomNumber: '101', code: 'RD' }, { roomNumber: '110', code: 'RD' }, { roomNumber: '205', code: 'RD' },
    { roomNumber: '206', code: 'RD' }, { roomNumber: '207', code: 'RD' }, { roomNumber: '208', code: 'RD' },
    { roomNumber: '209', code: 'RD' }, { roomNumber: '210', code: 'RD' },
    { roomNumber: '102', code: 'RDCY' }, { roomNumber: '103', code: 'RDCY' }, { roomNumber: '104', code: 'RDCY' },
    { roomNumber: '105', code: 'RDCY' }, { roomNumber: '106', code: 'RDCY' }, { roomNumber: '107', code: 'RDCY' },
    { roomNumber: '108', code: 'RDCY' }, { roomNumber: '109', code: 'RDCY' },
    { roomNumber: '204', code: 'DQ' }, { roomNumber: '216', code: 'DQ' },
    { roomNumber: '304', code: 'DD' }, { roomNumber: '316', code: 'DD' }, { roomNumber: '401', code: 'DD' }, { roomNumber: '413', code: 'DD' },
    { roomNumber: '201', code: 'HHK' }, { roomNumber: '202', code: 'HHK' }, { roomNumber: '203', code: 'HHK' },
    { roomNumber: '301', code: 'HHK' }, { roomNumber: '302', code: 'HHK' }, { roomNumber: '303', code: 'HHK' },
    { roomNumber: '111', code: 'TQACC' }
  ],
  indjh: [
    { roomNumber: 'J1', code: 'CHQ' }, { roomNumber: 'J2', code: 'CHQ' }, { roomNumber: 'J3', code: 'CHQ' }, { roomNumber: 'J4', code: 'CHQ' },
    { roomNumber: 'I101', code: 'DK' }, { roomNumber: 'I112', code: 'DK' }, { roomNumber: 'I201', code: 'DK' },
    { roomNumber: 'I212', code: 'DK' }, { roomNumber: 'I301', code: 'DK' }, { roomNumber: 'I312', code: 'DK' },
    { roomNumber: 'J101E', code: 'MHD-Q' }, { roomNumber: 'J101W', code: 'MHD-Q' },
    { roomNumber: 'J201E', code: 'MHD-Q' }, { roomNumber: 'J201W', code: 'MHD-Q' },
    { roomNumber: 'J3F', code: 'MHF-Q' },
    { roomNumber: 'J102NW', code: 'MHS-Q' }, { roomNumber: 'J202NW', code: 'MHS-Q' },
    { roomNumber: 'I104', code: 'QAV' }, { roomNumber: 'I106', code: 'QAV' }, { roomNumber: 'I107', code: 'QAV' },
    { roomNumber: 'I109', code: 'QAV' }, { roomNumber: 'I205', code: 'QAV' }, { roomNumber: 'I206', code: 'QAV' },
    { roomNumber: 'I207', code: 'QAV' }, { roomNumber: 'I306', code: 'QAV' }, { roomNumber: 'I307', code: 'QAV' },
    { roomNumber: 'I309', code: 'QAV' },
    { roomNumber: 'I1200', code: 'QNV' }, { roomNumber: 'I214', code: 'QNV' }, { roomNumber: 'I300', code: 'QNV' },
    { roomNumber: 'I314', code: 'QNV' },
    { roomNumber: 'I102', code: 'QQ' }, { roomNumber: 'I111', code: 'QQ' }, { roomNumber: 'I202', code: 'QQ' },
    { roomNumber: 'I211', code: 'QQ' }, { roomNumber: 'I302', code: 'QQ' }, { roomNumber: 'I311', code: 'QQ' },
    { roomNumber: 'I103', code: 'QQAV' }, { roomNumber: 'I105', code: 'QQAV' }, { roomNumber: 'I108', code: 'QQAV' },
    { roomNumber: 'I110', code: 'QQAV' }, { roomNumber: 'I203', code: 'QQAV' }, { roomNumber: 'I204', code: 'QQAV' },
    { roomNumber: 'I208', code: 'QQAV' }, { roomNumber: 'I209', code: 'QQAV' }, { roomNumber: 'I210', code: 'QQAV' },
    { roomNumber: 'I303', code: 'QQAV' }, { roomNumber: 'I304', code: 'QQAV' }, { roomNumber: 'I305', code: 'QQAV' },
    { roomNumber: 'I308', code: 'QQAV' }, { roomNumber: 'I310', code: 'QQAV' }
  ],
  sts: [
    { roomNumber: '215', code: 'PKR' },
    { roomNumber: '203', code: 'TKR' }, { roomNumber: '204', code: 'TKR' }, { roomNumber: '206', code: 'TKR' },
    { roomNumber: '207', code: 'TKR' }, { roomNumber: '208', code: 'TKR' }, { roomNumber: '209', code: 'TKR' },
    { roomNumber: '211', code: 'TKR' }, { roomNumber: '212', code: 'TKR' }, { roomNumber: '213', code: 'TKR' },
    { roomNumber: '214', code: 'TKR' }, { roomNumber: '303', code: 'TKR' }, { roomNumber: '304', code: 'TKR' },
    { roomNumber: '307', code: 'TKR' }, { roomNumber: '308', code: 'TKR' }, { roomNumber: '309', code: 'TKR' },
    { roomNumber: '311', code: 'TKR' }, { roomNumber: '312', code: 'TKR' }, { roomNumber: '314', code: 'TKR' },
    { roomNumber: '319', code: 'TKR' }, { roomNumber: '402', code: 'TKR' }, { roomNumber: '403', code: 'TKR' },
    { roomNumber: '406', code: 'TKR' }, { roomNumber: '407', code: 'TKR' },
    { roomNumber: '202', code: 'QQR' }, { roomNumber: '210', code: 'QQR' }, { roomNumber: '218', code: 'QQR' },
    { roomNumber: '220', code: 'QQR' }, { roomNumber: '302', code: 'QQR' }, { roomNumber: '306', code: 'QQR' },
    { roomNumber: '310', code: 'QQR' }, { roomNumber: '317', code: 'QQR' }, { roomNumber: '401', code: 'QQR' },
    { roomNumber: '405', code: 'QQR' }, { roomNumber: '408', code: 'QQR' },
    { roomNumber: '201', code: 'LKR' }, { roomNumber: '221', code: 'LKR' }, { roomNumber: '301', code: 'LKR' },
    { roomNumber: '316', code: 'LKR' },
    { roomNumber: '205', code: 'CKR' }, { roomNumber: '305', code: 'CKR' }, { roomNumber: '404', code: 'CKR' },
    { roomNumber: '217', code: 'KS' }, { roomNumber: '219', code: 'KS' }, { roomNumber: '313', code: 'KS' },
    { roomNumber: '315', code: 'KS' }, { roomNumber: '318', code: 'KS' },
    { roomNumber: '409', code: 'PKS' },
    { roomNumber: '216', code: 'AKR' },
    { roomNumber: '320', code: 'AQQ' }
  ],
  rcn: [
    { roomNumber: '429', code: 'KING' }, { roomNumber: '427', code: 'KING' }, { roomNumber: '426', code: 'KING' }, { roomNumber: '423', code: 'KING' }, { roomNumber: '422', code: 'KING' },
    { roomNumber: '419', code: 'KING' }, { roomNumber: '418', code: 'KING' }, { roomNumber: '417', code: 'KING' }, { roomNumber: '416', code: 'KING' }, { roomNumber: '403', code: 'KING' },
    { roomNumber: '402', code: 'KING' }, { roomNumber: '401', code: 'KING' }, { roomNumber: '330', code: 'KING' }, { roomNumber: '327', code: 'KING' }, { roomNumber: '326', code: 'KING' },
    { roomNumber: '323', code: 'KING' }, { roomNumber: '322', code: 'KING' }, { roomNumber: '320', code: 'KING' }, { roomNumber: '303', code: 'KING' }, { roomNumber: '302', code: 'KING' },
    { roomNumber: '301', code: 'KING' }, { roomNumber: '230', code: 'KING' }, { roomNumber: '229', code: 'KING' }, { roomNumber: '227', code: 'KING' }, { roomNumber: '226', code: 'KING' },
    { roomNumber: '223', code: 'KING' }, { roomNumber: '222', code: 'KING' }, { roomNumber: '219', code: 'KING' }, { roomNumber: '215', code: 'KING' }, { roomNumber: '214', code: 'KING' },
    { roomNumber: '212', code: 'KING' }, { roomNumber: '203', code: 'KING' }, { roomNumber: '202', code: 'KING' }, { roomNumber: '201', code: 'KING' },
    { roomNumber: '220', code: 'KINGADA' }, { roomNumber: '319', code: 'KINGADA' }, { roomNumber: '329', code: 'KINGADA' }, { roomNumber: '430', code: 'KINGADA' },
    { roomNumber: '205', code: 'DQUEEN' }, { roomNumber: '206', code: 'DQUEEN' }, { roomNumber: '207', code: 'DQUEEN' }, { roomNumber: '208', code: 'DQUEEN' }, { roomNumber: '209', code: 'DQUEEN' },
    { roomNumber: '210', code: 'DQUEEN' }, { roomNumber: '221', code: 'DQUEEN' }, { roomNumber: '224', code: 'DQUEEN' }, { roomNumber: '228', code: 'DQUEEN' }, { roomNumber: '305', code: 'DQUEEN' },
    { roomNumber: '306', code: 'DQUEEN' }, { roomNumber: '307', code: 'DQUEEN' }, { roomNumber: '308', code: 'DQUEEN' }, { roomNumber: '309', code: 'DQUEEN' }, { roomNumber: '310', code: 'DQUEEN' },
    { roomNumber: '321', code: 'DQUEEN' }, { roomNumber: '324', code: 'DQUEEN' }, { roomNumber: '325', code: 'DQUEEN' }, { roomNumber: '328', code: 'DQUEEN' }, { roomNumber: '405', code: 'DQUEEN' },
    { roomNumber: '406', code: 'DQUEEN' }, { roomNumber: '407', code: 'DQUEEN' }, { roomNumber: '408', code: 'DQUEEN' }, { roomNumber: '409', code: 'DQUEEN' }, { roomNumber: '410', code: 'DQUEEN' },
    { roomNumber: '424', code: 'DQUEEN' }, { roomNumber: '425', code: 'DQUEEN' }, { roomNumber: '428', code: 'DQUEEN' },
    { roomNumber: '225', code: 'ADADQ' },
    { roomNumber: '312', code: 'LVKING' }, { roomNumber: '314', code: 'LVKING' }, { roomNumber: '315', code: 'LVKING' },
    { roomNumber: '412', code: 'LVKING' }, { roomNumber: '414', code: 'LVKING' }, { roomNumber: '415', code: 'LVKING' },
    { roomNumber: '204', code: 'JRSTE' }, { roomNumber: '211', code: 'JRSTE' }, { roomNumber: '304', code: 'JRSTE' }, { roomNumber: '404', code: 'JRSTE' },
    { roomNumber: '311', code: 'LVJRSTE' }, { roomNumber: '411', code: 'LVJRSTE' },
    { roomNumber: '421', code: 'PRES' }
  ],
  cby: [
    { roomNumber: '205', code: 'KNR' }, { roomNumber: '207', code: 'KNR' }, { roomNumber: '209', code: 'KNR' }, { roomNumber: '214', code: 'KNR' }, { roomNumber: '216', code: 'KNR' },
    { roomNumber: '305', code: 'KNR' }, { roomNumber: '307', code: 'KNR' }, { roomNumber: '309', code: 'KNR' }, { roomNumber: '314', code: 'KNR' }, { roomNumber: '316', code: 'KNR' },
    { roomNumber: '405', code: 'KNR' }, { roomNumber: '407', code: 'KNR' }, { roomNumber: '409', code: 'KNR' }, { roomNumber: '411', code: 'KNR' }, { roomNumber: '414', code: 'KNR' }, { roomNumber: '416', code: 'KNR' },
    { roomNumber: '201', code: 'KND' }, { roomNumber: '202', code: 'KND' }, { roomNumber: '301', code: 'KND' }, { roomNumber: '302', code: 'KND' }, { roomNumber: '401', code: 'KND' }, { roomNumber: '402', code: 'KND' },
    { roomNumber: '203', code: 'QQNR' }, { roomNumber: '204', code: 'QQNR' }, { roomNumber: '206', code: 'QQNR' }, { roomNumber: '211', code: 'QQNR' }, { roomNumber: '215', code: 'QQNR' }, { roomNumber: '217', code: 'QQNR' }, { roomNumber: '219', code: 'QQNR' }, { roomNumber: '221', code: 'QQNR' },
    { roomNumber: '303', code: 'QQNR' }, { roomNumber: '304', code: 'QQNR' }, { roomNumber: '306', code: 'QQNR' }, { roomNumber: '311', code: 'QQNR' }, { roomNumber: '312', code: 'QQNR' }, { roomNumber: '315', code: 'QQNR' }, { roomNumber: '317', code: 'QQNR' }, { roomNumber: '319', code: 'QQNR' }, { roomNumber: '321', code: 'QQNR' },
    { roomNumber: '403', code: 'QQNR' }, { roomNumber: '404', code: 'QQNR' }, { roomNumber: '406', code: 'QQNR' }, { roomNumber: '412', code: 'QQNR' }, { roomNumber: '415', code: 'QQNR' }, { roomNumber: '417', code: 'QQNR' }, { roomNumber: '419', code: 'QQNR' }, { roomNumber: '421', code: 'QQNR' },
    { roomNumber: '213', code: 'KAR' }, { roomNumber: '313', code: 'KAR' },
    { roomNumber: '413', code: 'QQAR' },
    { roomNumber: '308', code: 'K1S' }, { roomNumber: '408', code: 'K1S' },
    { roomNumber: '208', code: 'K1AS' }
  ],
  bri: [
    { roomNumber: '210', code: 'PQNN' }, { roomNumber: '310', code: 'PQNN' }, { roomNumber: '409', code: 'PQNN' }, { roomNumber: '509', code: 'PQNN' }, { roomNumber: '609', code: 'PQNN' },
    { roomNumber: '209', code: 'PKNG' }, { roomNumber: '309', code: 'PKNG' }, { roomNumber: '408', code: 'PKNG' }, { roomNumber: '508', code: 'PKNG' }, { roomNumber: '608', code: 'PKNG' },
    { roomNumber: '205', code: 'STQQ' }, { roomNumber: '206', code: 'STQQ' }, { roomNumber: '211', code: 'STQQ' }, { roomNumber: '305', code: 'STQQ' }, { roomNumber: '306', code: 'STQQ' }, { roomNumber: '311', code: 'STQQ' },
    { roomNumber: '402', code: 'STQQ' }, { roomNumber: '404', code: 'STQQ' }, { roomNumber: '405', code: 'STQQ' }, { roomNumber: '410', code: 'STQQ' }, { roomNumber: '502', code: 'STQQ' }, { roomNumber: '505', code: 'STQQ' },
    { roomNumber: '510', code: 'STQQ' }, { roomNumber: '602', code: 'STQQ' }, { roomNumber: '604', code: 'STQQ' }, { roomNumber: '605', code: 'STQQ' }, { roomNumber: '610', code: 'STQQ' }, { roomNumber: '702', code: 'STQQ' },
    { roomNumber: '704', code: 'STQQ' }, { roomNumber: '705', code: 'STQQ' }, { roomNumber: '708', code: 'STQQ' },
    { roomNumber: '504', code: 'SQAC' },
    { roomNumber: '204', code: 'SKNG' }, { roomNumber: '208', code: 'SKNG' }, { roomNumber: '212', code: 'SKNG' }, { roomNumber: '301', code: 'SKNG' }, { roomNumber: '308', code: 'SKNG' }, { roomNumber: '312', code: 'SKNG' },
    { roomNumber: '401', code: 'SKNG' }, { roomNumber: '403', code: 'SKNG' }, { roomNumber: '406', code: 'SKNG' }, { roomNumber: '411', code: 'SKNG' }, { roomNumber: '501', code: 'SKNG' }, { roomNumber: '503', code: 'SKNG' },
    { roomNumber: '506', code: 'SKNG' }, { roomNumber: '511', code: 'SKNG' }, { roomNumber: '601', code: 'SKNG' }, { roomNumber: '603', code: 'SKNG' }, { roomNumber: '606', code: 'SKNG' }, { roomNumber: '611', code: 'SKNG' },
    { roomNumber: '701', code: 'SKNG' }, { roomNumber: '709', code: 'SKNG' },
    { roomNumber: '304', code: 'SKAC' }, { roomNumber: '703', code: 'SKAC' },
    { roomNumber: '207', code: 'HERT' }, { roomNumber: '307', code: 'HERT' }, { roomNumber: '407', code: 'HERT' }, { roomNumber: '507', code: 'HERT' }, { roomNumber: '607', code: 'HERT' }, { roomNumber: '706', code: 'HERT' },
    { roomNumber: '203', code: 'AMER' }, { roomNumber: '303', code: 'AMER' },
    { roomNumber: '202', code: 'LEST' },
    { roomNumber: '302', code: 'LEAC' },
    { roomNumber: '707', code: 'GPST' }
  ],
  dar: [
    { roomNumber: '101', code: 'RQR' }, { roomNumber: '102', code: 'RQR' }, { roomNumber: '103', code: 'RQR' }, { roomNumber: '104', code: 'RQR' },
    { roomNumber: '205', code: 'RKR' }, { roomNumber: '206', code: 'RKR' }, { roomNumber: '207', code: 'RKR' }, { roomNumber: '208', code: 'RKR' }, { roomNumber: '209', code: 'RKR' },
    { roomNumber: '210', code: 'RKR' }, { roomNumber: '213', code: 'RKR' }, { roomNumber: '314', code: 'RKR' }, { roomNumber: '315', code: 'RKR' }, { roomNumber: '316', code: 'RKR' },
    { roomNumber: '318', code: 'RKR' }, { roomNumber: '319', code: 'RKR' }, { roomNumber: '320', code: 'RKR' }, { roomNumber: '321', code: 'RKR' }, { roomNumber: '324', code: 'RKR' },
    { roomNumber: '425', code: 'RKR' }, { roomNumber: '432', code: 'RKR' },
    { roomNumber: '431', code: 'RQQ' },
    { roomNumber: '211', code: 'SKR' }, { roomNumber: '212', code: 'SKR' }, { roomNumber: '317', code: 'SKR' }, { roomNumber: '323', code: 'SKR' }, { roomNumber: '426', code: 'SKR' }, { roomNumber: '427', code: 'SKR' },
    { roomNumber: '322', code: 'AKS' }, { roomNumber: '428', code: 'AKS' },
    { roomNumber: '430', code: 'EXE' },
    { roomNumber: '429', code: 'DAR' }
  ],
  dpi: [
    { roomNumber: '325', code: 'PKING-K' }, { roomNumber: '328', code: 'PKING-K' },
    { roomNumber: '225', code: 'PQUEEN-Q' },
    { roomNumber: '101', code: 'NKING-K' }, { roomNumber: '102', code: 'NKING-K' }, { roomNumber: '103', code: 'NKING-K' }, { roomNumber: '105', code: 'NKING-K' }, { roomNumber: '201', code: 'NKING-K' },
    { roomNumber: '202', code: 'NKING-K' }, { roomNumber: '203', code: 'NKING-K' }, { roomNumber: '205', code: 'NKING-K' }, { roomNumber: '214', code: 'NKING-K' }, { roomNumber: '216', code: 'NKING-K' },
    { roomNumber: '218', code: 'NKING-K' }, { roomNumber: '220', code: 'NKING-K' }, { roomNumber: '228', code: 'NKING-K' }, { roomNumber: '232', code: 'NKING-K' }, { roomNumber: '234', code: 'NKING-K' },
    { roomNumber: '311', code: 'NKING-K' }, { roomNumber: '314', code: 'NKING-K' }, { roomNumber: '316', code: 'NKING-K' }, { roomNumber: '318', code: 'NKING-K' }, { roomNumber: '330', code: 'NKING-K' },
    { roomNumber: '332', code: 'NKING-K' }, { roomNumber: '334', code: 'NKING-K' }, { roomNumber: '336', code: 'NKING-K' },
    { roomNumber: '236', code: 'NKINGACC-K' },
    { roomNumber: '109', code: 'NQQ-QQ' }, { roomNumber: '111', code: 'NQQ-QQ' }, { roomNumber: '209', code: 'NQQ-QQ' }, { roomNumber: '211', code: 'NQQ-QQ' }, { roomNumber: '230', code: 'NQQ-QQ' },
    { roomNumber: '306', code: 'NQQ-QQ' }, { roomNumber: '323', code: 'NQQ-QQ' },
    { roomNumber: '213', code: 'RKINGACC-K' },
    { roomNumber: '104', code: 'RQQ-QQ' }, { roomNumber: '113', code: 'RQQ-QQ' }, { roomNumber: '204', code: 'RQQ-QQ' }, { roomNumber: '223', code: 'RQQ-QQ' }, { roomNumber: '310', code: 'RQQ-QQ' },
    { roomNumber: '313', code: 'RQQACC-QQ' },
    { roomNumber: '309', code: 'MHQQ-QQ' },
    { roomNumber: '337', code: 'MHQSTE-Q' },
    { roomNumber: '217', code: 'MHSTE-K' }, { roomNumber: '227', code: 'MHSTE-K' }, { roomNumber: '301', code: 'MHSTE-K' }, { roomNumber: '302', code: 'MHSTE-K' }, { roomNumber: '317', code: 'MHSTE-K' },
    { roomNumber: '108', code: 'MHSTEKIT-K' }, { roomNumber: '208', code: 'MHSTEKIT-K' },
    { roomNumber: '215', code: 'RSTE-K' }, { roomNumber: '221', code: 'RSTE-K' }, { roomNumber: '315', code: 'RSTE-K' }, { roomNumber: '321', code: 'RSTE-K' }, { roomNumber: '327', code: 'RSTE-K' },
    { roomNumber: '241', code: 'BUCKSTE-K' },
    { roomNumber: '239', code: 'CORNSTE-K' }
  ],
  asu: [
    { roomNumber: '101', code: '1K-K/SB' }, { roomNumber: '102', code: '1K-K/SB' }, { roomNumber: '201', code: '1K-K/SB' }, { roomNumber: '202', code: '1K-K/SB' }, { roomNumber: '209', code: '1K-K/SB' }, { roomNumber: '210', code: '1K-K/SB' },
    { roomNumber: '109', code: '1KF-K' }, { roomNumber: '110', code: '1KF-K' },
    { roomNumber: '119', code: '1KH-K' }, { roomNumber: '219', code: '1KH-K' },
    { roomNumber: '127', code: '1KJ-K' },
    { roomNumber: '105', code: '1QQ-QQ' }, { roomNumber: '106', code: '1QQ-QQ' }, { roomNumber: '107', code: '1QQ-QQ' }, { roomNumber: '108', code: '1QQ-QQ' }, { roomNumber: '111', code: '1QQ-QQ' }, { roomNumber: '112', code: '1QQ-QQ' },
    { roomNumber: '115', code: '1QQ-QQ' }, { roomNumber: '116', code: '1QQ-QQ' }, { roomNumber: '117', code: '1QQ-QQ' }, { roomNumber: '118', code: '1QQ-QQ' }, { roomNumber: '121', code: '1QQ-QQ' }, { roomNumber: '122', code: '1QQ-QQ' },
    { roomNumber: '123', code: '1QQ-QQ' }, { roomNumber: '124', code: '1QQ-QQ' }, { roomNumber: '205', code: '1QQ-QQ' }, { roomNumber: '206', code: '1QQ-QQ' }, { roomNumber: '208', code: '1QQ-QQ' }, { roomNumber: '211', code: '1QQ-QQ' },
    { roomNumber: '212', code: '1QQ-QQ' }, { roomNumber: '213', code: '1QQ-QQ' }, { roomNumber: '214', code: '1QQ-QQ' }, { roomNumber: '215', code: '1QQ-QQ' }, { roomNumber: '216', code: '1QQ-QQ' }, { roomNumber: '217', code: '1QQ-QQ' },
    { roomNumber: '218', code: '1QQ-QQ' }, { roomNumber: '221', code: '1QQ-QQ' }, { roomNumber: '223', code: '1QQ-QQ' }, { roomNumber: '224', code: '1QQ-QQ' },
    { roomNumber: '113', code: '1QQD-QQ' }, { roomNumber: '114', code: '1QQD-QQ' },
    { roomNumber: '207', code: '1QQF-QQ' }, { roomNumber: '222', code: '1QQF-QQ' },
    { roomNumber: '120', code: '1QQH-Q' }, { roomNumber: '220', code: '1QQH-Q' },
    { roomNumber: '103', code: '2KQQ-K/QQ' }, { roomNumber: '104', code: '2KQQ-K/QQ' }, { roomNumber: '125', code: '2KQQ-K/QQ' }, { roomNumber: '126', code: '2KQQ-K/QQ' }, { roomNumber: '203', code: '2KQQ-K/QQ' }, { roomNumber: '204', code: '2KQQ-K/QQ' },
    { roomNumber: '225', code: '2KQQ-K/QQ' }, { roomNumber: '226', code: '2KQQ-K/QQ' }
  ],
  ehi: [
    { roomNumber: '11', code: 'TRADQUEEN-Q' }, { roomNumber: '21', code: 'TRADQUEEN-Q' },
    { roomNumber: '10', code: 'TRADKING-K' }, { roomNumber: '31', code: 'TRADKING-K' }, { roomNumber: '32', code: 'TRADKING-K' },
    { roomNumber: '12', code: 'QNN-Q' }, { roomNumber: '14', code: 'QNN-Q' }, { roomNumber: '23', code: 'QNN-Q' }, { roomNumber: '25', code: 'QNN-Q' }, { roomNumber: '33', code: 'QNN-Q' }, { roomNumber: '34', code: 'QNN-Q' },
    { roomNumber: '15', code: 'KNN-K' }, { roomNumber: '16', code: 'KNN-K' }, { roomNumber: '17', code: 'KNN-K' }, { roomNumber: '18', code: 'KNN-K' }, { roomNumber: '19', code: 'KNN-K' },
    { roomNumber: '20', code: 'KNN-K' }, { roomNumber: '22', code: 'KNN-K' }, { roomNumber: '24', code: 'KNN-K' }, { roomNumber: '26', code: 'KNN-K' }, { roomNumber: '27', code: 'KNN-K' },
    { roomNumber: '28', code: 'KNN-K' }, { roomNumber: '29', code: 'KNN-K' }, { roomNumber: '30', code: 'KNN-K' }, { roomNumber: '35', code: 'KNN-K' }, { roomNumber: '36', code: 'KNN-K' }
  ],
  palms: [
    { roomNumber: '112', code: 'TRAK-K' }, { roomNumber: '120', code: 'TRAK-K' }, { roomNumber: '205', code: 'TRAK-K' }, { roomNumber: '212', code: 'TRAK-K' }, { roomNumber: '220', code: 'TRAK-K' }, { roomNumber: '305', code: 'TRAK-K' }, { roomNumber: '312', code: 'TRAK-K' }, { roomNumber: '320', code: 'TRAK-K' },
    { roomNumber: '114', code: 'TRAQQ-QQ' }, { roomNumber: '116', code: 'TRAQQ-QQ' }, { roomNumber: '118', code: 'TRAQQ-QQ' }, { roomNumber: '122', code: 'TRAQQ-QQ' }, { roomNumber: '203', code: 'TRAQQ-QQ' }, { roomNumber: '207', code: 'TRAQQ-QQ' }, { roomNumber: '209', code: 'TRAQQ-QQ' }, { roomNumber: '214', code: 'TRAQQ-QQ' }, { roomNumber: '216', code: 'TRAQQ-QQ' }, { roomNumber: '218', code: 'TRAQQ-QQ' }, { roomNumber: '222', code: 'TRAQQ-QQ' }, { roomNumber: '303', code: 'TRAQQ-QQ' }, { roomNumber: '307', code: 'TRAQQ-QQ' }, { roomNumber: '309', code: 'TRAQQ-QQ' }, { roomNumber: '314', code: 'TRAQQ-QQ' }, { roomNumber: '316', code: 'TRAQQ-QQ' }, { roomNumber: '318', code: 'TRAQQ-QQ' }, { roomNumber: '322', code: 'TRAQQ-QQ' },
    { roomNumber: '109', code: 'TRAKH-K' },
    { roomNumber: '111', code: 'CBREEQQ-QQ' }, { roomNumber: '113', code: 'CBREEQQ-QQ' }, { roomNumber: '115', code: 'CBREEQQ-QQ' },
    { roomNumber: '117', code: 'COASK-K' }, { roomNumber: '119', code: 'COASK-K' }, { roomNumber: '121', code: 'COASK-K' }, { roomNumber: '217', code: 'COASK-K' }, { roomNumber: '219', code: 'COASK-K' }, { roomNumber: '221', code: 'COASK-K' }, { roomNumber: '317', code: 'COASK-K' }, { roomNumber: '319', code: 'COASK-K' }, { roomNumber: '321', code: 'COASK-K' },
    { roomNumber: '123', code: 'COASQQ-QQ' }, { roomNumber: '211', code: 'COASQQ-QQ' }, { roomNumber: '213', code: 'COASQQ-QQ' }, { roomNumber: '215', code: 'COASQQ-QQ' }, { roomNumber: '223', code: 'COASQQ-QQ' }, { roomNumber: '311', code: 'COASQQ-QQ' }, { roomNumber: '313', code: 'COASQQ-QQ' }, { roomNumber: '315', code: 'COASQQ-QQ' }, { roomNumber: '323', code: 'COASQQ-QQ' },
    { roomNumber: '201', code: 'ISLAND-K' }, { roomNumber: '301', code: 'ISLAND-K' },
    { roomNumber: '124', code: 'OFKN-K' }, { roomNumber: '126', code: 'OFKN-K' }, { roomNumber: '129', code: 'OFKN-K' }, { roomNumber: '224', code: 'OFKN-K' }, { roomNumber: '226', code: 'OFKN-K' }, { roomNumber: '229', code: 'OFKN-K' }, { roomNumber: '324', code: 'OFKN-K' }, { roomNumber: '326', code: 'OFKN-K' }, { roomNumber: '329', code: 'OFKN-K' },
    { roomNumber: '125', code: 'OFQQ-QQ' }, { roomNumber: '127', code: 'OFQQ-QQ' }, { roomNumber: '128', code: 'OFQQ-QQ' }, { roomNumber: '225', code: 'OFQQ-QQ' }, { roomNumber: '227', code: 'OFQQ-QQ' }, { roomNumber: '228', code: 'OFQQ-QQ' }, { roomNumber: '325', code: 'OFQQ-QQ' }, { roomNumber: '327', code: 'OFQQ-QQ' }, { roomNumber: '328', code: 'OFQQ-QQ' }
  ],
  csh: [
    { roomNumber: '201', code: 'SQ' }, { roomNumber: '210', code: 'SQ' }, { roomNumber: '211', code: 'SQ' }, { roomNumber: '221', code: 'SQ' }, { roomNumber: '222', code: 'SQ' },
    { roomNumber: '301', code: 'SQ' }, { roomNumber: '310', code: 'SQ' }, { roomNumber: '311', code: 'SQ' }, { roomNumber: '321', code: 'SQ' }, { roomNumber: '322', code: 'SQ' },
    { roomNumber: '401', code: 'SQ' }, { roomNumber: '410', code: 'SQ' }, { roomNumber: '411', code: 'SQ' }, { roomNumber: '418', code: 'SQ' }, { roomNumber: '421', code: 'SQ' }, { roomNumber: '422', code: 'SQ' },
    { roomNumber: '226', code: 'QQ' }, { roomNumber: '326', code: 'QQ' }, { roomNumber: '426', code: 'QQ' },
    { roomNumber: '204', code: 'DS' }, { roomNumber: '206', code: 'DS' }, { roomNumber: '208', code: 'DS' }, { roomNumber: '216', code: 'DS' }, { roomNumber: '218', code: 'DS' }, { roomNumber: '220', code: 'DS' },
    { roomNumber: '304', code: 'DS' }, { roomNumber: '306', code: 'DS' }, { roomNumber: '308', code: 'DS' }, { roomNumber: '316', code: 'DS' }, { roomNumber: '318', code: 'DS' }, { roomNumber: '320', code: 'DS' },
    { roomNumber: '404', code: 'DS' }, { roomNumber: '406', code: 'DS' }, { roomNumber: '408', code: 'DS' }, { roomNumber: '420', code: 'DS' },
    { roomNumber: '202', code: 'KS' }, { roomNumber: '214', code: 'KS' }, { roomNumber: '224', code: 'KS' },
    { roomNumber: '302', code: 'KS' }, { roomNumber: '314', code: 'KS' }, { roomNumber: '324', code: 'KS' },
    { roomNumber: '402', code: 'KS' }, { roomNumber: '414', code: 'KS' }, { roomNumber: '424', code: 'KS' },
    { roomNumber: '416', code: 'EX' }
  ],
  cgt: [
    { roomNumber: '15', code: 'PDBL-D' }, { roomNumber: '35', code: 'PDBL-D' },
    { roomNumber: '02', code: 'QUEEN-Q' }, { roomNumber: '05', code: 'QUEEN-Q' }, { roomNumber: '09', code: 'QUEEN-Q' }, { roomNumber: '10', code: 'QUEEN-Q' }, { roomNumber: '11', code: 'QUEEN-Q' }, { roomNumber: '12', code: 'QUEEN-Q' },
    { roomNumber: '25', code: 'QUEEN-Q' }, { roomNumber: '29', code: 'QUEEN-Q' }, { roomNumber: '30', code: 'QUEEN-Q' }, { roomNumber: '31', code: 'QUEEN-Q' }, { roomNumber: '32', code: 'QUEEN-Q' },
    { roomNumber: '07', code: 'QUEENADA-Q' }, { roomNumber: '27', code: 'QUEENADA-Q' },
    { roomNumber: '01', code: 'KING-K' }, { roomNumber: '03', code: 'KING-K' }, { roomNumber: '06', code: 'KING-K' }, { roomNumber: '08', code: 'KING-K' }, { roomNumber: '14', code: 'KING-K' },
    { roomNumber: '17', code: 'KING-K' }, { roomNumber: '23', code: 'KING-K' }, { roomNumber: '26', code: 'KING-K' }, { roomNumber: '34', code: 'KING-K' }, { roomNumber: '37', code: 'KING-K' },
    { roomNumber: '16', code: 'EKING-K' }, { roomNumber: '21', code: 'EKING-K' }, { roomNumber: '22', code: 'EKING-K' }, { roomNumber: '36', code: 'EKING-K' },
    { roomNumber: '28', code: 'QNQN-QQ' },
    { roomNumber: '19', code: 'KSTE-K' }, { roomNumber: '39', code: 'KSTE-K' },
    { roomNumber: '13', code: 'KSTWN-K/T' }, { roomNumber: '33', code: 'KSTWN-K/T' },
    { roomNumber: '20', code: 'KSTSB-K/POC' }, { roomNumber: '40', code: 'KSTSB-K/POC' },
    { roomNumber: '04', code: 'KSS-K' }, { roomNumber: '18', code: 'KSS-K' }, { roomNumber: '24', code: 'KSS-K' }, { roomNumber: '38', code: 'KSS-K' }
  ],
  gsl: [
    { roomNumber: '194', code: 'SQHC' }, { roomNumber: '195', code: 'SQHC' }, { roomNumber: '196', code: 'SQHC' }, { roomNumber: '197', code: 'SQHC' },
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
    { roomNumber: '138', code: 'K11-E' }, { roomNumber: '165', code: 'K11-E' }, { roomNumber: '166', code: 'K11-E' }, { roomNumber: '238', code: 'K11-E' }, { roomNumber: '265', code: 'K11-E' }, { roomNumber: '266', code: 'K11-E' },
    { roomNumber: '338', code: 'K11-E' }, { roomNumber: '365', code: 'K11-E' }, { roomNumber: '366', code: 'K11-E' },
    { roomNumber: '139', code: 'DD20-P' }, { roomNumber: '141', code: 'DD20-P' }, { roomNumber: '143', code: 'DD20-P' }, { roomNumber: '145', code: 'DD20-P' }, { roomNumber: '147', code: 'DD20-P' }, { roomNumber: '149', code: 'DD20-P' },
    { roomNumber: '151', code: 'DD20-P' }, { roomNumber: '153', code: 'DD20-P' }, { roomNumber: '239', code: 'DD20-P' }, { roomNumber: '241', code: 'DD20-P' }, { roomNumber: '243', code: 'DD20-P' }, { roomNumber: '245', code: 'DD20-P' },
    { roomNumber: '247', code: 'DD20-P' }, { roomNumber: '249', code: 'DD20-P' }, { roomNumber: '251', code: 'DD20-P' }, { roomNumber: '253', code: 'DD20-P' }, { roomNumber: '339', code: 'DD20-P' }, { roomNumber: '341', code: 'DD20-P' },
    { roomNumber: '343', code: 'DD20-P' }, { roomNumber: '345', code: 'DD20-P' }, { roomNumber: '347', code: 'DD20-P' }, { roomNumber: '349', code: 'DD20-P' }, { roomNumber: '351', code: 'DD20-P' }, { roomNumber: '353', code: 'DD20-P' },
    { roomNumber: '137', code: 'K12-P' }, { roomNumber: '237', code: 'K12-P' }, { roomNumber: '337', code: 'K12-P' },
    { roomNumber: '102', code: 'QQ2-I' }, { roomNumber: '104', code: 'QQ2-I' }, { roomNumber: '106', code: 'QQ2-I' }, { roomNumber: '108', code: 'QQ2-I' }, { roomNumber: '201', code: 'QQ2-I' }, { roomNumber: '203', code: 'QQ2-I' },
    { roomNumber: '209', code: 'QQ2-I' }, { roomNumber: '223', code: 'QQ2-I' }, { roomNumber: '225', code: 'QQ2-I' }, { roomNumber: '227', code: 'QQ2-I' }, { roomNumber: '229', code: 'QQ2-I' }, { roomNumber: '301', code: 'QQ2-I' },
    { roomNumber: '303', code: 'QQ2-I' }, { roomNumber: '309', code: 'QQ2-I' }, { roomNumber: '311', code: 'QQ2-I' }, { roomNumber: '313', code: 'QQ2-I' }, { roomNumber: '315', code: 'QQ2-I' }, { roomNumber: '317', code: 'QQ2-I' },
    { roomNumber: '319', code: 'QQ2-I' }, { roomNumber: '321', code: 'QQ2-I' }, { roomNumber: '323', code: 'QQ2-I' }, { roomNumber: '325', code: 'QQ2-I' }, { roomNumber: '327', code: 'QQ2-I' }, { roomNumber: '329', code: 'QQ2-I' },
    { roomNumber: '401', code: 'QQ2-I' }, { roomNumber: '403', code: 'QQ2-I' }, { roomNumber: '409', code: 'QQ2-I' }, { roomNumber: '411', code: 'QQ2-I' }, { roomNumber: '413', code: 'QQ2-I' }, { roomNumber: '415', code: 'QQ2-I' },
    { roomNumber: '417', code: 'QQ2-I' }, { roomNumber: '419', code: 'QQ2-I' }, { roomNumber: '421', code: 'QQ2-I' }, { roomNumber: '423', code: 'QQ2-I' }, { roomNumber: '425', code: 'QQ2-I' }, { roomNumber: '427', code: 'QQ2-I' },
    { roomNumber: '429', code: 'QQ2-I' }, { roomNumber: '513', code: 'QQ2-I' }, { roomNumber: '515', code: 'QQ2-I' }, { roomNumber: '521', code: 'QQ2-I' }, { roomNumber: '523', code: 'QQ2-I' },
    { roomNumber: '200', code: 'DD2-B' }, { roomNumber: '202', code: 'DD2-B' }, { roomNumber: '204', code: 'DD2-B' }, { roomNumber: '206', code: 'DD2-B' }, { roomNumber: '208', code: 'DD2-B' }, { roomNumber: '210', code: 'DD2-B' },
    { roomNumber: '212', code: 'DD2-B' }, { roomNumber: '222', code: 'DD2-B' }, { roomNumber: '224', code: 'DD2-B' }, { roomNumber: '226', code: 'DD2-B' }, { roomNumber: '228', code: 'DD2-B' }, { roomNumber: '230', code: 'DD2-B' },
    { roomNumber: '232', code: 'DD2-B' }, { roomNumber: '234', code: 'DD2-B' }, { roomNumber: '236', code: 'DD2-B' }, { roomNumber: '300', code: 'DD2-B' }, { roomNumber: '302', code: 'DD2-B' }, { roomNumber: '304', code: 'DD2-B' },
    { roomNumber: '306', code: 'DD2-B' }, { roomNumber: '308', code: 'DD2-B' }, { roomNumber: '310', code: 'DD2-B' }, { roomNumber: '312', code: 'DD2-B' }, { roomNumber: '322', code: 'DD2-B' }, { roomNumber: '324', code: 'DD2-B' },
    { roomNumber: '326', code: 'DD2-B' }, { roomNumber: '328', code: 'DD2-B' }, { roomNumber: '330', code: 'DD2-B' }, { roomNumber: '332', code: 'DD2-B' }, { roomNumber: '334', code: 'DD2-B' }, { roomNumber: '336', code: 'DD2-B' },
    { roomNumber: '400', code: 'DD2-B' }, { roomNumber: '402', code: 'DD2-B' }, { roomNumber: '404', code: 'DD2-B' }, { roomNumber: '406', code: 'DD2-B' }, { roomNumber: '408', code: 'DD2-B' }, { roomNumber: '410', code: 'DD2-B' },
    { roomNumber: '412', code: 'DD2-B' }, { roomNumber: '422', code: 'DD2-B' }, { roomNumber: '424', code: 'DD2-B' }, { roomNumber: '426', code: 'DD2-B' }, { roomNumber: '428', code: 'DD2-B' }, { roomNumber: '430', code: 'DD2-B' },
    { roomNumber: '432', code: 'DD2-B' }, { roomNumber: '434', code: 'DD2-B' }, { roomNumber: '436', code: 'DD2-B' }, { roomNumber: '504', code: 'DD2-B' }, { roomNumber: '506', code: 'DD2-B' }, { roomNumber: '512', code: 'DD2-B' },
    { roomNumber: '522', code: 'DD2-B' }, { roomNumber: '528', code: 'DD2-B' }, { roomNumber: '530', code: 'DD2-B' },
    { roomNumber: '501', code: 'K13-F' }, { roomNumber: '503', code: 'K13-F' }, { roomNumber: '509', code: 'K13-F' }, { roomNumber: '511', code: 'K13-F' }, { roomNumber: '517', code: 'K13-F' }, { roomNumber: '519', code: 'K13-F' },
    { roomNumber: '525', code: 'K13-F' }, { roomNumber: '527', code: 'K13-F' }, { roomNumber: '529', code: 'K13-F' },
    { roomNumber: '500', code: 'K1-B' }, { roomNumber: '502', code: 'K1-B' }, { roomNumber: '508', code: 'K1-B' }, { roomNumber: '510', code: 'K1-B' }, { roomNumber: '524', code: 'K1-B' }, { roomNumber: '526', code: 'K1-B' },
    { roomNumber: '532', code: 'K1-B' }, { roomNumber: '534', code: 'K1-B' }, { roomNumber: '536', code: 'K1-B' },
    { roomNumber: '207', code: 'K3' }, { roomNumber: '307', code: 'K3' }, { roomNumber: '407', code: 'K3' }, { roomNumber: '507', code: 'K3' },
    { roomNumber: '235', code: 'SQQ4' }, { roomNumber: '335', code: 'SQQ4' }, { roomNumber: '435', code: 'SQQ4' }
  ],
  one: [
    { roomNumber: '234', code: 'CORNSTE-K' },
    { roomNumber: '102', code: 'DBDBADA-DD' }, { roomNumber: '104', code: 'DBDBADA-DD' }, { roomNumber: '128', code: 'DBDBADA-DD' }, { roomNumber: '129', code: 'DBDBADA-DD' },
    { roomNumber: '109', code: 'KING-K' }, { roomNumber: '110', code: 'KING-K' }, { roomNumber: '137', code: 'KING-K' }, { roomNumber: '203', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' },
    { roomNumber: '213', code: 'KING-K' }, { roomNumber: '214', code: 'KING-K' }, { roomNumber: '230', code: 'KING-K' }, { roomNumber: '237', code: 'KING-K' }, { roomNumber: '245', code: 'KING-K' },
    { roomNumber: '103', code: 'KINGADA-K' },
    { roomNumber: '106', code: 'KKING-K' }, { roomNumber: '111', code: 'KKING-K' }, { roomNumber: '122', code: 'KKING-K' }, { roomNumber: '207', code: 'KKING-K' }, { roomNumber: '224', code: 'KKING-K' },
    { roomNumber: '232', code: 'KSTE-K' },
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
    { roomNumber: '101', code: 'QNQNADA-QQ' },
    { roomNumber: '136', code: 'QQNQN-QQ' }, { roomNumber: '209', code: 'QQNQN-QQ' }, { roomNumber: '210', code: 'QQNQN-QQ' }, { roomNumber: '212', code: 'QQNQN-QQ' }, { roomNumber: '244', code: 'QQNQN-QQ' }, { roomNumber: '246', code: 'QQNQN-QQ' }
  ],
  ich: [
    { roomNumber: '112', code: 'ACCESS-K' }, { roomNumber: '114', code: 'ACCESS-K' },
    { roomNumber: '202', code: 'DOUBLE-QQ' }, { roomNumber: '203', code: 'DOUBLE-QQ' }, { roomNumber: '212', code: 'DOUBLE-QQ' }, { roomNumber: '225', code: 'DOUBLE-QQ' }, { roomNumber: '301', code: 'DOUBLE-QQ' }, { roomNumber: '309', code: 'DOUBLE-QQ' }, { roomNumber: '315', code: 'DOUBLE-QQ' }, { roomNumber: '317', code: 'DOUBLE-QQ' },
    { roomNumber: '221', code: 'EURO-D' }, { roomNumber: '312', code: 'EURO-D' },
    { roomNumber: '217', code: 'JUNIOR-K' },
    { roomNumber: '204', code: 'KINGSB-K' }, { roomNumber: '205', code: 'KINGSB-K' }, { roomNumber: '215', code: 'KINGSB-K' }, { roomNumber: '216', code: 'KINGSB-K' }, { roomNumber: '223', code: 'KINGSB-K' }, { roomNumber: '224', code: 'KINGSB-K' }, { roomNumber: '226', code: 'KINGSB-K' }, { roomNumber: '302', code: 'KINGSB-K' }, { roomNumber: '303', code: 'KINGSB-K' }, { roomNumber: '304', code: 'KINGSB-K' }, { roomNumber: '310', code: 'KINGSB-K' }, { roomNumber: '311', code: 'KINGSB-K' }, { roomNumber: '316', code: 'KINGSB-K' },
    { roomNumber: '218', code: 'SENIOR-K' },
    { roomNumber: '101', code: 'STAND-K' }, { roomNumber: '102', code: 'STAND-K' }, { roomNumber: '103', code: 'STAND-K' }, { roomNumber: '104', code: 'STAND-K' }, { roomNumber: '105', code: 'STAND-K' }, { roomNumber: '106', code: 'STAND-K' }, { roomNumber: '201', code: 'STAND-K' }, { roomNumber: '206', code: 'STAND-K' }, { roomNumber: '207', code: 'STAND-K' }, { roomNumber: '208', code: 'STAND-K' }, { roomNumber: '209', code: 'STAND-K' }, { roomNumber: '210', code: 'STAND-K' }, { roomNumber: '211', code: 'STAND-K' }, { roomNumber: '214', code: 'STAND-K' }, { roomNumber: '219', code: 'STAND-K' }, { roomNumber: '220', code: 'STAND-K' }, { roomNumber: '222', code: 'STAND-K' }, { roomNumber: '305', code: 'STAND-K' }, { roomNumber: '306', code: 'STAND-K' }, { roomNumber: '307', code: 'STAND-K' }, { roomNumber: '308', code: 'STAND-K' }, { roomNumber: '314', code: 'STAND-K' }
  ],
  maj: [
    { roomNumber: '401', code: 'EX' },
    { roomNumber: '102', code: 'KS' }, { roomNumber: '120', code: 'KS' }, { roomNumber: '202', code: 'KS' }, { roomNumber: '220', code: 'KS' }, { roomNumber: '302', code: 'KS' }, { roomNumber: '320', code: 'KS' },
    { roomNumber: '403', code: 'QQ' },
    { roomNumber: '104', code: 'QS' }, { roomNumber: '106', code: 'QS' }, { roomNumber: '118', code: 'QS' }, { roomNumber: '204', code: 'QS' }, { roomNumber: '206', code: 'QS' }, { roomNumber: '218', code: 'QS' }, { roomNumber: '304', code: 'QS' }, { roomNumber: '306', code: 'QS' }, { roomNumber: '318', code: 'QS' }, { roomNumber: '402', code: 'QS' },
    { roomNumber: '108', code: 'SQ' }, { roomNumber: '109', code: 'SQ' }, { roomNumber: '110', code: 'SQ' }, { roomNumber: '111', code: 'SQ' }, { roomNumber: '112', code: 'SQ' }, { roomNumber: '114', code: 'SQ' }, { roomNumber: '115', code: 'SQ' }, { roomNumber: '116', code: 'SQ' }, { roomNumber: '117', code: 'SQ' },
    { roomNumber: '208', code: 'SQ' }, { roomNumber: '209', code: 'SQ' }, { roomNumber: '210', code: 'SQ' }, { roomNumber: '211', code: 'SQ' }, { roomNumber: '212', code: 'SQ' }, { roomNumber: '214', code: 'SQ' }, { roomNumber: '215', code: 'SQ' }, { roomNumber: '216', code: 'SQ' }, { roomNumber: '217', code: 'SQ' },
    { roomNumber: '308', code: 'SQ' }, { roomNumber: '309', code: 'SQ' }, { roomNumber: '310', code: 'SQ' }, { roomNumber: '311', code: 'SQ' }, { roomNumber: '312', code: 'SQ' }, { roomNumber: '314', code: 'SQ' }, { roomNumber: '315', code: 'SQ' }, { roomNumber: '316', code: 'SQ' }, { roomNumber: '317', code: 'SQ' },
    { roomNumber: '404', code: 'SQ' },
    { roomNumber: '101', code: 'SS' }, { roomNumber: '122', code: 'SS' }, { roomNumber: '201', code: 'SS' }, { roomNumber: '222', code: 'SS' }, { roomNumber: '301', code: 'SS' }, { roomNumber: '322', code: 'SS' }
  ],
  mcs: [
    { roomNumber: '119', code: 'ADAKING' }, { roomNumber: '219', code: 'ADAKING' }, { roomNumber: '319', code: 'ADAKING' },
    { roomNumber: '200', code: 'EXEC' }, { roomNumber: '222', code: 'EXEC' },
    { roomNumber: '104', code: 'KING' }, { roomNumber: '105', code: 'KING' }, { roomNumber: '106', code: 'KING' }, { roomNumber: '107', code: 'KING' }, { roomNumber: '108', code: 'KING' }, { roomNumber: '109', code: 'KING' },
    { roomNumber: '111', code: 'KING' }, { roomNumber: '121', code: 'KING' }, { roomNumber: '123', code: 'KING' }, { roomNumber: '125', code: 'KING' }, { roomNumber: '204', code: 'KING' }, { roomNumber: '205', code: 'KING' },
    { roomNumber: '206', code: 'KING' }, { roomNumber: '207', code: 'KING' }, { roomNumber: '208', code: 'KING' }, { roomNumber: '209', code: 'KING' }, { roomNumber: '210', code: 'KING' }, { roomNumber: '211', code: 'KING' },
    { roomNumber: '221', code: 'KING' }, { roomNumber: '223', code: 'KING' }, { roomNumber: '224', code: 'KING' }, { roomNumber: '225', code: 'KING' }, { roomNumber: '226', code: 'KING' }, { roomNumber: '304', code: 'KING' },
    { roomNumber: '305', code: 'KING' }, { roomNumber: '306', code: 'KING' }, { roomNumber: '307', code: 'KING' }, { roomNumber: '308', code: 'KING' }, { roomNumber: '309', code: 'KING' }, { roomNumber: '310', code: 'KING' },
    { roomNumber: '311', code: 'KING' }, { roomNumber: '321', code: 'KING' }, { roomNumber: '322', code: 'KING' }, { roomNumber: '323', code: 'KING' }, { roomNumber: '324', code: 'KING' }, { roomNumber: '325', code: 'KING' },
    { roomNumber: '326', code: 'KING' },
    { roomNumber: '215', code: 'KSUITE' }, { roomNumber: '314', code: 'KSUITE' }, { roomNumber: '315', code: 'KSUITE' },
    { roomNumber: '100', code: 'QQ' }, { roomNumber: '101', code: 'QQ' }, { roomNumber: '102', code: 'QQ' }, { roomNumber: '103', code: 'QQ' }, { roomNumber: '113', code: 'QQ' }, { roomNumber: '127', code: 'QQ' },
    { roomNumber: '128', code: 'QQ' }, { roomNumber: '129', code: 'QQ' }, { roomNumber: '130', code: 'QQ' }, { roomNumber: '201', code: 'QQ' }, { roomNumber: '202', code: 'QQ' }, { roomNumber: '203', code: 'QQ' },
    { roomNumber: '212', code: 'QQ' }, { roomNumber: '213', code: 'QQ' }, { roomNumber: '217', code: 'QQ' }, { roomNumber: '227', code: 'QQ' }, { roomNumber: '228', code: 'QQ' }, { roomNumber: '229', code: 'QQ' },
    { roomNumber: '230', code: 'QQ' }, { roomNumber: '300', code: 'QQ' }, { roomNumber: '301', code: 'QQ' }, { roomNumber: '302', code: 'QQ' }, { roomNumber: '303', code: 'QQ' }, { roomNumber: '312', code: 'QQ' },
    { roomNumber: '313', code: 'QQ' }, { roomNumber: '316', code: 'QQ' }, { roomNumber: '317', code: 'QQ' }, { roomNumber: '327', code: 'QQ' }, { roomNumber: '328', code: 'QQ' }, { roomNumber: '329', code: 'QQ' },
    { roomNumber: '330', code: 'QQ' }
  ],
  sea: [
    { roomNumber: '213', code: 'DKING-K' }, { roomNumber: '215', code: 'DKING-K' }, { roomNumber: '305', code: 'DKING-K' }, { roomNumber: '311', code: 'DKING-K' }, { roomNumber: '313', code: 'DKING-K' },
    { roomNumber: '114', code: 'DQQ-QQ' }, { roomNumber: '115', code: 'DQQ-QQ' }, { roomNumber: '212', code: 'DQQ-QQ' }, { roomNumber: '214', code: 'DQQ-QQ' }, { roomNumber: '314', code: 'DQQ-QQ' }, { roomNumber: '315', code: 'DQQ-QQ' },
    { roomNumber: '105', code: 'KING-K' }, { roomNumber: '107', code: 'KING-K' }, { roomNumber: '109', code: 'KING-K' }, { roomNumber: '111', code: 'KING-K' }, { roomNumber: '202', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' },
    { roomNumber: '205', code: 'KING-K' }, { roomNumber: '207', code: 'KING-K' }, { roomNumber: '209', code: 'KING-K' }, { roomNumber: '211', code: 'KING-K' }, { roomNumber: '306', code: 'KING-K' }, { roomNumber: '307', code: 'KING-K' },
    { roomNumber: '309', code: 'KING-K' },
    { roomNumber: '116', code: 'KINGOF-K' }, { roomNumber: '117', code: 'KINGOF-K' }, { roomNumber: '216', code: 'KINGOF-K' }, { roomNumber: '217', code: 'KINGOF-K' }, { roomNumber: '316', code: 'KINGOF-K' }, { roomNumber: '317', code: 'KINGOF-K' },
    { roomNumber: '201', code: 'Q-Q' }, { roomNumber: '301', code: 'Q-Q' },
    { roomNumber: '101', code: 'QADA-Q' },
    { roomNumber: '102', code: 'QQ-QQ' }, { roomNumber: '103', code: 'QQ-QQ' }, { roomNumber: '104', code: 'QQ-QQ' }, { roomNumber: '106', code: 'QQ-QQ' }, { roomNumber: '108', code: 'QQ-QQ' }, { roomNumber: '110', code: 'QQ-QQ' },
    { roomNumber: '112', code: 'QQ-QQ' }, { roomNumber: '113', code: 'QQ-QQ' }, { roomNumber: '203', code: 'QQ-QQ' }, { roomNumber: '206', code: 'QQ-QQ' }, { roomNumber: '208', code: 'QQ-QQ' }, { roomNumber: '210', code: 'QQ-QQ' },
    { roomNumber: '302', code: 'QQ-QQ' }, { roomNumber: '303', code: 'QQ-QQ' }, { roomNumber: '304', code: 'QQ-QQ' }, { roomNumber: '308', code: 'QQ-QQ' }, { roomNumber: '310', code: 'QQ-QQ' }, { roomNumber: '312', code: 'QQ-QQ' }
  ],
  sci: [
    { roomNumber: '222', code: '2QCrk' }, { roomNumber: '122', code: '2QCrk' }, { roomNumber: '206', code: '2QCrk' }, { roomNumber: '116', code: '2QCrk' }, { roomNumber: '210', code: '2QCrk' },
    { roomNumber: '110', code: '2QCrk' }, { roomNumber: '118', code: '2QCrk' }, { roomNumber: '106', code: '2QCrk' }, { roomNumber: '114', code: '2QCrk' }, { roomNumber: '208', code: '2QCrk' },
    { roomNumber: '104', code: '2QCrk' }, { roomNumber: '102', code: '2QCrk' }, { roomNumber: '220', code: '2QCrk' }, { roomNumber: '204', code: '2QCrk' },
    { roomNumber: '225', code: '2QCrk ADA' }, { roomNumber: '226', code: '2QCrk ADA' },
    { roomNumber: '109', code: '2QMRSH' }, { roomNumber: '209', code: '2QMRSH' }, { roomNumber: '115', code: '2QMRSH' }, { roomNumber: '101', code: '2QMRSH' }, { roomNumber: '105', code: '2QMRSH' },
    { roomNumber: '215', code: '2QMRSH' }, { roomNumber: '217', code: '2QMRSH' }, { roomNumber: '121', code: '2QMRSH' }, { roomNumber: '201', code: '2QMRSH' }, { roomNumber: '117', code: '2QMRSH' },
    { roomNumber: '205', code: '2QMRSH' }, { roomNumber: '113', code: '2QMRSH' }, { roomNumber: '221', code: '2QMRSH' }, { roomNumber: '103', code: '2QMRSH' },
    { roomNumber: '212', code: 'DKCrk' }, { roomNumber: '112', code: 'DKCrk' }, { roomNumber: '124', code: 'DKCrk' }, { roomNumber: '224', code: 'DKCrk' },
    { roomNumber: '123', code: 'DKMrsh-K' },
    { roomNumber: '227', code: 'JRSTE-K/POC' },
    { roomNumber: '214', code: 'KCrk' }, { roomNumber: '216', code: 'KCrk' }, { roomNumber: '218', code: 'KCrk' }, { roomNumber: '108', code: 'KCrk' }, { roomNumber: '120', code: 'KCrk' },
    { roomNumber: '202', code: 'KCrk' },
    { roomNumber: '203', code: 'KMrsh' }, { roomNumber: '207', code: 'KMrsh' }, { roomNumber: '213', code: 'KMrsh' }, { roomNumber: '119', code: 'KMrsh' }, { roomNumber: '107', code: 'KMrsh' },
    { roomNumber: '219', code: 'KMrsh' }, { roomNumber: '111', code: 'KMrsh' }, { roomNumber: '223', code: 'KMrsh' }, { roomNumber: '211', code: 'KMrsh' }
  ],
  soh: [
    { roomNumber: '204', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '206', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '208', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '210', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '212', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '223', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '225', code: '1-2Q-NB-Stan-QQ' }, { roomNumber: '227', code: '1-2Q-NB-Stan-QQ' },
    { roomNumber: '314', code: '10-King-OV-B-K' }, { roomNumber: '414', code: '10-King-OV-B-K' }, { roomNumber: '504', code: '10-King-OV-B-K' }, { roomNumber: '508', code: '10-King-OV-B-K' }, { roomNumber: '514', code: '10-King-OV-B-K' }, { roomNumber: '604', code: '10-King-OV-B-K' }, { roomNumber: '606', code: '10-King-OV-B-K' }, { roomNumber: '608', code: '10-King-OV-B-K' }, { roomNumber: '614', code: '10-King-OV-B-K' },
    { roomNumber: '704', code: '10-King-OV-B-K' }, { roomNumber: '706', code: '10-King-OV-B-K' }, { roomNumber: '708', code: '10-King-OV-B-K' }, { roomNumber: '714', code: '10-King-OV-B-K' }, { roomNumber: '804', code: '10-King-OV-B-K' }, { roomNumber: '808', code: '10-King-OV-B-K' }, { roomNumber: '814', code: '10-King-OV-B-K' },
    { roomNumber: '201', code: '11-KingSuite-K/SOFA' },
    { roomNumber: '214', code: '3-King-NB-K' },
    { roomNumber: '323', code: '4-ADAQueenRS-Q' }, { roomNumber: '327', code: '4-ADAQueenRS-Q' },
    { roomNumber: '423', code: '5-ADAQueen-Q' }, { roomNumber: '423', code: '5-ADAQueen-Q' }, { roomNumber: '523', code: '5-ADAQueen-Q' }, { roomNumber: '527', code: '5-ADAQueen-Q' }, { roomNumber: '623', code: '5-ADAQueen-Q' }, { roomNumber: '627', code: '5-ADAQueen-Q' },
    { roomNumber: '301', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '303', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '305', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '307', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '309', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '311', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '313', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '315', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '321', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '325', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '401', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '403', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '405', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '407', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '409', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '411', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '413', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '415', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '421', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '425', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '501', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '503', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '505', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '507', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '509', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '511', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '513', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '515', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '521', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '525', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '601', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '603', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '605', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '607', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '609', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '611', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '613', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '615', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '621', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '625', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '701', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '703', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '705', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '707', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '709', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '711', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '713', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '715', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '721', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '725', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '801', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '803', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '805', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '809', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '811', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '813', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '815', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '821', code: '6-2Q-PV-Bal-QQ' }, { roomNumber: '825', code: '6-2Q-PV-Bal-QQ' },
    { roomNumber: '304', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '306', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '308', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '310', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '312', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '316', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '322', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '324', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '326', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '404', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '406', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '408', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '410', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '412', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '416', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '422', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '424', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '426', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '506', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '510', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '512', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '516', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '522', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '524', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '526', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '610', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '612', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '616', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '622', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '624', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '626', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '710', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '712', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '716', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '722', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '724', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '726', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '806', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '810', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '812', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '816', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '822', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '824', code: '7-2Q-PV-Bal-QQ' }, { roomNumber: '826', code: '7-2Q-PV-Bal-QQ' },
    { roomNumber: '317', code: '8-JrSuite-QQ' }, { roomNumber: '318', code: '8-JrSuite-QQ' }, { roomNumber: '319', code: '8-JrSuite-QQ' },
    { roomNumber: '417', code: '8-JrSuite-QQ' }, { roomNumber: '418', code: '8-JrSuite-QQ' }, { roomNumber: '419', code: '8-JrSuite-QQ' },
    { roomNumber: '517', code: '8-JrSuite-QQ' }, { roomNumber: '518', code: '8-JrSuite-QQ' }, { roomNumber: '519', code: '8-JrSuite-QQ' },
    { roomNumber: '617', code: '8-JrSuite-QQ' }, { roomNumber: '618', code: '8-JrSuite-QQ' }, { roomNumber: '619', code: '8-JrSuite-QQ' },
    { roomNumber: '717', code: '8-JrSuite-QQ' }, { roomNumber: '718', code: '8-JrSuite-QQ' }, { roomNumber: '719', code: '8-JrSuite-QQ' },
    { roomNumber: '817', code: '8-JrSuite-QQ' }, { roomNumber: '818', code: '8-JrSuite-QQ' }, { roomNumber: '819', code: '8-JrSuite-QQ' },
    { roomNumber: '723', code: '9-King-PV-Bal-K' }, { roomNumber: '727', code: '9-King-PV-Bal-K' }, { roomNumber: '807', code: '9-King-PV-Bal-K' }, { roomNumber: '823', code: '9-King-PV-Bal-K' }, { roomNumber: '827', code: '9-King-PV-Bal-K' }
  ],
  abr: [
    { roomNumber: '103', code: 'KING-K' }, { roomNumber: '202', code: 'KING-K' }, { roomNumber: '203', code: 'KING-K' }, { roomNumber: '204', code: 'KING-K' }, { roomNumber: '205', code: 'KING-K' }, { roomNumber: '206', code: 'KING-K' }, { roomNumber: '207', code: 'KING-K' }, { roomNumber: '208', code: 'KING-K' }, { roomNumber: '209', code: 'KING-K' },
    { roomNumber: '302', code: 'KING-K' }, { roomNumber: '303', code: 'KING-K' }, { roomNumber: '304', code: 'KING-K' }, { roomNumber: '305', code: 'KING-K' }, { roomNumber: '306', code: 'KING-K' }, { roomNumber: '307', code: 'KING-K' }, { roomNumber: '308', code: 'KING-K' }, { roomNumber: '309', code: 'KING-K' },
    { roomNumber: '402', code: 'KING-K' }, { roomNumber: '403', code: 'KING-K' }, { roomNumber: '404', code: 'KING-K' }, { roomNumber: '405', code: 'KING-K' }, { roomNumber: '406', code: 'KING-K' }, { roomNumber: '407', code: 'KING-K' }, { roomNumber: '408', code: 'KING-K' }, { roomNumber: '409', code: 'KING-K' }, { roomNumber: '410', code: 'KING-K' }, { roomNumber: '411', code: 'KING-K' }, { roomNumber: '412', code: 'KING-K' },
    { roomNumber: '101', code: 'KINGADA-K' }, { roomNumber: '102', code: 'KINGADA-K' },
    { roomNumber: '104', code: 'KINGFULL' }, { roomNumber: '105', code: 'KINGFULL' }, { roomNumber: '210', code: 'KINGFULL' }, { roomNumber: '211', code: 'KINGFULL' }, { roomNumber: '212', code: 'KINGFULL' },
    { roomNumber: '310', code: 'KINGFULL' }, { roomNumber: '311', code: 'KINGFULL' }, { roomNumber: '312', code: 'KINGFULL' },
    { roomNumber: '201', code: 'PREMIUM-K' }, { roomNumber: '301', code: 'PREMIUM-K' },
    { roomNumber: '401', code: 'DABO-K' }
  ]
};

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
let savedLeadTimes = {}; 

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
  if (acceptedContainer) acceptedContainer.style.display = 'block';

  const leadTimeContainer = document.getElementById('lead-time-container');
  if (leadTimeContainer) leadTimeContainer.innerHTML = '';

  displayAcceptedUpgrades();
}

// Synchronous wrapper to prevent STS load freeze
function handleRefresh() {
  if (!currentCsvContent) return;

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

  // Fetch lead times then run logic
  fetchSavedLeadTimes(currentRules.profile).then(() => {
    setTimeout(() => {
      try {
        if (acceptedUpgrades.length > 0) {
          const results = applyUpgradesAndRecalculate(acceptedUpgrades, currentCsvContent, currentRules, currentFileName);
          displayMatrixOnlyView(results);
        } else {
          const results = processUpgradeData(currentCsvContent, currentRules, currentFileName);
          displayResults(results);
        }
        displayLeadTimeAnalytics(); 
        renderManualUpgradeView();
      } catch (err) {
        console.error("Refresh error:", err);
        showLoader(false);
      }
    }, 50);
  });
}

function updateRulesForm(profileName) {
  const profile = profiles[profileName];
  if (!profile) return;
  document.getElementById('hierarchy').value = profile.hierarchy;
  document.getElementById('target-rooms').value = profile.targetRooms;
  document.getElementById('prioritized-rates').value = profile.prioritizedRates;
  document.getElementById('ota-rates').value = profile.otaRates;
  document.getElementById('ineligible-upgrades').value = profile.ineligibleUpgrades;
  
  // Background fetch to avoid blocking the UI thread
  fetchSavedLeadTimes(profileName);
  populateOooDropdown();
}

// --- CORE PARSING & LOGIC ---

function parseAllReservations(data, header, fileName, rules) {
  const isSnt = fileName && (fileName.startsWith('SNT') || fileName.startsWith('LTRL') || fileName.startsWith('VERD') || fileName.startsWith('LCKWD') || fileName.startsWith('TBH') || fileName.startsWith('DARLING'));
  let nameIndex, resIdIndex, roomTypeIndex, rateNameIndex, arrivalIndex, departureIndex, statusIndex, rateIndex, bookDateIndex = -1;
  let firstNameIndex, lastNameIndex, marketCodeIndex, vipIndex, dnmIndex, groupNameIndex = -1;

  if (isSnt) {
    firstNameIndex = header.indexOf('First Name'); lastNameIndex = header.indexOf('Last Name');
    resIdIndex = header.indexOf('Reservation Id'); roomTypeIndex = header.indexOf('Arrival Room Type');
    rateNameIndex = header.indexOf('Arrival Rate Code'); 
    groupNameIndex = header.indexOf('Group Name');
    arrivalIndex = header.indexOf('Arrival Date');
    departureIndex = header.indexOf('Departure Date'); statusIndex = header.indexOf('Reservation Status');
    rateIndex = header.indexOf('Adr'); marketCodeIndex = header.indexOf('Market Code');
    vipIndex = header.indexOf('Vip'); if (vipIndex === -1) vipIndex = header.indexOf('VIPDescription');
    dnmIndex = header.indexOf('Do Not Move');
    const bookDateCandidates = ['Book Date', 'Booked Date', 'Creation Date', 'Create Date', 'Entered On'];
    bookDateIndex = header.findIndex(h => bookDateCandidates.includes(h));
  } else {
    nameIndex = header.indexOf('Guest Name'); resIdIndex = header.indexOf('Res ID');
    roomTypeIndex = header.indexOf('Room Type'); rateNameIndex = header.indexOf('Rate Name');
    arrivalIndex = header.indexOf('Arrival Date'); departureIndex = header.indexOf('Departure Date');
    statusIndex = header.indexOf('Status'); rateIndex = header.indexOf('Rate');
    vipIndex = header.indexOf('VIPDescription');
    const bookDateCandidates = ['Book Date', 'Booked Date', 'Booked On', 'Creation Date', 'Create Date', 'Entered On'];
    bookDateIndex = header.findIndex(h => bookDateCandidates.includes(h));
  }

  return data.map(values => {
    if (values.length < header.length) return null;
    const arrival = values[arrivalIndex] ? parseDate(values[arrivalIndex]) : null;
    const departure = values[departureIndex] ? parseDate(values[departureIndex]) : null;
    const roomType = values[roomTypeIndex]?.trim().toUpperCase();
    
    let leadTime = savedLeadTimes[roomType]?.avgLeadTime || 0;
    if (!leadTime) {
      const bookDate = (bookDateIndex > -1 && values[bookDateIndex]) ? parseDate(values[bookDateIndex]) : null;
      if (arrival instanceof Date && !isNaN(arrival) && bookDate instanceof Date && !isNaN(bookDate)) {
          const timeDiff = arrival.getTime() - bookDate.getTime();
          leadTime = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
    }

    let nights = 0; if (arrival && departure) nights = Math.max(1, Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)));
    const dailyRate = parseFloat(values[rateIndex]) || 0;
    let fullName = isSnt ? `${values[firstNameIndex] || ''} ${values[lastNameIndex] || ''}`.trim() : values[nameIndex];
    let status = values[statusIndex] ? values[statusIndex].trim().toUpperCase() : '';
    if (isSnt && status === 'RESERVED') status = 'RESERVATION';
    
    // STS Fallback: Rate Code -> Group Name
    let finalRate = values[rateNameIndex]?.trim();
    if (!finalRate && isSnt && groupNameIndex > -1) finalRate = values[groupNameIndex]?.trim();

    return { name: fullName, resId: values[resIdIndex]?.trim(), roomType, rate: finalRate, nights, arrival, departure, status, revenue: (dailyRate * nights).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), vipStatus: (vipIndex > -1) ? values[vipIndex] : '', leadTime };
  }).filter(r => r && r.roomType && r.arrival && r.departure && r.nights > 0);
}

function generateScenariosFromData(allReservations, rules) {
  const masterInventory = getMasterInventory(rules.profile);
  const activeReservations = allReservations.filter(res => !['CANCELED', 'CANCELLED', 'NO SHOW'].includes(res.status));
  const completedResIds = new Set(completedUpgrades.filter(up => up.profile === rules.profile).map(up => up.resId));
  const startDate = parseDate(rules.selectedDate);
  const reservationsByDate = buildReservationsByDate(activeReservations);
  const todayInventory = getInventoryForDate(masterInventory, reservationsByDate, startDate);
  const matrixData = generateMatrixData(masterInventory, reservationsByDate, startDate, rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean));
  
  // Strategy: Optimized as Default
  const strategies = ['Optimized', 'Guest Focus', 'VIP Focus'];
  const scenarios = {};
  strategies.forEach(strategy => { scenarios[strategy] = runSimulation(strategy, activeReservations, masterInventory, rules, completedResIds); });
  return { scenarios, inventory: todayInventory, matrixData };
}

function runSimulation(strategy, allReservations, masterInv, rules, completedIds) {
  const startDate = parseDate(rules.selectedDate);
  const hierarchy = rules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
  const ineligible = rules.ineligibleUpgrades.toUpperCase().split(',');
  const otaRates = rules.otaRates.toLowerCase().split(',').map(r => r.trim()).filter(Boolean);

  const simInventory = {};
  for (let i = 0; i < 14; i++) {
    const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i);
    const dStr = d.toISOString().split('T')[0];
    simInventory[dStr] = {};
    for (let room in masterInv) {
      const existingCount = allReservations.reduce((acc, res) => { if (res.roomType === room && res.arrival <= d && res.departure > d) return acc + 1; return acc; }, 0);
      simInventory[dStr][room] = (masterInv[room] || 0) - existingCount;
    }
  }

  const guestState = {};
  allReservations.forEach(r => guestState[r.resId] = r.roomType);
  const pendingUpgrades = {};

  for (let pass = 0; pass < 20; pass++) {
    let activity = false; let candidates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i);
      const dTime = d.getTime();
      const dailyArrivals = allReservations.filter(r => r.arrival && r.arrival.getTime() === dTime && r.status === 'RESERVATION');
      
      dailyArrivals.forEach(res => {
        if (completedIds.has(res.resId)) return;
        if (otaRates.some(ota => res.rate && res.rate.toLowerCase().includes(ota))) return;
        
        const currentRoom = guestState[res.resId];
        const currentIdx = hierarchy.indexOf(currentRoom);
        if (currentIdx === -1) return;
        const originalBed = getBedType(res.roomType);
        if (originalBed === 'OTHER') return;

        for (let u = currentIdx + 1; u < hierarchy.length; u++) {
          const targetRoom = hierarchy[u];
          if (ineligible.includes(targetRoom) || getBedType(targetRoom) !== originalBed) continue;
          candidates.push({ resObj: res, currentRoom, targetRoom, score: parseFloat(res.revenue.replace(/[$,]/g, '')) || 0, rank: u });
        }
      });
    }

    if (strategy === 'Guest Focus') candidates.sort((a, b) => b.score - a.score);
    else if (strategy === 'VIP Focus') candidates.sort((a, b) => (b.resObj.vipStatus ? 1 : 0) - (a.resObj.vipStatus ? 1 : 0));
    else candidates.sort((a, b) => a.resObj.nights - b.resObj.nights); // Optimized default

    candidates.forEach(cand => {
      let canMove = true; let checkDate = new Date(cand.resObj.arrival);
      while (checkDate < cand.resObj.departure) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (!simInventory[dStr] || (simInventory[dStr][cand.targetRoom] || 0) <= 0) { canMove = false; break; }
        checkDate.setUTCDate(checkDate.getUTCDate() + 1);
      }
      if (canMove) {
        activity = true;
        let updateDate = new Date(cand.resObj.arrival);
        while (updateDate < cand.resObj.departure) {
          const dStr = updateDate.toISOString().split('T')[0];
          simInventory[dStr][cand.targetRoom]--;
          simInventory[dStr][cand.currentRoom]++;
          updateDate.setUTCDate(updateDate.getUTCDate() + 1);
        }
        guestState[cand.resObj.resId] = cand.targetRoom;
        pendingUpgrades[cand.resObj.resId] = { ...cand.resObj, upgradeTo: cand.targetRoom, score: cand.score, isoArrival: cand.resObj.arrival.toISOString().split('T')[0], isoDeparture: cand.resObj.departure.toISOString().split('T')[0] };
      }
    });
    if (!activity) break;
  }
  return Object.values(pendingUpgrades);
}

// --- OVERLAY MATRIX GENERATOR ---

function generateMatrixHTML(title, rows, headers, colTotals) {
  const styleTable = 'width:100%; border-collapse:collapse; font-size:13px; min-width:100%;';
  const styleTh = 'padding:12px 8px; background-color:#f8f9fa; color:#495057; font-weight:600; border-bottom:2px solid #e9ecef; text-align:center;';
  const styleTd = 'padding:10px 8px; border-bottom:1px solid #e9ecef; text-align:center; color:#333;';
  
  let html = `<div style="background:white; border-radius:8px; border:1px solid #eee; overflow:hidden; margin-bottom:20px;">
      <div style="padding:15px; border-bottom:1px solid #eee; font-weight:bold; color:#4343FF;">${title}</div>
      <div style="overflow-x:auto;"><table style="${styleTable}">
      <thead><tr>${headers.map(h => `<th style="${styleTh}">${h}</th>`).join('')}</tr></thead><tbody>`;

  rows.forEach(row => {
    html += `<tr><td style="padding:10px; text-align:left; font-weight:bold; border-bottom:1px solid #e9ecef; background:#fff; position:sticky; left:0;">${row.roomCode}</td>`;
    row.data.forEach((avail, idx) => {
      const delta = row.deltas && row.deltas[idx] ? row.deltas[idx] : 0;
      const content = delta !== 0 ? 
        `<span style="color:#999;">${avail}</span> <b class="delta-anim" style="color:${delta > 0 ? '#10B981' : '#EF4444'}">${delta > 0 ? '+' : ''}${delta}</b>` : 
        avail;
      html += `<td style="${styleTd}">${content}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div></div>';
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
  btn.onclick = () => handleAcceptScenario(name);
  head.appendChild(btn);
  wrapper.appendChild(head);

  const startDate = parseDate(currentRules.selectedDate);
  const hierarchy = currentRules.hierarchy.toUpperCase().split(',').map(r => r.trim()).filter(Boolean);
  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(startDate); d.setUTCDate(d.getUTCDate() + i); return d; });
  const headers = ['Room Type', ...dates.map(date => `${date.getUTCMonth() + 1}/${date.getUTCDate()}`)];

  const matrixRows = [];
  hierarchy.forEach(roomCode => {
    const row = { roomCode, data: [], deltas: new Array(14).fill(0) };
    dates.forEach((date, i) => {
      const dStr = date.toISOString().split('T')[0];
      let baseAvail = currentInventoryMap?.[dStr]?.[roomCode] || 0;
      
      recs.forEach(up => {
        if (dStr >= up.isoArrival && dStr < up.isoDeparture) {
          if (up.roomType === roomCode) row.deltas[i]++;
          if (up.upgradeTo === roomCode) row.deltas[i]--;
        }
      });
      row.data.push(baseAvail);
    });
    matrixRows.push(row);
  });

  const matrixContainer = document.createElement('div');
  matrixContainer.innerHTML = generateMatrixHTML("Current Base Availability with Scenario Overlay (+/-)", matrixRows, headers, []);
  wrapper.appendChild(matrixContainer);
  parent.appendChild(wrapper);
}

// --- MANUAL & LEAD TIME ---

async function fetchSavedLeadTimes(profile) {
  try {
    const doc = await db.collection('property_analytics').doc(profile).get();
    savedLeadTimes = doc.exists ? (doc.data().leadTimeStats || {}) : {};
  } catch (e) { console.error("LT Fetch fail", e); }
}

function getBedType(roomCode) { 
  if (!roomCode) return 'OTHER'; 
  const code = roomCode.toUpperCase();
  if (['PKR', 'TKR', 'LKR', 'CKR', 'AKR', 'KS', 'PKS', 'KING'].some(c => code.includes(c))) return 'K'; 
  if (['QQR', 'AQQ', 'STQQ', 'PQNN', 'DQUEEN', 'ADADQ', 'QUEEN'].some(c => code.includes(c))) return 'QQ'; 
  return 'OTHER'; 
}

function renderManualUpgradeView() {
  const container = document.getElementById('manual-upgrade-list-container');
  if (!container || !currentAllReservations.length) return;
  
  const startStr = document.getElementById('selected-date').value;
  const startDate = parseDate(startStr);
  const acceptedIds = new Set(acceptedUpgrades.map(u => u.resId));
  const otaRates = currentRules.otaRates.toLowerCase().split(',').map(r => r.trim()).filter(Boolean);

  const candidates = currentAllReservations.filter(res => {
    const diff = Math.floor((res.arrival.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const isRateIneligible = otaRates.some(ota => res.rate && res.rate.toLowerCase().includes(ota));
    return diff >= 0 && diff < 7 && !acceptedIds.has(res.resId) && !isRateIneligible && res.status === 'RESERVATION';
  });

  if (!candidates.length) {
    container.innerHTML = '<p style="text-align:center; padding:20px;">No eligible guests found after filtering.</p>';
    return;
  }

  let html = `<table style="width:100%; border-collapse:collapse; background:white; font-size:14px;">
    <thead style="background:#f8f9fa;"><tr><th>Guest & Rate</th><th>Arrival</th><th>Current</th><th>Option</th><th>Action</th></tr></thead><tbody>`;

  candidates.forEach((guest, index) => {
    const guestBed = getBedType(guest.roomType);
    const hierarchy = currentRules.hierarchy.toUpperCase().split(',').map(r => r.trim());
    const currentIdx = hierarchy.indexOf(guest.roomType);
    let options = '';

    if (currentIdx !== -1) {
      hierarchy.slice(currentIdx + 1).forEach(target => {
        if (getBedType(target) === guestBed) options += `<option value="${target}">${target}</option>`;
      });
    }

    if (options) {
      html += `<tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px;"><strong>${guest.name}</strong><br><small style="color:#d63384;">${guest.rate || 'BAR'}</small></td>
        <td style="padding:10px;">${guest.arrival.getUTCMonth()+1}/${guest.arrival.getUTCDate()}</td>
        <td style="padding:10px;">${guest.roomType}</td>
        <td style="padding:10px;"><select id="manual-select-${index}">${options}</select></td>
        <td style="padding:10px;"><button onclick="executeManualUpgrade('${guest.resId}', ${index})" class="pms-btn">Upgrade</button></td>
      </tr>`;
    }
  });

  container.innerHTML = html + '</tbody></table>';
}

function executeManualUpgrade(resId, index) {
    const dropdown = document.getElementById(`manual-select-${index}`);
    const res = currentAllReservations.find(r => r.resId === resId);
    if (dropdown && res) {
      acceptedUpgrades.push({ ...res, upgradeTo: dropdown.value, score: parseFloat(res.revenue.replace(/[$,]/g, '')) || 0, isoArrival: res.arrival.toISOString().split('T')[0], isoDeparture: res.departure.toISOString().split('T')[0] });
      handleRefresh();
    }
}



