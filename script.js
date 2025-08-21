// Marqueur de l'état de chargement
let currentPage = 'accueil';
let isMenuOpen = false; // ✅ on supprime isLoading



// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Simulation du chargement
    setTimeout(() => {
        hideLoadingScreen();
        setupEventListeners();
        setupScrollEffects();
        setupAnimationObserver();
        setupPortfolioFilters();
        setupFormHandler();
        markActiveNavItem();
        triggerHeroAnimation(); // ⚡ Animation hero au chargement
    }, 1500);
}

// Gestion de l'écran de chargement
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
    }, 600);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Navigation desktop
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.target.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Navigation mobile
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.target.getAttribute('data-page');
            navigateTo(page);
            closeMobileMenu();
        });
    });

    // Menu mobile toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Fermeture du menu mobile par clic extérieur
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Gestion du scroll
    window.addEventListener('scroll', handleScroll);
    
    // Redimensionnement de la fenêtre
    window.addEventListener('resize', handleResize);
}

// Navigation entre les pages
// Dans navigateTo(), enlever la vérification isLoading :
function navigateTo(page) {
    if (page === currentPage) return;  // ✅ on ne bloque plus avec isLoading
   


    // Animation de sortie de la page actuelle
    const currentPageEl = document.getElementById(`page-${currentPage}`);
    currentPageEl.style.opacity = '0';
    currentPageEl.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        // Masquer la page actuelle
        currentPageEl.classList.remove('active');
        
        // Afficher la nouvelle page
        const newPageEl = document.getElementById(`page-${page}`);
        newPageEl.classList.add('active');
        
        // Animation d'entrée de la nouvelle page
        setTimeout(() => {
            newPageEl.style.opacity = '1';
            newPageEl.style.transform = 'translateY(0)';
        }, 50);

        // Mettre à jour l'état
        currentPage = page;
        markActiveNavItem();
        updateScrollToTopVisibility();
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Réinitialiser les animations de la page
        resetPageAnimations(page);
    }, 300);
}

// Gestion du menu mobile
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgers = document.querySelectorAll('.hamburger');
    
    if (isMenuOpen) {
        mobileMenu.classList.add('open');
        hamburgers.forEach((hamburger, index) => {
            if (index === 0) hamburger.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) hamburger.style.opacity = '0';
            if (index === 2) hamburger.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        });
    } else {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    isMenuOpen = false;
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgers = document.querySelectorAll('.hamburger');
    
    mobileMenu.classList.remove('open');
    hamburgers.forEach(hamburger => {
        hamburger.style.transform = '';
        hamburger.style.opacity = '1';
    });
}

// Marquer l'élément de navigation actif
function markActiveNavItem() {
    // Desktop navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Effets de scroll
function setupScrollEffects() {
    const navigation = document.getElementById('navigation');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    });

    // ⚠️ Correction : s'assurer qu'au départ la navbar est bien transparente
    if (window.scrollY <= 50) {
        navigation.classList.remove('scrolled');
    }
}

function handleScroll() {
    updateScrollToTopVisibility();
    handleParallaxEffects();
}

function updateScrollToTopVisibility() {
    const scrollToTop = document.getElementById('scroll-to-top');
    if (window.scrollY > 300 && currentPage !== 'accueil') {
        scrollToTop.classList.add('visible');
    } else {
        scrollToTop.classList.remove('visible');
    }
}



function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Observateur d'animations
function setupAnimationObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                // Ajouter des classes d'animation supplémentaires si nécessaire
                if (entry.target.classList.contains('stat-item')) {
                    animateCounters(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer tous les éléments animés
    const animatedElements = document.querySelectorAll(`
        .philosophy-item,
        .portfolio-item,
        .process-step,
        .stat-item,
        .service-card,
        .contact-info-item
    `);
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Animation des compteurs
function animateCounters(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated) return;
    
    const finalNumber = numberElement.textContent.replace(/\D/g, '');
    const suffix = numberElement.textContent.replace(/\d/g, '');
    
    if (finalNumber) {
        numberElement.dataset.animated = 'true';
        animateNumber(numberElement, 0, parseInt(finalNumber), 1500, suffix);
    }
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOutCubic);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Filtres du portfolio
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrer les éléments
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInScale 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Gestion du formulaire de contact
function setupFormHandler() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Animation du bouton
    submitBtn.innerHTML = '<span>⏳</span> Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation d'envoi
    setTimeout(() => {
        submitBtn.innerHTML = '<span>✅</span> Message envoyé !';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 2000);
    }, 2000);
}

// Réinitialisation des animations de page
function resetPageAnimations(page) {
    const pageElement = document.getElementById(`page-${page}`);
    const animatedElements = pageElement.querySelectorAll(`
        .philosophy-item,
        .portfolio-item,
        .process-step,
        .stat-item,
        .service-card
    `);
    
    animatedElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Force reflow
        el.style.animation = '';
    });
}

// Gestion du redimensionnement
function handleResize() {
    // Fermer le menu mobile sur desktop
    if (window.innerWidth >= 768 && isMenuOpen) {
        closeMobileMenu();
    }
}

// Utilitaires
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimisation des événements de scroll
const optimizedScroll = debounce(handleScroll, 10);
window.addEventListener('scroll', optimizedScroll);

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Réactiver les animations si nécessaire
        resetPageAnimations(currentPage);
    }
});

// Préchargement des images importantes
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1707507758211-f6ca8e96e563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZWxlZ2FudCUyMGZsb3dlciUyMGFycmFuZ2VtZW50JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc1NTc4MzgwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1630638915293-4cb45bb06c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yaXN0JTIwd29ya3Nob3AlMjBzdHVkaW8lMjBiZWhpbmQlMjBzY2VuZXN8ZW58MXx8fHwxNzU1NzgzOTA2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Lancer le préchargement après l'initialisation
setTimeout(preloadImages, 2000);

// Gestion des touches clavier
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Escape':
            if (isMenuOpen) {
                closeMobileMenu();
            }
            break;
        case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) {
                navigateToPrevPage();
            }
            break;
        case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) {
                navigateToNextPage();
            }
            break;
    }
});

// Navigation par clavier
function navigateToPrevPage() {
    const pages = ['accueil', 'portfolio', 'atelier', 'services', 'contact'];
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
        navigateTo(pages[currentIndex - 1]);
    }
}

function navigateToNextPage() {
    const pages = ['accueil', 'portfolio', 'atelier', 'services', 'contact'];
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
        navigateTo(pages[currentIndex + 1]);
    }
}

// Gestion des erreurs d'images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.opacity = '0.5';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Performance et debugging
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('app-init-start');
    
    window.addEventListener('load', () => {
        performance.mark('app-init-end');
        performance.measure('app-init', 'app-init-start', 'app-init-end');
    });
}

// ⚡ Animation Hero au chargement
function triggerHeroAnimation() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('hero-animate');
    }
}


// Active la navigation pour tous les boutons qui ont data-page
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const page = btn.dataset.page;
    if (page) {
      navigateTo(page);
    }
  });
});
