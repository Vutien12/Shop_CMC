import api from '@/api/axiosInstance.js';

// Get current user profile from /users endpoint
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Update user profile
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/users/me', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
