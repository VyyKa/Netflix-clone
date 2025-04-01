document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const authState = localStorage.getItem('netflix_auth') || sessionStorage.getItem('netflix_auth');
    if (!authState || !JSON.parse(authState).isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Video Player Elements
    const videoPlayer = document.getElementById('video-player');
    const videoControls = document.getElementById('video-controls');
    const playPauseBtn = document.getElementById('play-pause');
    const rewindBtn = document.getElementById('rewind');
    const forwardBtn = document.getElementById('forward');
    const volumeBtn = document.getElementById('volume');
    const volumeBar = document.getElementById('volume-bar');
    const volumeLevel = document.getElementById('volume-level');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const fullscreenBtn = document.getElementById('fullscreen');
    const subtitlesBtn = document.getElementById('subtitles');
    const settingsBtn = document.getElementById('settings');
    const episodesPanel = document.getElementById('episodes-panel');

    // Store the last activity timestamp
    let lastActivity = Date.now();
    let controlsTimeout;

    // Initialize player state
    let isPlaying = false;
    let isMuted = false;
    let currentVolume = 1;

    // Format time in minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update progress bar
    function updateProgress() {
        const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;
        currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
    }

    // Toggle play/pause
    function togglePlay() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause text-2xl"></i>';
            isPlaying = true;
        } else {
            videoPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play text-2xl"></i>';
            isPlaying = false;
        }
    }

    // Handle volume changes
    function updateVolume(e) {
        const rect = volumeBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        
        videoPlayer.volume = percentage;
        volumeLevel.style.width = `${percentage * 100}%`;
        currentVolume = percentage;
        
        // Update volume icon
        if (percentage === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute text-xl"></i>';
            isMuted = true;
        } else if (percentage < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down text-xl"></i>';
            isMuted = false;
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up text-xl"></i>';
            isMuted = false;
        }
    }

    // Toggle mute
    function toggleMute() {
        if (isMuted) {
            videoPlayer.volume = currentVolume;
            volumeLevel.style.width = `${currentVolume * 100}%`;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up text-xl"></i>';
        } else {
            videoPlayer.volume = 0;
            volumeLevel.style.width = '0%';
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute text-xl"></i>';
        }
        isMuted = !isMuted;
    }

    // Handle seeking
    function seek(e) {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        videoPlayer.currentTime = percentage * videoPlayer.duration;
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress text-xl"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand text-xl"></i>';
        }
    }

    // Show/hide controls based on activity
    function showControls() {
        lastActivity = Date.now();
        videoControls.style.opacity = '1';
        document.body.style.cursor = 'default';
        
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(hideControls, 3000);
    }

    function hideControls() {
        if (Date.now() - lastActivity > 3000 && isPlaying) {
            videoControls.style.opacity = '0';
            document.body.style.cursor = 'none';
        }
    }

    // Skip forward/backward
    function skip(seconds) {
        videoPlayer.currentTime += seconds;
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    videoPlayer.addEventListener('click', togglePlay);
    videoPlayer.addEventListener('timeupdate', updateProgress);
    
    videoPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(videoPlayer.duration);
    });

    volumeBtn.addEventListener('click', toggleMute);
    volumeBar.addEventListener('click', updateVolume);
    
    progressBar.addEventListener('click', seek);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    rewindBtn.addEventListener('click', () => skip(-10));
    forwardBtn.addEventListener('click', () => skip(10));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMute();
                break;
            case 'arrowleft':
                skip(-5);
                break;
            case 'arrowright':
                skip(5);
                break;
        }
    });

    // Mouse movement tracking
    document.addEventListener('mousemove', showControls);
    
    // Episodes panel toggle
    settingsBtn.addEventListener('click', () => {
        episodesPanel.classList.toggle('translate-x-full');
    });

    // Initialize video player
    videoPlayer.volume = currentVolume;
    durationEl.textContent = '0:00';
    showControls();
});