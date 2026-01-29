class AuthModal {
    constructor() {
        this.modal = document.getElementById('modalBackdrop');
        this.container = document.getElementById('modalContainer');
        this.currentView = 'login';
        this.formData = {
            login: {},
            register: {}
        };
        this.isOpen = false;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.setupKeyboardNavigation();
        this.setupSocialAuth();
    }

    setupEventListeners() {
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal();
            }
        });

        // Click outside modal to close (backdrop only, not modal content)
        this.modal.addEventListener('click', (e) => {
            // Only close if clicking directly on the backdrop, not on children
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Prevent modal container clicks from propagating to backdrop
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Input validation on blur
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Password confirmation validation
        document.getElementById('confirmPassword').addEventListener('input', () => {
            this.validatePasswordConfirmation();
        });

        // Terms checkbox validation
        document.getElementById('agreeTerms').addEventListener('change', () => {
            this.validateTermsAgreement();
        });
    }

    setupFormValidation() {
        // Email/Phone validation
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        // Password validation
        this.passwordMinLength = 8;
        this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength(passwordInput.value);
            });
        }
    }

    setupKeyboardNavigation() {
        // Trap focus within modal
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }

    setupSocialAuth() {
        // Lazy load social auth buttons
        this.loadSocialAuthButtons();
    }

    // Public API Methods
    openModal(view = 'login') {
        this.currentView = view;
        this.isOpen = true;
        
        // Preserve scroll position
        this.scrollPosition = window.pageYOffset;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Show modal
        this.modal.classList.add('show');
        this.switchView(view);
        
        // Ensure forms are visible
        this.ensureFormsVisible();
        
        // Focus first input
        setTimeout(() => {
            this.focusFirstInput();
        }, 300);
    }

    closeModal() {
        this.isOpen = false;
        
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
        
        // Hide modal
        this.modal.classList.remove('show');
        
        // Clear forms
        this.clearForms();
    }

    switchView(view) {
        this.currentView = view;
        
        // Save current form data
        this.saveFormData();
        
        // Update title
        const title = document.getElementById('modalTitle');
        title.textContent = view === 'login' ? 'Login' : 'Register';
        
        // Switch forms with animation
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (view === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
        
        // Restore form data
        this.restoreFormData();
        
        // Focus first input
        setTimeout(() => {
            this.focusFirstInput();
        }, 150);
    }

    ensureFormsVisible() {
        // Make sure at least one form is visible
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (!loginForm.classList.contains('active') && !registerForm.classList.contains('active')) {
            // If no form is active, activate the login form
            loginForm.classList.add('active');
        }
    }

    // Form Handling
    handleLogin() {
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
        
        const username = formData.get('username');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Validate form
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        
        // Simulate API call
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.closeModal();
            
            // Call success callback
            if (this.onLoginSuccess) {
                this.onLoginSuccess({ username, remember });
            }
        }, 1500);
    }

    handleRegister() {
        const form = document.getElementById('registerForm');
        const formData = new FormData(form);
        
        const username = formData.get('username');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const referralId = formData.get('referralId');
        const agreeTerms = formData.get('agreeTerms');
        
        // Validate form
        if (!this.validateRegisterForm(username, name, phone, email, password, confirmPassword, referralId, agreeTerms)) {
            return;
        }
        
        // Simulate API call
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.closeModal();
            
            // Call success callback
            if (this.onRegisterSuccess) {
                this.onRegisterSuccess({ username, name, phone, email, referralId });
            }
        }, 1500);
    }

    // Validation Methods
    validateLoginForm(username, password) {
        let isValid = true;
        
        if (!username || username.trim().length < 3) {
            this.showFieldError('loginUsername', 'Please enter a valid username (at least 3 characters)');
            isValid = false;
        }
        
        if (!password || password.length < 6) {
            this.showFieldError('loginPassword', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }

    validateRegisterForm(username, name, phone, email, password, confirmPassword, referralId, agreeTerms) {
        let isValid = true;
        
        if (!username || username.trim().length < 3) {
            this.showFieldError('registerUsername', 'Please enter a valid username (at least 3 characters)');
            isValid = false;
        }
        
        if (!name || name.trim().length < 2) {
            this.showFieldError('registerName', 'Please enter your full name');
            isValid = false;
        }
        
        if (!phone || !this.validatePhone(phone)) {
            this.showFieldError('registerPhone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (!email || !this.validateEmail(email)) {
            this.showFieldError('registerEmail', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!this.validatePassword(password)) {
            this.showFieldError('registerPassword', 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!agreeTerms) {
            this.showFieldError('agreeTerms', 'You must agree to the Terms and Conditions');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        
        switch (fieldName) {
            case 'username':
                if (value && value.length < 3) {
                    this.showFieldError(input.id, 'Please enter a valid username (at least 3 characters)');
                    return false;
                }
                break;
            case 'email':
                if (value && !this.validateEmail(value)) {
                    this.showFieldError(input.id, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'phone':
                if (value && !this.validatePhone(value)) {
                    this.showFieldError(input.id, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'password':
                if (value && value.length < 6) {
                    this.showFieldError(input.id, 'Password must be at least 6 characters');
                    return false;
                }
                break;
            case 'name':
                if (value && value.length < 2) {
                    this.showFieldError(input.id, 'Please enter your full name');
                    return false;
                }
                break;
        }
        
        this.clearFieldError(input);
        return true;
    }

    validateEmailOrPhone(value) {
        return this.emailRegex.test(value) || this.phoneRegex.test(value);
    }

    validateEmail(value) {
        return this.emailRegex.test(value);
    }

    validatePhone(value) {
        return this.phoneRegex.test(value);
    }

    validatePassword(password) {
        return password.length >= this.passwordMinLength && this.passwordRegex.test(password);
    }

    validatePasswordConfirmation() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            return false;
        }
        
        this.clearFieldError(document.getElementById('confirmPassword'));
        return true;
    }

    validateTermsAgreement() {
        const checkbox = document.getElementById('agreeTerms');
        const errorElement = document.getElementById('agreeTermsError');
        
        if (!checkbox.checked) {
            if (!errorElement) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'agreeTermsError';
                errorDiv.className = 'form-error';
                errorDiv.setAttribute('role', 'alert');
                errorDiv.setAttribute('aria-live', 'polite');
                checkbox.parentNode.parentNode.appendChild(errorDiv);
            }
            document.getElementById('agreeTermsError').textContent = 'You must agree to the Terms and Conditions';
            return false;
        }
        
        if (errorElement) {
            errorElement.remove();
        }
        return true;
    }

    // Password Strength
    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!password) {
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Password strength';
            return;
        }
        
        let strength = 0;
        let strengthLabel = '';
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                strengthFill.className = 'strength-fill weak';
                strengthLabel = 'Weak';
                break;
            case 2:
            case 3:
                strengthFill.className = 'strength-fill fair';
                strengthLabel = 'Fair';
                break;
            case 4:
                strengthFill.className = 'strength-fill good';
                strengthLabel = 'Good';
                break;
            case 5:
                strengthFill.className = 'strength-fill strong';
                strengthLabel = 'Strong';
                break;
        }
        
        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    // UI Helpers
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        const input = document.getElementById(fieldId);
        if (input) {
            input.setAttribute('aria-invalid', 'true');
        }
    }

    clearFieldError(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        input.removeAttribute('aria-invalid');
    }

    showLoading(show) {
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(btn => {
            btn.disabled = show;
            btn.textContent = show ? 'Loading...' : (btn.closest('#loginForm') ? 'Login' : 'Create Account');
        });
    }


    // Focus Management
    trapFocus(e) {
        const focusableElements = this.container.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    focusFirstInput() {
        const activeForm = document.querySelector('.auth-form.active');
        const firstInput = activeForm.querySelector('.form-input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    // Form Data Management
    saveFormData() {
        const activeForm = document.querySelector('.auth-form.active');
        const formData = new FormData(activeForm);
        
        for (let [key, value] of formData.entries()) {
            this.formData[this.currentView][key] = value;
        }
    }

    restoreFormData() {
        const activeForm = document.querySelector('.auth-form.active');
        const inputs = activeForm.querySelectorAll('.form-input, input[type="checkbox"]');
        
        inputs.forEach(input => {
            const savedValue = this.formData[this.currentView][input.name];
            if (savedValue !== undefined) {
                if (input.type === 'checkbox') {
                    input.checked = savedValue === 'on';
                } else {
                    input.value = savedValue;
                }
            }
        });
        
        // Update password strength if on register form
        if (this.currentView === 'register') {
            const password = document.getElementById('registerPassword').value;
            this.updatePasswordStrength(password);
        }
    }

    clearForms() {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.reset();
        });
        
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        
        this.formData = { login: {}, register: {} };
    }

    // Social Auth
    loadSocialAuthButtons() {
        // Simulate lazy loading
        setTimeout(() => {
            document.querySelectorAll('.btn-social').forEach(btn => {
                btn.style.opacity = '1';
            });
        }, 500);
    }

    handleSocialAuth(provider) {
        // Simulate redirect
        setTimeout(() => {
            this.closeModal();
        }, 1000);
    }

    handleForgotPassword() {
        console.log('Forgot password clicked');
    }

    // Callback Setters
    setOnLoginSuccess(callback) {
        this.onLoginSuccess = callback;
    }

    setOnRegisterSuccess(callback) {
        this.onRegisterSuccess = callback;
    }
}

// Global API Functions
let authModal;

document.addEventListener('DOMContentLoaded', () => {
    authModal = new AuthModal();
    
    authModal.setOnLoginSuccess((data) => {
        console.log('Login successful:', data);
    });
    
    authModal.setOnRegisterSuccess((data) => {
        console.log('Registration successful:', data);
    });
});

function openModal(view = 'login') {
    if (authModal) {
        authModal.openModal(view);
    }
}

function closeModal() {
    if (authModal) {
        authModal.closeModal();
    }
}

function switchView(view) {
    if (authModal) {
        authModal.switchView(view);
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

function handleSocialAuth(provider) {
    if (authModal) {
        authModal.handleSocialAuth(provider);
    }
}

function handleForgotPassword() {
    if (authModal) {
        authModal.handleForgotPassword();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        activeForm.style.display = 'block';
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthModal, openModal, closeModal, switchView };
}
