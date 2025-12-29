/**
 * SYMBIS Navigation Component
 * Provides consistent navigation across all pages
 */

// Navigation state and configuration
const NAV_CONFIG = {
  pages: {
    survey: { title: 'Survey', url: 'survey' },
    generator: { title: 'Generate Report', url: 'report-generator' },
    report: { title: 'View Report', url: 'index' }
  },
  reportPages: [
    { num: 1, title: 'Overview', url: 'index' },
    { num: 2, title: 'Love Styles', url: 'page2' },
    { num: 3, title: 'Happiness & Attitude', url: 'page3' },
    { num: 4, title: 'Communication', url: 'page4' },
    { num: 5, title: 'Gender Differences', url: 'page5' },
    { num: 6, title: 'Conflict Resolution', url: 'page6' },
    { num: 7, title: 'Soul Mates', url: 'page7' },
    { num: 8, title: 'Money & Finances', url: 'page8' },
    { num: 9, title: 'Spiritual Intimacy', url: 'page9' },
    { num: 10, title: 'Social Support', url: 'page10' },
    { num: 11, title: 'Expectations & Roles', url: 'page11' },
    { num: 12, title: 'Family Background', url: 'page12' },
    { num: 13, title: 'Vision & Goals', url: 'page13' },
    { num: 14, title: 'Realistic Expectations', url: 'page14' },
    { num: 15, title: 'Next Steps', url: 'page15' }
  ]
};

/**
 * Create the main navigation bar
 * @param {string} currentPage - Current page identifier ('survey', 'generator', or 'report')
 * @returns {string} HTML for navigation bar
 */
