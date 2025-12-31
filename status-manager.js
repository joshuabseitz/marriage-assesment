/**
 * SYMBIS Status Manager
 * Tracks user progress through the assessment flow
 */

const STATUS_KEYS = {
  PERSON1_RESPONSES: 'person1_responses',
  PERSON2_RESPONSES: 'person2_responses',
  PERSON1_COMPLETE: 'person1_complete',
  PERSON2_COMPLETE: 'person2_complete',
  GENERATED_REPORT: 'generated_report',
  REPORT_DATE: 'report_generated_date',
  CURRENT_PERSON: 'current_person'
};

/**
 * Status Manager Class
 */
class SymbisStatusManager {
  /**
   * Get complete status overview
   */
  static getStatus() {
    return {
      person1: {
        hasResponses: !!localStorage.getItem(STATUS_KEYS.PERSON1_RESPONSES),
        isComplete: localStorage.getItem(STATUS_KEYS.PERSON1_COMPLETE) === 'true',
        responseCount: this.getResponseCount(1)
      },
      person2: {
        hasResponses: !!localStorage.getItem(STATUS_KEYS.PERSON2_RESPONSES),
        isComplete: localStorage.getItem(STATUS_KEYS.PERSON2_COMPLETE) === 'true',
        responseCount: this.getResponseCount(2)
      },
      survey: {
        isComplete: this.isSurveyComplete(),
        completionPercent: this.getSurveyCompletionPercent()
      },
      report: {
        isGenerated: !!localStorage.getItem(STATUS_KEYS.GENERATED_REPORT),
        generatedDate: localStorage.getItem(STATUS_KEYS.REPORT_DATE),
        canGenerate: this.canGenerateReport()
      },
      currentStep: this.getCurrentStep()
    };
  }
  
  /**
   * Get response count for a person
   */
  static getResponseCount(personNum) {
    const key = personNum === 1 ? STATUS_KEYS.PERSON1_RESPONSES : STATUS_KEYS.PERSON2_RESPONSES;
    const responses = localStorage.getItem(key);
    if (!responses) return 0;
    
    try {
      const parsed = JSON.parse(responses);
      return Object.keys(parsed).length;
    } catch (e) {
      return 0;
    }
  }
  
  /**
   * Check if survey is complete
   */
  static isSurveyComplete() {
    return localStorage.getItem(STATUS_KEYS.PERSON1_COMPLETE) === 'true' &&
           localStorage.getItem(STATUS_KEYS.PERSON2_COMPLETE) === 'true';
  }
  
  /**
   * Get survey completion percentage
   */
  static getSurveyCompletionPercent() {
    const person1Complete = localStorage.getItem(STATUS_KEYS.PERSON1_COMPLETE) === 'true';
    const person2Complete = localStorage.getItem(STATUS_KEYS.PERSON2_COMPLETE) === 'true';
    
    if (person1Complete && person2Complete) return 100;
    if (person1Complete || person2Complete) return 50;
    
    // Check partial completion
    const person1Count = this.getResponseCount(1);
    const person2Count = this.getResponseCount(2);
    const totalExpected = 606; // 303 questions x 2 people
    const totalAnswered = person1Count + person2Count;
    
    return Math.min(Math.round((totalAnswered / totalExpected) * 100), 99);
  }
  
  /**
   * Check if report can be generated
   */
  static canGenerateReport() {
    return this.isSurveyComplete();
  }
  
  /**
   * Determine current step in the flow
   */
  static getCurrentStep() {
    if (localStorage.getItem(STATUS_KEYS.GENERATED_REPORT)) {
      return 'report';
    }
    if (this.isSurveyComplete()) {
      return 'generate';
    }
    return 'survey';
  }
  
  /**
   * Get formatted status message
   */
  static getStatusMessage() {
    const status = this.getStatus();
    
    if (status.report.isGenerated) {
      return {
        type: 'success',
        title: 'Report Ready!',
        message: 'Your personalized SYMBIS report has been generated.',
        action: 'View Report',
        actionUrl: 'index'
      };
    }
    
    if (status.survey.isComplete) {
      return {
        type: 'info',
        title: 'Survey Complete!',
        message: 'Both partners have completed the assessment. Ready to generate your report.',
        action: 'Generate Report',
        actionUrl: 'report-generator'
      };
    }
    
    if (status.person1.isComplete && !status.person2.isComplete) {
      return {
        type: 'warning',
        title: 'Waiting for Partner',
        message: 'Person 1 is complete. Person 2 needs to complete the survey.',
        action: 'Continue Survey',
        actionUrl: 'survey'
      };
    }
    
    if (!status.person1.isComplete && status.person2.isComplete) {
      return {
        type: 'warning',
        title: 'Waiting for Partner',
        message: 'Person 2 is complete. Person 1 needs to complete the survey.',
        action: 'Continue Survey',
        actionUrl: 'survey'
      };
    }
    
    return {
      type: 'info',
      title: 'Get Started',
      message: 'Begin your SYMBIS pre-marriage assessment.',
      action: 'Start Survey',
      actionUrl: 'survey'
    };
  }
  
