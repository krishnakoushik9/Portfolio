/**
 * githubMain.js
 * Main entry point for the GitHub Dynamic Sync system.
 */

import { githubService } from './githubService.js';
import { uiRenderer } from './uiRenderer.js';
import { githubModal } from './githubModal.js';

async function initGitHubSync() {
    // Initial Modal setup
    githubModal.init();

    // Disabled dynamic API rendering to allow hardcoded GitLab & GitHub portfolio cards
    /*
    try {
        const repos = await githubService.getRepos();
        if (repos) {
            uiRenderer.renderProjects(repos);
        }
    } catch (err) {
        console.error('Main Sync Exception:', err);
    }
    */
}

// Lazy load after Hero render / DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubSync);
} else {
    initGitHubSync();
}
