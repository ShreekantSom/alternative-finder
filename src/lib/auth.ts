// Mock authentication service - would be replaced with a real auth system

interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin' | 'brand';
    brandId?: string;
    brandName?: string;
    pendingApproval?: boolean;
  };
}

// Simple storage for mock users
const USERS_STORAGE_KEY = 'alternative_app_users';
const CURRENT_USER_KEY = 'alternative_app_current_user';
const AUTH_TOKEN_KEY = 'alternative_app_auth_token';
const PENDING_BRANDS_KEY = 'alternative_app_pending_brands';
const PENDING_SUGGESTIONS_KEY = 'alternative_app_pending_suggestions';

type StoredUser = {
  id: string;
  email: string;
  password: string; // In a real app, never store plain-text passwords
  role: 'user' | 'admin' | 'brand';
  brandId?: string;
  brandName?: string;
  pendingApproval?: boolean;
  createdAt: string;
};

// Initialize with an admin user
const initUsers = (): void => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    const initialUsers: StoredUser[] = [
      {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123', // In a real app, this would be hashed
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'user@example.com',
        password: 'user123', // In a real app, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'brand@example.com',
        password: 'brand123', // In a real app, this would be hashed
        role: 'brand',
        brandId: 'brand-1',
        brandName: 'Example Brand',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  }
};

// Call this when the app initializes
initUsers();

