/*!
 * Williams College Design System - JavaScript Bundle
 * Version: 2.0.0
 * Build Date: 2024-12-17
 * 
 * Complete JavaScript bundle for Williams College CRM branding system
 * Includes: Theme management, accessibility features, and component interactions
 * 
 * Copyright (c) 2024 Williams College
 * Licensed under MIT License
 */

/**
 * Theme Manager - Handles light/dark/auto theme switching
 */
class ThemeManager {
  constructor() {
    this.storageKey = 'williams-theme';
    this.themes = ['light', 'dark', 'auto'];
    this.currentTheme = this.getStoredTheme();
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system preference changes
    this.systemPreference.addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.updateDocumentTheme(e.matches ? 'dark' : 'light');
      }
    });
    
    // Setup theme toggle buttons
    this.setupToggleButtons();
    
    // Expose to global scope
    window.themeManager = this;
    
    console.log('Theme Manager initialized:', this.currentTheme);
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem(this.storageKey) || 'auto';
    } catch (e) {
      console.warn('localStorage not available, defaulting to auto theme');
      return 'auto';
    }
  }
  
  storeTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      console.warn('Could not store theme preference');
    }
  }
  
  applyTheme(theme, animate = false) {
    if (!this.themes.includes(theme)) {
      console.warn(`Invalid theme: ${theme}, defaulting to auto`);
      theme = 'auto';
    }
    
    this.currentTheme = theme;
    this.storeTheme(theme);
    
    let actualTheme = theme;
    if (theme === 'auto') {
      actualTheme = this.systemPreference.matches ? 'dark' : 'light';
    }
    
    this.updateDocumentTheme(actualTheme, animate);
    this.updateToggleButtons();
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: theme, actualTheme: actualTheme }
    }));
  }
  
  updateDocumentTheme(actualTheme, animate = false) {
    const html = document.documentElement;
    
    if (animate) {
      html.style.transition = 'background-color 300ms ease, color 300ms ease';
      setTimeout(() => {
        html.style.transition = '';
      }, 300);
    }
    
    html.setAttribute('data-theme', actualTheme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#09090b' : '#500082');
    }
  }
  
  setupToggleButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = button.dataset.themeToggle;
        
        if (mode === 'cycle') {
          this.cycleTheme();
        } else if (this.themes.includes(mode)) {
          this.applyTheme(mode, true);
        }
      });
    });
  }
  
  updateToggleButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      // Update ARIA label
      button.setAttribute('aria-label', `Current theme: ${this.currentTheme}. Click to change theme.`);
      
      // Update button text if it has text content
      if (button.textContent.trim() && !button.querySelector('svg')) {
        button.textContent = `Theme: ${this.currentTheme}`;
      }
    });
  }
  
  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.applyTheme(this.themes[nextIndex], true);
  }
  
  setTheme(theme) {
    this.applyTheme(theme, true);
  }
  
  getTheme() {
    return this.currentTheme;
  }
  
  getActualTheme() {
    if (this.currentTheme === 'auto') {
      return this.systemPreference.matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }
}

/**
 * Accessibility Manager - Comprehensive accessibility features and ARIA support
 */
