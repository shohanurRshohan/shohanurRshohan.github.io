/**
 * Portfolio JavaScript — Shohanur Rahman Shohan
 * Features:
 * 1. Accessible responsive mobile navigation toggle (ARIA states & Escape key)
 * 2. Client-side contact form validation with accessible error & confirmation feedback
 */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNavigation();
  initContactFormValidation();
});

/**
 * Initializes accessible mobile navigation toggle and menu link behaviors.
 */
function initMobileNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!navToggle || !navLinks) return;

  function setMenuState(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }

  navToggle.addEventListener('click', function () {
    const currentlyOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!currentlyOpen);
  });

  // Close mobile drawer when any navigation link is selected
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });

  // Allow keyboard users to dismiss open mobile menu with Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuState(false);
      navToggle.focus();
    }
  });
}

/**
 * Initializes client-side validation for the contact form.
 * Note: Does not pretend to send an email; displays a clear validation confirmation.
 */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  const feedbackEl = document.getElementById('formFeedback');

  if (!form || !feedbackEl) return;

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: function (value) {
        if (!value.trim()) {
          return 'Please enter your full name.';
        }
        if (value.trim().length < 2) {
          return 'Full name must be at least 2 characters long.';
        }
        return '';
      }
    },
    emailAddress: {
      input: document.getElementById('emailAddress'),
      error: document.getElementById('emailAddressError'),
      validate: function (value) {
        const trimmed = value.trim();
        if (!trimmed) {
          return 'Please enter your email address.';
        }
        // Standard email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email address (e.g., name@example.com).';
        }
        return '';
      }
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate: function (value) {
        if (!value.trim()) {
          return 'Please enter a subject for your message.';
        }
        if (value.trim().length < 3) {
          return 'Subject must be at least 3 characters long.';
        }
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: function (value) {
        if (!value.trim()) {
          return 'Please enter a message before submitting.';
        }
        if (value.trim().length < 10) {
          return 'Please enter a message of at least 10 characters.';
        }
        return '';
      }
    }
  };

  function validateField(fieldKey) {
    const field = fields[fieldKey];
    const errorMessage = field.validate(field.input.value);

    if (errorMessage) {
      field.input.setAttribute('aria-invalid', 'true');
      field.error.textContent = errorMessage;
      return false;
    } else {
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
      return true;
    }
  }

  // Real-time validation on blur and re-check on input if previously invalid
  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    field.input.addEventListener('blur', function () {
      validateField(key);
    });
    field.input.addEventListener('input', function () {
      if (field.input.getAttribute('aria-invalid') === 'true') {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    feedbackEl.className = 'form-feedback';
    feedbackEl.textContent = '';

    let isFormValid = true;
    let firstInvalidInput = null;

    Object.keys(fields).forEach(function (key) {
      const valid = validateField(key);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = fields[key].input;
        }
      }
    });

    if (!isFormValid) {
      feedbackEl.classList.add('error-summary');
      feedbackEl.textContent =
        'Validation failed: Please correct the highlighted fields above.';
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // All inputs passed client-side validation
    const senderName = fields.fullName.input.value.trim();
    const senderEmail = fields.emailAddress.input.value.trim();

    feedbackEl.classList.add('success');
    feedbackEl.innerHTML =
      '<strong>Validation Successful:</strong> Thank you, ' +
      escapeHTML(senderName) +
      '. Your inputs passed client-side validation. <em>Reminder:</em> No email has been sent because this static site requires a backend or form service for live delivery. You can reach me directly at <strong>231179@students.aih.edu.au</strong> (reply address entered: ' +
      escapeHTML(senderEmail) +
      ').';

    form.reset();
  });
}

/**
 * Escapes HTML special characters before rendering user-entered strings in status messages.
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}