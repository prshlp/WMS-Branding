/**
 * Theme Manager - Williams College Design System
 * Handles theme switching, persistence, and system preference detection
 */

class ThemeManager {
  constructor(options = {}) {
    this.options = {
      storageKey: 'williams-theme',
      defaultTheme: 'auto',
      themes: ['light', 'dark', 'auto'],
      transitionDuration: 200,
      ...options
    };
    
    this.currentTheme = null;
    this.systemTheme = null;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  /**
   * Initialize the theme manager
   */
  init() {
    // Get stored theme or use default
    const storedTheme = this.getStoredTheme();
    this.currentTheme = storedTheme || this.options.defaultTheme;
    
    // Apply theme immediately to prevent flash
    this.applyTheme(this.currentTheme, false);
    
    // Set up system theme detection
    this.detectSystemTheme();
    this.setupSystemThemeListener();
    
    // Set up theme toggle buttons if they exist
    this.setupThemeToggles();
    
    // Expose API to window
    window.themeManager = this;
  }
  
  /**
   * Get the stored theme from localStorage
   */
  getStoredTheme() {
    try {
      return localStorage.getItem(this.options.storageKey);
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
      return null;
    }
  }
  
  /**
   * Store the theme in localStorage
   */
  storeTheme(theme) {
    try {
      localStorage.setItem(this.options.storageKey, theme);
    } catch (e) {
      console.warn('Failed to store theme:', e);
    }
  }
  
  /**
   * Detect the system theme preference
   */
  detectSystemTheme() {
    this.systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
  }
  
  /**
   * Set up listener for system theme changes
   */
  setupSystemThemeListener() {
    this.mediaQuery.addEventListener('change', (e) => {
      this.systemTheme = e.matches ? 'dark' : 'light';
      
      // If current theme is auto, apply the new system theme
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto', true);
      }
    });
  }
  
  /**
   * Apply the specified theme
   */
  applyTheme(theme, animate = true) {
    const root = document.documentElement;
    
    // Handle transition animation
    if (animate) {
      root.classList.add('theme-transitioning');
    }
    
    // Determine actual theme to apply
    let actualTheme = theme;
    if (theme === 'auto') {
      actualTheme = this.systemTheme || 'light';
    }
    
    // Remove all theme classes and add new one
    root.setAttribute('data-theme', actualTheme);
    
    // Update current theme
    this.currentTheme = theme;
    
    // Store theme preference
    this.storeTheme(theme);
    
    // Dispatch custom event
    this.dispatchThemeChangeEvent(theme, actualTheme);
    
    // Update toggle buttons
    this.updateToggleButtons(theme);
    
    // Remove transition class after animation
    if (animate) {
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, this.options.transitionDuration);
    }
    
