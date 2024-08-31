const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const activateMonthGoals = document.getElementById('activateMonthGoals');
const monthGoalContainer = document.getElementById('monthGoalContainer');
const monthGoalInput = document.getElementById('monthGoalInput');
const saveButton = document.getElementById('saveButton');

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

hamburgerMenu.addEventListener('click', function(event) {
    event.stopPropagation();
    toggleSidebar();
});

document.addEventListener('click', function(event) {
    const isClickInside = sidebar.contains(event.target) || hamburgerMenu.contains(event.target);
    if (!isClickInside && sidebar.classList.contains('open')) {
        toggleSidebar();
    }
});

// Monthly goal functionality
let monthlyGoalData = JSON.parse(localStorage.getItem('monthlyGoalData')) || { goal: '', startDate: '', totalRemainingDays: 30 };

function updateTotalRemainingDays() {
    if (monthlyGoalData.startDate) {
        const startDate = new Date(monthlyGoalData.startDate);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        monthlyGoalData.totalRemainingDays = Math.max(30 - daysPassed, 0);
        
        // Update localStorage and CSV
        localStorage.setItem('monthlyGoalData', JSON.stringify(monthlyGoalData));
        updateCSV();
    }
}

function updateCSV() {
    const csvData = `${monthlyGoalData.goal},${monthlyGoalData.startDate},${monthlyGoalData.totalRemainingDays}`;
    localStorage.setItem('monthlyGoalCSV', csvData);
}

// Run updateTotalRemainingDays when the page loads
window.addEventListener('load', function() {
    updateTotalRemainingDays();
    if (monthlyGoalData.goal) {
        monthGoalInput.value = monthlyGoalData.goal;
    }
});

monthGoalInput.value = monthlyGoalData.goal;

activateMonthGoals.checked = localStorage.getItem('monthGoalsActive') === 'true';
monthGoalContainer.style.display = activateMonthGoals.checked ? 'block' : 'none';

activateMonthGoals.addEventListener('change', function() {
    monthGoalContainer.style.display = this.checked ? 'block' : 'none';
    localStorage.setItem('monthGoalsActive', this.checked);
});

saveButton.addEventListener('click', function() {
    monthlyGoalData.goal = monthGoalInput.value;
    monthlyGoalData.startDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    monthlyGoalData.totalRemainingDays = 30; // Reset to 30 days when a new goal is set

    localStorage.setItem('monthlyGoalData', JSON.stringify(monthlyGoalData));
    updateCSV();

    alert('Monthly goal saved: ' + localStorage.getItem('monthlyGoalCSV'));
});