class AccessibilityManager {
  constructor(options = {}) {
    this.options = {
      enableKeyboardNavigation: true,
      enableFocusManagement: true,
      enableAriaLiveRegions: true,
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
    
    // Close user menu
    const openUserMenu = document.querySelector('.header-user.open');
    if (openUserMenu) {
      openUserMenu.classList.remove('open');
      const toggle = openUserMenu.querySelector('.header-user-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      return;
    }
    
    // Exit focus trap
    if (this.currentFocusTrap) {
      this.exitFocusTrap();
    }
  }
  
  handleTabNavigation(event) {
    if (this.currentFocusTrap) {
      this.manageFocusTrap(event);
    }
  }
  
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
  
  skipToMain() {
    const main = document.querySelector('main, [role="main"], #main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: this.isReducedMotion ? 'auto' : 'smooth' });
      this.announce('Skipped to main content');
    }
  }
  
  setupFocusTraps() {
    const focusTrapElements = document.querySelectorAll(this.options.focusTrapSelector);
    
    focusTrapElements.forEach(element => {
      this.setupFocusTrap(element);
    });
  }
  
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
  
  enterFocusTrap(element) {
    this.currentFocusTrap = element;
    this.lastFocusedElement = document.activeElement;
    
    const firstFocusable = element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
  
  exitFocusTrap() {
    this.currentFocusTrap = null;
    
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }
  
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
  
  setupReducedMotion() {
    this.updateReducedMotionSettings();
  }
  
  updateReducedMotionSettings() {
    if (this.isReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }
  
  updateContrastSettings() {
    if (this.isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }
  
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
  
  handleFocusOut(event) {
    if (event.target.matches('.table th.sortable')) {
      event.target.removeAttribute('aria-describedby');
    }
  }
  
  closeModal(modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    this.exitFocusTrap();
    this.announce('Modal closed');
  }
  
  closeDropdown(dropdown) {
    dropdown.classList.remove('open');
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  }
  
  closeMobileNav(nav) {
    nav.classList.remove('open');
    const toggle = document.querySelector('.mobile-nav-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
    this.announce('Navigation closed');
  }
}

/**
 * Component Interactions - Handle common UI component behaviors
 */
class ComponentManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupModalHandlers();
    this.setupDropdownHandlers();
    this.setupTabHandlers();
    this.setupTableSorting();
    this.setupFormValidation();
    
    // Expose to global scope
    window.components = this;
    
    console.log('Component Manager initialized');
  }
  
  setupModalHandlers() {
    // Modal triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-target]');
      if (trigger) {
        e.preventDefault();
        const targetId = trigger.dataset.modalTarget;
        const modal = document.getElementById(targetId);
        if (modal) {
          this.showModal(modal);
        }
      }
      
      // Modal close buttons
      const closeButton = e.target.closest('.modal-close');
      if (closeButton) {
        const modal = closeButton.closest('.modal');
        if (modal) {
          this.hideModal(modal);
        }
      }
      
      // Backdrop click
      if (e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.hideModal(modal);
        }
      }
    });
  }
  
  showModal(modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('show.modal'));
    
    if (window.a11y) {
      window.a11y.enterFocusTrap(modal);
    }
  }
  
  hideModal(modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('hide.modal'));
    
