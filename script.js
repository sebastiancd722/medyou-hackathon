// GLOBAL STATE
let allData = {};       // Holds the raw JSON
let currentUser = null; // Who is logged in?
let userMeds = [];      // The pills for the current user only

// LOCAL STORAGE KEYS
const STORAGE_KEY_DOSES = 'medyou_doses'; // Tracks taken status per dose
const STORAGE_KEY_INV = 'medyou_inventory'; // Tracks inventory per med ID
const STORAGE_KEY_DAILY = 'medyou_daily_'; // Prefix for daily adherence stats
const STORAGE_KEY_DISCUSSION = 'medyou_discussion_list'; // List of meds to discuss

// --- MEDICATION CATALOG DATA ---
const medicationCatalog = [
  // Diabetes
  { id: "metformin", name: "Metformin", condition: "Diabetes", description: "Helps lower blood sugar by improving how your body uses insulin.", typicalUse: "Type 2 diabetes", note: "Common first line medication. Take with food." },
  { id: "insulin_glargine", name: "Insulin glargine", condition: "Diabetes", description: "Long acting insulin that works slowly over the day.", typicalUse: "Type 1 and Type 2 diabetes", note: "Injected once or twice daily as directed." },
  { id: "sitagliptin", name: "Sitagliptin", condition: "Diabetes", description: "Helps the body release more insulin after meals.", typicalUse: "Type 2 diabetes", note: "Often added when Metformin alone is not enough." },
  { id: "empagliflozin", name: "Empagliflozin", condition: "Diabetes", description: "Helps lower blood sugar by making you pass extra sugar in urine.", typicalUse: "Type 2 diabetes", note: "Can increase urination and infection risk. Stay hydrated." },
  { id: "glipizide", name: "Glipizide", condition: "Diabetes", description: "Helps the pancreas release more insulin.", typicalUse: "Type 2 diabetes", note: "Can cause low blood sugar if you skip meals." },

  // High blood pressure
  { id: "amlodipine", name: "Amlodipine", condition: "High blood pressure", description: "Relaxes blood vessels so blood can flow more easily.", typicalUse: "High blood pressure", note: "Can cause ankle swelling or flushing." },
  { id: "ramipril", name: "Ramipril", condition: "High blood pressure", description: "ACE inhibitor that lowers blood pressure and protects the heart.", typicalUse: "High blood pressure and heart failure", note: "Can cause a dry cough in some people." },
  { id: "hydrochlorothiazide", name: "Hydrochlorothiazide", condition: "High blood pressure", description: "Water pill that helps the body get rid of extra fluid and salt.", typicalUse: "High blood pressure", note: "May increase urination, usually taken in the morning." },
  { id: "losartan", name: "Losartan", condition: "High blood pressure", description: "ARB that relaxes blood vessels and protects kidneys.", typicalUse: "High blood pressure, kidney protection in diabetes", note: "Used if ACE inhibitors are not tolerated." },
  { id: "metoprolol", name: "Metoprolol", condition: "High blood pressure", description: "Slows heart rate and lowers blood pressure.", typicalUse: "High blood pressure, angina, heart disease", note: "Do not stop suddenly without medical advice." },

  // Asthma and breathing
  { id: "salbutamol", name: "Salbutamol inhaler", condition: "Asthma and breathing", description: "Rescue inhaler that quickly opens airways during flare ups.", typicalUse: "Fast relief of asthma or wheeze", note: "Use as needed for symptoms. Seek help if you need it very often." },
  { id: "fluticasone_inhaler", name: "Fluticasone inhaler", condition: "Asthma and breathing", description: "Steroid inhaler that reduces swelling in the airways.", typicalUse: "Daily asthma prevention", note: "Rinse mouth after use to reduce irritation." },
  { id: "budesonide_formoterol", name: "Budesonide-formoterol inhaler", condition: "Asthma and breathing", description: "Combination inhaler for daily control and sometimes symptom relief.", typicalUse: "Moderate to severe asthma", note: "Use exactly as your asthma plan describes." },
  { id: "tiotropium", name: "Tiotropium inhaler", condition: "Asthma and breathing", description: "Long acting inhaler that helps keep airways open.", typicalUse: "Chronic lung diseases like COPD, sometimes asthma", note: "Not for sudden attacks; used regularly." },

  // Allergies
  { id: "cetirizine", name: "Cetirizine", condition: "Allergies", description: "Antihistamine tablet that reduces sneezing and itchy eyes.", typicalUse: "Seasonal allergies, hives", note: "Can cause mild drowsiness in some people." },
  { id: "loratadine", name: "Loratadine", condition: "Allergies", description: "Once daily antihistamine for allergy symptoms.", typicalUse: "Hay fever and mild allergies", note: "Usually non drowsy at normal doses." },
  { id: "fluticasone_nasal", name: "Fluticasone nasal spray", condition: "Allergies", description: "Nasal steroid spray that reduces nose congestion and sneezing.", typicalUse: "Nasal allergies", note: "Takes a few days of regular use to see full effect." },
  { id: "diphenhydramine", name: "Diphenhydramine", condition: "Allergies", description: "Older antihistamine that can cause strong drowsiness.", typicalUse: "Short term allergy or itch relief", note: "Can make you very sleepy. Avoid driving after taking." },

  // Pain relief
  { id: "acetaminophen", name: "Acetaminophen", condition: "Pain relief", description: "Relieves pain and reduces fever.", typicalUse: "Headache, mild pain, fever", note: "Do not exceed the maximum daily dose to protect the liver." },
  { id: "ibuprofen", name: "Ibuprofen", condition: "Pain relief", description: "Anti inflammatory pain reliever.", typicalUse: "Muscle pain, period cramps, joint pain", note: "Take with food. Avoid if you have certain stomach or kidney problems." },
  { id: "naproxen", name: "Naproxen", condition: "Pain relief", description: "Longer lasting anti inflammatory pain reliever.", typicalUse: "Arthritis, joint and muscle pain", note: "Take with food. Talk to your doctor if used often." },
  { id: "tramadol", name: "Tramadol", condition: "Pain relief", description: "Stronger pain reliever that affects how the brain feels pain.", typicalUse: "Moderate to severe pain", note: "Can cause dizziness and dependence. Only use under close medical advice." },

  // Cholesterol
  { id: "atorvastatin", name: "Atorvastatin", condition: "Cholesterol", description: "Statin that lowers LDL cholesterol.", typicalUse: "High cholesterol and heart disease prevention", note: "Taken once daily. Report any severe muscle pain." },
  { id: "rosuvastatin", name: "Rosuvastatin", condition: "Cholesterol", description: "Potent statin for lowering cholesterol.", typicalUse: "High cholesterol, high risk heart patients", note: "Liver tests may be monitored by your doctor." },
  { id: "simvastatin", name: "Simvastatin", condition: "Cholesterol", description: "Statin that lowers cholesterol overnight.", typicalUse: "High cholesterol", note: "Usually taken in the evening. Watch for muscle aches." },
  { id: "ezetimibe", name: "Ezetimibe", condition: "Cholesterol", description: "Lowers cholesterol by reducing absorption from the gut.", typicalUse: "High cholesterol, often added to a statin", note: "Used when statins alone are not enough." }
];

