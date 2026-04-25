// Preloader Captivating Counter Logic
const preloader = document.getElementById('preloader');
const loaderCounter = document.querySelector('.loader-counter');

if (preloader && loaderCounter) {
    let count = 0;
    let isLoaded = false;
    
    // We note when the window finishes loading
    window.addEventListener('load', () => {
        isLoaded = true;
    });

    const finishLoader = () => {
        // Wait a tiny bit at 100% before sliding up
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.remove();
            }, 1200); // Wait for slide up transition to finish
        }, 100);
    };

    const counterInterval = setInterval(() => {
        // Increment count: randomness adds a realistic "loading" feel
        // Make it faster to reduce loading time
        count += Math.floor(Math.random() * 6) + 4;
        
        // If window is loaded, we can jump faster
        if (isLoaded && count < 80) count += 15;

        if (count >= 100) {
            count = 100;
            updateCounterUI(count);
            clearInterval(counterInterval);
            
            if (isLoaded) {
                finishLoader();
            } else {
                window.addEventListener('load', finishLoader);
            }
        } else {
            updateCounterUI(count);
        }
    }, 15);

    function updateCounterUI(val) {
        loaderCounter.textContent = val + '%';
        loaderCounter.setAttribute('data-count', val);
        loaderCounter.style.setProperty('--progress', val + '%');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that need to be animated
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Contact Form Logic (Web3Forms + WhatsApp Integration)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const statusDiv = document.getElementById('form-status');
            
            // Original button text
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            statusDiv.className = 'form-status-message';
            statusDiv.style.display = 'none';

            // Gather data
            const formData = new FormData(contactForm);
            
            // For WhatsApp integration
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');

            try {
                // Send to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();

                if (response.status === 200) {
                    // Success UI
                    submitBtn.textContent = 'Sent Successfully!';
                    statusDiv.textContent = 'Message sent! Redirecting to WhatsApp...';
                    statusDiv.classList.add('success');
                    contactForm.reset();
                    
                    // WhatsApp Redirect
                    // REPLACE THIS NUMBER WITH YOUR ACTUAL WHATSAPP NUMBER (including country code, no + or spaces)
                    // e.g. 2348000000000
                    const whatsappNumber = '2349056937682'; 
                    
                    const waText = `Hello! I just submitted a contact form on your website.%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
                    const waUrl = `https://wa.me/${whatsappNumber}?text=${waText}`;
                    
                    // Small delay to allow user to see success message before redirect
                    setTimeout(() => {
                        window.open(waUrl, '_blank');
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1500);

                } else {
                    // Web3Forms API Error
                    console.log(data);
                    statusDiv.textContent = data.message || 'Something went wrong. Please try again.';
                    statusDiv.classList.add('error');
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                // Network Error
                console.error('Submission Error:', error);
                statusDiv.textContent = 'Network error. Please try again later.';
                statusDiv.classList.add('error');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Blog Entry Wrapping: auto-wrap each blog-btn + blog-content pair into a blog-entry div
    const blogList = document.querySelector('.blog-list');
    if (blogList) {
        const buttons = blogList.querySelectorAll(':scope > .blog-btn');
        buttons.forEach(btn => {
            const content = btn.nextElementSibling;
            if (content && content.classList.contains('blog-content')) {
                const entry = document.createElement('div');
                entry.className = 'blog-entry';
                btn.parentNode.insertBefore(entry, btn);
                entry.appendChild(btn);
                entry.appendChild(content);
            }
        });
    }

    // Blog Expand/Collapse Functionality
    const blogButtons = document.querySelectorAll('.blog-btn');
    blogButtons.forEach(button => {
        button.addEventListener('click', () => {
            const entry = button.closest('.blog-entry');
            const content = entry ? entry.querySelector('.blog-content') : button.nextElementSibling;
            if (content && content.classList.contains('blog-content')) {
                const isHidden = content.classList.contains('hidden');
                
                // Close all other open blogs
                document.querySelectorAll('.blog-content').forEach(c => {
                    if (c !== content) {
                        c.classList.remove('expanded');
                        c.classList.add('hidden');
                    }
                });

                // Toggle current blog
                if (isHidden) {
                    content.classList.remove('hidden');
                    content.classList.add('expanded');
                    setTimeout(() => {
                        button.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else {
                    content.classList.remove('expanded');
                    content.classList.add('hidden');
                }
            }
        });
    });
});

// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const sunSVG = `
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
`;
const moonSVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function setTheme(theme) {
    const profileImages = document.querySelectorAll('.profile-photo-wrap img');
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.innerHTML = moonSVG; // Show moon when in light mode
        profileImages.forEach(img => img.src = 'image/profile pix.webp');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.innerHTML = sunSVG; // Show sun when in dark mode
        profileImages.forEach(img => img.src = 'image/profile pix.png');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme on load
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
}
