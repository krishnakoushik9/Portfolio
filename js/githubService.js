/**
 * githubService.js
 * Handles data fetching from GitHub API with caching and rate limiting.
 */

const GITHUB_USERNAME = 'krishnakoushik9';
const CACHE_KEY = 'github_cache_data';
const TIMESTAMP_KEY = 'github_cache_timestamp';
const FETCH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours (2 times per day)

export const githubService = {
    async getRepos() {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const lastFetch = localStorage.getItem(TIMESTAMP_KEY);
        const now = Date.now();

        // Check if cache is valid (exists and within 12h window)
        if (cachedData && lastFetch && (now - lastFetch < FETCH_INTERVAL)) {
            console.log('GitHub Sync: Using cached data');
            return JSON.parse(cachedData);
        }

        try {
            console.log('GitHub Sync: Fetching fresh data...');
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            if (!response.ok) {
                if (response.status === 403) console.warn('GitHub Sync: Rate limit hit');
                throw new Error('GitHub API fetch failed');
            }

            const repos = await response.json();
            
            // Filtering Logic: Exclude forks and archived
            const filteredRepos = repos
                .filter(repo => !repo.fork && !repo.archived)
                .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)) // Sort by most recently active
                .slice(0, 5); // Select Top 5

            // Store in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(filteredRepos));
            localStorage.setItem(TIMESTAMP_KEY, now.toString());

            return filteredRepos;
        } catch (error) {
            console.error('GitHub Sync Error:', error);
            return null; // Let UI renderer handle the fallback
        }
    }
};
