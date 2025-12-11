document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navButtons = document.querySelectorAll('.nav-btn');
    const backButtons = document.querySelectorAll('.back-btn');

    // --- STAR GENERATOR ---
    function generateStarShadows(count) {
        let shadow = '';
        for(let i = 0; i < count; i++) {
            shadow += `${Math.random() * 200}vw ${Math.random() * 200}vh #FFF, `;
        }
        return shadow.slice(0, -2);
    }
    
    const starLayer1 = document.querySelector('.stars');
    const starLayer2 = document.querySelector('.stars2');
    
    // Check if elements exist before attempting to apply shadows
    if(starLayer1) starLayer1.style.boxShadow = generateStarShadows(700);
    if(starLayer2) starLayer2.style.boxShadow = generateStarShadows(200);


    // --- WARP TRANSITION LOGIC ---
    function performTransition(targetViewId) {
        const currentView = document.querySelector('.active-view');
        const nextView = document.getElementById(targetViewId);

        if(!currentView || !nextView || currentView === nextView) return;

        // Engage Warp Speed
        body.classList.add('warp-speed');

        // Fade out current view 
        currentView.classList.remove('active-view');

        currentView.addEventListener('transitionend', function handler() {
            currentView.removeEventListener('transitionend', handler);

            // Bring in the new view
            nextView.classList.add('active-view');

            setTimeout(() => {
                body.classList.remove('warp-speed');
            }, 700); 

        }, { once: true });
    }

    // --- EVENT LISTENERS ---
    
    // Bridge Buttons
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            performTransition(targetId);
        });
    });

    // Back Buttons
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
           performTransition('main-nav');
        });
    });
});