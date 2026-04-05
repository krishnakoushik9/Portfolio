/**
 * uiRenderer.js
 * Handles DOM manipulation and project card rendering.
 */

const FALLBACK_PROJECTS = [
    { name: "AYUR-VERSE", description: "Immersive 3D exploration of sacred trees combining ancient knowledge with modern tech.", html_url: "https://github.com/krishnakoushik9/AyurVerse", stargazers_count: 5, pushed_at: "2024-11-20T12:00:00Z", language: "JavaScript" },
    { name: "EMO-CARE", description: "Real-time emotion and voice response system using facial recognition.", html_url: "https://github.com/krishnakoushik9/EMO-CARE-KAVVY", stargazers_count: 3, pushed_at: "2024-11-15T12:00:00Z", language: "Python" },
    { name: "E-SUMMIT", description: "Modern landing page with Three.js animations and event scheduling.", html_url: "https://github.com/krishnakoushik9/E-SUMMIT", stargazers_count: 2, pushed_at: "2025-01-10T12:00:00Z", language: "JavaScript" },
    { name: "ASHBORN-RAG", description: "24/7 document-based RAG AI bot designed for local execution.", html_url: "https://github.com/krishnakoushik9/HackIndia-Spark-4-2025-ASHBORN-SRCS", stargazers_count: 4, pushed_at: "2025-02-15T12:00:00Z", language: "Python" },
    { name: "LEGION-SURF", description: "Full-stack AI chatbot for discovering and planning local events.", html_url: "https://github.com/krishnakoushik9/legion-surf-mate/tree/main/eventmate", stargazers_count: 2, pushed_at: "2024-12-05T12:00:00Z", language: "TypeScript" }
];

export const uiRenderer = {
    renderProjects(repos) {
        const container = document.getElementById('github-projects-container');
        if (!container) return;

        // Use repositories if provided, otherwise use fallback data
        const data = (repos && repos.length > 0) ? repos : FALLBACK_PROJECTS;
        
        container.innerHTML = ''; // Clear container

        data.forEach((repo, index) => {
            const isMain = index < 2; // Make first two cards larger span 6
            const isMostActive = index === 0; // Highlight the very first (most recently pushed)

            const lastUpdated = new Date(repo.pushed_at).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            const card = document.createElement('div');
            card.style.gridColumn = isMain ? 'span 6' : 'span 4';
            if (window.innerWidth <= 1024) card.style.gridColumn = 'span 12';

            card.innerHTML = `
                <div class="card-brutalist" style="height: 100%; display: flex; flex-direction: column; background: ${isMostActive ? 'var(--volt)' : 'var(--white)'}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <h3 style="font-size: ${isMain ? '3rem' : '2rem'}; word-break: break-all;">${repo.name.toUpperCase()}</h3>
                        <div style="background: var(--ink); color: var(--white); padding: 0.25rem 0.5rem; font-family: var(--font-mono); font-size: 0.75rem;">
                            ★ ${repo.stargazers_count}
                        </div>
                    </div>
                    <p style="margin-bottom: 2rem; flex-grow: 1;">${repo.description || 'No description provided.'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <a href="${repo.html_url}" target="_blank" class="btn-brutalist" style="padding: 0.5rem 1rem;">PULL_REQUEST</a>
                        <span class="font-mono" style="font-size: 0.7rem; opacity: 0.7;">UPDT: ${lastUpdated}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
};
