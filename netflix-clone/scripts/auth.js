// Mock user data (in a real app, this would be handled by a backend)
const mockUsers = [
    { email: 'test@example.com', password: 'password123' }
];

// Form validation and submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; // Exit if form not found

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    
    // Email validation
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid && email !== '') {
            emailInput.classList.add('border-2', 'border-[#e87c03]');
        } else {
            emailInput.classList.remove('border-2', 'border-[#e87c03]');
        }
    });

    // Password validation
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        if (password.length < 6 && password !== '') {
            passwordInput.classList.add('border-2', 'border-[#e87c03]');
        } else {
            passwordInput.classList.remove('border-2', 'border-[#e87c03]');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = loginForm.querySelector('input[type="checkbox"]').checked;

        // Basic validation
        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }

        // Check credentials
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store auth state
            const authData = { email, isAuthenticated: true };
            if (rememberMe) {
                localStorage.setItem('netflix_auth', JSON.stringify(authData));
            } else {
                sessionStorage.setItem('netflix_auth', JSON.stringify(authData));
            }
            
            // Show loading state
            const signInButton = loginForm.querySelector('button[type="submit"]');
            signInButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
            signInButton.disabled = true;

            // Redirect to browse page after a short delay
            setTimeout(() => {
                window.location.href = 'browse.html';
            }, 1000);
        } else {
            showError('Sorry, we can\'t find an account with this email address and password.');
            
            // Reset button state
            const signInButton = loginForm.querySelector('button[type="submit"]');
            signInButton.innerHTML = 'Sign In';
            signInButton.disabled = false;
        }
    });
});

// Error handling
function showError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-[#e87c03] text-sm p-2 mt-2 rounded';
    errorDiv.textContent = message;

    const form = document.getElementById('login-form');
    form.insertBefore(errorDiv, form.querySelector('button'));
}

// Check if user is already logged in
function checkAuthState() {
    const authState = localStorage.getItem('netflix_auth') || sessionStorage.getItem('netflix_auth');
    
    if (authState) {
        const { isAuthenticated } = JSON.parse(authState);
        if (isAuthenticated) {
            window.location.href = 'browse.html';
        }
    }
}

// Check auth state when page loads
checkAuthState();

// Handle "Remember me" checkbox
const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');
if (rememberMeCheckbox) {
    // Check if there's a remembered login
    const remembered = localStorage.getItem('netflix_auth');
    if (remembered) {
        rememberMeCheckbox.checked = true;
    }
}