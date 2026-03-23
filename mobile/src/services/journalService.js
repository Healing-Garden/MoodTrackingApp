import api from './api';

export const journalService = {
    getAll: async () => {
        try {
            console.log("journalService: Fetching all entries");
            const response = await api.get('/journals');
            console.log("journalService: Fetch all success", response.data?.length, "entries");
            return response.data;
        } catch (error) {
            console.error("journalService: Fetch all failed", error.response?.data || error.message);
            throw error;
        }
    },

    getDeleted: async () => {
        try {
            console.log("journalService: Fetching deleted entries");
            const response = await api.get('/journals/deleted');
            console.log("journalService: Fetch deleted success", response.data?.length, "entries");
            return response.data;
        } catch (error) {
            console.error("journalService: Fetch deleted failed", error.response?.data || error.message);
            throw error;
        }
    },

    create: async (data) => {
        try {
            console.log("journalService: Creating entry", data.title);
            const response = await api.post('/journals', data);
            console.log("journalService: Create success", response.data?._id);
            return response.data;
        } catch (error) {
            console.error("journalService: Create failed", error.response?.data || error.message);
            throw error;
        }
    },

    update: async (id, data) => {
        const response = await api.put(`/journals/${id}`, data);
        return response.data;
    },

    softDelete: async (id) => {
        const response = await api.delete(`/journals/${id}`);
        return response.data;
    },

    restore: async (id) => {
        const response = await api.patch(`/journals/${id}/restore`);
        return response.data;
    },

    permanentDelete: async (id) => {
        const response = await api.delete(`/journals/${id}/permanent`);
        return response.data;
    },

    search: async (query) => {
        const response = await api.get(`/journals/search?q=${query}`);
        return response.data;
    }
};

export default journalService;
