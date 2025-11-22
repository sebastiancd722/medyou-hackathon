// GLOBAL STATE
let allData = {};       // Holds the raw JSON
let currentUser = null; // Who is logged in?
let userMeds = [];      // The pills for the current user only
let tempAvatarColor = ''; // Used for the modal selection

// LOCAL STORAGE KEYS
const STORAGE_KEY_DOSES = 'medyou_doses'; // Tracks taken status per dose
const STORAGE_KEY_INV = 'medyou_inventory'; // Tracks inventory per med ID
const STORAGE_KEY_DAILY = 'medyou_daily_'; // Prefix for daily adherence stats
const STORAGE_KEY_DISCUSSION = 'medyou_discussion_list'; // List of meds to discuss
const STORAGE_KEY_AVATAR = 'medyou_avatar_'; // User avatar preferences

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

// Condition Icons
const conditionIcons = {
    "Diabetes": "💉",
    "High blood pressure": "❤️",
    "Asthma and breathing": "🌬️",
    "Allergies": "🌼",
    "Pain relief": "💊",
    "Cholesterol": "🩺"
};

// BROWSE STATE
let currentCategory = "Diabetes";

// 1. Load Data & Start App
async function initApp() {
  try {
    const response = await fetch('data.json');
    allData = await response.json();
    
    // START WITH USER ID 1 (Alex)
    loginUser(1); 
    
    // Init Account Menu Logic
    initAccountMenu();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('info-modal').style.display = 'none';
            document.getElementById('avatar-modal').style.display = 'none';
            // Close menu on Escape
            const menu = document.getElementById('account-dropdown');
            if (!menu.classList.contains('hidden')) toggleAccountMenu();
        }
    });

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// --- SKELETON LOADER UTILS ---
function renderSkeleton() {
    const skeletonHTML = `
      <div style="padding:1rem; opacity:0.6;">
        <div class="skeleton" style="height:24px; width:50%; margin-bottom:16px; border-radius:6px;"></div>
        <div class="skeleton" style="height:120px; width:100%; margin-bottom:16px; border-radius:12px;"></div>
        <div class="skeleton" style="height:24px; width:30%; border-radius:6px;"></div>
      </div>
    `;
    
    document.getElementById('med-card-container').innerHTML = skeletonHTML;
    document.getElementById('dose-list').innerHTML = skeletonHTML;
    document.getElementById('history-chart').innerHTML = skeletonHTML;
    document.getElementById('forecast-grid').innerHTML = skeletonHTML;
    document.getElementById('catalog-grid').innerHTML = skeletonHTML;
}

// 2. Login Logic
function loginUser(userId) {
  // Simulate loading state
  renderSkeleton();

  setTimeout(() => {
      // REAL LOAD AFTER 300ms
      currentUser = allData.users.find(u => u.id === userId);
      userMeds = allData.prescriptions.filter(p => p.userId === userId);

      const storedInventory = JSON.parse(localStorage.getItem(STORAGE_KEY_INV) || '{}');
      
      userMeds.forEach(med => {
        if (storedInventory[med.id] !== undefined) {
            med.inventory = storedInventory[med.id];
        }
      });

      // Apply Header Info & Avatar
      document.getElementById('user-name-display').innerText = `Hi, ${currentUser.name}`;
      applySavedAvatarPreferences();

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
      renderTodaySummary();
  }, 300);
}

function determineDefaultCategory() {
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
        currentCategory = "Diabetes";
    }
}

// --- NEW: TODAY SUMMARY LOGIC ---
function renderTodaySummary() {
    // Doses
    const checkboxes = document.querySelectorAll('.dose-checkbox');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.dose-checkbox:checked').length;
    const left = total - checked;
    document.getElementById('summary-doses').innerText = `${left} left`;

    // Low Stock
    const low = userMeds.filter(m => m.inventory <= m.refillThreshold).length;
    const lowText = document.getElementById('summary-low-stock');
    lowText.innerText = `${low} med${low !== 1 ? 's' : ''}`;
    lowText.style.color = low > 0 ? 'var(--red)' : 'inherit';

    // Discussion
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCUSSION) || '[]');
    document.getElementById('summary-discussion').innerText = list.length;
}

