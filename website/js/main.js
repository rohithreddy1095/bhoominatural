/**
 * Bhoomi Natural - Main JavaScript
 * Handles navigation, smooth scrolling, and interactive elements
 */

(function() {
    'use strict';

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
        });

        // Close menu when clicking a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

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
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlight on scroll
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

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
                'Hello! I am ' + name + '.\n\n' +
                'Email: ' + email + '\n' +
                (phone ? 'Phone: ' + phone + '\n\n' : '\n') +
                'Message: ' + message
            );

            // Open WhatsApp with pre-filled message
            const whatsappUrl = 'https://wa.me/917500312013?text=' + whatsappMessage;
            window.open(whatsappUrl, '_blank');

            // Show success message
            alert('Redirecting to WhatsApp to send your message. Thank you for contacting Bhoomi Natural!');

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
            console.log('Starting project data load...');
            
            // Simple fetch, exactly matching the working logic from root index.html
            // expecting /website/refs/youtube/analysis/locations.json to exist
            const response = await fetch('./refs/youtube/analysis/locations.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            locationsData = await response.json();
            console.log('Project data loaded:', Object.keys(locationsData));
            
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
            const safeId = loc.replace(/\s+/g, '-');
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
        }, 200);
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

    // Add animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .stat-item, .video-card, .gallery-item, .product-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .service-card.animate-in, .stat-item.animate-in, .video-card.animate-in, .gallery-item.animate-in, .product-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .product-card.hidden {
            display: none;
        }
        .navbar.scrolled {
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        .nav-menu a.active {
            color: #4a7c59;
        }
        .nav-menu a.active::after {
            width: 100%;
        }
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);

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
                });
                this.classList.add('active');

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
