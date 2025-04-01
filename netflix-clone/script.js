// Handle header background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('bg-black');
        header.classList.remove('bg-gradient-to-b', 'from-black', 'to-transparent');
    } else {
        header.classList.remove('bg-black');
        header.classList.add('bg-gradient-to-b', 'from-black', 'to-transparent');
    }
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-button');
        const answer = item.querySelector('.faq-answer');
        const icon = button.querySelector('.fa-plus');
        
        button.addEventListener('click', () => {
            const isOpen = !answer.classList.contains('hidden');
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.fa-plus');
                    otherAnswer.classList.add('hidden');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current answer
            answer.classList.toggle('hidden');
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
        });
    });
});

// Email validation
const emailInputs = document.querySelectorAll('input[type="email"]');

emailInputs.forEach(input => {
    const nearestButton = input.parentElement.querySelector('button');
    
    input.addEventListener('input', () => {
        const email = input.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (isValid) {
            input.style.borderColor = '#2ecc71';
            nearestButton.removeAttribute('disabled');
        } else {
            input.style.borderColor = email ? '#e74c3c' : '';
            nearestButton.setAttribute('disabled', 'true');
        }
    });
});

// Language selector functionality
const languageSelectors = document.querySelectorAll('select');
languageSelectors.forEach(selector => {
    selector.addEventListener('change', (e) => {
        const language = e.target.value;
        // Here you would typically handle language change
        console.log(`Language changed to: ${language}`);
    });
});

// Video autoplay handling
document.querySelectorAll('video').forEach(video => {
    // Play videos when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(() => {
                    // Autoplay might be blocked by browser settings
                    console.log('Video autoplay blocked by browser');
                });
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(video);
});

// Initialize loading state for images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});