// --- NEW: SCHEDULE TOGGLE LOGIC ---
function toggleScheduleFilter() {
    const checkbox = document.getElementById('toggle-remaining');
    const list = document.getElementById('dose-list');
    
    if (checkbox.checked) {
        list.classList.add('hide-completed-mode');
    } else {
        list.classList.remove('hide-completed-mode');
    }
}

// --- ACCOUNT MENU LOGIC ---

function initAccountMenu() {
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('account-dropdown');
        const btn = document.getElementById('user-menu-btn');
        if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
            toggleAccountMenu();
        }
    });
}

function toggleAccountMenu() {
    const menu = document.getElementById('account-dropdown');
    const btn = document.getElementById('user-menu-btn');
    const isHidden = menu.classList.contains('hidden');
    
    if (isHidden) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
    } else {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    }
}

function handleMenuAction(action) {
    toggleAccountMenu(); // Close menu
    
    if (action === 'logout') {
        showToast('Signing out...', 'info');
        setTimeout(() => {
            window.location.reload(); // Simulate logout by resetting app
        }, 1000);
    } else if (action === 'account' || action === 'settings') {
        showToast('Account settings coming soon (Demo)', 'info');
    }
}

// --- AVATAR CUSTOMIZATION LOGIC ---

function applySavedAvatarPreferences() {
    const avatarEl = document.getElementById('user-avatar-display');
    
    // 1. Reset to default from JSON
    avatarEl.innerText = currentUser.initials;
    avatarEl.style.backgroundColor = 'var(--teal)'; // Default color

    // 2. Check LocalStorage
    const key = STORAGE_KEY_AVATAR + currentUser.id;
    const savedPref = JSON.parse(localStorage.getItem(key));

    if (savedPref) {
        if (savedPref.initials) avatarEl.innerText = savedPref.initials;
        if (savedPref.color) avatarEl.style.backgroundColor = savedPref.color;
    }
}

function openAvatarModal() {
    toggleAccountMenu(); // Close dropdown first
    const modal = document.getElementById('avatar-modal');
    const input = document.getElementById('avatar-initials-input');
    
    // Pre-fill current initials
    const avatarEl = document.getElementById('user-avatar-display');
    input.value = avatarEl.innerText;
    tempAvatarColor = avatarEl.style.backgroundColor; // start with current

    modal.style.display = 'flex';
    input.focus();
}

function closeAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'none';
}

function selectAvatarColor(color) {
    tempAvatarColor = color;
    // Visual feedback could be added here (border selection), 
    // but for plain JS we'll just rely on the click for now.
    showToast('Color selected', 'info'); 
}

function saveAvatarSettings() {
    const input = document.getElementById('avatar-initials-input');
    const newInitials = input.value.toUpperCase().substring(0, 2);
    
    const pref = {
        initials: newInitials,
        color: tempAvatarColor || 'var(--teal)'
    };

    // Save to LocalStorage
    const key = STORAGE_KEY_AVATAR + currentUser.id;
    localStorage.setItem(key, JSON.stringify(pref));

    // Apply immediately
    applySavedAvatarPreferences();
    
    closeAvatarModal();
    showToast('Avatar updated!', 'success');
}


// --- BROWSE & TAB LOGIC ---

function switchTab(tabName) {
  const dashboardView = document.getElementById('view-dashboard');
  const browseView = document.getElementById('view-browse');
  const dashBtn = document.getElementById('tab-dashboard-btn');
  const browseBtn = document.getElementById('tab-browse-btn');

  // Skeleton loading effect
  if(tabName === 'dashboard') {
      document.getElementById('med-card-container').innerHTML = '<div class="skeleton" style="height:100px;width:100%;"></div>';
      document.getElementById('dose-list').innerHTML = '<div class="skeleton" style="height:100px;width:100%;"></div>';
  } else {
      document.getElementById('catalog-grid').innerHTML = '<div class="skeleton" style="height:100px;width:100%;"></div>';
  }

  setTimeout(() => {
      if (tabName === 'dashboard') {
        dashboardView.classList.remove('hidden');
        browseView.classList.add('hidden');
        dashBtn.classList.add('active');
        browseBtn.classList.remove('active');
        dashBtn.setAttribute('aria-selected', 'true');
        browseBtn.setAttribute('aria-selected', 'false');
        // Re-render to clear skeleton
        renderMedicationCards();
        renderSchedule();
      } else {
        dashboardView.classList.add('hidden');
        browseView.classList.remove('hidden');
        dashBtn.classList.remove('active');
        browseBtn.classList.add('active');
        dashBtn.setAttribute('aria-selected', 'false');
        browseBtn.setAttribute('aria-selected', 'true');
        // Re-render to clear skeleton
        renderCatalog();
      }
  }, 300);
}

