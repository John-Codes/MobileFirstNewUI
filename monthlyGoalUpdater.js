// monthlyGoalUpdater.js

function parseCSVGoal() {
    const csvData = localStorage.getItem('monthlyGoalCSV');
    if (!csvData) return { goal: '', startDate: '', totalRemainingDays: 0 };

    const [goal, startDate, totalRemainingDays] = csvData.split(',');
    return { goal, startDate, totalRemainingDays: parseInt(totalRemainingDays, 10) };
}

function updateTotalRemainingDays() {
    let monthlyGoalData = parseCSVGoal();

    if (monthlyGoalData.startDate) {
        const startDate = new Date(monthlyGoalData.startDate);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        monthlyGoalData.totalRemainingDays = Math.max(30 - daysPassed, 0);
        
        // Update CSV
        const csvData = `${monthlyGoalData.goal},${monthlyGoalData.startDate},${monthlyGoalData.totalRemainingDays}`;
        localStorage.setItem('monthlyGoalCSV', csvData);
    }
}

// Run updateTotalRemainingDays when the page loads
window.addEventListener('load', updateTotalRemainingDays);

// Optionally, export the function if you're using ES6 modules
// export { updateTotalRemainingDays };