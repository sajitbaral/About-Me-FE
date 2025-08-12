const backendUrl = 'https://about-me-be.onrender.com/send-email';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }

            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav .nav-links li a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const initialHash = window.location.hash;
    if (initialHash) {
        const initialActiveLink = document.querySelector(`nav a[href="${initialHash}"]`);
        if (initialActiveLink) {
            initialActiveLink.classList.add('active');
        }
    } else {
        document.querySelector('nav a[href="#home"]').classList.add('active');
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    const contactForm = document.querySelector('.contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            formMessage.textContent = '';
            formMessage.className = '';

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.classList.add('error', 'show');
                return;
            }

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
    }
});