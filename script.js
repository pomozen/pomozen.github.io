document.addEventListener('DOMContentLoaded', () => {
    const circle = document.querySelector('.progress-ring__circle');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const workInput = document.getElementById('workTime');
    const breakInput = document.getElementById('breakTime');
    const setTimeButton = document.getElementById('setTime');
    const phaseDisplay = document.getElementById('phase');
    const sessionsDisplay = document.getElementById('sessions');
    const totalTimeStudiedDisplay = document.getElementById('totalTimeStudied');
    const resetTimeStudiedButton = document.getElementById('resetTimeStudied');
    const themeToggleButton = document.getElementById('themeToggle');

    let radius = circle.r.baseVal.value;
    let circumference = radius * Math.PI * 2;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    let totalTime; // Total time for the current phase in seconds
    let timeLeft; // Remaining time in seconds
    let startTime; // Timestamp when the timer started
    let isRunning = false;
    let isWorkPhase = true;
    let timerInterval;
    let sessionsCompleted = 0;
    let totalTimeStudied = parseInt(localStorage.getItem('totalTimeStudied')) || 0;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update progress ring
        const progress = timeLeft / totalTime;
        circle.style.strokeDashoffset = circumference * (1 - progress);
    }

    function startTimer() {
        if (isRunning) return;

        isRunning = true;
        startTime = Date.now();

        timerInterval = setInterval(() => {
            const now = Date.now();
            const elapsedTime = Math.floor((now - startTime) / 1000);
            timeLeft = totalTime - elapsedTime;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                switchPhase();
            } else {
                updateTimerDisplay();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;

        isRunning = false;
        clearInterval(timerInterval);
        totalTime -= Math.floor((Date.now() - startTime) / 1000); // Adjust total time left
    }

    function resetTimer() {
        pauseTimer();
        isWorkPhase = true;
        totalTime = workInput.value ? parseInt(workInput.value) * 60 : 25 * 60;
        timeLeft = totalTime;
        phaseDisplay.textContent = 'Work';
        updateTimerDisplay();
        circle.style.strokeDashoffset = circumference; // Reset progress ring
        sessionsCompleted = 0;
        sessionsDisplay.textContent = 'Sessions: ' + sessionsCompleted;
    }

    function switchPhase() {
        isWorkPhase = !isWorkPhase;

        if (isWorkPhase) {
            phaseDisplay.textContent = 'Work';
            totalTime = workInput.value ? parseInt(workInput.value) * 60 : 25 * 60;
            alert("Break's over! Back to work.");
            totalTimeStudied += workInput.value ? parseInt(workInput.value) : 25; // Add work time to total studied
            localStorage.setItem('totalTimeStudied', totalTimeStudied.toString());
            updateTotalTimeStudiedDisplay();
        } else {
            phaseDisplay.textContent = 'Break';
            totalTime = breakInput.value ? parseInt(breakInput.value) * 60 : 5 * 60;
            alert("Work time's up! Starting break.");
            sessionsCompleted++;
            sessionsDisplay.textContent = 'Sessions: ' + sessionsCompleted;
        }

        timeLeft = totalTime;
        updateTimerDisplay();
        startTimer();
    }

    function updateTotalTimeStudiedDisplay() {
        totalTimeStudiedDisplay.textContent = `Total Time Studied: ${totalTimeStudied} minutes`;
    }

    // Set time button functionality
    setTimeButton.addEventListener('click', () => {
        resetTimer();
        totalTime = (workInput.value ? parseInt(workInput.value) : 25) * 60 || totalTime;
        timeLeft = (workInput.value ? parseInt(workInput.value) : totalTime / 60) * 60 || timeLeft;

        updateTimerDisplay();
    });

    // Button event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);

    resetTimeStudiedButton.addEventListener('click', () => {
        totalTimeStudied = 0;
        localStorage.setItem('totalTimeStudied', '0');
        updateTotalTimeStudiedDisplay();
    });

    themeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    });

    // Task Management
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class='task-item'>
                    <input type='checkbox'>
                    <span>${taskText}</span>
                </div>
                <button class='deleteTask'>Delete</button>`;
            taskList.appendChild(listItem);
            taskInput.value = '';
        }
    }

    function deleteTask(event) {
        if (event.target.classList.contains('deleteTask')) {
            event.target.parentElement.remove();
        }
    }

    function toggleComplete(event) {
        if (event.target.type === 'checkbox') {
            const listItem = event.target.parentElement.parentElement;
            const span = listItem.querySelector('span');
            span.classList.toggle('completed');
        }
    }

    addTaskButton.addEventListener('click', addTask);

    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteTask')) {
            deleteTask(event);
        } else if (event.target.type === 'checkbox') {
            toggleComplete(event);
        }
    });

    // Initialize display
    resetTimer();
    updateTotalTimeStudiedDisplay();
});
