export function initCarousel() {
    const track = document.getElementById('track');
    const container = document.querySelector('.carousel-container');
    const dots = document.querySelectorAll('.dot');
    let slides = Array.from(track.children);
    
    if (!track || !container || slides.length === 0) return;

    const originalCount = slides.length;

    // 1. Configuração de Loop Infinito (Clonagem)
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });

    let currentPos = 0;
    let isPaused = false;
    const speed = 0.3;
    let animationId;

    function updateDots() {
        if (!dots.length) return;
        const slideWidth = slides[0].offsetWidth;
        const exactIndex = Math.abs(currentPos) / slideWidth;
        const targetIndex = Math.round(exactIndex) % originalCount;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === targetIndex);
        });
    }

    function animate() {
        if (!isPaused) {
            currentPos -= speed;
            const totalWidth = slides[0].offsetWidth * originalCount;
            if (Math.abs(currentPos) >= totalWidth) {
                currentPos = 0;
            }
            track.style.transform = `translateX(${currentPos}px)`;
            updateDots();
        }
        animationId = requestAnimationFrame(animate);
    }

    // 2. Lógica de Enquadramento (Snap)
    function snapToImage() {
        isPaused = true;
        const slideWidth = slides[0].offsetWidth;
        const exactIndex = Math.abs(currentPos) / slideWidth;
        const targetIndex = Math.round(exactIndex);
        
        currentPos = -(targetIndex * slideWidth);
        track.classList.add('snapping');
        track.style.transform = `translateX(${currentPos}px)`;
        updateDots();
    }

    function resumeAnimation() {
        track.classList.remove('snapping');
        isPaused = false;
    }

    // 3. Controle Manual via Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflitos com o container
            const slideWidth = slides[0].offsetWidth;
            currentPos = -(index * slideWidth);
            track.classList.add('snapping');
            track.style.transform = `translateX(${currentPos}px)`;
            updateDots();
        });
    });

    // Event Listeners
    container.addEventListener('mouseenter', snapToImage);
    container.addEventListener('mouseleave', resumeAnimation);

    // Inicia animação
    animate();

    // 4. Ajuste de Redimensionamento
    window.addEventListener('resize', () => {
        if (!isPaused) {
            currentPos = 0;
        }
    });
}
