/**
 * Bhoomi Natural - Main JavaScript
 * Handles navigation, smooth scrolling, and interactive elements
 */

(function() {
    'use strict';

    // Constants
    var NAVBAR_SCROLL_THRESHOLD = 50;
    var SCROLL_OFFSET = 100;
    var WHATSAPP_NUMBER = '917500312013';
    var FADE_TIMEOUT_MS = 300;

    // Utilities
    function throttle(fn, wait) {
        var last = 0;
        return function() {
            var now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, arguments);
            }
        };
    }

    function showToast(message, type) {
        var toast = document.createElement('div');
        toast.className = 'toast ' + (type || 'success');
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);
        // Trigger reflow then show
        toast.offsetHeight;
        toast.classList.add('visible');
        setTimeout(function() {
            toast.classList.remove('visible');
            setTimeout(function() { toast.remove(); }, FADE_TIMEOUT_MS);
        }, 4000);
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile Navigation Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            var expanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', String(expanded));
        });

        // Close menu when clicking a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > NAVBAR_SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Active navigation highlight on scroll
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + navbar.offsetHeight + SCROLL_OFFSET;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    });
                    navLink.classList.add('active');
                    navLink.setAttribute('aria-current', 'true');
                }
            }
        });
    }

    // Throttled combined scroll handler
    window.addEventListener('scroll', throttle(function() {
        handleNavbarScroll();
        highlightNavOnScroll();
    }, 100));

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Create WhatsApp message
            const whatsappMessage = encodeURIComponent(
                `Hello! I am ${name}.\n\nEmail: ${email}\n${phone ? 'Phone: ' + phone + '\n\n' : '\n'}Message: ${message}`
            );

            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            showToast('Redirecting to WhatsApp. Thank you for contacting Bhoomi Natural!', 'success');

            // Reset form
            contactForm.reset();
        });
    }

    // Lazy loading for iframes (YouTube videos)
    function lazyLoadIframes(scope = document) {
        const iframes = scope.querySelectorAll('iframe[data-src]');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    observer.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '100px'
        });

        iframes.forEach(function(iframe) {
            observer.observe(iframe);
        });
    }

    // Initialize lazy loading
    lazyLoadIframes();

    // ========================================
    // Project Loading Logic
    // ========================================
    let locationsData = {};
    const projectsSection = document.getElementById('projects');

    async function loadProjectData() {
        if (!projectsSection) return;

        try {
            // Simple fetch, exactly matching the working logic from root index.html
            // expecting /website/refs/youtube/analysis/locations.json to exist
            const response = await fetch('./refs/youtube/analysis/locations.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            locationsData = await response.json();
            renderProjectTabs();
        } catch (error) {
            console.error('Error loading projects:', error);
            const container = document.getElementById('location-tabs');
            if (container) {
                container.innerHTML = `
                    <div style="color: #dc2626; padding: 1rem; text-align: center; width: 100%;">
                        <p>Unable to load projects (${error.message}).</p>
                        <p style="font-size: 0.8em; margin-top: 0.5rem;">Please check console for details.</p>
                    </div>
                `;
            }
        }
    }

    function renderProjectTabs() {
        const container = document.getElementById('location-tabs');
        if (!container) return;

        const locations = Object.keys(locationsData);
        
        container.innerHTML = locations.map((loc, index) => {
            // Create a safe ID for the tab
            const safeId = loc.replace(/[^a-zA-Z0-9]+/g, '-');
            const isActive = index === 0 ? 'active' : '';
            return `<button class="tab-btn ${isActive}" data-location="${loc}">${loc}</button>`;
        }).join('');

        // Add click listeners
        const tabs = container.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Deactivate all
                tabs.forEach(t => t.classList.remove('active'));
                // Activate clicked
                this.classList.add('active');
                // Render content
                renderProjectContent(this.dataset.location);
            });
        });

        // Render initial content
        if (locations.length > 0) {
            renderProjectContent(locations[0]);
        }
    }

    function renderProjectContent(locationKey) {
        const contentContainer = document.getElementById('location-content');
        if (!contentContainer) return;

        const data = locationsData[locationKey];
        
        // Fade out
        contentContainer.classList.remove('loaded');

            // Short timeout for fade effect
        setTimeout(() => {
            contentContainer.innerHTML = `
                <div class="project-grid">
                    <!-- Sidebar Info -->
                    <div class="project-info">
                        <h3>${locationKey}</h3>
                        <p class="project-summary">${data.project_summary || 'No summary available.'}</p>
                        
                        <div class="tag-group">
                            <h4>Key Techniques</h4>
                            <div class="tags">
                                ${(data.key_techniques || []).map(tech => 
                                    `<span class="tag tech">${tech}</span>`
                                ).join('') || '<span class="tag">Not specified</span>'}
                            </div>
                        </div>
                        
                        <div class="tag-group">
                            <h4>Key Crops</h4>
                            <div class="tags">
                                ${(data.key_crops || []).map(crop => 
                                    `<span class="tag crop">${crop}</span>`
                                ).join('') || '<span class="tag">Not specified</span>'}
                            </div>
                        </div>

                        <div class="project-stat">
                            <span>Total Videos</span>
                            <span class="stat-value">${data.video_count}</span>
                        </div>
                    </div>

                    <!-- Video Grid -->
                    <div class="project-videos">
                        <h4>Project Videos</h4>
                        <div class="video-list">
                            ${(data.videos || []).map(video => `
                                <div class="project-video-item">
                                    <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="project-video-thumb">
                                        <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" loading="lazy">
                                        <div class="play-overlay">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    </a>
                                    <div class="project-video-info">
                                        <span class="project-video-category">${video.category || 'General'}</span>
                                        <h5 class="project-video-title">
                                            <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">${video.title}</a>
                                        </h5>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Fade in
            contentContainer.classList.add('loaded');
            
            // Re-initialize icons for new content
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, FADE_TIMEOUT_MS);
    }

    // Trigger load when DOM is ready
    loadProjectData();


    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .stat-item, .video-card, .gallery-item, .product-card');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // Initialize animations
    animateOnScroll();

    // ========================================
    // Products Tab Filtering
    // ========================================
    const productTabs = document.querySelectorAll('.products-tabs .tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (productTabs.length > 0 && productCards.length > 0) {
        productTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Update active tab
                productTabs.forEach(function(t) {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Filter products
                const category = this.dataset.category;

                productCards.forEach(function(card) {
                    const cardCategory = card.dataset.category;
                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        // Show all products initially (fruits are shown by default)
        // First tab (Fruits) is already active, filter to fruits
        productCards.forEach(function(card) {
            const cardCategory = card.dataset.category;
            if (cardCategory !== 'fruits') {
                card.classList.add('hidden');
            }
        });
    }

    // Console welcome message
    console.log('%c Bhoomi Natural ', 'background: #4a7c59; color: white; font-size: 20px; padding: 10px;');
    console.log('Cultivating Nature\'s Abundance Through Food Forests');
    console.log('Website: https://bhoominatural.com | YouTube: @bhoominatural');

})();
