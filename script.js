document.addEventListener('DOMContentLoaded', () => {
    const circle = document.querySelector('.progress-ring__circle');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const workInput = document.getElementById('workTime');
    const breakInput = document.getElementById('breakTime');
    const setTimeButton = document.getElementById('setTime'); // Define setTimeButton here
    const phaseDisplay = document.getElementById('phase');
    const sessionsDisplay = document.getElementById('sessions');
    const totalTimeStudiedDisplay = document.getElementById('totalTimeStudied');
    const resetTimeStudiedButton = document.getElementById('resetTimeStudied'); // Reset Button

    let radius = circle.r.baseVal.value;
    let circumference = radius * Math.PI * 2;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    let timeLeft = 25 * 60; // Default work time in seconds
    let totalTime = timeLeft;
    let timerInterval;
    let isWorkPhase = true;
    let sessionsCompleted = 0;
    let totalTimeStudied = parseInt(localStorage.getItem('totalTimeStudied')) || 0; // Load from local storage

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        // Update progress ring
        const progress = timeLeft / totalTime;
        circle.style.strokeDashoffset = circumference * (1 - progress);
    }

    function startTimer() {
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    playSound();
                    switchPhase();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        pauseTimer();
        isWorkPhase = true;
        timeLeft = workInput.value ? parseInt(workInput.value) * 60 : 25 * 60;
        totalTime = timeLeft;
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
            timeLeft = totalTime;
            alert("Break's over! Back to work.");
             updateTimerDisplay();
        startTimer();
         totalTimeStudied += (workInput.value ? parseInt(workInput.value) : 25);
          localStorage.setItem('totalTimeStudied', totalTimeStudied.toString());
          updateTotalTimeStudiedDisplay();
        } else {
            phaseDisplay.textContent = 'Break';
            totalTime = breakInput.value ? parseInt(breakInput.value) * 60 : 5 * 60;
            timeLeft = totalTime;
            alert("Work time's up! Starting break.");
            sessionsCompleted++;
            sessionsDisplay.textContent = 'Sessions: ' + sessionsCompleted;
              updateTimerDisplay();
              startTimer();
        }
       
    }

    function playSound() {
        const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
        audio.play().catch(err => console.error('Audio error:', err));
    }

    setTimeButton.addEventListener('click', () => {
        resetTimer();
        totalTime = (workInput.value ? parseInt(workInput.value) : 25) * 60 || totalTime;
        timeLeft = (workInput.value ? parseInt(workInput.value) : totalTime / 60) * 60 || timeLeft;
        updateTimerDisplay();
    });

    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);

    // Initialize display
    updateTimerDisplay();
    updateTotalTimeStudiedDisplay();

    // Task Management
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="task-item">
                    <input type="checkbox">
                    <span>${taskText}</span>
                </div>
                <button class="deleteTask">Delete</button>
            `;
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

    function updateTotalTimeStudiedDisplay() {
      totalTimeStudiedDisplay.textContent = `Total Time Studied: ${totalTimeStudied} minutes`;
    }

    // Add task on Enter key press
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            addTask();
        }
    });
    
    // Reset total time studied
    resetTimeStudiedButton.addEventListener('click', () => {
        totalTimeStudied = 0;
        localStorage.setItem('totalTimeStudied', '0');
        updateTotalTimeStudiedDisplay();
    });
});

