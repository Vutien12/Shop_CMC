import axiosInstance from './axiosInstance';

// Get all coupons
export const getCoupons = async () => {
    try {
        const response = await axiosInstance.get('/coupons');
        return response.data;
    } catch (error) {
        console.error('Error fetching coupons:', error);
        throw error;
    }
};

// Get coupon by ID
export const getCouponById = async (id) => {
    try {
        const response = await axiosInstance.get(`/coupons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching coupon:', error);
        throw error;
    }
};

// Create new coupon
export const createCoupon = async (couponData) => {
    try {
        const response = await axiosInstance.post('/coupons', couponData);
        return response.data;
    } catch (error) {
        console.error('Error creating coupon:', error);
        throw error;
    }
};

// Update coupon
export const updateCoupon = async (id, couponData) => {
    try {
        const response = await axiosInstance.put(`/coupons/${id}`, couponData);
        return response.data;
    } catch (error) {
        console.error('Error updating coupon:', error);
        throw error;
    }
};

// Delete coupon
export const deleteCoupon = async (id) => {
    try {
        const response = await axiosInstance.delete(`/coupons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting coupon:', error);
        throw error;
    }
};

// Delete multiple coupons
export const deleteCoupons = async (ids) => {
    try {
        const response = await axiosInstance.post('/coupons/bulk-delete', { ids });
        return response.data;
    } catch (error) {
        console.error('Error deleting coupons:', error);
        throw error;
    }
};
