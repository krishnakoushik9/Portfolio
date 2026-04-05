/**
 * githubModal.js
 * Handles the contribution graph modal logic.
 */

export const githubModal = {
    init() {
        const modalId = 'contribution-modal';
        const triggerId = 'view-contributions-btn';
        
        // Modal HTML creation if it doesn't exist
        if (!document.getElementById(modalId)) {
            const modalHTML = `
                <div id="${modalId}" style="position: fixed; inset: 0; background: rgba(9, 9, 11, 0.9); backdrop-filter: blur(10px); z-index: 20000; display: none; align-items: center; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s ease;">
                    <div id="${modalId}-content" class="card-brutalist" style="max-width: 900px; width: 100%; background: var(--bg-paper); transform: scale(0.9); transition: transform 0.3s ease;">
                        <button id="${modalId}-close" class="btn-brutalist" style="position: absolute; top: -1rem; right: -1rem; background: var(--ink); color: var(--white); padding: 0.5rem 1rem;">CLOSE [ESC]</button>
                        <h2 style="font-size: 3rem; margin-bottom: 2rem;">GH_CONTRIBUTIONS</h2>
                        <div style="background: white; padding: 1rem; border: 2px solid var(--ink); overflow-x: auto;">
                            <img src="https://ghchart.rshah.org/krishnakoushik9" alt="GitHub Contribution Graph" style="width: 100%; min-width: 700px; display: block;">
                        </div>
                        <p class="font-mono" style="margin-top: 1rem; font-size: 0.75rem; opacity: 0.7;">* GRAPH SHOWS ACTIVITY LOG OVER THE LAST 365 DAYS.</p>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = document.getElementById(modalId);
        const content = document.getElementById(`${modalId}-content`);
        const closeBtn = document.getElementById(`${modalId}-close`);
        const trigger = document.getElementById(triggerId);

        const openModal = () => {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 10);
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            document.body.style.overflow = 'auto';
        };

        if (trigger) trigger.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // ESC key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
        });
    }
};
