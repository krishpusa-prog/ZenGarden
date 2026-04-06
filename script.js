const UNSPLASH_KEY = 'CWE3neCUMpKmo1H5y5Of87l5xoVYucP2_fJ72F0NOGo';

// 1. Fetch Dynamic Zen Content
async function getZenContent() {
  const loader = document.getElementById('loader');
  try {
    // Fetch Background from Unsplash
    const imgRes = await fetch(`https://api.unsplash.com/photos/random?query=nature,minimalist,zen&client_id=${UNSPLASH_KEY}`);
    const imgData = await imgRes.json();
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${imgData.urls.regular}')`;

    // Fetch Quote from ZenQuotes (Using 'today' mode)
    const quoteRes = await fetch('https://api.zenquotes.io/api/today');
    const quoteData = await quoteRes.json();
    
    document.getElementById('text').innerText = `"${quoteData[0].q}"`;
    document.getElementById('author').innerText = `- ${quoteData[0].a}`;
    
  } catch (error) {
    console.error("ZenGarden Error:", error);
    document.getElementById('text').innerText = "You are enough. Focus on the present moment.";
    document.getElementById('author').innerText = "- Zen Proverb";
  } finally {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 1000);
  }
}

// 2. Pomodoro Logic
let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;

function updateDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  document.title = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} - ZenTimer`;
}

function setTimer(minutes) {
  stopTimer();
  timeLeft = minutes * 60;
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById('start-timer').innerText = 'Pause';
  
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      document.getElementById('zen-bell').play();
      stopTimer();
      alert("Time to rest and breathe.");
      return;
    }
    timeLeft--;
    updateDisplay();
  }, 1000);
}

function stopTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  document.getElementById('start-timer').innerText = 'Start';
}

function toggleTimer() {
  if (isRunning) stopTimer();
  else startTimer();
}

function resetTimer() {
  stopTimer();
  timeLeft = 25 * 60;
  updateDisplay();
}

// 3. Todo List Logic
function initTodo() {
  const todoList = document.getElementById('todo');
  const todoInput = document.getElementById('todoInput');
  const todoButton = document.getElementById("todoButton");

  todoButton.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer;">×</button>
      `;
      li.querySelector('.delete-btn').onclick = () => li.remove();
      todoList.appendChild(li);
      todoInput.value = '';
    }
  });

  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') todoButton.click();
  });
}

// 4. Panel & Tools Logic
function setupPanel() {
  const panel = document.getElementById('features-panel');
  const trigger = document.getElementById('sidebar-trigger');
  const close = document.getElementById('close-panel');

  trigger.addEventListener('click', () => panel.classList.add('active'));
  close.addEventListener('click', () => panel.classList.remove('active'));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
      panel.classList.remove('active');
    }
  });
}

function initMindfulnessTools() {
  // Breathing Tool
  const breathModal = document.getElementById('breathing-modal');
  const breathText = document.getElementById('breath-text');
  
  document.getElementById('open-breathing').addEventListener('click', () => {
    breathModal.classList.add('active');
    startBreathingGuide();
  });

  const closeBreathing = document.querySelector('.close-breathing');
  closeBreathing.addEventListener('click', () => {
    breathModal.classList.remove('active');
    clearInterval(breathInterval);
  });

  let breathInterval;
  function startBreathingGuide() {
    let phase = 0; // 0: Inhale, 1: Hold, 2: Exhale
    const phases = ["Inhale deeply...", "Hold briefly...", "Exhale slowly..."];
    
    breathText.innerText = phases[0];
    breathInterval = setInterval(() => {
      phase = (phase + 1) % 3;
      breathText.innerText = phases[phase];
    }, 4000);
  }

  // Music Tool
  const musicBtn = document.getElementById('play-pause-music');
  const audio = document.getElementById('bg-music');
  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      musicBtn.innerText = "Pause";
    } else {
      audio.pause();
      musicBtn.innerText = "Play";
    }
  });

  // Theme Toggle (Quick Background Change)
  document.getElementById('theme-toggle').addEventListener('click', async () => {
    const loader = document.getElementById('loader');
    loader.classList.remove('fade-out');
    await getZenContent();
    loader.classList.add('fade-out');
  });
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  getZenContent();
  initTodo();
  setupPanel();
  initMindfulnessTools();
  
  // Attach timer listeners
  document.getElementById('start-timer').addEventListener('click', toggleTimer);
  document.getElementById('reset-timer').addEventListener('click', resetTimer);
  updateDisplay();
});
