// Check authentication state
function checkAuth() {
    const authState = localStorage.getItem('netflix_auth') || sessionStorage.getItem('netflix_auth');
    
    if (!authState) {
        window.location.href = 'login.html';
        return;
    }

    const { isAuthenticated } = JSON.parse(authState);
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
}

// Handle sign out
document.getElementById('signout-button').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear auth state
    localStorage.removeItem('netflix_auth');
    sessionStorage.removeItem('netflix_auth');
    
    // Redirect to login
    window.location.href = 'login.html';
});

// Handle navigation background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.remove('bg-gradient-to-b', 'from-black', 'to-transparent');
        nav.classList.add('bg-black');
    } else {
        nav.classList.add('bg-gradient-to-b', 'from-black', 'to-transparent');
        nav.classList.remove('bg-black');
    }
});

// Movie data (in a real app, this would come from an API)
const movies = [
    {
        id: 1,
        title: "The Witcher",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        image: "https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
        genre: ["Fantasy", "Action"],
        rating: "TV-MA",
        year: 2019
    },
    {
        id: 2,
        title: "Stranger Things",
        description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying forces in order to get him back.",
        image: "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
        genre: ["Drama", "Fantasy", "Horror"],
        rating: "TV-14",
        year: 2016
    }
    // Add more movies as needed
];

// Handle movie hover preview
document.querySelectorAll('.movie-item').forEach(item => {
    let previewTimeout;

    item.addEventListener('mouseenter', () => {
        previewTimeout = setTimeout(() => {
            // In a real implementation, this would load a video preview
            console.log('Loading preview...');
        }, 500);
    });

    item.addEventListener('mouseleave', () => {
        clearTimeout(previewTimeout);
    });
});

// Handle search functionality
const searchInput = document.querySelector('input[type="text"]');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter movies based on search term
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.genre.some(g => g.toLowerCase().includes(searchTerm))
        );

        // Update UI with filtered movies
        // In a real implementation, this would update the movie grid
        console.log('Filtered movies:', filteredMovies);
    });
}

// Handle movie click
document.querySelectorAll('.movie-item').forEach(item => {
    item.addEventListener('click', () => {
        // In a real implementation, this would open the movie detail modal or navigate to the watch page
        console.log('Opening movie details...');
    });
});

// Initialize tooltips
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
        const text = e.target.getAttribute('data-tooltip');
        // Show tooltip
        // In a real implementation, this would create and position a tooltip element
        console.log('Showing tooltip:', text);
    });
});

// Handle video player
function initializeVideoPlayer(videoElement) {
    if (!videoElement) return;

    const controls = {
        play: () => videoElement.play(),
        pause: () => videoElement.pause(),
        togglePlay: () => videoElement.paused ? videoElement.play() : videoElement.pause(),
        setVolume: (level) => {
            videoElement.volume = level;
            localStorage.setItem('netflix_volume', level);
        },
        toggleMute: () => {
            videoElement.muted = !videoElement.muted;
            localStorage.setItem('netflix_muted', videoElement.muted);
        },
        setProgress: (time) => {
            videoElement.currentTime = time;
        }
    };

    // Restore user preferences
    const savedVolume = localStorage.getItem('netflix_volume');
    const savedMuted = localStorage.getItem('netflix_muted');
    
    if (savedVolume) videoElement.volume = parseFloat(savedVolume);
    if (savedMuted) videoElement.muted = savedMuted === 'true';

    return controls;
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth);