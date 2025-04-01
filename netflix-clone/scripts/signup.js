// Form validation and submission
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const emailInput = signupForm.querySelector('input[type="email"]');
    const passwordInput = signupForm.querySelector('input[type="password"]');
    
    // Email validation
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid && email !== '') {
            emailInput.classList.add('border-2', 'border-[#e87c03]');
            showError('Please enter a valid email address.');
        } else {
            emailInput.classList.remove('border-2', 'border-[#e87c03]');
            removeError();
        }
    });

    // Password validation
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        if (password.length < 6 && password !== '') {
            passwordInput.classList.add('border-2', 'border-[#e87c03]');
            showError('Password should be at least 6 characters.');
        } else {
            passwordInput.classList.remove('border-2', 'border-[#e87c03]');
            removeError();
        }
    });

    // Form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const wantsOffers = signupForm.querySelector('#offers').checked;

        // Basic validation
        if (!email || !password) {
            showError('Please fill in all required fields.');
            return;
        }

        if (password.length < 6) {
            showError('Password should be at least 6 characters.');
            return;
        }

        // Store user data (in a real app, this would be sent to a backend)
        const userData = {
            email,
            password,
            wantsOffers,
            createdAt: new Date().toISOString()
        };

        try {
            // Store in localStorage for demo purposes
            const existingUsers = JSON.parse(localStorage.getItem('netflix_users') || '[]');
            
            // Check if email already exists
            if (existingUsers.some(user => user.email === email)) {
                showError('This email is already registered.');
                return;
            }

            existingUsers.push(userData);
            localStorage.setItem('netflix_users', JSON.stringify(existingUsers));

            // Auto login after signup
            localStorage.setItem('netflix_auth', JSON.stringify({
                email,
                isAuthenticated: true
            }));

            // Show success message and redirect
            showSuccess('Account created successfully!');
            setTimeout(() => {
                window.location.href = 'browse.html';
            }, 1500);

        } catch (error) {
            showError('Something went wrong. Please try again.');
            console.error('Signup error:', error);
        }
    });
});

// Error handling
function showError(message) {
    removeError(); // Remove any existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-[#e87c03] text-sm p-2 mt-2 rounded';
    errorDiv.textContent = message;

    const form = document.getElementById('signup-form');
    form.insertBefore(errorDiv, form.querySelector('button'));
}

function removeError() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Success message
function showSuccess(message) {
    removeError(); // Remove any existing error messages
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message text-green-600 text-sm p-2 mt-2 rounded bg-green-100';
    successDiv.textContent = message;

    const form = document.getElementById('signup-form');
    form.insertBefore(successDiv, form.querySelector('button'));
}

// Check if user is already logged in
function checkAuthState() {
    const authState = localStorage.getItem('netflix_auth');
    
    if (authState) {
        const { isAuthenticated } = JSON.parse(authState);
        if (isAuthenticated) {
            window.location.href = 'browse.html';
        }
    }
}

// Check auth state when page loads
checkAuthState();

// Add loading state to signup button
const signupButton = document.querySelector('button[type="submit"]');
if (signupButton) {
    signupButton.addEventListener('click', () => {
        if (document.getElementById('signup-form').checkValidity()) {
            signupButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
            signupButton.disabled = true;
            
            // Reset button after 2 seconds if signup fails
            setTimeout(() => {
                if (signupButton.disabled) {
                    signupButton.innerHTML = 'Next';
                    signupButton.disabled = false;
                }
            }, 2000);
        }
    });
}