// BROWSE STATE
let currentCategory = "Diabetes";

// 1. Load Data & Start App
async function initApp() {
  try {
    const response = await fetch('data.json');
    allData = await response.json();
    
    // START WITH USER ID 1 (Alex)
    loginUser(1); 
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('info-modal').style.display = 'none';
        }
    });

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// 2. Login Logic
function loginUser(userId) {
  currentUser = allData.users.find(u => u.id === userId);
  userMeds = allData.prescriptions.filter(p => p.userId === userId);

  const storedInventory = JSON.parse(localStorage.getItem(STORAGE_KEY_INV) || '{}');
  
  userMeds.forEach(med => {
    if (storedInventory[med.id] !== undefined) {
        med.inventory = storedInventory[med.id];
    }
  });

  document.getElementById('user-name-display').innerText = `Hi, ${currentUser.name}`;
  document.getElementById('user-avatar-display').innerText = currentUser.initials;

  // Determine Default Category based on conditions
  determineDefaultCategory();

  // Update Browse Header Context
  const browseContext = document.getElementById('browse-user-context');
  if (currentUser.conditions && currentUser.conditions.length > 0) {
    browseContext.innerText = `Based on: ${currentUser.conditions.join(' • ')}`;
  } else {
    browseContext.innerText = 'Browsing general medication catalog';
  }

  // Init Browse Tab
  initBrowseMedications();

  renderMedicationCards();
  renderSchedule();
  calculateAdherence();
  renderHistory(); 
  renderForecast(); 
  renderDiscussionList(); 
}