function createNavBar(currentPage = '') {
  const status = getNavigationStatus();
  
  return `
    <nav class="symbis-nav bg-white border-b border-slate-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Main Nav -->
          <div class="flex items-center space-x-8">
            <a href="survey" class="flex items-center space-x-2">
              <span class="font-bold text-slate-900 text-2xl tracking-tight">SYMBIS</span>
            </a>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-1">
              <a href="survey" 
                 class="nav-link px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                   currentPage === 'survey' 
                     ? 'bg-slate-50 text-slate-900 font-semibold' 
                     : status.surveyComplete 
                       ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50' 
                       : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                 }">
                ${status.surveyComplete ? '✓ ' : ''}Survey
              </a>
              <a href="report-generator" 
                 class="nav-link px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                   currentPage === 'generator' 
                     ? 'bg-slate-50 text-slate-900 font-semibold' 
                     : status.reportGenerated 
                       ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50' 
                       : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                 }">
                ${status.reportGenerated ? '✓ ' : ''}Generate Report
              </a>
              <a href="index" 
                 class="nav-link px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                   currentPage === 'report' 
                     ? 'bg-slate-50 text-slate-900 font-semibold' 
                     : status.reportGenerated 
                       ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' 
                       : 'text-slate-300 cursor-not-allowed'
                 }"
                 ${!status.reportGenerated ? 'onclick="return false;"' : ''}>
                View Report
              </a>
            </div>
          </div>
          
          <!-- Right Side Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <a href="index" 
               class="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Sample Report
            </a>
            <a href="partner-connect" 
               class="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Find Partner
            </a>
            <a href="profile" 
               class="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Profile
            </a>
            <button onclick="SymbisNav.signOut()" 
                    class="text-slate-600 hover:text-red-600 text-sm font-medium transition-colors">
              Sign Out
            </button>
          </div>
          
          <!-- Mobile Menu Button -->
          <button onclick="SymbisNav.toggleMobileMenu()" 
                  class="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div id="mobile-menu" class="hidden md:hidden border-t border-slate-100 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="survey" 
             class="block px-3 py-2 rounded-md text-base font-medium transition-colors ${
               currentPage === 'survey' ? 'bg-slate-50 text-slate-900' : 'text-slate-600'
             } hover:bg-slate-50 hover:text-slate-900">
            ${status.surveyComplete ? '✓ ' : ''}Survey
          </a>
          <a href="report-generator" 
             class="block px-3 py-2 rounded-md text-base font-medium transition-colors ${
               currentPage === 'generator' ? 'bg-slate-50 text-slate-900' : 'text-slate-600'
             } hover:bg-slate-50 hover:text-slate-900">
            ${status.reportGenerated ? '✓ ' : ''}Generate Report
          </a>
          <a href="index" 
             class="block px-3 py-2 rounded-md text-base font-medium transition-colors ${
               status.reportGenerated 
                 ? currentPage === 'report' ? 'bg-slate-50 text-slate-900' : 'text-slate-600' 
                 : 'text-slate-400'
             } hover:bg-slate-50 hover:text-slate-900"
             ${!status.reportGenerated ? 'onclick="return false;"' : ''}>
            View Report
          </a>
          <hr class="my-2">
          <a href="index" 
             class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">
            Sample Report
          </a>
          <a href="partner-connect" 
             class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">
            Find Partner
          </a>
          <a href="profile" 
             class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50">
            Profile
          </a>
          <button onclick="SymbisNav.signOut()" 
                  class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Create report page navigation (previous/next, page selector)
 * @param {number} currentPageNum - Current page number (1-15)
 * @returns {string} HTML for report navigation
 */
function createReportNav(currentPageNum) {
  const totalPages = NAV_CONFIG.reportPages.length;
  const currentPage = NAV_CONFIG.reportPages[currentPageNum - 1];
  const prevPage = currentPageNum > 1 ? NAV_CONFIG.reportPages[currentPageNum - 2] : null;
  const nextPage = currentPageNum < totalPages ? NAV_CONFIG.reportPages[currentPageNum] : null;
  
  return `
    <div class="report-navigation bg-white border-t border-slate-100 py-4 px-6 sticky bottom-0 shadow-lg">
      <div class="max-w-7xl mx-auto">
        <!-- Mobile: Simplified Navigation -->
        <div class="flex md:hidden items-center justify-between">
          ${prevPage ? `
            <a href="${prevPage.url}" 
               class="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              ← Prev
            </a>
          ` : '<div></div>'}
          
          <select onchange="SymbisNav.goToPage(this.value)" 
                  class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500">
            ${NAV_CONFIG.reportPages.map(page => `
              <option value="${page.url}" ${page.num === currentPageNum ? 'selected' : ''}>
                Page ${page.num}: ${page.title}
              </option>
            `).join('')}
          </select>
          
          ${nextPage ? `
            <a href="${nextPage.url}" 
               class="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Next →
            </a>
          ` : '<div></div>'}
        </div>
        
        <!-- Desktop: Full Navigation -->
        <div class="hidden md:flex items-center justify-between">
          <div class="flex items-center space-x-4">
            ${prevPage ? `
              <a href="${prevPage.url}" 
                 class="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous: ${prevPage.title}</span>
              </a>
            ` : '<div></div>'}
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-slate-600 font-medium">
              Page ${currentPageNum} of ${totalPages}
            </span>
            
            <select onchange="SymbisNav.goToPage(this.value)" 
                    class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white">
              <option value="">Jump to page...</option>
              ${NAV_CONFIG.reportPages.map(page => `
                <option value="${page.url}" ${page.num === currentPageNum ? 'selected' : ''}>
                  ${page.num}. ${page.title}
                </option>
              `).join('')}
            </select>
            
            <a href="report-generator" 
               class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Back to Generator
            </a>
          </div>
          
          <div>
            ${nextPage ? `
              <a href="${nextPage.url}" 
                 class="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                <span>Next: ${nextPage.title}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ` : '<div></div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Get navigation status (placeholder - real status comes from Supabase)
 * @returns {object} Status object with completion flags
 */
function getNavigationStatus() {
  // In the Supabase version, this is simplified
  // Real status is checked on individual pages
  return {
    surveyComplete: false,
    reportGenerated: !!localStorage.getItem('generated_report') // Kept for report display
  };
}

/**
 * Global namespace for navigation functions
 */
window.SymbisNav = {
  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  },
  
  /**
   * Navigate to a specific report page
   */
  goToPage(url) {
    if (url) {
      window.location.href = url;
    }
  },
  
  /**
   * Sign out the current user
   */
  async signOut() {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        // Use the global supabaseAuth object
        await window.supabaseAuth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
        alert('Failed to sign out. Please try again.');
      }
    }
  },
  
  /**
   * Initialize navigation on page load
   */
  init(currentPage, pageNumber = null) {
    // Insert main navigation
    const navContainer = document.getElementById('symbis-navigation');
    if (navContainer) {
      navContainer.innerHTML = createNavBar(currentPage);
    }
    
    // Insert report navigation if on a report page
    if (pageNumber && currentPage === 'report') {
      const reportNavContainer = document.getElementById('report-navigation');
      if (reportNavContainer) {
        reportNavContainer.innerHTML = createReportNav(pageNumber);
      }
    }
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createNavBar, createReportNav, getNavigationStatus };
}

