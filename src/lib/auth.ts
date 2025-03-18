
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

type StoredUser = {
  id: string;
  email: string;
  password: string; // In a real app, never store plain-text passwords
  role: 'user' | 'admin';
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
      },
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  }
};

// Call this when the app initializes
initUsers();

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
      };

      // Save to "database"
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

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
  },

  getCurrentUser: (): { id: string; email: string; role: 'user' | 'admin' } | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin';
  }
};
