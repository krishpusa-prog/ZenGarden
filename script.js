

const UNSPLASH_KEY = 'CWE3neCUMpKmo1H5y5Of87l5xoVYucP2_fJ72F0NOGo';

async function getZenContent() {
  const loader = document.getElementById('loader');
  try {
    // 1. Fetch Background from Unsplash
    const imgRes = await fetch(`https://api.unsplash.com/photos/random?query=nature,zen&client_id=${UNSPLASH_KEY}`);
    const imgData = await imgRes.json();
    document.body.style.backgroundImage = `url('${imgData.urls.regular}')`;


    // 2. Fetch Quote from ZenQuotes (Using 'today' mode)
    // Note: If you face CORS issues, use a proxy or their specific 'today' endpoint
    const quoteRes = await fetch('https://api.zenquotes.io/api/today');
    const quoteData = await quoteRes.json();
    
    document.getElementById('text').innerText = `"${quoteData[0].q}"`;
    document.getElementById('author').innerText = `- ${quoteData[0].a}`;
    
  } catch (error) {
    console.error("ZenGarden Error:", error);
    
    document.getElementById('text').innerText = "You are enough. Focus on the present moment.";
    document.getElementById('author').innerText = "- Zen Proverb";
  }finally {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 1000);
}}

//To-do list
function todo(){
  const todoList=document.getElementById('todo');
  const todoItem=document.getElementById('todoInput');
  const todoButton=document.getElementById("todoButton");
  todoButton.addEventListener('click',function(){
    const textValue=todoItem.value;
    if(textValue.trim()!==''){
      const listItem=document.createElement('li');
      listItem.textContent=textValue;
      todoList.appendChild(listItem);
      
    }
    todoItem.value='';
    todoItem.add.classList('disabled')
  })

}
//sidebar
function setupPanel() {
  const sidebarIcon = document.getElementById('pomodoro-icon'); // The icon in the thin strip
  const panel = document.getElementById('features-panel');

  sidebarIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents clicks from bubbling up
    panel.classList.add('active');
    console.log("Sidebar opened, timer NOT started.");
  });
}

//pomodor logic
let timerInterval;
let timeLeft = 25 * 60;
let isBreak = false;

// Function to allow user to pick time
function setTimer(minutes) {
  clearInterval(timerInterval);
  timeLeft = minutes * 60;
  document.getElementById('start-timer').innerText = 'Start';
  updateDisplay();
}

function updateDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function initPomodoro() {
  const modal = document.getElementById('pomodoro-modal');
  const startBtn = document.getElementById('start-timer');
  const resetBtn = document.getElementById('reset-timer');
  const closeModal = document.querySelector('.close-modal');

  document.getElementById('open-timer-btn').addEventListener('click', () => modal.classList.add('active'));
  closeModal.addEventListener('click', () => modal.classList.remove('active'));

  startBtn.addEventListener('click', () => {
    if (startBtn.innerText === 'Start') {
      startBtn.innerText = 'Pause';
      timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
          document.getElementById('zen-bell').play();
          clearInterval(timerInterval);
          alert("Session Finished!");
          return;
        }
        timeLeft--;
        updateDisplay();
      }, 1000);
    } else {
      startBtn.innerText = 'Start';
      clearInterval(timerInterval);
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    updateDisplay();
    startBtn.innerText = 'Start';
  });
}

function setupPanel() {
  const panel = document.getElementById('features-panel');
  document.getElementById('sidebar-trigger').addEventListener('click', () => panel.classList.add('active'));
  document.getElementById('close-panel').addEventListener('click', () => panel.classList.remove('active'));
}

function initMindfulnessTools() {
  // Breathing
  const breathModal = document.getElementById('breathing-modal');
  document.getElementById('open-breathing').addEventListener('click', () => breathModal.classList.add('active'));
  document.querySelector('.close-breathing').addEventListener('click', () => breathModal.classList.remove('active'));

  // Music (Now global)
  const musicBtn = document.getElementById('play-pause-music');
  const audio = document.getElementById('bg-music');
  musicBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); musicBtn.innerText = "Pause"; }
    else { audio.pause(); musicBtn.innerText = "Play"; }
  });

  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });
}

// Run on load
window.addEventListener('DOMContentLoaded', ()=>{
  getZenContent();
  todo();
  setupPanel();
  initPomodoro();
  initMindfulnessTools();
});

