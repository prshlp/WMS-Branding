// Main application namespace
const BrandingApp = {
    // Configuration object for URLs and selectors
    config: {
      urls: {
        base: 'https://connect.williams.edu/apply/',
        exclude: 'https://connect.williams.edu/apply/payment',
        redirect: 'https://connect.williams.edu/portal/williams-alumni'
      },
      selectors: {
        birthdateLabel: 'label[for="birthdate"]',
        loginButton: '.action .default',
        editLinks: "a[href*='/editafask?'], a[href*='/ocr-confidentiality-policy?'], a[href*='/editclassag?']",
        deferredStyles: '#deferred-styles',
        focusableElements: 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      }
    },
  
    // UI modifications
    updateUIElements() {
      // Update birthdate label
      const birthdateLabel = document.querySelector(this.config.selectors.birthdateLabel);
      if (birthdateLabel) {
        birthdateLabel.textContent = 'Date of Birth';
      }
  
      // Update login button text
      const loginButton = document.querySelector(this.config.selectors.loginButton);
      if (loginButton && loginButton.textContent === 'Login') {
        loginButton.textContent = 'Log In';
      }
    },
  
    // Add red asterisk to required form fields
    addRedAsteriskToEnd() {
      $(document).ready(() => {
        $('.form_question[data-required="1"]').each(function () {
          if (!$(this).find(".form_label").hasClass("asterisk-added")) {
            $(this)
              .find(".form_label")
              .append('<span style="color:red">*</span>')
              .addClass("asterisk-added");
          }
        });
      });
    },
  
    // URL redirection logic
    handleUrlRedirection() {
      const currentUrl = window.location.href;
      const { base, exclude, redirect } = this.config.urls;
  
      if (currentUrl.startsWith(base) && !currentUrl.startsWith(exclude)) {
        window.location.href = redirect;
      }
    },
  
    // Handle edit links
    handleEditLinks() {
      const editLinks = document.querySelectorAll(this.config.selectors.editLinks);
      
      if (editLinks.length) {
        setTimeout(() => {
          editLinks[0].click();
        }, 100);
      }
    },
  
    // Performance: Load deferred styles
    loadDeferredStyles() {
      const addStylesNode = document.querySelector(this.config.selectors.deferredStyles);
      if (addStylesNode) {
        const replacement = document.createElement("div");
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement);
        addStylesNode.parentElement.removeChild(addStylesNode);
      }
    },
  
    // Accessibility: Focus trap for modals/dialogs
    trapFocus(element) {
      if (!element) return;
  
      const focusableEls = element.querySelectorAll(this.config.selectors.focusableElements);
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
  
      element.addEventListener('keydown', function(e) {
        const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);
        
        if (!isTabPressed) return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      });
    },
  
    // Initialize all functionality
    init() {
      // DOM ready handler
      document.addEventListener('DOMContentLoaded', () => {
        this.updateUIElements();
        this.handleUrlRedirection();
        this.handleEditLinks();
        this.addRedAsteriskToEnd();
      });
  
      // Load handler for non-critical CSS
      if (window.addEventListener) {
        window.addEventListener('load', () => this.loadDeferredStyles());
      } else if (window.attachEvent) {
        window.attachEvent('onload', () => this.loadDeferredStyles());
      }
    }
  };
  
  // Initialize the application
  BrandingApp.init(); 
