 let isScrolling = false;
        let currentZoom = 1;
        const minZoom = 0.5;
        const maxZoom = 3;
        const zoomStep = 0.1;

        // Carousel functionality
        let currentSlide = 0;
        const carousel = document.getElementById('projectsCarousel');
        const cards = document.querySelectorAll('.related-card');
        const totalSlides = cards.length;
        let cardsToShow = getCardsToShow();
        const maxSlide = Math.max(0, totalSlides - cardsToShow);

        function getCardsToShow() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // 1.5rem gap
            const translateX = -(currentSlide * (cardWidth + gap));
            
            carousel.style.transform = `translateX(${translateX}px)`;
            
            // Update active states
            cards.forEach((card, index) => {
                card.classList.remove('active');
                if (index >= currentSlide && index < currentSlide + cardsToShow) {
                    card.classList.add('active');
                }
            });
            
            updateButtons();
            updateIndicators();
        }

        function updateButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            prevBtn.disabled = currentSlide <= 0;
            nextBtn.disabled = currentSlide >= maxSlide;
        }

        function updateIndicators() {
            const indicatorsContainer = document.getElementById('indicators');
            indicatorsContainer.innerHTML = '';
            
            const totalIndicators = maxSlide + 1;
            
            for (let i = 0; i < totalIndicators; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (i === currentSlide) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }

        function nextSlide() {
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateCarousel();
            }
        }

        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }

        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(index, maxSlide));
            updateCarousel();
        }

        // FIXED: Expand/collapse functionality with correct arrow directions
        function toggleExpanded() {
            const content = document.getElementById('expandableContent');
            const button = document.querySelector('.expand-button');
            const arrow = button.querySelector('.arrow');
            const buttonText = button.querySelector('span:first-child'); // Get the first span (text)
            
            content.classList.toggle('expanded');
            button.classList.toggle('expanded');
            
            if (content.classList.contains('expanded')) {
                buttonText.textContent = 'Read less';
                // Don't change arrow text, let CSS rotation handle it
            } else {
                buttonText.textContent = 'Click to find more';
                // Don't change arrow text, let CSS rotation handle it
            }
        }

        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let isDown = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDown = true;
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
        });

        carousel.addEventListener('touchend', (e) => {
            if (!isDown) return;
            isDown = false;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            cardsToShow = getCardsToShow();
            currentSlide = Math.min(currentSlide, Math.max(0, totalSlides - cardsToShow));
            updateCarousel();
        });

        // Mouse scroll functionality
        function scrollToTopMouse() {
            isScrolling = true;
            
            const mouseButton = document.querySelector('.mouse-scroll-button');
            mouseButton.style.transform = 'translateY(-2px) scale(1.02)';
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                isScrolling = false;
                mouseButton.style.transform = '';
            }, 1000);
        }

        // Scroll detection and progress update
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min((scrolled / maxScroll) * 100, 100);
            
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            
            progressFill.style.height = scrollProgress + '%';
            progressText.textContent = Math.round(scrollProgress) + '%';
        });

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Home' && e.ctrlKey) {
                e.preventDefault();
                scrollToTopMouse();
            }
        });

        document.querySelector('.mouse-scroll-button').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTopMouse();
            }
        });

        // Image Modal functions
        function openImageModal() {
            document.getElementById('imageModal').classList.add('active');
            document.querySelector('.mouse-scroll-button').style.display = 'none';
            document.querySelector('.scroll-tag').style.display = 'none';
            resetZoom();
        }

        // Iframe functions
        // function openImageModal() {
        //     const modal = document.getElementById('imageModal');
        //     const iframe = document.getElementById('modalFigma');

        //     // 🔄 Reload Figma prototype from the start
        //     iframe.src = iframe.src;

        //     modal.classList.add('active');
        //     document.querySelector('.mouse-scroll-button').style.display = 'none';
        //     document.querySelector('.scroll-tag').style.display = 'none';

        //     resetZoom(); 
        // }


        function closeImageModal() {
            document.getElementById('imageModal').classList.remove('active');
            document.querySelector('.mouse-scroll-button').style.display = 'block';
            document.querySelector('.scroll-tag').style.display = 'block';
        }

         function zoomIn() {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                applyZoom();
            }
        }

        function zoomOut() {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                applyZoom();
            }
        }

        function resetZoom() {
            currentZoom = 1;
            applyZoom();
        }

        function applyZoom() {
            const modalImage = document.getElementById('modalImage');
            modalImage.style.transformOrigin = 'center center';
            modalImage.style.transform = `scale(${currentZoom})`;
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });

        // Enhanced hover effects for mouse button
        const mouseButton = document.querySelector('.mouse-scroll-button');
        
        mouseButton.addEventListener('mouseenter', () => {
            document.querySelector('.mouse-wheel').style.animationDuration = '1s';
        });
        
        mouseButton.addEventListener('mouseleave', () => {
            document.querySelector('.mouse-wheel').style.animationDuration = '2s';
        });

        // Initialize carousel
        window.addEventListener('load', () => {
            updateCarousel();
            
            // Trigger initial scroll event
            window.dispatchEvent(new Event('scroll'));
        });