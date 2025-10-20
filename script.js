// --- STATE MANAGEMENT ---
let currentCsvContent = null;
let currentRules = null;
let currentRecommendations = [];
let acceptedUpgrades = [];
let completedUpgrades = [];

// --- DOM READY ---
// --- DOM READY ---
document.addEventListener('DOMContentLoaded', function() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3); // Add 3 days to the current date
    document.getElementById('selected-date').value = futureDate.toISOString().slice(0, 10);
    // ... rest of the code
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


// --- EVENT HANDLERS ---
function handleGenerateClick() {
    const fileInput = document.getElementById('csv-file');
    if (fileInput.files.length === 0) {
        alert('Please upload a CSV file.');
        return;
    }

    // Reset state for new generation
    acceptedUpgrades = [];
    completedUpgrades = [];
    displayAcceptedUpgrades();
    displayCompletedUpgrades();
    
    // Clear old dates from the completed dropdown
    const dropdown = document.getElementById('sort-date-dropdown');
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }


    const rules = {
        hierarchy: document.getElementById('hierarchy').value,
        targetRooms: document.getElementById('target-rooms').value,
        prioritizedRates: document.getElementById('prioritized-rates').value,
        otaRates: document.getElementById('ota-rates').value,
        ineligibleUpgrades: document.getElementById('ineligible-upgrades').value,
        selectedDate: document.getElementById('selected-date').value
    };
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCsvContent = e.target.result;
        currentRules = rules;
        showLoader(true, 'Generating...');
        // Use a timeout to allow the UI to update before the heavy processing starts
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
    
    // Use a timeout to allow the UI to update before recalculating
    setTimeout(() => {
        try {
            const results = acceptUpgradeAndRecalculate(acceptedRec, acceptedUpgrades, currentCsvContent, currentRules);
            displayResults(results);
        } catch (err) {
            showError(err);
            // Re-enable the button if an error occurs
            card.style.opacity = '1';
            button.disabled = false;
            button.textContent = 'Accept';
        }
    }, 50);
}

function handlePmsUpdateClick(event) {
    // Find the index of the upgrade to move, based on the button clicked
    const recIndex = event.target.dataset.index;
    const resIdToComplete = acceptedUpgrades[recIndex].resId;
    const itemIndex = acceptedUpgrades.findIndex(item => item.resId === resIdToComplete);

    if (itemIndex > -1) {
        // Remove the item from acceptedUpgrades and add it to completedUpgrades
        const upgradeToComplete = acceptedUpgrades.splice(itemIndex, 1)[0];
        upgradeToComplete.completedTimestamp = new Date();
        completedUpgrades.push(upgradeToComplete);
        
        // Refresh both the 'Accepted' and 'Analytics' tabs
        displayAcceptedUpgrades();
        displayCompletedUpgrades();
    }
}


// --- UI DISPLAY FUNCTIONS ---
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
            card.innerHTML = `
                <div class="rec-info">
                    <h3>${rec.name} (${rec.resId})</h3>
                    <div class="rec-details">
                        Original: <b>${rec.room}</b> | Upgraded To: <strong>${rec.upgradeTo}</strong><br>
                        Value of Reservation: <strong>${rec.revenue}</strong>
                    </div>
                </div>
                <div class="rec-actions">
                    <button class="pms-btn" data-index="${index}">Mark as PMS Updated</button>
                </div>
            `;
            container.appendChild(card);
        });
        totalHeader.textContent = `Total Value of Accepted Upgrades: ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
        container.querySelectorAll('.pms-btn').forEach(btn => {
            btn.addEventListener('click', handlePmsUpdateClick);
        });
    } else {
        container.innerHTML = '<p>No upgrades have been accepted yet.</p>';
    }
}

function displayCompletedUpgrades() {
    const container = document.getElementById('completed-container');
    const dropdown = document.getElementById('sort-date-dropdown');
    const selectedValue = dropdown.value;
    let totalValue = 0;

    const existingOptions = new Set(Array.from(dropdown.options).map(opt => opt.value));
    const uniqueDates = new Set(completedUpgrades.map(rec => rec.completedTimestamp.toLocaleDateString()));
    
    uniqueDates.forEach(date => {
        if (!existingOptions.has(date)) {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dropdown.appendChild(option);
        }
    });
    
    container.innerHTML = '';
    const upgradesToDisplay = selectedValue === 'all' 
        ? completedUpgrades 
        : completedUpgrades.filter(rec => rec.completedTimestamp.toLocaleDateString() === selectedValue);

    if (upgradesToDisplay && upgradesToDisplay.length > 0) {
        upgradesToDisplay.sort((a, b) => b.completedTimestamp - a.completedTimestamp);
        upgradesToDisplay.forEach(rec => {
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
                    <strong>✓ Completed</strong>
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
        container.innerHTML = '<p>No upgrades have been marked as completed for the selected date.</p>';
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
            let color = avail > 2 ? 'var(--success-color)' : (avail > 0 ? 'orange' : 'var(--secondary-accent)');
            html += `<td style="color:${color}; font-weight: bold;">${avail}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showError(error) {
    showLoader(false);
    alert(error.message || 'An unknown error occurred.');
    console.error(error); // Also log the full error to the console for debugging
}

