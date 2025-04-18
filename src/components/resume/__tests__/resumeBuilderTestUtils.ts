
/**
 * Shared utilities for ResumeBuilder test files
 */

import { analyticsService } from '@/utils/analytics';

// Reset all mocks before each test
export const setupMocks = () => {
  jest.clearAllMocks();
  
  // Make sure analyticsService.event accepts an object with the required properties
  (analyticsService.event as jest.Mock).mockImplementation((data: { 
    category: string; 
    action: string; 
    label?: string; 
    value?: number 
  }) => {});
};

// Helper function to create resume data
export const createResumeTestData = () => ({
  personalInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    location: 'Test City',
    summary: 'Test summary'
  },
  workExperience: [
    {
      id: '1',
      company: 'Test Company 1',
      position: 'Test Position 1',
      startDate: '2020-01',
      endDate: '2022-01',
      current: false,
      description: 'Test description 1'
    },
    {
      id: '2',
      company: 'Test Company 2',
      position: 'Test Position 2',
      startDate: '2022-02',
      endDate: '',
      current: true,
      description: 'Test description 2'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Test University',
      degree: 'Test Degree',
      field: 'Test Field',
      startDate: '2016-09',
      endDate: '2020-05',
      description: 'Test education description'
    }
  ],
  skills: ['Skill 1', 'Skill 2', 'Skill 3']
});

// Helper for mocking events
export const mockAnalyticsEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
) => {
  // This ensures the expected format when calling analyticsService.event()
  return analyticsService.event({ category, action, label, value });
};

export { analyticsService };