function determineDefaultCategory() {
    // Simple string matching to find a relevant start category
    const conditions = currentUser.conditions || [];
    
    if (conditions.some(c => c.includes('Diabetes'))) {
        currentCategory = "Diabetes";
    } else if (conditions.some(c => c.includes('Cholesterol'))) {
        currentCategory = "Cholesterol";
    } else if (conditions.some(c => c.includes('Hypertension'))) {
        currentCategory = "High blood pressure";
    } else if (conditions.some(c => c.includes('Asthma'))) {
        currentCategory = "Asthma and breathing";
    } else {
        currentCategory = "Diabetes"; // Fallback
    }
}

// --- BROWSE & TAB LOGIC ---

function switchTab(tabName) {
  const dashboardView = document.getElementById('view-dashboard');
  const browseView = document.getElementById('view-browse');
  const dashBtn = document.getElementById('tab-dashboard-btn');
  const browseBtn = document.getElementById('tab-browse-btn');

  if (tabName === 'dashboard') {
    dashboardView.classList.remove('hidden');
    browseView.classList.add('hidden');
    dashBtn.classList.add('active');
    browseBtn.classList.remove('active');
    dashBtn.setAttribute('aria-selected', 'true');
    browseBtn.setAttribute('aria-selected', 'false');
  } else {
    dashboardView.classList.add('hidden');
    browseView.classList.remove('hidden');
    dashBtn.classList.remove('active');
    browseBtn.classList.add('active');
    dashBtn.setAttribute('aria-selected', 'false');
    browseBtn.setAttribute('aria-selected', 'true');
  }
}

function initBrowseMedications() {
  const categories = [...new Set(medicationCatalog.map(m => m.condition))];
  const categoryList = document.getElementById('category-list');
  
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    if(cat === currentCategory) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    } else {
        btn.setAttribute('aria-pressed', 'false');
    }
    btn.innerText = cat;
    btn.onclick = () => setCategory(cat);
    categoryList.appendChild(btn);
  });

  renderCatalog();
  renderDiscussionList();
}

function setCategory(cat) {
  currentCategory = cat;
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    if(btn.innerText === cat) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    }
  });

  document.getElementById('browse-title').innerText = cat;
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';

  const filtered = medicationCatalog.filter(m => m.condition === currentCategory);

  filtered.forEach(med => {
    const card = document.createElement('div');
    card.className = 'catalog-card';
    card.innerHTML = `
      <div class="med-header">
        <span class="med-name">${med.name}</span>
      </div>
      <div class="med-use">Typical Use: ${med.typicalUse}</div>
      <p class="med-desc">${med.description}</p>
      <div class="med-note">ℹ️ ${med.note}</div>
      <button class="btn-discuss" onclick="addToDiscussion('${med.id}')">
        + Add to discussion list
      </button>
    `;
    grid.appendChild(card);
  });
}

function addToDiscussion(medId) {
  const med = medicationCatalog.find(m => m.id === medId);
  if (!med) return;

  let list = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCUSSION) || '[]');
  
  if (!list.includes(med.name)) {
    list.push(med.name);
    localStorage.setItem(STORAGE_KEY_DISCUSSION, JSON.stringify(list));
    renderDiscussionList();
    showToast(`${med.name} added to your discussion list.`, 'success');
  } else {
    showToast(`${med.name} is already on your list.`, 'info');
  }
}

function renderDiscussionList() {
  const ul = document.getElementById('discussion-list-ul');
  ul.innerHTML = '';
  
  let list = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCUSSION) || '[]');

  if (list.length === 0) {
    ul.innerHTML = '<li class="empty-msg">No items added yet.</li>';
    return;
  }

  list.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    ul.appendChild(li);
  });
}


// --- EXISTING TRACKING LOGIC ---

