import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    getDashboardData: async () => {
        const response = await api.get('/user/dashboard/data');
        return response.data;
    },

    getHealingContent: async (type) => {
        const response = await api.get(`/user/healing-content?type=${type}`);
        return response.data;
    },

    getTodayCheckIn: async () => {
        const response = await api.get('/user/checkins/today');
        return response.data;
    },

    getMoodHistory: async () => {
        const response = await api.get('/user/analytics/mood-history');
        return response.data;
    },

    getMoodFlow: async (period = 'week') => {
        const response = await api.get(`/user/checkins/flow?period=${period}`);
        return response.data;
    },

    getAnalyticsSummary: async (period = 'week') => {
        const response = await api.get(`/user/analytics/summary?period=${period}`);
        return response.data;
    },

    getTriggerHeatmap: async (period = 'week') => {
        const response = await api.get(`/user/analytics/trigger-heatmap?period=${period}`);
        return response.data;
    },

    getWordCloud: async (period = 'week') => {
        const response = await api.get(`/user/analytics/word-cloud?period=${period}`);
        return response.data;
    }
};

export default userService;
