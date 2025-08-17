/**
 * Accessibility Module - Williams College Design System
 * Comprehensive accessibility features and ARIA support
 */

class AccessibilityManager {
  constructor(options = {}) {
    this.options = {
      enableKeyboardNavigation: true,
      enableFocusManagement: true,
      enableAriaLiveRegions: true,
      enableColorContrastCheck: false, // Dev tool
      enableA11yAnnouncements: true,
      skipLinkSelector: '.skip-link',
      focusTrapSelector: '[data-focus-trap]',
      ...options
    };
    
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    this.currentFocusTrap = null;
    this.lastFocusedElement = null;
    
    this.init();
  }
  
  /**
   * Initialize accessibility features
   */
  init() {
    this.setupGlobalEventListeners();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLiveRegions();
    this.setupSkipLinks();
    this.setupFocusTraps();
    this.setupColorPreferences();
    this.setupReducedMotion();
    
    // Expose API
    window.a11y = this;
    
    console.log('Accessibility Manager initialized');
  }
  
  /**
   * Set up global event listeners
   */
  setupGlobalEventListeners() {
    // Monitor preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.updateReducedMotionSettings();
    });
    
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.isHighContrast = e.matches;
      this.updateContrastSettings();
    });
    
    // Keyboard event listeners
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
  }
  
  /**
   * Handle global keyboard events
   */
  handleGlobalKeydown(event) {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
    
    // Handle Escape key for modals, dropdowns, etc.
    if (key === 'Escape') {
      this.handleEscape(event);
    }
    
    // Handle Tab navigation
    if (key === 'Tab') {
      this.handleTabNavigation(event);
    }
    
    // Handle arrow keys for navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.handleArrowNavigation(event);
    }
    
    // Handle Enter and Space for activation
    if (key === 'Enter' || key === ' ') {
      this.handleActivation(event);
    }
    
    // Handle accessibility shortcuts
    if (altKey && key === 's') {
      // Alt+S: Skip to main content
      this.skipToMain();
      event.preventDefault();
    }
  }
  
  /**
   * Handle escape key functionality
   */
  handleEscape(event) {
    // Close open modals
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
      this.closeModal(openModal);
      return;
    }
    
    // Close open dropdowns
    const openDropdown = document.querySelector('.nav-dropdown.open');
    if (openDropdown) {
      this.closeDropdown(openDropdown);
      return;
    }
    
    // Close mobile navigation
    const openMobileNav = document.querySelector('.mobile-nav.open');
    if (openMobileNav) {
      this.closeMobileNav(openMobileNav);
      return;
    }
    
    // Exit focus trap
    if (this.currentFocusTrap) {
      this.exitFocusTrap();
    }
  }
  
  /**
   * Handle tab navigation and focus trapping
   */
  handleTabNavigation(event) {
    if (this.currentFocusTrap) {
      this.manageFocusTrap(event);
    }
  }
  
  /**
   * Handle arrow key navigation for menus and lists
   */
  handleArrowNavigation(event) {
    const target = event.target;
    const parent = target.closest('[role="menu"], [role="listbox"], [role="tablist"], .nav');
    
    if (!parent) return;
    
    const items = Array.from(parent.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"], .nav-link'));
    const currentIndex = items.indexOf(target);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = 0; // Wrap to beginning
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = items.length - 1; // Wrap to end
        }
        break;
      default:
        return;
    }
    
    items[nextIndex].focus();
    event.preventDefault();
  }
  
  /**
   * Handle activation with Enter or Space
   */
  handleActivation(event) {
    const target = event.target;
    
    // Skip if target is already an interactive element
    if (['button', 'a', 'input', 'select', 'textarea'].includes(target.tagName.toLowerCase())) {
      return;
    }
    
    // Handle custom interactive elements
    if (target.hasAttribute('role') && 
        ['button', 'link', 'menuitem', 'option', 'tab'].includes(target.getAttribute('role'))) {
      target.click();
      event.preventDefault();
    }
    
    // Handle elements with click handlers
    if (target.hasAttribute('tabindex') && target.onclick) {
      target.click();
      event.preventDefault();
    }
  }
  
  /**
   * Setup keyboard navigation for components
   */
  setupKeyboardNavigation() {
    // Make sortable table headers keyboard accessible
    document.querySelectorAll('.table th.sortable').forEach(th => {
      if (!th.hasAttribute('tabindex')) {
        th.setAttribute('tabindex', '0');
      }
      if (!th.hasAttribute('role')) {
        th.setAttribute('role', 'button');
      }
      if (!th.hasAttribute('aria-label')) {
        th.setAttribute('aria-label', `Sort by ${th.textContent.trim()}`);
      }
    });
    
    // Make custom buttons keyboard accessible
    document.querySelectorAll('[data-role="button"]:not(button)').forEach(el => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'button');
      }
    });
    
    // Make card links keyboard accessible
    document.querySelectorAll('.card-hover, .card[data-href]').forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      card.setAttribute('role', 'button');
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const href = card.dataset.href || card.querySelector('a')?.href;
          if (href) {
            window.location.href = href;
          } else {
            card.click();
          }
          e.preventDefault();
        }
      });
    });
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure modal focus management
    document.addEventListener('show.modal', (event) => {
      this.lastFocusedElement = document.activeElement;
      setTimeout(() => {
        const modal = event.target;
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);
    });
    
    document.addEventListener('hide.modal', (event) => {
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    });
    
    // Focus visible indicators
    this.addFocusVisiblePolyfill();
  }
  
  /**
   * Add focus-visible polyfill for better focus indicators
   */
  addFocusVisiblePolyfill() {
    let hadKeyboardEvent = true;
    
    const keyboardThrottleTimeout = 100;
    let keyboardThrottleTimeoutID = 0;
    
    const pointerThrottleTimeout = 200;
    let pointerThrottleTimeoutID = 0;
    
    function onPointerDown() {
      hadKeyboardEvent = false;
      
      clearTimeout(pointerThrottleTimeoutID);
      pointerThrottleTimeoutID = setTimeout(() => {
        hadKeyboardEvent = true;
      }, pointerThrottleTimeout);
    }
    
    function onKeyDown(e) {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }
      
      hadKeyboardEvent = true;
      
      clearTimeout(keyboardThrottleTimeoutID);
      keyboardThrottleTimeoutID = setTimeout(() => {
        hadKeyboardEvent = false;
      }, keyboardThrottleTimeout);
    }
    
    function onFocus(e) {
      if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
        e.target.classList.add('focus-visible');
      }
    }
    
    function onBlur(e) {
      e.target.classList.remove('focus-visible');
    }
    
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
  }
  
  /**
   * Setup ARIA live regions for announcements
   */
  setupAriaLiveRegions() {
    if (!this.options.enableAriaLiveRegions) return;
    
    // Create live regions if they don't exist
    if (!document.getElementById('aria-live-polite')) {
      const politeRegion = document.createElement('div');
      politeRegion.id = 'aria-live-polite';
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      document.body.appendChild(politeRegion);
    }
    
    if (!document.getElementById('aria-live-assertive')) {
      const assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'aria-live-assertive';
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      document.body.appendChild(assertiveRegion);
    }
  }
  
  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    if (!this.options.enableA11yAnnouncements) return;
    
    const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }
  
  /**
   * Setup skip links
   */
  setupSkipLinks() {
    const skipLinks = document.querySelectorAll(this.options.skipLinkSelector);
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: this.isReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }
  
  /**
   * Skip to main content
   */
  skipToMain() {
    const main = document.querySelector('main, [role="main"], #main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: this.isReducedMotion ? 'auto' : 'smooth' });
      this.announce('Skipped to main content');
    }
  }
  
  /**
   * Setup focus traps for modals and dialogs
   */
  setupFocusTraps() {
    const focusTrapElements = document.querySelectorAll(this.options.focusTrapSelector);
    
    focusTrapElements.forEach(element => {
      this.setupFocusTrap(element);
    });
  }
  
  /**
   * Setup individual focus trap
   */
  setupFocusTrap(element) {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])'
    ].join(', ');
    
    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = Array.from(element.querySelectorAll(focusableSelectors));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    });
  }
  
  /**
   * Enter focus trap
   */
  enterFocusTrap(element) {
    this.currentFocusTrap = element;
    this.lastFocusedElement = document.activeElement;
    
    const firstFocusable = element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
  
  /**
   * Exit focus trap
   */
  exitFocusTrap() {
    this.currentFocusTrap = null;
    
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }
  
  /**
   * Manage focus trap navigation
   */
  manageFocusTrap(event) {
    const trap = this.currentFocusTrap;
    if (!trap) return;
    
    const focusableElements = Array.from(trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
  
  /**
   * Setup color preference handling
   */
  setupColorPreferences() {
    if (this.isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    // Add system color scheme support
    const colorSchemeMetaTag = document.querySelector('meta[name="color-scheme"]');
    if (!colorSchemeMetaTag) {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = 'light dark';
      document.head.appendChild(meta);
    }
  }
  
  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    this.updateReducedMotionSettings();
  }
  
  /**
   * Update reduced motion settings
   */
  updateReducedMotionSettings() {
    if (this.isReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }
  
  /**
   * Update contrast settings
   */
  updateContrastSettings() {
    if (this.isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }
  
  /**
   * Handle focus in events
   */
  handleFocusIn(event) {
    // Add focus indicator to tables
    if (event.target.matches('.table th.sortable')) {
      event.target.setAttribute('aria-describedby', 'sort-instructions');
      
      // Create sort instructions if they don't exist
      if (!document.getElementById('sort-instructions')) {
        const instructions = document.createElement('div');
        instructions.id = 'sort-instructions';
        instructions.className = 'sr-only';
        instructions.textContent = 'Press Enter or Space to sort this column';
        document.body.appendChild(instructions);
      }
    }
  }
  
  /**
   * Handle focus out events
   */
  handleFocusOut(event) {
    if (event.target.matches('.table th.sortable')) {
      event.target.removeAttribute('aria-describedby');
    }
  }
  
  /**
   * Close modal (accessibility helper)
   */
  closeModal(modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    this.exitFocusTrap();
    this.announce('Modal closed');
  }
  
  /**
   * Close dropdown (accessibility helper)
   */
  closeDropdown(dropdown) {
    dropdown.classList.remove('open');
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  }
  
  /**
   * Close mobile navigation (accessibility helper)
   */
  closeMobileNav(nav) {
    nav.classList.remove('open');
    const toggle = document.querySelector('.mobile-nav-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
    this.announce('Navigation closed');
  }
  
  /**
   * Validate color contrast (development tool)
   */
  checkColorContrast(element) {
    if (!this.options.enableColorContrastCheck) return;
    
    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    // Simple contrast check (you might want to use a more sophisticated library)
    const contrast = this.calculateContrast(bgColor, textColor);
    
    if (contrast < 4.5) {
      console.warn(`Low contrast detected on element:`, element, `Contrast ratio: ${contrast}`);
    }
  }
  
  /**
   * Calculate contrast ratio (simplified)
   */
  calculateContrast(bg, text) {
    // This is a simplified version - you'd want a proper color contrast library for production
    // Return a placeholder value
    return 7; // Assume good contrast for now
  }
  
  /**
   * Add ARIA attributes to components
   */
  enhanceWithAria() {
    // Enhance form validation with ARIA
    document.querySelectorAll('input[required]').forEach(input => {
      input.setAttribute('aria-required', 'true');
      
      const form = input.closest('form');
      if (form && !form.hasAttribute('novalidate')) {
        input.addEventListener('invalid', () => {
          input.setAttribute('aria-invalid', 'true');
          const errorMessage = input.validationMessage;
          this.announce(`Error: ${errorMessage}`, 'assertive');
        });
        
        input.addEventListener('input', () => {
          if (input.validity.valid) {
            input.removeAttribute('aria-invalid');
          }
        });
      }
    });
    
    // Enhance buttons with proper ARIA
    document.querySelectorAll('button[data-toggle]').forEach(button => {
      button.setAttribute('aria-expanded', 'false');
    });
    
    // Enhance tabs with ARIA
    document.querySelectorAll('.nav-tabs .nav-link').forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', `tab-${index}`);
      tab.setAttribute('aria-controls', `panel-${index}`);
      tab.setAttribute('aria-selected', tab.classList.contains('active'));
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
  });
} else {
  new AccessibilityManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}