// Generate a fake JWT-like token (for demo purposes only)
const generateToken = (userId: string): string => {
  const payload = {
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return btoa(JSON.stringify(payload)); // Base64 encode (NOT a real JWT implementation)
};

// In a real app, this would validate the JWT signature and check its expiration
const validateToken = (token: string): { valid: boolean; userId?: string } => {
  try {
    const decoded = JSON.parse(atob(token)); // Base64 decode
    if (decoded.exp < Date.now()) {
      return { valid: false };
    }
    return { valid: true, userId: decoded.sub };
  } catch (e) {
    return { valid: false };
  }
};

export const AuthService = {
  login: async (email: string, password: string, isAdminLogin = false): Promise<AuthResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // For admin login, enforce admin role
      if (isAdminLogin && user.role !== 'admin') {
        return { success: false, error: 'Access denied. Admin credentials required.' };
      }

      // Generate and store auth token
      const token = generateToken(user.id);
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Store current user (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { 
        success: true, 
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  },

  signup: async (email: string, password: string, role: 'user' | 'brand' = 'user', brandName?: string): Promise<AuthResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser: StoredUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        role,
        createdAt: new Date().toISOString(),
      };
      
      // Add brand details if it's a brand account
      if (role === 'brand' && brandName) {
        newUser.brandId = `brand-${Date.now()}`;
        newUser.brandName = brandName;
        newUser.pendingApproval = true; // Brand accounts need approval
      }

      // Save to "database"
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Generate and store auth token
      const token = generateToken(newUser.id);
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { 
        success: true, 
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getCurrentUser: () => {
    // First check if we have a valid token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return null;
    }

    const validation = validateToken(token);
    if (!validation.valid) {
      // Token is invalid or expired, clear auth state
      AuthService.logout();
      return null;
    }

    // Token is valid, return the user
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;
    
    return validateToken(token).valid;
  },

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin';
  },

  isBrand: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'brand';
  },

  // Brand/Service submission and approval functions
  submitBrandForApproval: async (brandData: any): Promise<{success: boolean, error?: string}> => {
    try {
      const pendingBrandsJson = localStorage.getItem(PENDING_BRANDS_KEY);
      const pendingBrands = pendingBrandsJson ? JSON.parse(pendingBrandsJson) : [];
      
      // Add submission ID and timestamp
      const submission = {
        ...brandData,
        id: `submission-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Save submission
      pendingBrands.push(submission);
      localStorage.setItem(PENDING_BRANDS_KEY, JSON.stringify(pendingBrands));
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting brand:', error);
      return { success: false, error: 'Failed to submit brand for approval' };
    }
  },
  
  getPendingBrands: async (): Promise<any[]> => {
    const pendingBrandsJson = localStorage.getItem(PENDING_BRANDS_KEY);
    return pendingBrandsJson ? JSON.parse(pendingBrandsJson) : [];
  },
  
  approveBrand: async (submissionId: string): Promise<{success: boolean, error?: string}> => {
    try {
      // Get pending brands
      const pendingBrandsJson = localStorage.getItem(PENDING_BRANDS_KEY);
      const pendingBrands = pendingBrandsJson ? JSON.parse(pendingBrandsJson) : [];
      
      // Find the submission
      const submissionIndex = pendingBrands.findIndex((s: any) => s.id === submissionId);
      if (submissionIndex === -1) {
        return { success: false, error: 'Submission not found' };
      }
      
      const submission = pendingBrands[submissionIndex];
      
      if (submission.userId) {
        // User suggested a brand - create a new brand entry
        // Implementation would depend on how brands are stored
      } else if (submission.brandId) {
        // Existing brand submitted new info - update the brand
        // Find the user and update pendingApproval status
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
        
        const userIndex = users.findIndex(u => u.brandId === submission.brandId);
        if (userIndex !== -1) {
          users[userIndex].pendingApproval = false;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
      
      // Update submission status
      pendingBrands[submissionIndex].status = 'approved';
      pendingBrands[submissionIndex].approvedAt = new Date().toISOString();
      localStorage.setItem(PENDING_BRANDS_KEY, JSON.stringify(pendingBrands));
      
      return { success: true };
    } catch (error) {
      console.error('Error approving brand:', error);
      return { success: false, error: 'Failed to approve brand' };
    }
  },
  
  rejectBrand: async (submissionId: string, reason: string): Promise<{success: boolean, error?: string}> => {
    try {
      // Get pending brands
      const pendingBrandsJson = localStorage.getItem(PENDING_BRANDS_KEY);
      const pendingBrands = pendingBrandsJson ? JSON.parse(pendingBrandsJson) : [];
      
      // Find the submission
      const submissionIndex = pendingBrands.findIndex((s: any) => s.id === submissionId);
      if (submissionIndex === -1) {
        return { success: false, error: 'Submission not found' };
      }
      
      // Update submission status
      pendingBrands[submissionIndex].status = 'rejected';
      pendingBrands[submissionIndex].rejectedAt = new Date().toISOString();
      pendingBrands[submissionIndex].rejectionReason = reason;
      localStorage.setItem(PENDING_BRANDS_KEY, JSON.stringify(pendingBrands));
      
      return { success: true };
    } catch (error) {
      console.error('Error rejecting brand:', error);
      return { success: false, error: 'Failed to reject brand' };
    }
  },

  // User suggestion for brands/services
  submitBrandSuggestion: async (suggestionData: any, userId: string): Promise<{success: boolean, error?: string}> => {
    try {
      const pendingSuggestionsJson = localStorage.getItem(PENDING_SUGGESTIONS_KEY);
      const pendingSuggestions = pendingSuggestionsJson ? JSON.parse(pendingSuggestionsJson) : [];
      
      // Add suggestion ID and timestamp
      const suggestion = {
        ...suggestionData,
        id: `suggestion-${Date.now()}`,
        userId,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Save suggestion
      pendingSuggestions.push(suggestion);
      localStorage.setItem(PENDING_SUGGESTIONS_KEY, JSON.stringify(pendingSuggestions));
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      return { success: false, error: 'Failed to submit brand suggestion' };
    }
  },
  
  getPendingSuggestions: async (): Promise<any[]> => {
    const pendingSuggestionsJson = localStorage.getItem(PENDING_SUGGESTIONS_KEY);
    return pendingSuggestionsJson ? JSON.parse(pendingSuggestionsJson) : [];
  }
};
