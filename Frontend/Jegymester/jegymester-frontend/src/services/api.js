const API_BASE_URL = 'http://localhost:5214/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.Message || errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

// User Authentication
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/User/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};


export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/User/Register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Movies
export const getMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/Movie/List`);
  return handleResponse(response);
};

export const getMovie = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Movie/GetMovie/${id}`);
  const result = await handleResponse(response);
  return result.data;
};


export const addMovie = async (movieData) => {
  const response = await fetch(`${API_BASE_URL}/Movie/AddMovie`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(movieData),
  });
  return handleResponse(response);
};

export const updateMovie = async (id, movieData) => {
  const response = await fetch(`${API_BASE_URL}/Movie/UpdateMovie/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(movieData),
  });
  return handleResponse(response);
};

export const deleteMovie = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Movie/DeleteMovie/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Screenings
export const getScreenings = async () => {
  const response = await fetch(`${API_BASE_URL}/Screening/List`);
  return handleResponse(response);
};

export const getScreening = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Screening/GetScreening/${id}`);
  return handleResponse(response);
};

export const addScreening = async (screeningData) => {
  const response = await fetch(`${API_BASE_URL}/Screening/AddScreening`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(screeningData),
  });
  return handleResponse(response);
};

export const updateScreening = async (id, screeningData) => {
  const response = await fetch(`${API_BASE_URL}/Screening/UpdateScreening/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(screeningData),
  });
  return handleResponse(response);
};

export const deleteScreening = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Screening/DeleteScreening/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Tickets
export const getTickets = async () => {
  const response = await fetch(`${API_BASE_URL}/Ticket/list`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const purchaseTicket = async (ticketData) => {
  const response = await fetch(`${API_BASE_URL}/Ticket/purchase-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(ticketData),
  });
  return handleResponse(response);
};

export const deleteTicket = async (id) => {
  const response = await fetch(`${API_BASE_URL}/Ticket/delete-ticket/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// At the bottom of api.js

export const movieAPI = {
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie,
};

export const screeningAPI = {
  getScreenings,
  getScreening,
  addScreening,
  updateScreening,
  deleteScreening,
};

export const ticketAPI = {
  getTickets,
  purchaseTicket,
  deleteTicket,
};

export const authAPI = {
  login,
  register,
};