    // Update meta theme-color
    this.updateMetaThemeColor(actualTheme);
  }
  
  /**
   * Cycle through available themes
   */
  cycleTheme() {
    const currentIndex = this.options.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.options.themes.length;
    const nextTheme = this.options.themes[nextIndex];
    
    this.applyTheme(nextTheme, true);
  }
  
  /**
   * Set a specific theme
   */
  setTheme(theme) {
    if (this.options.themes.includes(theme)) {
      this.applyTheme(theme, true);
    } else {
      console.warn(`Theme "${theme}" is not available`);
    }
  }
  
  /**
   * Get the current theme
   */
  getTheme() {
    return this.currentTheme;
  }
  
  /**
   * Get the actual applied theme (resolves 'auto')
   */
  getAppliedTheme() {
    if (this.currentTheme === 'auto') {
      return this.systemTheme || 'light';
    }
    return this.currentTheme;
  }
  
  /**
   * Set up theme toggle buttons
   */
  setupThemeToggles() {
    // Find all theme toggle buttons
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    
    toggles.forEach(toggle => {
      // Set initial state
      this.updateToggleButton(toggle, this.currentTheme);
      
      // Add click handler
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetTheme = toggle.dataset.themeToggle;
        
        if (targetTheme === 'cycle') {
          this.cycleTheme();
        } else if (targetTheme) {
          this.setTheme(targetTheme);
        }
      });
    });
  }
  
  /**
   * Update toggle button state
   */
  updateToggleButton(button, theme) {
    // Update aria-pressed for accessibility
    button.setAttribute('aria-pressed', button.dataset.themeToggle === theme);
    
    // Update button text if it has a text element
    const textElement = button.querySelector('[data-theme-text]');
    if (textElement) {
      textElement.textContent = theme;
    }
    
    // Update button icon if it has icon elements
    const icons = button.querySelectorAll('[data-theme-icon]');
    icons.forEach(icon => {
      const iconTheme = icon.dataset.themeIcon;
      icon.style.display = iconTheme === theme ? 'block' : 'none';
    });
  }
  
  /**
   * Update all toggle buttons
   */
  updateToggleButtons(theme) {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(toggle => {
      this.updateToggleButton(toggle, theme);
    });
  }
  
  /**
   * Update meta theme-color tag
   */
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      // Use computed styles to get the actual color value
      const styles = getComputedStyle(document.documentElement);
      const color = theme === 'dark' 
        ? styles.getPropertyValue('--gray-900').trim()
        : styles.getPropertyValue('--williams-purple').trim();
      
      metaThemeColor.setAttribute('content', color);
    }
  }
  
  /**
   * Dispatch custom theme change event
   */
  dispatchThemeChangeEvent(theme, appliedTheme) {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: theme,
        appliedTheme: appliedTheme,
        systemTheme: this.systemTheme
      }
    });
    
    window.dispatchEvent(event);
  }
  
  /**
   * Create a theme toggle button element
   */
  createToggleButton(options = {}) {
    const config = {
      type: 'cycle', // 'cycle', 'light', 'dark', 'auto'
      showText: false,
      showIcon: true,
      className: 'theme-toggle',
      ariaLabel: 'Toggle theme',
      ...options
    };
    
    const button = document.createElement('button');
    button.className = config.className;
    button.setAttribute('data-theme-toggle', config.type);
    button.setAttribute('aria-label', config.ariaLabel);
    button.setAttribute('type', 'button');
    
    // Add icons if requested
    if (config.showIcon) {
      button.innerHTML = `
        <svg data-theme-icon="light" class="theme-icon theme-icon--light" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 2V4M10 16V18M4 10H2M6.31412 6.31412L4.8999 4.8999M13.6859 6.31412L15.1001 4.8999M6.31412 13.69L4.8999 15.1001M13.6859 13.69L15.1001 15.1001M18 10H16M14 10C14 7.79086 12.2091 6 10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14C12.2091 14 14 12.2091 14 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg data-theme-icon="dark" class="theme-icon theme-icon--dark" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
        </svg>
        <svg data-theme-icon="auto" class="theme-icon theme-icon--auto" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 2C10 1.44772 9.55228 1 9 1C8.44772 1 8 1.44772 8 2V3C8 3.55228 8.44772 4 9 4C9.55228 4 10 3.55228 10 3V2Z" fill="currentColor"/>
          <path d="M14 10C14 12.2091 12.2091 14 10 14V10H14Z" fill="currentColor"/>
          <path d="M10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V10H14C14 7.79086 12.2091 6 10 6Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;
    }
    
    // Add text if requested
    if (config.showText) {
      const textSpan = document.createElement('span');
      textSpan.setAttribute('data-theme-text', '');
      textSpan.textContent = this.currentTheme;
      button.appendChild(textSpan);
    }
    
    // Set initial state
    this.updateToggleButton(button, this.currentTheme);
    
    // Add click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (config.type === 'cycle') {
        this.cycleTheme();
      } else {
        this.setTheme(config.type);
      }
    });
    
    return button;
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}