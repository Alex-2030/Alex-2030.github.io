document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navButtons = document.querySelectorAll('.nav-btn');
    const backButtons = document.querySelectorAll('.back-btn');

    // 1. STAR GENERATOR
    function generateStarShadows(count) {
        let shadow = '';
        for(let i = 0; i < count; i++) {
            shadow += `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF, `;
        }
        return shadow.slice(0, -2);
    }
    
    const starLayer1 = document.querySelector('.stars');
    const starLayer2 = document.querySelector('.stars2');
    
    if(starLayer1) starLayer1.style.boxShadow = generateStarShadows(700);
    if(starLayer2) starLayer2.style.boxShadow = generateStarShadows(200);


    // 2. WARP TRANSITION LOGIC
    function performTransition(targetViewId) {
        const currentView = document.querySelector('.active-view');
        const nextView = document.getElementById(targetViewId);

        if(!currentView || !nextView || currentView === nextView) return;

        // A. Engage Warp Speed
        body.classList.add('warp-speed');

        // B. Fade out current view (fly away)
        currentView.classList.remove('active-view');

        // C. Wait 800ms for the current view to zoom away (Matches CSS transition time)
        setTimeout(() => {
            // D. Bring in new view
            nextView.classList.add('active-view');
            
            // E. Disengage warp speed
            setTimeout(() => {
                 body.classList.remove('warp-speed');
            }, 500); 

        }, 800); 
    }

    // 3. EVENT LISTENERS
    
    // Bridge Buttons (Navigate to content)
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            performTransition(targetId);
        });
    });

    // Back Buttons (Return to bridge)
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
           performTransition('main-nav');
        });
    });
});