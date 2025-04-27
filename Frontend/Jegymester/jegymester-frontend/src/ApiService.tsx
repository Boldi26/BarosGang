import {useAuth} from './AuthContext'; 

const BASE_URL = 'http://localhost:5214/api';
export interface Movie {
  id: number;
  name: string;
  length: number;
  genre: string;
  ageLimit: number;
}

export interface Screening {
  id: number;
  movieId: number;
  startTime: string;
  room: string;
  capacity: number;
  price: number;
}

export const useApiService = () => {
  const { getToken } = useAuth();
  
  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'API request failed');
    }
    
    return response.json();
  };
  const movieService = {
    list: async (): Promise<Movie[]> => {
      return fetchWithAuth('/Movie/List');
    },
    
    getById: async (id: number): Promise<Movie> => {
      return fetchWithAuth(`/Movie/get-movie/${id}`);
    },
    
    add: async (movie: Omit<Movie, 'id'>): Promise<Movie> => {
      return fetchWithAuth('/Movie/add-movie', {
        method: 'POST',
        body: JSON.stringify(movie)
      });
    },
    
    update: async (id: number, movie: Partial<Movie>): Promise<Movie> => {
      return fetchWithAuth(`/Movie/update-movie/${id}`, {
        method: 'PUT',
        body: JSON.stringify(movie)
      });
    },
    
    delete: async (id: number): Promise<void> => {
      return fetchWithAuth(`/Movie/delete-movie/${id}`, {
        method: 'DELETE'
      });
    }
  };
  
  const screeningService = {
    list: async (): Promise<Screening[]> => {
      return fetchWithAuth('/Screening/list');
    },
    
    getById: async (id: number): Promise<Screening> => {
      return fetchWithAuth(`/Screening/get-screening/${id}`);
    },
    
    add: async (screening: Omit<Screening, 'id'>): Promise<Screening> => {
      return fetchWithAuth('/Screening/add-screening', {
        method: 'POST',
        body: JSON.stringify(screening)
      });
    },
    
    update: async (id: number, screening: Partial<Screening>): Promise<Screening> => {
      return fetchWithAuth(`/Screening/update-screening/${id}`, {
        method: 'PUT',
        body: JSON.stringify(screening)
      });
    },
    
    delete: async (id: number): Promise<void> => {
      return fetchWithAuth(`/Screening/delete-screening/${id}`, {
        method: 'DELETE'
      });
    }
  };
  
  return {
    movie: movieService,
    screening: screeningService
  };
};