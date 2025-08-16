const breathingEndBtn = document.getElementById('breathingEndBtn');

if (breathingEndBtn) {
    breathingEndBtn.addEventListener('click', () => {
        stopBreathingGuide();
    });
}
const moodAudioFiles = {
    calm: 'music/calm1.mp3',
    focus: 'music/focus1.mp3',
    energize: 'music/energize1.mp3',
    sleep: 'music/sleep1.mp3'
};

const moodButtons = document.querySelectorAll('.mood-buttons button');
const moodQuote = document.getElementById('moodQuote');
const audioElement = document.getElementById('moodAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const timerSelect = document.getElementById('timerSelect');
let timerId = null;
const chimeAudioFile = 'audio/chime.mp3';
let chimeAudio = new Audio(chimeAudioFile);
let currentMood = null;
let isPlaying = false;

// Breathing Guide Elements
const breathingToggleBtn = document.getElementById('breathingToggleBtn');
const breathingGuide = document.getElementById('breathingGuide');
const breathingText = document.getElementById('breathingText');
let breathingActive = false;
let breathingInterval = null;

function setMood(mood) {
    document.body.className = mood;
    moodButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
    audioElement.src = moodAudioFiles[mood];
    audioElement.load();
    audioElement.loop = true;
    playAudio();
    playPauseBtn.textContent = 'Pause';
    isPlaying = true;
    currentMood = mood;
    clearTimer();
    setupTimer();
    showMoodQuote(mood);
}
// Show default quote on page load
if (typeof moodQuote !== 'undefined') {
    moodQuote.textContent = "Let's relax.";
}
moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        setMood(mood);
    });
});

function showMoodQuote(mood) {
    const quotes = {
        calm: 'Inhale peace, exhale stress.',
        focus: 'One step at a time.',
        energize: 'You got this!',
        sleep: 'Let your mind drift away.'
    };
    moodQuote.textContent = quotes[mood] || '';
}

function playAudio() {
    audioElement.play();
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
}

function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    clearTimer();
}


playPauseBtn.addEventListener('click', () => {
    if (!currentMood) return;
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
        setupTimer();
    }
});

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        setMood(mood);
    });
});

// ...existing code...
timerSelect.addEventListener('change', () => {
    if (isPlaying) {
        clearTimer();
        setupTimer();
    }
});

function setupTimer() {
    const minutes = parseInt(timerSelect.value, 10);
    if (!minutes || isNaN(minutes)) return;
    // Ensure audio loops during session
    audioElement.loop = true;
    timerId = setTimeout(() => {
        audioElement.loop = false;
        pauseAudio();
        chimeAudio.currentTime = 0;
        chimeAudio.play();
    }, minutes * 60 * 1000);
}

function clearTimer() {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
}

// Optionally, set a default mood on load
// setMood('calm');

// Breathing Guide Logic
const breathingSteps = [
    { text: 'Breathe In…', duration: 3200 },
    { text: 'Hold…', duration: 1600 },
    { text: 'Breathe Out…', duration: 3200 }
];

function startBreathingGuide() {
    breathingGuide.style.display = 'flex';
    breathingToggleBtn.textContent = 'Stop Breathing Guide';
    breathingActive = true;
    let step = 0;
    breathingText.textContent = breathingSteps[step].text;
    clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
        step = (step + 1) % breathingSteps.length;
        breathingText.textContent = breathingSteps[step].text;
    }, breathingSteps[step].duration);
    // Sync steps with animation
    let totalTime = 0;
    breathingSteps.forEach((s, i) => {
        setTimeout(() => {
            breathingText.textContent = s.text;
        }, totalTime);
        totalTime += s.duration;
    });
    breathingInterval = setInterval(() => {
        let totalTime = 0;
        breathingSteps.forEach((s, i) => {
            setTimeout(() => {
                breathingText.textContent = s.text;
            }, totalTime);
            totalTime += s.duration;
        });
    }, totalTime);
}

function stopBreathingGuide() {
    breathingGuide.style.display = 'none';
    breathingToggleBtn.textContent = 'Start Breathing Guide';
    breathingActive = false;
    clearInterval(breathingInterval);
}

breathingToggleBtn.addEventListener('click', () => {
    if (breathingActive) {
        stopBreathingGuide();
    } else {
        startBreathingGuide();
    }
});
