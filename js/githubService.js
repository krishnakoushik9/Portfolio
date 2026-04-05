/**
 * githubService.js
 * Handles data fetching from GitHub API with GraphQL (pinned) and REST (starred).
 */

const GITHUB_USERNAME = 'krishnakoushik9';
const CACHE_KEY = 'github_cache_data';
const TIMESTAMP_KEY = 'github_cache_timestamp';
const FETCH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours (2 times per day)

// PLACEHOLDER: Replace with actual token or use process.env if build system exists
// Note: Client-side tokens are public. Use a token with minimal (public_repo) scope.
const GITHUB_TOKEN = ''; 

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
            console.log('GitHub Sync: Syncing fresh data...');
            
            // Step 1: Fetch Pinned Repos via GraphQL
            const pinnedRepos = await this.fetchPinnedRepos();
            
            // Step 2: Fetch All Repos via REST
            const starredRepos = await this.fetchStarredRepos();
            
            // Step 3: Merge and Deduplicate (Limit to 5)
            const finalRepos = this.mergeRepos(pinnedRepos, starredRepos);

            if (finalRepos.length === 0) {
                throw new Error('No repos found');
            }

            // Store in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(finalRepos));
            localStorage.setItem(TIMESTAMP_KEY, now.toString());

            return finalRepos;
        } catch (error) {
            console.error('GitHub Sync Error:', error);
            return null; // Fallback to cached or static
        }
    },

    async fetchPinnedRepos() {
        if (!GITHUB_TOKEN) return [];

        const query = `
            query {
                user(login: "${GITHUB_USERNAME}") {
                    pinnedItems(first: 6, types: REPOSITORY) {
                        nodes {
                            ... on Repository {
                                name
                                description
                                url
                                stargazerCount
                                updatedAt
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GITHUB_TOKEN}`
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) throw new Error('GraphQL Pinned failed');

            const result = await response.json();
            return result.data.user.pinnedItems.nodes.map(repo => ({
                name: repo.name,
                description: repo.description,
                html_url: repo.url,
                stargazers_count: repo.stargazerCount,
                pushed_at: repo.updatedAt // Mapping for UI consistency
            }));
        } catch (err) {
            console.warn('GitHub Sync: Pinned fetch failed, falling back to starred.');
            return [];
        }
    },

    async fetchStarredRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            if (!response.ok) throw new Error('REST Stars failed');

            const repos = await response.json();
            
            // Filter out forks and archived
            return repos
                .filter(repo => !repo.fork && !repo.archived)
                .sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by most starred
        } catch (err) {
            console.warn('GitHub Sync: Starred fetch failed.');
            return [];
        }
    },

    mergeRepos(pinned, starred) {
        const merged = [...pinned];
        const names = new Set(pinned.map(r => r.name.toLowerCase()));

        for (const repo of starred) {
            if (merged.length >= 5) break;
            if (!names.has(repo.name.toLowerCase())) {
                merged.push(repo);
                names.add(repo.name.toLowerCase());
            }
        }

        return merged.slice(0, 5);
    }
};
