document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    
    // Email validation
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid && email !== '') {
            emailInput.classList.add('border-2', 'border-[#e87c03]');
            showError('Please enter a valid email address.');
        } else {
            emailInput.classList.remove('border-2', 'border-[#e87c03]');
            removeMessages();
        }
    });

    // Name validation
    nameInput.addEventListener('input', (e) => {
        const name = e.target.value;
        if (name.length < 2 && name !== '') {
            nameInput.classList.add('border-2', 'border-[#e87c03]');
            showError('Name should be at least 2 characters.');
        } else {
            nameInput.classList.remove('border-2', 'border-[#e87c03]');
            removeMessages();
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
            removeMessages();
        }
    });

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const name = nameInput.value;
        const password = passwordInput.value;

        // Basic validation
        if (!email || !name || !password) {
            showError('Please fill in all required fields.');
            return;
        }

        if (password.length < 6) {
            showError('Password should be at least 6 characters.');
            return;
        }

        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
        submitButton.disabled = true;

        try {
            // Get existing users
            const existingUsers = JSON.parse(localStorage.getItem('netflix_users') || '[]');
            
            // Check if email already exists
            if (existingUsers.some(user => user.email === email)) {
                showError('This email is already registered.');
                resetButton();
                return;
            }

            // Create new user
            const newUser = {
                email,
                name,
                password,
                createdAt: new Date().toISOString()
            };

            // Add to users list
            existingUsers.push(newUser);
            localStorage.setItem('netflix_users', JSON.stringify(existingUsers));

            // Set auth state
            localStorage.setItem('netflix_auth', JSON.stringify({
                email,
                name,
                isAuthenticated: true
            }));

            // Show success message
            showSuccess('Account created successfully!');

            // Redirect to browse page after a short delay
            setTimeout(() => {
                window.location.href = 'browse.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            showError('Something went wrong. Please try again.');
            resetButton();
        }
    });

    function resetButton() {
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Sign Up';
        submitButton.disabled = false;
    }
});

// Message handling
function showError(message) {
    removeMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-[#e87c03] text-sm p-2 mt-2 rounded';
    errorDiv.textContent = message;

    const form = document.getElementById('signup-form');
    form.insertBefore(errorDiv, form.querySelector('button'));
}

function showSuccess(message) {
    removeMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message text-green-500 text-sm p-2 mt-2 rounded bg-green-100/10';
    successDiv.textContent = message;

    const form = document.getElementById('signup-form');
    form.insertBefore(successDiv, form.querySelector('button'));
}

function removeMessages() {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) existingSuccess.remove();
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