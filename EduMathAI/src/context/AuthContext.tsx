import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Curriculum, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  curriculum: Curriculum;
  language: string;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string; role?: string }) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setCurriculum: (curriculum: Curriculum) => void;
  setLanguage: (lang: string) => void;
  updateUser: (updatedUser: User, updatedProfile?: any) => void;
  isStudent: boolean;
  isTeacher: boolean;
  isParent: boolean;
  isSchoolAdmin: boolean;
  isPlatformAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [curriculum, setCurriculumState] = useState<Curriculum>('CBSE');
  const [language, setLanguageState] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('edumath_user');
      const storedProfile = localStorage.getItem('edumath_profile');
      const storedToken = localStorage.getItem('edumath_token');
      const storedCurriculum = localStorage.getItem('edumath_curriculum') as Curriculum;
      const storedLang = localStorage.getItem('edumath_lang');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedToken) setToken(storedToken);
      if (storedCurriculum) setCurriculumState(storedCurriculum);
      if (storedLang) setLanguageState(storedLang);
    } catch (e) {
      console.error('Failed to parse auth cache:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAuthSession = (u: User, p: any, t: string) => {
    setUser(u);
    setProfile(p);
    setToken(t);
    localStorage.setItem('edumath_user', JSON.stringify(u));
    if (p) localStorage.setItem('edumath_profile', JSON.stringify(p));
    localStorage.setItem('edumath_token', t);

    if (p?.curriculum) {
      setCurriculumState(p.curriculum);
      localStorage.setItem('edumath_curriculum', p.curriculum);
    }
  };

  const login = async (credentials: { email: string; password?: string; role?: string }) => {
    setIsLoading(true);
    try {
      const data = await api.login(credentials);
      saveAuthSession(data.user, data.profile, data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const data = await api.demoLogin(role);
      saveAuthSession(data.user, data.profile, data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    setIsLoading(true);
    try {
      const data = await api.register(formData);
      saveAuthSession(data.user, data.profile, data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('edumath_user');
    localStorage.removeItem('edumath_profile');
    localStorage.removeItem('edumath_token');
  };

  const setCurriculum = (newCurriculum: Curriculum) => {
    setCurriculumState(newCurriculum);
    localStorage.setItem('edumath_curriculum', newCurriculum);
    if (profile) {
      const updated = { ...profile, curriculum: newCurriculum };
      setProfile(updated);
      localStorage.setItem('edumath_profile', JSON.stringify(updated));
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('edumath_lang', lang);
  };

  const updateUser = (updatedUser: User, updatedProfile?: any) => {
    setUser(updatedUser);
    localStorage.setItem('edumath_user', JSON.stringify(updatedUser));
    if (updatedProfile) {
      setProfile(updatedProfile);
      localStorage.setItem('edumath_profile', JSON.stringify(updatedProfile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        curriculum,
        language,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        setCurriculum,
        setLanguage,
        updateUser,
        isStudent: user?.role === 'STUDENT',
        isTeacher: user?.role === 'TEACHER',
        isParent: user?.role === 'PARENT',
        isSchoolAdmin: user?.role === 'SCHOOL_ADMIN',
        isPlatformAdmin: user?.role === 'PLATFORM_ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
