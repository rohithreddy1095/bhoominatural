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
    function lazyLoadIframes() {
        const iframes = document.querySelectorAll('iframe[data-src]');

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

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .stat-item, .video-card, .gallery-item');

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
        .service-card, .stat-item, .video-card, .gallery-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .service-card.animate-in, .stat-item.animate-in, .video-card.animate-in, .gallery-item.animate-in {
            opacity: 1;
            transform: translateY(0);
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

    // Console welcome message
    console.log('%c Bhoomi Natural ', 'background: #4a7c59; color: white; font-size: 20px; padding: 10px;');
    console.log('Cultivating Nature\'s Abundance Through Food Forests');
    console.log('Website: https://bhoominatural.com | YouTube: @bhoominatural');

})();
