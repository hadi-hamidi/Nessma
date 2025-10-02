// GSAP Animation Script for Comfi Landing Page

// Wait for GSAP to be loaded (deferred script)
window.addEventListener('load', () => {
    // Respect prefers-reduced-motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Basic references with null checks
    const heroLeft = document.querySelector('.hero-left');
    const invoiceCard = document.getElementById('invoiceCard');
    const portrait = document.getElementById('portrait');
    const logos = document.querySelectorAll('#logosRow img');
    const optNow = document.getElementById('opt-now');
    const optLater = document.getElementById('opt-later');
    const amountValue = document.getElementById('amountValue');
    const animAmountSpan = document.getElementById('animAmount');

    // Simple utility to format number with comma
    function formatNumber(n) {
        return n.toLocaleString('en-US');
    }

    // If reduced motion, skip fancy animations but keep simple states
    if (!reduce && window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Intro timeline for left column elements
        const tlLeft = gsap.timeline({ 
            defaults: { 
                duration: 0.7, 
                ease: 'cubic-bezier(.2,.9,.2,1)' 
            } 
        });
        tlLeft.from(heroLeft.querySelector('h1'), { y: 10, opacity: 0 });
        tlLeft.from(heroLeft.querySelector('.lead'), { y: 8, opacity: 0 }, "-=0.55");
        tlLeft.from(heroLeft.querySelector('.btn-cta'), { y: 6, opacity: 0 }, "-=0.45");

        // Invoice card slide-in with slight rotation
        gsap.from(invoiceCard, {
            x: 120,
            rotation: 2,
            opacity: 0,
            duration: 0.9,
            ease: 'cubic-bezier(.16,.84,.3,1)',
            delay: 0.15
        });

        // Portrait subtle parallax effect on scroll
        gsap.to(invoiceCard, {
            scrollTrigger: {
                trigger: invoiceCard,
                start: "top center",
                end: "bottom top",
                scrub: 0.6
            },
            y: -20
        });
        
        gsap.to(portrait, {
            scrollTrigger: {
                trigger: portrait,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6
            },
            y: 10
        });

        // Portrait hover scale (only if portrait exists)
        if (portrait) {
            portrait.addEventListener('mouseenter', () => gsap.to(portrait, { scale: 1.02, duration: 0.25 }));
            portrait.addEventListener('mouseleave', () => gsap.to(portrait, { scale: 1, duration: 0.25 }));
        }

        // Logos fade-in staggered when they enter viewport (only if logos exist)
        if (logos.length > 0) {
            gsap.from(logos, {
                y: 12,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#logosRow',
                    start: "top 80%",
                }
            });
        }

        // Micro-interaction: selecting funding type (only if elements exist)
        function animateSelectToExpansion() {
            if (optLater) {
                // outline pulse on selected option
                gsap.fromTo(optLater, 
                    { boxShadow: '0 0 0 rgba(47,138,107,0.0)' }, 
                    {
                        boxShadow: '0 10px 30px rgba(47,138,107,0.12)',
                        duration: 0.6,
                        yoyo: true,
                        repeat: 1,
                        ease: 'sine.inOut'
                    }
                );
            }

            // small pointer animation (simulated by moving card slightly)
            if (invoiceCard) {
                gsap.fromTo(invoiceCard, 
                    { x: 20 }, 
                    { x: 0, duration: 0.6, ease: 'power3.out' }
                );
            }

            // make option visually selected (only if elements exist)
            if (optLater) optLater.classList.add('selected');
            if (optNow) optNow.classList.remove('selected');
        }

        // initial micro-selection state (simulate expansion funding selected already)
        animateSelectToExpansion();

        // radio change listeners (keyboard accessible) - only if elements exist
        if (optNow) {
            optNow.addEventListener('click', () => {
                const radio = optNow.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                optNow.classList.add('selected');
                if (optLater) optLater.classList.remove('selected');
            });
        }
        
        if (optLater) {
            optLater.addEventListener('click', () => {
                const radio = optLater.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                animateSelectToExpansion();
            });
        }

        // Make keyboard 'Enter' or Space trigger click on label (accessibility) - only if elements exist
        [optNow, optLater].filter(Boolean).forEach(label => {
            label.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    label.click();
                }
            });
        });

    } else {
        // Reduced motion fallback: ensure selected state is static (only if element exists)
        if (optLater) optLater.classList.add('selected');
    }

    // IntersectionObserver fallback for logos if ScrollTrigger unavailable
    if (!window.gsap || !window.gsap.ScrollTrigger) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                    e.target.style.opacity = 1;
                    e.target.style.transform = 'translateY(0px)';
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        
        if (logos.length > 0) {
            logos.forEach(img => {
                img.style.opacity = 0;
                img.style.transform = 'translateY(12px)';
                io.observe(img);
            });
        }
    }

    // Smooth scrolling for navigation links (only if elements exist)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    if (navLinks.length > 0) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-navigation button:focus,
        .keyboard-navigation input:focus,
        .keyboard-navigation label:focus {
            outline: 2px solid var(--headline-green) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(focusStyle);

}); // load end