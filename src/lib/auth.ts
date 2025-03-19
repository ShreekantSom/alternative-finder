
// Mock authentication service - would be replaced with a real auth system

interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

// Simple storage for mock users
const USERS_STORAGE_KEY = 'alternative_app_users';
const CURRENT_USER_KEY = 'alternative_app_current_user';
const AUTH_TOKEN_KEY = 'alternative_app_auth_token';

type StoredUser = {
  id: string;
  email: string;
  password: string; // In a real app, never store plain-text passwords
  role: 'user' | 'admin';
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
  login: async (email: string, password: string): Promise<AuthResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
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

  signup: async (email: string, password: string): Promise<AuthResult> => {
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
        role: 'user',
        createdAt: new Date().toISOString(),
      };

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

  getCurrentUser: (): { id: string; email: string; role: 'user' | 'admin' } | null => {
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
  }
};
