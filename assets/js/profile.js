// Profile Page JavaScript
// Handles loading and updating user profile data

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    Auth.requireAuth();

    // DOM elements
    const profileForm = document.getElementById('profileForm');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordEyeIcon = document.getElementById('passwordEyeIcon');

    // Form fields
    const firstNameInput = document.getElementById('profileFirstName');
    const lastNameInput = document.getElementById('profileLastName');
    const usernameInput = document.getElementById('profileUsername');
    const emailInput = document.getElementById('profileEmail');
    const passwordInput = document.getElementById('profilePassword');
    const bioInput = document.getElementById('profileBio');
    const linkedinInput = document.getElementById('profileLinkedin');
    const githubInput = document.getElementById('profileGithub');
    const portfolioInput = document.getElementById('profilePortfolio');

    let isEditMode = false;
    let originalData = {};

    // Load profile data
    await loadProfile();

    // Event listeners
    if (editBtn) {
        editBtn.addEventListener('click', () => toggleEditMode(true));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            toggleEditMode(false);
            restoreOriginalData();
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfile();
        });
    }

    // Add logout functionality to user menu
    setupLogout();

    // Password visibility toggle
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';

            // Update icon - show eye-off when password is visible
            if (passwordEyeIcon) {
                if (isPassword) {
                    // Show eye-off icon (password visible)
                    passwordEyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
                } else {
                    // Show eye icon (password hidden)
                    passwordEyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                }
            }
        });
    }

    /**
     * Load profile data from API
     */
    async function loadProfile() {
        try {
            const response = await fetch(Auth.API_ENDPOINTS.profile, {
                method: 'GET',
                headers: Auth.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                populateProfile(data);
                originalData = { ...data };
            } else if (response.status === 401) {
                // Unauthorized - token invalid
                Auth.logout();
            } else {
                console.error('Failed to load profile');
                showMessage('error', 'Failed to load profile data');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showMessage('error', 'Network error loading profile');
        }
    }

    /**
     * Populate form with profile data
     */
    function populateProfile(data) {
        if (firstNameInput) firstNameInput.value = data.first_name || '';
        if (lastNameInput) lastNameInput.value = data.last_name || '';
        if (usernameInput) usernameInput.value = data.username || '';
        if (emailInput) emailInput.value = data.email || '';
        if (passwordInput) passwordInput.value = ''; // Don't show actual password
        if (bioInput) bioInput.value = data.bio || '';
        if (linkedinInput) linkedinInput.value = data.linkedin_url || '';
        if (githubInput) githubInput.value = data.github_url || '';
        if (portfolioInput) portfolioInput.value = data.portfolio_url || '';
    }

    /**
     * Toggle edit mode
     */
    function toggleEditMode(enabled) {
        isEditMode = enabled;

        // Toggle readonly state
        if (firstNameInput) firstNameInput.readOnly = !enabled;
        if (lastNameInput) lastNameInput.readOnly = !enabled;
        if (passwordInput) passwordInput.readOnly = !enabled;
        if (bioInput) bioInput.readOnly = !enabled;
        if (linkedinInput) linkedinInput.readOnly = !enabled;
        if (githubInput) githubInput.readOnly = !enabled;
        if (portfolioInput) portfolioInput.readOnly = !enabled;

        // Show/hide password toggle button
        if (togglePasswordBtn) {
            togglePasswordBtn.style.display = enabled ? 'block' : 'none';
        }

        // Toggle button visibility
        if (editBtn) editBtn.style.display = enabled ? 'none' : 'inline-block';
        if (saveBtn) saveBtn.style.display = enabled ? 'inline-block' : 'none';
        if (cancelBtn) cancelBtn.style.display = enabled ? 'inline-block' : 'none';

        // Add/remove visual indication
        const editableFields = [firstNameInput, lastNameInput, passwordInput, bioInput, linkedinInput, githubInput, portfolioInput];
        editableFields.forEach(field => {
            if (field) {
                field.style.borderColor = enabled ? '#3B82F6' : '#E5E7EB';
                field.style.background = enabled ? '#FFFFFF' : '#F9FAFB';
            }
        });
    }

    /**
     * Restore original data (cancel edit)
     */
    function restoreOriginalData() {
        populateProfile(originalData);
    }

    /**
     * Save profile changes
     */
    async function saveProfile() {
        const updatedData = {
            first_name: firstNameInput ? firstNameInput.value.trim() : '',
            last_name: lastNameInput ? lastNameInput.value.trim() : '',
            bio: bioInput ? bioInput.value.trim() : '',
            linkedin_url: linkedinInput ? linkedinInput.value.trim() : '',
            github_url: githubInput ? githubInput.value.trim() : '',
            portfolio_url: portfolioInput ? portfolioInput.value.trim() : ''
        };

        // Add password only if it was changed
        if (passwordInput && passwordInput.value.trim()) {
            updatedData.password = passwordInput.value;
        }

        // Validate URLs if provided
        if (updatedData.linkedin_url && !isValidURL(updatedData.linkedin_url)) {
            showMessage('error', 'Please enter a valid LinkedIn URL');
            return;
        }
        if (updatedData.github_url && !isValidURL(updatedData.github_url)) {
            showMessage('error', 'Please enter a valid GitHub URL');
            return;
        }
        if (updatedData.portfolio_url && !isValidURL(updatedData.portfolio_url)) {
            showMessage('error', 'Please enter a valid Portfolio URL');
            return;
        }

        // Show loading state
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
        }

        try {
            const response = await fetch(Auth.API_ENDPOINTS.profile, {
                method: 'PUT',
                headers: Auth.getAuthHeaders(),
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                originalData = { ...data };
                showMessage('success', 'Profile updated successfully!');
                toggleEditMode(false);
            } else if (response.status === 401) {
                Auth.logout();
            } else {
                const errorData = await response.json();
                showMessage('error', errorData.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            showMessage('error', 'Network error saving profile');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        }
    }

    /**
     * Validate URL format
     */
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Show message to user
     */
    function showMessage(type, message) {
        const messageDiv = document.getElementById('profileMessage');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    /**
     * Setup logout functionality
     */
    function setupLogout() {
        // You can add a logout button or menu item
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        }
    }
});