  /**
   * Create status badge HTML
   */
  static createStatusBadge() {
    const status = this.getStatus();
    const message = this.getStatusMessage();
    
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return `
      <div class="status-badge ${colors[message.type]} border-2 rounded-lg p-4 mb-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1">${message.title}</h3>
            <p class="text-sm mb-3">${message.message}</p>
            <div class="flex items-center space-x-4 text-xs">
              <span class="flex items-center">
                ${status.person1.isComplete ? '✓' : '○'} Person 1
              </span>
              <span class="flex items-center">
                ${status.person2.isComplete ? '✓' : '○'} Person 2
              </span>
              ${status.report.isGenerated ? `
                <span class="flex items-center">
                  ✓ Report Generated
                </span>
              ` : ''}
            </div>
          </div>
          <a href="${message.actionUrl}" 
             class="ml-4 px-4 py-2 bg-white rounded-md font-medium text-sm hover:shadow-md transition-shadow whitespace-nowrap">
            ${message.action} →
          </a>
        </div>
      </div>
    `;
  }
  
  /**
   * Create progress bar HTML
   */
  static createProgressBar() {
    const percent = this.getSurveyCompletionPercent();
    
    return `
      <div class="progress-container mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Overall Progress</span>
          <span class="text-sm font-medium text-gray-700">${percent}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r from-teal-500 to-teal-600 h-3 transition-all duration-500 ease-out" 
               style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }
  
  /**
   * Create detailed status cards HTML
   */
  static createStatusCards() {
    const status = this.getStatus();
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Survey Card -->
        <div class="bg-white rounded-lg border-2 ${status.survey.isComplete ? 'border-green-500' : 'border-gray-200'} p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-800">Survey</h4>
            ${status.survey.isComplete ? 
              '<span class="text-2xl">✅</span>' : 
              '<span class="text-2xl">📝</span>'}
          </div>
          <p class="text-sm text-gray-600 mb-2">
            ${status.survey.isComplete ? 'Complete!' : 'In Progress'}
          </p>
          <div class="text-xs text-gray-500">
            <div>Person 1: ${status.person1.isComplete ? '✓ Complete' : '○ Pending'}</div>
            <div>Person 2: ${status.person2.isComplete ? '✓ Complete' : '○ Pending'}</div>
          </div>
        </div>
        
        <!-- Generation Card -->
        <div class="bg-white rounded-lg border-2 ${status.report.canGenerate ? 'border-blue-500' : 'border-gray-200'} p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-800">Generate</h4>
            ${status.report.canGenerate ? 
              '<span class="text-2xl">🤖</span>' : 
              '<span class="text-2xl text-gray-300">🔒</span>'}
          </div>
          <p class="text-sm text-gray-600 mb-2">
            ${status.report.canGenerate ? 'Ready to Generate' : 'Complete Survey First'}
          </p>
          <div class="text-xs text-gray-500">
            ${status.report.canGenerate ? 
              'Click to create your personalized report' : 
              'Both partners must complete survey'}
          </div>
        </div>
        
        <!-- Report Card -->
        <div class="bg-white rounded-lg border-2 ${status.report.isGenerated ? 'border-teal-500' : 'border-gray-200'} p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-800">Report</h4>
            ${status.report.isGenerated ? 
              '<span class="text-2xl">📊</span>' : 
              '<span class="text-2xl text-gray-300">⏳</span>'}
          </div>
          <p class="text-sm text-gray-600 mb-2">
            ${status.report.isGenerated ? 'Available' : 'Not Generated Yet'}
          </p>
          <div class="text-xs text-gray-500">
            ${status.report.isGenerated && status.report.generatedDate ? 
              `Generated ${new Date(status.report.generatedDate).toLocaleDateString()}` : 
              'Generate report first'}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Mark a step as complete
   */
  static markComplete(step) {
    switch(step) {
      case 'person1':
        localStorage.setItem(STATUS_KEYS.PERSON1_COMPLETE, 'true');
        break;
      case 'person2':
        localStorage.setItem(STATUS_KEYS.PERSON2_COMPLETE, 'true');
        break;
      case 'report':
        localStorage.setItem(STATUS_KEYS.REPORT_DATE, new Date().toISOString());
        break;
    }
  }
  
  /**
   * Clear all status data
   */
  static clearAll() {
    Object.values(STATUS_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export to window for global access
window.SymbisStatus = SymbisStatusManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SymbisStatusManager;
}

