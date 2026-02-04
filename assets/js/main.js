console.log('resunex.ai script loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Sign Up Form Handling
    const signupForm = document.getElementById('signupForm');
    const successModal = document.getElementById('successModal');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API call
            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Creating Account...';
            btn.disabled = true;

            setTimeout(() => {
                if (successModal) {
                    successModal.classList.add('active');
                }
                btn.innerText = originalText;
                btn.disabled = false;
                signupForm.reset();
            }, 1500);
        });
    }
});

function closeModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
        // Optional: Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
}
