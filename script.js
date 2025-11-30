document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 100;

    // --- Navbar Scroll Logic ---
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- Smooth Scrolling Logic ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default behavior if the link is NOT the Book Now button (which needs to open the modal)
            if (!this.classList.contains('btn-book-now')) {
                 e.preventDefault();
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#home' || !targetId) {
                 // Scroll to top if 'Home' is clicked
                 window.scrollTo({ top: 0, behavior: 'smooth' });
                 return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;

                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight - 20, // -20 for extra padding
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 🔑 Booking Modal Logic (NEW) ---

    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const bookNowBtns = document.querySelectorAll('.btn-book-now');
    const closeBtns = document.querySelectorAll('.close-btn');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const bookingPageUrl = 'booking.html'; 
    
    // 1. Function to open the first modal (Login) when 'Book Now' is clicked
    bookNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    });

    // 2. Close modals using the 'x' button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // 3. Close modals when clicking outside the box
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // 4. Switch from Login to Register
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    // 5. Switch from Register to Login
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    // --- 🎯 Simulation of Login and Redirect to Booking Page ---
    
    // Login Submission Handler (Simulated Success)
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate checking credentials and redirecting
        alert('Login successful! Redirecting to booking page...');
        window.location.href = bookingPageUrl;
    });

    // Register Submission Handler (Simulated Success)
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate registration and redirecting
        alert('Registration successful! Redirecting to booking page...');
        window.location.href = bookingPageUrl;
    });
});