function showLoader(show, text = 'Loading...') {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
    document.getElementById('loader').innerHTML = `<div class="spinner"></div>${text}`;
    document.getElementById('output').style.display = show ? 'none' : 'block';
    document.getElementById('generate-btn').disabled = show;
}


// --- LOGIC PORTED FROM Code.gs ---

/**
 * A robust CSV parser designed for the specific format of the provided file.
 * It correctly handles fields that contain commas by respecting double quotes.
 * @param {string} csvContent The raw string content from the CSV file.
 * @returns {{data: Array<Array<string>>, header: Array<string>}} An object containing the header and data rows.
 */
function parseCsv(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headerLine = lines.shift();
    // Simple split for the header, assuming headers don't have commas
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
        
        row.push(currentField); // Add the last field
        return row;
    });

    return { data, header };
}


function acceptUpgradeAndRecalculate(acceptedRec, previouslyAccepted, csvContent, rules) {
    const allAccepted = [...previouslyAccepted, acceptedRec];
    // We need to re-parse the original CSV each time to ensure a clean state
    const { data, header } = parseCsv(csvContent);
    const allReservations = parseAllReservations(data, header);
    
    // Apply all accepted upgrades to the fresh reservation list
    allAccepted.forEach(rec => {
        const reservationToUpdate = allReservations.find(res => res.resId === rec.resId);
        if (reservationToUpdate) {
            reservationToUpdate.roomType = rec.upgradeTo;
        }
    });

    const results = generateRecommendationsFromData(allReservations, rules);
    results.acceptedUpgrades = allAccepted; // Pass the updated list of accepted upgrades back
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
        // Find which header is missing and provide a more helpful error
        const firstMissing = header.find(h => !requiredHeaders.includes(h));
        console.log("Parsed Headers:", header);
        throw new Error(`The uploaded PMS export is missing required columns. Could not find: '${missingHeaders.join(', ')}'`);
    }

    const allReservations = parseAllReservations(data, header);
    return generateRecommendationsFromData(allReservations, rules);
}

function generateRecommendationsFromData(allReservations, rules) {
    const masterInventory = getMasterInventory();
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
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(startDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + dayOffset);
        const currentTimestamp = currentDate.getTime();
        const arrivalsForThisDay = allReservations.filter(r => r.arrival && r.arrival.getTime() === currentTimestamp && r.status === 'RESERVATION');
        
        let processingQueue = useDefaultLogic ? [...roomHierarchy] : [...originalTargetRooms];
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
        
        processingQueue.forEach((roomToEvaluate) => {
            const eligibleReservations = arrivalsForThisDay.filter(res => res.roomType === roomToEvaluate && !otaRates.some(ota => res.rate.toLowerCase().includes(ota)));
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
                        recommendations.push({
                            name: res.name, resId: res.resId, revenue: res.revenue,
                            room: res.roomType, rate: res.rate, nights: res.nights,
                            upgradeTo: potentialUpgradeRoom, score: score,
                            arrivalDate: currentDate.toLocaleDateString('en-US', { timeZone: 'UTC' })
                        });
                        break;
                    }
                }
            });
        });
    }
    
    recommendations.sort((a, b) => b.score - a.score);
    return {
        recommendations,
        inventory: todayInventory,
        matrixData,
        message: recommendations.length === 0 ? 'No suitable upgrade candidates found for the next 7 days.' : null
    };
}