// 3. Render Cards
function renderMedicationCards() {
  const container = document.getElementById('med-card-container');
  container.innerHTML = ''; 

  if (userMeds.length === 0) {
    container.innerHTML = '<p style="color:#666;">No active prescriptions found.</p>';
    return;
  }

  userMeds.forEach(med => {
    const isLowStock = med.inventory <= med.refillThreshold;

    const cardHTML = `
      <div class="med-card">
        <div class="med-header">
          <div>
            <div class="med-name">${med.name} <span class="med-dose">${med.dose}</span></div>
            <div class="med-condition">${med.condition}</div>
          </div>
          <div class="badge-container">
            ${isLowStock ? '<span class="chip-refill">Refill soon</span>' : ''}
            <div class="stock-badge ${isLowStock ? 'low' : ''}">
                ${med.inventory} pills left
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn-info" onclick="openModal(${med.id})">ℹ️ Info</button>
          ${isLowStock ? 
            `<button class="btn-refill" onclick="triggerRefill('${med.name}')">
                <span>🔄</span> Order Refill
             </button>` 
            : ''
          }
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });
}

// 4. Render Schedule
function renderSchedule() {
  const list = document.getElementById('dose-list');
  list.innerHTML = '';

  let allDoses = [];
  userMeds.forEach(med => {
    med.times.forEach(time => {
        allDoses.push({
            medId: med.id,
            name: med.name,
            time: time,
            uniqueId: `${med.id}-${time}`
        });
    });
  });

  allDoses.sort((a, b) => a.time.localeCompare(b.time));
  const doseHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_DOSES) || '{}');

  let currentGroup = '';
  
  allDoses.forEach(dose => {
    const hour = parseInt(dose.time.split(':')[0]);
    let groupLabel = 'Morning';
    if (hour >= 12 && hour < 17) groupLabel = 'Afternoon';
    if (hour >= 17) groupLabel = 'Evening';

    if (groupLabel !== currentGroup) {
        currentGroup = groupLabel;
        list.innerHTML += `<div class="time-group-label">${groupLabel}</div>`;
    }

    const storageKey = `${currentUser.id}-${dose.medId}-${dose.time}`;
    const isTaken = doseHistory[storageKey] === true;

    const item = document.createElement('div');
    item.className = `dose-item ${isTaken ? 'completed' : ''}`;
    
    item.innerHTML = `
      <label class="dose-label">
          <input type="checkbox" class="dose-checkbox" 
                 id="${dose.uniqueId}" 
                 ${isTaken ? 'checked' : ''}
                 onchange="toggleDose(this, ${dose.medId}, '${dose.time}')">
          <span class="dose-time">${dose.time}</span>
          <span class="dose-text">${dose.name}</span>
          ${isTaken ? '<span class="taken-badge">✓ Taken</span>' : ''}
      </label>
    `;
    list.appendChild(item);
  });

  updateNextDoseDisplay(allDoses, doseHistory);
}

// 5. Helper: Next Dose
function updateNextDoseDisplay(allDoses, doseHistory) {
    const nextDoseEl = document.getElementById('next-dose-display');
    const next = allDoses.find(dose => {
        const key = `${currentUser.id}-${dose.medId}-${dose.time}`;
        return !doseHistory[key];
    });

    if (next) {
        nextDoseEl.innerText = `Next dose at ${next.time}`;
        nextDoseEl.style.color = 'var(--soft-yellow)';
    } else {
        nextDoseEl.innerText = "All caught up!";
        nextDoseEl.style.color = 'white';
    }
}

// 6. Handle Toggle & Logic
function toggleDose(checkbox, medId, time) {
  const parentRow = checkbox.closest('.dose-item');
  const med = userMeds.find(m => m.id === medId);
  const storageKey = `${currentUser.id}-${medId}-${time}`;
  
  const doseHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_DOSES) || '{}');
  const storedInventory = JSON.parse(localStorage.getItem(STORAGE_KEY_INV) || '{}');

  if (checkbox.checked) {
    parentRow.classList.add('completed');
    if (!doseHistory[storageKey]) {
        if (med && med.inventory > 0) {
            med.inventory--; 
            storedInventory[med.id] = med.inventory;
        }
    }
    doseHistory[storageKey] = true;
  } else {
    parentRow.classList.remove('completed');
    if (doseHistory[storageKey]) {
        if (med) {
            med.inventory++;
            storedInventory[med.id] = med.inventory;
        }
    }
    doseHistory[storageKey] = false;
  }

  localStorage.setItem(STORAGE_KEY_DOSES, JSON.stringify(doseHistory));
  localStorage.setItem(STORAGE_KEY_INV, JSON.stringify(storedInventory));

  saveDailyAdherence();

  renderMedicationCards();
  calculateAdherence();
  renderSchedule();
  renderHistory(); 
}

// 7. Adherence Calculation & Persistence
function calculateAdherence() {
  const totalDoses = document.querySelectorAll('.dose-checkbox').length;
  const takenDoses = document.querySelectorAll('.dose-checkbox:checked').length;
  
  let score = 0;
  if (totalDoses > 0) score = Math.round((takenDoses / totalDoses) * 100);
  
  const display = document.getElementById('adherence-display');
  display.innerText = `${score}%`;
  
  if (score < 50) display.style.color = '#E63946';
  else if (score < 80) display.style.color = '#f1c40f';
  else display.style.color = 'white';
  
  return score;
}

function saveDailyAdherence() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const score = calculateAdherence();
    const key = `${STORAGE_KEY_DAILY}${currentUser.id}_${today}`;
    localStorage.setItem(key, score);
}

// 8. Render Last 7 Days (History)
function renderHistory() {
    const container = document.getElementById('history-chart');
    const summaryEl = document.getElementById('history-summary');
    container.innerHTML = '';
    
    const today = new Date();
    let totalScore = 0;
    let daysCounted = 0;
    let streak = 0;
    let streakBroken = false;

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0]; 
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

        const key = `${STORAGE_KEY_DAILY}${currentUser.id}_${dateStr}`;
        const savedScore = localStorage.getItem(key); 

        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        
        if (savedScore !== null) {
            const scoreVal = parseInt(savedScore);
            bar.style.height = `${Math.max(scoreVal, 5)}%`; 
            
            // Average Calculation
            totalScore += scoreVal;
            daysCounted++;

            // Color Coding
            if (scoreVal >= 80) bar.style.backgroundColor = 'var(--light-green)';
            else if (scoreVal >= 50) bar.style.backgroundColor = 'var(--soft-yellow)';
            else bar.style.backgroundColor = 'var(--red)';
            
            bar.title = `${dateStr}: ${scoreVal}%`;
        } else {
            bar.style.height = '100%';
            bar.style.backgroundColor = '#eee';
            bar.title = `${dateStr}: No Data`;
        }

        barContainer.appendChild(bar);
        const label = document.createElement('div');
        label.className = 'chart-date';
        label.innerText = dayLabel;
        barContainer.appendChild(label);

        container.appendChild(barContainer);
    }

    // --- Stats Calculation (Backwards loop for streak) ---
    for (let i = 0; i < 30; i++) { // Check last 30 days for streak
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const key = `${STORAGE_KEY_DAILY}${currentUser.id}_${dateStr}`;
        const val = localStorage.getItem(key);
        
        if (val !== null) {
            if (parseInt(val) >= 80) {
                streak++;
            } else {
                break; // Streak broken by bad score
            }
        } else {
             // If today has no data yet, don't break streak immediately, just skip
             if (i === 0) continue; 
             break; // Streak broken by missing day
        }
    }

    const average = daysCounted > 0 ? Math.round(totalScore / daysCounted) : 0;
    summaryEl.innerText = `Average: ${average}% • Streak: ${streak} days`;
}

// 9. Render Next 7 Days (Forecast)
function renderForecast() {
    const container = document.getElementById('forecast-grid');
    container.innerHTML = '';
    
    const today = new Date();
    let dailyDoseCount = 0;
    userMeds.forEach(med => {
        dailyDoseCount += med.times.length;
    });

    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); 

        const box = document.createElement('div');
        box.className = 'forecast-box';
        
        box.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-count">${dailyDoseCount}</div>
            <div class="forecast-label">Doses</div>
            <div style="font-size: 0.6rem; color:#999;">${dateLabel}</div>
        `;
        
        container.appendChild(box);
    }
}

// Modal & Alerts
const modal = document.getElementById('info-modal');
const closeBtn = document.getElementById('close-modal-btn');

function openModal(medId) {
  const med = userMeds.find(m => m.id === medId);
  if (med) {
    document.getElementById('modal-title').innerText = med.name;
    document.getElementById('modal-instructions').innerText = med.instructions;
    document.getElementById('modal-note').innerText = med.pharmacistNote;
    modal.style.display = 'flex';
    closeBtn.focus();
  }
}

closeBtn.onclick = () => { modal.style.display = 'none'; };
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

// Toast Logic
let toastTimeout;
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    
    // Reset classes
    toast.className = 'toast'; 
    if (type === 'success') toast.classList.add('success');
    if (type === 'warning') toast.classList.add('warning');
    
    // Show
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Hide after 3 seconds
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function triggerRefill(medName) {
  showToast(`Refill request for ${medName} sent!`, 'success');
}

function clearDemoData() {
    if(confirm("Reset all demo data?")) {
        localStorage.clear();
        location.reload();
    }
}

initApp();