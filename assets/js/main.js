console.log('Job Assistant script loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Sign Up Form Handling with API Integration
    const signupForm = document.getElementById('signupForm');
    const successModal = document.getElementById('successModal');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validate inputs
            if (!username || !email || !password) {
                Auth.showError(signupForm, 'Please fill in all fields');
                return;
            }

            if (!Auth.validateEmail(email)) {
                Auth.showError(signupForm, 'Please enter a valid email address');
                return;
            }

            const passwordValidation = Auth.validatePassword(password);
            if (!passwordValidation.isValid) {
                Auth.showError(signupForm, passwordValidation.message);
                return;
            }

            // Show loading state
            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Creating Account...';
            btn.disabled = true;

            try {
                // Call API
                const result = await Auth.register(username, password, email);

                if (result.success) {
                    // Show success modal
                    if (successModal) {
                        successModal.classList.add('active');
                    } else {
                        // Fallback if modal doesn't exist
                        Auth.showSuccess(signupForm, 'Account created successfully!');
                        setTimeout(() => {
                            window.location.href = 'preferences-step1.html';
                        }, 1500);
                    }
                } else {
                    // Show error message
                    Auth.showError(signupForm, result.error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Signup error:', error);
                Auth.showError(signupForm, 'An unexpected error occurred. Please try again.');
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});

function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
        // Redirect to Onboarding Step 1
        setTimeout(() => {
            window.location.href = 'preferences-step1.html';
        }, 500);
    }
}