function getBedType(roomCode) {
    if (!roomCode) return 'OTHER';
    if (roomCode.includes('-K')) return 'K';
    if (roomCode.includes('-QQ')) return 'QQ';
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
        if(values.length < header.length) return null; // Skip malformed rows

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

function getMasterInventory() {
    const masterRoomList = [
      { roomNumber: '301', code: 'CTK-K' }, { roomNumber: '320', code: 'CTK-K' }, { roomNumber: '102', code: 'DK-K' },
      { roomNumber: '202', code: 'DK-K' }, { roomNumber: '204', code: 'DK-K' }, { roomNumber: '205', code: 'DK-K' },
      { roomNumber: '222', code: 'DK-K' }, { roomNumber: '302', code: 'DK-K' }, { roomNumber: '303', code: 'DK-K' },
      { roomNumber: '304', code: 'DK-K' }, { roomNumber: '305', code: 'DK-K' }, { roomNumber: '306', code: 'DK-K' },
      { roomNumber: '310', code: 'DK-K' }, { roomNumber: '112', code: 'DK-K' }, { roomNumber: '213', code: 'DMVT-QQ' },
      { roomNumber: '214', code: 'DMVT-QQ' }, { roomNumber: '311', code: 'GMVB-QQ/POC' }, { roomNumber: '104', code: 'GMVC-QQ' },
      { roomNumber: '212', code: 'GMVT-QQ/POC' }, { roomNumber: '220', code: 'KBS-K/POC' }, { roomNumber: '319', code: 'KBS-K/POC' },
      { roomNumber: '219', code: 'KJS-K/POC' }, { roomNumber: '318', code: 'KJS-K/POC' }, { roomNumber: '101', code: 'LKBS-K/POC' },
      { roomNumber: '201', code: 'LKBS-K/POC' }, { roomNumber: '312', code: 'PMVB-QQ' }, { roomNumber: '313', code: 'PMVB-QQ' },
      { roomNumber: '105', code: 'QJS-QQ/POC' }, { roomNumber: '206', code: 'QJS-QQ/POC' }, { roomNumber: '307', code: 'QJS-QQ/POC' },
      { roomNumber: '108', code: 'TK-K' }, { roomNumber: '208', code: 'TK-K' }, { roomNumber: '210', 'code': 'TK-K' },
      { roomNumber: '211', code: 'TK-K' }, { roomNumber: '221', code: 'TK-K' }, { roomNumber: '308', code: 'TK-K' }, { roomNumber: '309', code: 'TK-K' },
      { roomNumber: '103', code: 'TQ-QQ' }, { roomNumber: '106', code: 'TQ-QQ' }, { roomNumber: '203', code: 'TQ-QQ' },
      { roomNumber: '207', code: 'TQ-QQ' }, { roomNumber: '215', code: 'TQ-QQ' }, { roomNumber: '216', code: 'TQ-QQ' },
      { roomNumber: '217', code: 'TQ-QQ' }, { roomNumber: '218', code: 'TQ-QQ' }, { roomNumber: '315', code: 'TQ-QQ' },
      { roomNumber: '107', code: 'TQHC' }
  ];
    const totalInventory = {};
    masterRoomList.forEach(room => {
        totalInventory[room.code.toUpperCase()] = (totalInventory[room.code.toUpperCase()] || 0) + 1;
    });
    return totalInventory;
}

function parseDate(dateStr) {
    if (!dateStr) return null;
    // Handle dates like "10/25/2023 15:00:00"
    if (dateStr.includes(' ')) dateStr = dateStr.split(' ')[0];
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
        // YYYY-MM-DD format
        if (parts[0].length === 4) return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        // MM/DD/YYYY format
        else return new Date(Date.UTC(parts[2], parts[0] - 1, parts[1]));
    }
    // Fallback for other potential formats
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

