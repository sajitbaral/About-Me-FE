document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation Links
    // Leverages CSS `scroll-behavior: smooth` for native performance.
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // `scrollIntoView` respects `scroll-behavior: smooth` in CSS
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Optional: Update URL hash without causing an instant jump
                // This maintains the URL for sharing/bookmarking
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }

            // Update active class in navigation for visual feedback
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Intersection Observer for Active Navigation Links on Scroll
    // This makes the navigation link highlight automatically as you scroll through sections.
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav .nav-links li a');

    // Options for the Intersection Observer.
    // A threshold of 0.5 means the callback will fire when 50% of the section is visible.
    const observerOptions = {
        root: null, // The viewport is the root
        rootMargin: '0px',
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all navigation links first
                navLinks.forEach(link => link.classList.remove('active'));

                // Add 'active' class to the link corresponding to the currently intersecting section
                const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Set initial active link on page load if a hash is present in the URL
    const initialHash = window.location.hash;
    if (initialHash) {
        const initialActiveLink = document.querySelector(`nav a[href="${initialHash}"]`);
        if (initialActiveLink) {
            initialActiveLink.classList.add('active');
        }
    } else {
        // If no hash, default to making the Home link active
        document.querySelector('nav a[href="#home"]').classList.add('active');
    }

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to apply or remove the 'dark-mode' class and update the toggle icon
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
        }
        localStorage.setItem('theme', theme); // Store user's preference
    };

    // Check for user's preferred theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no saved theme, check system-level dark mode preference
        setTheme('dark');
    } else {
        // Default to light theme
        setTheme('light');
    }

    // Add event listener to the dark mode toggle button
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setTheme('light'); // Switch to light mode
        } else {
            setTheme('dark'); // Switch to dark mode
        }
    });

    // --- START OF LIVE CONTACT FORM SUBMISSION CODE ---
    const contactForm = document.querySelector('.contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message'); // This ID is in your HTML

    // !!! IMPORTANT: THIS IS THE BACKEND URL FOR LOCAL TESTING !!!
    // When deployed, you MUST change this to your Render backend URL.
    const backendUrl = 'https://about-me-be.onrender.com';

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Clear previous messages and hide
        formMessage.textContent = '';
        formMessage.className = ''; // Remove all classes

        // Frontend Validation: Check for empty fields
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.classList.add('error', 'show');
            return;
        }

        // Show loading state on button
        submitButton.textContent = 'Sending...';
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                formMessage.textContent = data.message;
                formMessage.classList.add('success', 'show');
                contactForm.reset();
            } else {
                formMessage.textContent = data.message || 'An unexpected error occurred.';
                formMessage.classList.add('error', 'show');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            formMessage.textContent = 'Network error. Please try again.';
            formMessage.classList.add('error', 'show');
        } finally {
            // Reset button state
            submitButton.textContent = 'Send Message';
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            setTimeout(() => {
                formMessage.classList.remove('show');
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }, 500);
            }, 5000);
        }
    });
    // --- END OF LIVE CONTACT FORM SUBMISSION CODE ---

});