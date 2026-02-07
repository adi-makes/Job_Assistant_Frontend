console.log('Preferences script loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Determine current step based on URL or body class
    const path = window.location.pathname;

    // Step 1: Values
    if (path.includes('preferences-step1.html')) {
        setupSelectionLogic('option-card', 1, 3); // Min 1, Max 3
    }
});

/**
 * Shared Logic for selection
 * @param {string} className - Class of the selectable item
 * @param {number} minSelection - Minimum items to enable 'Next'
 * @param {number} maxSelection - Maximum items allowed
 */
function setupSelectionLogic(className, minSelection, maxSelection) {
    const options = document.querySelectorAll(`.${className}`);
    const nextBtn = document.getElementById('nextBtn');
    let selectedCount = 0;

    options.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                selectedCount--;
            } else {
                if (maxSelection && selectedCount >= maxSelection) {
                    // Optional: Visual cue that max reached
                    return;
                }
                option.classList.add('selected');
                selectedCount++;
            }
            updateNextButton(nextBtn, selectedCount >= minSelection);

            // Save to localStorage
            saveSelection(option.dataset.value, option.classList.contains('selected'));

            // Sub-section Logic (Step 2)
            if (option.dataset.targetSection) {
                toggleSubSection(option.dataset.targetSection, option.classList.contains('selected'));
            }
        });
    });
}

function toggleSubSection(sectionId, isActive) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (isActive) {
            section.classList.add('active');
            // Auto scroll to sub-section
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        } else {
            section.classList.remove('active');
        }
    }
}

function updateNextButton(btn, isEnabled) {
    if (btn) {
        btn.disabled = !isEnabled;
    }
}

function saveSelection(value, isSelected) {
    // Just a placeholder for now
    console.log(`Value: ${value}, Selected: ${isSelected}`);
}

// City Search Logic
const citySearchInput = document.getElementById('citySearch');
if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.option-card');

        cards.forEach(card => {
            const label = card.querySelector('.option-label');
            if (label) {
                const text = label.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'flex'; // Show
                } else {
                    card.style.display = 'none'; // Hide
                }
            }
        });
    });
}

// Industry Dual Search Logic
function setupGridSearch(inputId, gridId) {
    const input = document.getElementById(inputId);
    const grid = document.getElementById(gridId);
    
    if (input && grid) {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = grid.querySelectorAll('.option-card');
            
            cards.forEach(card => {
                const label = card.querySelector('.option-label');
                if (label) {
                    const text = label.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }
}

// Initialize for Step 6
setupGridSearch('searchWant', 'gridWant');
setupGridSearch('searchAvoid', 'gridAvoid');

// Skill Search Logic
const skillSearchInput = document.getElementById('skillSearch');
if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const skills = document.querySelectorAll('.skill-tag');
        
        skills.forEach(skill => {
            const span = skill.querySelector('span:first-child');
            if (span) {
                const text = span.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    skill.style.display = 'flex';
                } else {
                    skill.style.display = 'none';
                }
            }
        });
    });
}

// Global handlers for Skill Step (Step 7)
window.toggleSkill = function(element) {
    if (element) element.classList.toggle('selected');
}

window.toggleHeart = function(e, heartElement) {
    if (e && heartElement) {
        e.stopPropagation();
        heartElement.classList.toggle('loved');
        if (heartElement.classList.contains('loved')) {
            // If loved, allow it to select the parent as well
            const parent = heartElement.closest('.skill-tag');
            if (parent) parent.classList.add('selected');
        }
    }
}