function initBrowseMedications() {
  const categories = [...new Set(medicationCatalog.map(m => m.condition))];
  const categoryList = document.getElementById('category-list');
  
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const icon = conditionIcons[cat] || '💊';
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    if(cat === currentCategory) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    } else {
        btn.setAttribute('aria-pressed', 'false');
    }
    btn.innerHTML = `<span style="font-size:1.1rem;">${icon}</span> <span>${cat}</span>`;
    btn.onclick = () => setCategory(cat);
    categoryList.appendChild(btn);
  });

  renderCatalog();
  renderDiscussionList();
}

function setCategory(cat) {
  currentCategory = cat;
  
  // Clear search
  const searchInput = document.getElementById('catalog-search');
  if(searchInput) searchInput.value = '';

  // Update Active UI
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
      if(btn.innerText.includes(cat)) {
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
  const searchInput = document.getElementById('catalog-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  
  grid.innerHTML = '';

  const filtered = medicationCatalog.filter(m => {
      const matchesCategory = m.condition === currentCategory;
      const matchesSearch = m.name.toLowerCase().includes(searchTerm) || 
                            m.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:#888;">No medications found matching "${searchTerm}".</div>`;
      return;
  }

  filtered.forEach(med => {
    const card = document.createElement('div');
    card.className = 'catalog-card';
    card.innerHTML = `
      <div class="med-header">
        <span class="med-name">${med.name}</span>
      </div>
      <div><span class="med-use-badge">${med.typicalUse}</span></div>
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
    showToast(`${med.name} added to list.`, 'success');
  } else {
    showToast(`${med.name} is already on your list.`, 'info');
  }
}

function removeFromDiscussion(medName) {
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCUSSION) || '[]');
    const index = list.indexOf(medName);
    if (index > -1) {
        list.splice(index, 1);
        localStorage.setItem(STORAGE_KEY_DISCUSSION, JSON.stringify(list));
        renderDiscussionList();
        showToast(`${medName} removed.`, 'info');
    }
}

function renderDiscussionList() {
  const ul = document.getElementById('discussion-list-ul');
  const countSpan = document.getElementById('discussion-count');
  ul.innerHTML = '';
  
  let list = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCUSSION) || '[]');
  countSpan.innerText = `(${list.length})`;

  if (list.length === 0) {
    ul.innerHTML = `
      <li class="empty-msg">
        <span style="font-size: 1.5rem; display:block; margin-bottom: 0.5rem;">📋</span>
        Your list is empty. Browse medications to add items.
      </li>`;
    
    // Ensure summary updates even if list is empty
    renderTodaySummary();
    return;
  }

  list.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
        ${item}
        <button class="btn-remove-discuss" onclick="removeFromDiscussion('${item}')" aria-label="Remove ${item}">×</button>
    `;
    ul.appendChild(li);
  });

  // Update summary
  renderTodaySummary();
}

function clearDiscussionList() {
    if(confirm("Clear your discussion list?")) {
        localStorage.setItem(STORAGE_KEY_DISCUSSION, JSON.stringify([]));
        renderDiscussionList();
        showToast("List cleared.", "info");
    }
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
            uniqueId: `${med.id}-${time}`,
            inventory: med.inventory // pass for badge
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

    // Time Calculation
    const now = new Date();
    const [h, m] = dose.time.split(':');
    const doseDate = new Date();
    doseDate.setHours(h, m, 0);
    
    let relativeTime = "";
    const diffMs = doseDate - now;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins > 0) {
        if (diffMins > 60) relativeTime = `in ${Math.floor(diffMins/60)}h`;
        else relativeTime = `in ${diffMins}m`;
    } else {
       relativeTime = "Past";
    }

    // Inventory Check
    const isLow = dose.inventory < 5;

    const item = document.createElement('div');
    item.className = `dose-item ${isTaken ? 'completed' : ''}`;
    
    item.innerHTML = `
      <label class="dose-label">
          <input type="checkbox" class="dose-checkbox" 
                 id="${dose.uniqueId}" 
                 ${isTaken ? 'checked' : ''}
                 onchange="toggleDose(this, ${dose.medId}, '${dose.time}')">
          <div style="display:flex; flex-direction:column;">
             <div><span class="dose-time">${dose.time}</span> <span style="font-size:0.75rem; color:#999; margin-right:8px;">${relativeTime}</span></div>
             <span class="dose-text">${dose.name}</span>
          </div>
          
          ${isLow ? '<span class="low-stock-dot">Refill Soon</span>' : ''}
          
          ${isTaken ? '<span class="taken-icon checked">✓</span>' : '<span class="taken-icon missed"></span>'}
      </label>
    `;
    list.appendChild(item);
  });

  updateNextDoseDisplay(allDoses, doseHistory);
  
  // Ensure filter state is respected if re-rendered
  const checkbox = document.getElementById('toggle-remaining');
  if (checkbox.checked) list.classList.add('hide-completed-mode');
  
  // Update summary
  renderTodaySummary();
}

