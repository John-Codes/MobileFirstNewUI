
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
        let monthlyGoal = localStorage.getItem('monthlyGoal') || '';
        monthGoalInput.value = monthlyGoal;

        activateMonthGoals.checked = localStorage.getItem('monthGoalsActive') === 'true';
        monthGoalContainer.style.display = activateMonthGoals.checked ? 'block' : 'none';

        activateMonthGoals.addEventListener('change', function() {
            monthGoalContainer.style.display = this.checked ? 'block' : 'none';
            localStorage.setItem('monthGoalsActive', this.checked);
        });

        saveButton.addEventListener('click', function() {
            monthlyGoal = monthGoalInput.value;
            localStorage.setItem('monthlyGoal', monthlyGoal);
            alert('Monthly goal saved: ' + monthlyGoal);
        });
    