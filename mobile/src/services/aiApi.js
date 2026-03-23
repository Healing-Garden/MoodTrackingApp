import api from './api';

export const aiApi = {
    // Get prompting questions
    getQuestions: (userId, recentMood = null, count = 3, language = 'en') => {
        return api.post(
            '/ai/questions/suggest',
            {
                userId,
                recentMood,
                count,
                language,
            },
            { timeout: 30000 }
        );
    },

    // Generate daily summary
    getDailySummary: (userId, date = null, force = false) => {
        return api.post('/ai/summary/daily', { userId, date, forceRegenerate: force }, { timeout: 30000 });
    },

    // Semantic search
    semanticSearch: (userId, query, limit = 10) => {
        return api.post('/ai/search/semantic', { userId, query, limit }, { timeout: 30000 });
    },

    // Analyze emotional trends
    analyzeTrends: (userId, days = 30) => {
        return api.post('/ai/trends/analyze', { userId, days }, { timeout: 65000 });
    },

    // Suggest practical actions
    suggestActions: (userId, currentMood = null, count = 3, excludeIds = []) => {
        return api.post('/ai/actions/suggest', { userId, currentMood, count, excludeIds }, { timeout: 30000 });
    },

    logActionCompletion: (
        userId,
        actionId,
        durationSeconds,
        moodAtTime,
        source = 'suggestion',
        postMoodScore
    ) => {
        return api.post('/ai/actions/log-completion', {
            userId,
            actionId,
            durationSeconds,
            moodAtTime,
            source,
            postMoodScore,
        });
    },

    logSkip: (userId, mood = null, shownActions = [], reason) => {
        return api.post('/ai/actions/skip', { userId, mood, shownActions, reason });
    },

    checkActionEligibility: (userId) => {
        return api.post('/ai/actions/eligibility', { userId });
    },

    // Analyze sentiment
    analyzeSentiment: (text) => {
        return api.post('/ai/sentiment/analyze', { text }, { timeout: 30000 });
    },

    // Health check
    getHealth: () => {
        return api.get('/ai/health');
    },
};
