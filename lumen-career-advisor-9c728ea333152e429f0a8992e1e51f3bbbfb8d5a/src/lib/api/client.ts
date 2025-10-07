// API client for the new PostgreSQL backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    // Get token from localStorage if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.token = user.token || null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request error:', error);
      return { error: 'Network error occurred' };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request<{ message: string; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      // Store user data with token in localStorage
      const userWithToken = { ...response.data.user, token: response.data.token };
      localStorage.setItem('currentUser', JSON.stringify(userWithToken));
    }

    return response;
  }

  async register(email: string, password: string, name: string, role: string) {
    const response = await this.request<{ message: string; user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });

    if (response.data) {
      this.token = response.data.token;
      // Store user data with token in localStorage
      const userWithToken = { ...response.data.user, token: response.data.token };
      localStorage.setItem('currentUser', JSON.stringify(userWithToken));
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Skills methods
  async getSkills() {
    return this.request('/skills');
  }

  async getSkillsByDomain(domain: string) {
    return this.request(`/skills/domain/${domain}`);
  }

  // Jobs methods
  async getJobs() {
    return this.request('/jobs');
  }

  async getJobById(id: string) {
    return this.request(`/jobs/${id}`);
  }

  // Certifications methods
  async getCertifications() {
    return this.request('/certifications');
  }

  async getCertificationsByPlatform(platform: string) {
    return this.request(`/certifications/platform/${platform}`);
  }

  async getCertificationsBySkill(skill: string) {
    return this.request(`/certifications/skill/${skill}`);
  }

  // Internships methods
  async getInternships() {
    return this.request('/internships');
  }

  async getInternshipsByPlatform(platform: string) {
    return this.request(`/internships/platform/${platform}`);
  }

  async getInternshipsByRole(role: string) {
    return this.request(`/internships/role/${role}`);
  }

  // Quiz methods
  async getQuizQuestions(subject: string) {
    return this.request(`/quiz/${subject}`);
  }

  async getQuizSubjects() {
    return this.request('/quiz/subjects/all');
  }

  async submitQuizResults(userId: string, subject: string, score: number, totalQuestions: number, answers: Record<string, string>) {
    return this.request('/quiz/results', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, subject, score, total_questions: totalQuestions, answers }),
    });
  }

  async getQuizResults(userId: string) {
    return this.request(`/quiz/results/${userId}`);
  }

  // Profile methods
  async getGraduateProfile(userId: string) {
    return this.request(`/profiles/${userId}`);
  }

  async createOrUpdateGraduateProfile(userId: string, profileData: {
    resume_text?: string;
    extracted_skills?: string[];
    job_matches?: any[];
  }) {
    return this.request(`/profiles/${userId}`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateExtractedSkills(userId: string, skills: string[]) {
    return this.request(`/profiles/${userId}/skills`, {
      method: 'PATCH',
      body: JSON.stringify({ extracted_skills: skills }),
    });
  }

  async updateJobMatches(userId: string, matches: any[]) {
    return this.request(`/profiles/${userId}/matches`, {
      method: 'PATCH',
      body: JSON.stringify({ job_matches: matches }),
    });
  }

  // Admin methods
  async getAllUsers() {
    return this.request('/users');
  }

  async getAllGraduateProfiles() {
    return this.request('/profiles');
  }

  // Utility method to update token
  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}

// Create and export a single instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