// 5. Helper: Next Dose
function updateNextDoseDisplay(allDoses, doseHistory) {
    const nextDoseEl = document.getElementById('next-dose-display');
    const next = allDoses.find(dose => {
        const key = `${currentUser.id}-${dose.medId}-${dose.time}`;
        return !doseHistory[key];
    });

    if (next) {
        // Recalculate specific next time
        const now = new Date();
        const [h, m] = next.time.split(':');
        const doseDate = new Date();
        doseDate.setHours(h, m, 0);
        const diffMins = Math.round((doseDate - now) / 60000);
        
        if (diffMins > 0) {
             nextDoseEl.innerText = `Next dose in ${diffMins} mins`;
        } else {
             nextDoseEl.innerText = `Next dose today at ${next.time}`;
        }
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
  
  // Trigger pop animation
  display.classList.remove('pop');
  void display.offsetWidth; // trigger reflow
  display.classList.add('pop');
  
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

// 8. Render Last 7 Days (History) - VERTICAL BARS UPGRADE
function renderHistory() {
    const container = document.getElementById('history-chart');
    const summaryEl = document.getElementById('history-summary');
    container.innerHTML = '';
    
    const today = new Date();
    let totalScore = 0;
    let daysCounted = 0;
    let streak = 0;

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
        
        const label = document.createElement('span');
        label.className = 'chart-bar-label';

        if (savedScore !== null) {
            const scoreVal = parseInt(savedScore);
            bar.style.height = `${scoreVal}%`; 
            label.innerText = `${scoreVal}%`;
            
            totalScore += scoreVal;
            daysCounted++;

            // Color Coding
            if (scoreVal >= 90) { 
                bar.classList.add('high');
            } else if (scoreVal > 0) {
                bar.classList.add('low');
            } else {
                bar.classList.add('low'); // 0% but recorded
            }
        } else {
            // No data visual
            bar.classList.add('no-data');
            label.innerText = '';
        }

        bar.appendChild(label);
        barContainer.appendChild(bar);
        
        const dateLabelDiv = document.createElement('div');
        dateLabelDiv.className = 'chart-date';
        dateLabelDiv.innerText = dayLabel;
        barContainer.appendChild(dateLabelDiv);

        container.appendChild(barContainer);
    }

    // Stats Calculation (Streak)
    for (let i = 0; i < 30; i++) { 
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const key = `${STORAGE_KEY_DAILY}${currentUser.id}_${dateStr}`;
        const val = localStorage.getItem(key);
        
        if (val !== null) {
            if (parseInt(val) >= 80) {
                streak++;
            } else {
                break; 
            }
        } else {
             if (i === 0) continue; 
             break; 
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
    let minDaysSupply = 999;

    userMeds.forEach(med => {
        dailyDoseCount += med.times.length;
        
        // Supply Calculation
        if (med.times.length > 0) {
            const daysLeft = Math.floor(med.inventory / med.times.length);
            if (daysLeft < minDaysSupply) minDaysSupply = daysLeft;
        }
    });

    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); 

        const box = document.createElement('div');
        box.className = 'forecast-box';
        
        // Risk Check
        let riskClass = '';
        let riskLabel = 'Doses';
        if (i > minDaysSupply) {
            riskClass = 'risk';
            riskLabel = 'Refill Needed';
        }

        box.className = `forecast-box ${riskClass}`;
        
        box.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-count">${dailyDoseCount}</div>
            <div class="forecast-label">${riskLabel}</div>
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
