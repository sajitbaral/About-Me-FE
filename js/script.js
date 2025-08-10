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

    // Dummy Form Submission for Contact Section
    //const contactForm = document.querySelector('.contact-form');
    //contactForm.addEventListener('submit', function(e) {
    //   e.preventDefault(); // Prevent actual form submission to a server
    //   alert('Thank you for your message! I will get back to you soon. (This is a dummy submission for demonstration purposes.)');
    //   contactForm.reset(); // Clear the form fields
   // });
});