    if (window.a11y) {
      window.a11y.exitFocusTrap();
    }
  }
  
  setupDropdownHandlers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown-toggle]');
      if (trigger) {
        e.preventDefault();
        const targetId = trigger.dataset.dropdownToggle;
        const dropdown = document.getElementById(targetId);
        if (dropdown) {
          this.toggleDropdown(dropdown, trigger);
        }
      }
      
      // Close dropdowns when clicking outside
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
          this.closeDropdown(dropdown);
        });
      }
    });
  }
  
  toggleDropdown(dropdown, trigger) {
    const isOpen = dropdown.classList.contains('open');
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown.open').forEach(otherDropdown => {
      if (otherDropdown !== dropdown) {
        this.closeDropdown(otherDropdown);
      }
    });
    
    if (isOpen) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown, trigger);
    }
  }
  
  openDropdown(dropdown, trigger) {
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }
  
  closeDropdown(dropdown) {
    dropdown.classList.remove('open');
    const trigger = document.querySelector(`[data-dropdown-toggle="${dropdown.id}"]`);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  }
  
  setupTabHandlers() {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) {
        e.preventDefault();
        this.activateTab(tab);
      }
    });
  }
  
  activateTab(activeTab) {
    const tablist = activeTab.closest('[role="tablist"]');
    if (!tablist) return;
    
    const allTabs = tablist.querySelectorAll('[role="tab"]');
    const tabId = activeTab.getAttribute('aria-controls');
    const tabPanel = document.getElementById(tabId);
    
    // Deactivate all tabs
    allTabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.classList.remove('active');
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.hidden = true;
      }
    });
    
    // Activate selected tab
    activeTab.setAttribute('aria-selected', 'true');
    activeTab.classList.add('active');
    if (tabPanel) {
      tabPanel.hidden = false;
    }
  }
  
  setupTableSorting() {
    document.addEventListener('click', (e) => {
      const sortableHeader = e.target.closest('.table th.sortable');
      if (sortableHeader) {
        this.sortTable(sortableHeader);
      }
    });
  }
  
  sortTable(header) {
    const table = header.closest('table');
    const headerRow = header.parentNode;
    const columnIndex = Array.from(headerRow.children).indexOf(header);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentDirection = header.getAttribute('data-sort-direction');
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    
    // Clear all sort indicators
    headerRow.querySelectorAll('th').forEach(th => {
      th.removeAttribute('data-sort-direction');
    });
    
    // Set new sort direction
    header.setAttribute('data-sort-direction', newDirection);
    
    // Sort rows
    rows.sort((a, b) => {
      const aValue = a.children[columnIndex].textContent.trim();
      const bValue = b.children[columnIndex].textContent.trim();
      
      // Try to parse as numbers
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      
      let comparison;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = aValue.localeCompare(bValue);
      }
      
      return newDirection === 'asc' ? comparison : -comparison;
    });
    
    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
    
    // Announce to screen readers
    if (window.a11y) {
      window.a11y.announce(`Table sorted by ${header.textContent.trim()}, ${newDirection}ending order`);
    }
  }
  
  setupFormValidation() {
    // Enhanced form validation
    document.addEventListener('blur', (e) => {
      if (e.target.matches('input[required], textarea[required], select[required]')) {
        this.validateField(e.target);
      }
    }, true);
    
    document.addEventListener('input', (e) => {
      if (e.target.matches('input[aria-invalid="true"], textarea[aria-invalid="true"]')) {
        this.validateField(e.target);
      }
    });
  }
  
  validateField(field) {
    const isValid = field.validity.valid;
    field.setAttribute('aria-invalid', !isValid);
    
    if (!isValid && window.a11y) {
      window.a11y.announce(`Error in ${field.labels?.[0]?.textContent || 'field'}: ${field.validationMessage}`, 'assertive');
    }
  }
}

/**
 * Performance Utilities
 */
class PerformanceManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupLazyLoading();
    this.setupCriticalResourceHints();
    this.monitorPerformance();
    
    console.log('Performance Manager initialized');
  }
  
  setupLazyLoading() {
    // Lazy load images with Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  setupCriticalResourceHints() {
    // Add resource hints for critical resources
    const preloadCritical = [
      '/dev/styles/main.css',
      '/dev/scripts/main.js'
    ];
    
    preloadCritical.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = href.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }
  
  monitorPerformance() {
    // Monitor Web Vitals if supported
    if ('web-vital' in window) {
      // This would integrate with a Web Vitals library
      console.log('Web Vitals monitoring enabled');
    }
    
    // Log performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (performance.getEntriesByType) {
          const navigation = performance.getEntriesByType('navigation')[0];
          console.log('Page Load Performance:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstByte: navigation.responseStart - navigation.requestStart
          });
        }
      }, 0);
    });
  }
}

/**
 * Initialize all managers when DOM is ready
 */
function initializeDesignSystem() {
  // Initialize theme manager first
  window.themeManager = new ThemeManager();
  
  // Initialize accessibility manager
  window.a11y = new AccessibilityManager();
  
  // Initialize component manager
  window.components = new ComponentManager();
  
  // Initialize performance manager
  window.performance = new PerformanceManager();
  
  console.log('Williams College Design System v2.0 initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDesignSystem);
} else {
  initializeDesignSystem();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    AccessibilityManager,
    ComponentManager,
    PerformanceManager
  };
}

/*!
 * End of Williams College Design System JavaScript Bundle
 */