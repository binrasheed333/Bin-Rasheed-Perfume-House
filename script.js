// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks) {
        navLinks.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Navbar background on scroll with animation
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(212, 175, 55, 0.2)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(212, 175, 55, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add hover effect to logo
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.product-card, .location-card, .value-card, .order-card, .package-card').forEach(card => {
    observer.observe(card);
});

// Custom Cursor & Preloader
const preloader = document.querySelector('.preloader');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('load', () => {
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Remove from DOM after fade out to save resources
            setTimeout(() => preloader.style.display = 'none', 800);
        }, 1200); // 1.2s delay for visual effect
    }
});

if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    // Only enable custom cursor on non-touch devices
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const setupInteractiveHover = () => {
        const clickables = document.querySelectorAll('a, button, input, textarea, .product-card, .package-card, .location-card, .value-card');
        clickables.forEach(link => {
            // Check if listener is already added to prevent duplicates on dynamic elements
            if (!link.dataset.hasCursorListener) {
                link.dataset.hasCursorListener = 'true';
                link.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });
                link.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
            }
        });
    }

    // Initial setup
    document.addEventListener('DOMContentLoaded', setupInteractiveHover);
    // Run again slightly later in case 3D libraries render inside cards
    setTimeout(setupInteractiveHover, 1000);
} else if (cursorDot && cursorOutline) {
    // Hide them completely on touch devices
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
}


// --- 3D Web Enhancements ---
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

async function init3DEnhancements() {
    try {
        // 1. Vanilla Tilt for Cards
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js');

        const cards = document.querySelectorAll('.product-card, .package-card, .location-card, .order-card, .value-card');
        if (cards.length > 0 && window.VanillaTilt) {
            VanillaTilt.init(cards, {
                max: 12,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                scale: 1.05
            });

            // Ensure glare layer doesn't block clicks
            cards.forEach(card => {
                const glare = card.querySelector('.js-tilt-glare-inner');
                if (glare) glare.style.pointerEvents = 'none';
                const glareParent = card.querySelector('.js-tilt-glare');
                if (glareParent) glareParent.style.pointerEvents = 'none';
            });

            // Add 3D depth to card inner elements
            cards.forEach(card => {
                card.style.transformStyle = 'preserve-3d';
                const innerElements = card.querySelectorAll('h3, p, .price, .btn, .product-image, .order-image, .location-image, ul, .package-badge, .discount-price, .add-to-cart, .package-btn');
                innerElements.forEach(el => {
                    el.style.transform = 'translateZ(60px)'; // Increased depth
                    el.style.transition = 'transform 0.3s ease-out';
                    if (el.classList.contains('add-to-cart') || el.classList.contains('package-btn')) {
                        el.style.position = 'relative';
                        el.style.zIndex = '100';
                    }
                });
            });
        }

        // 2. Vanta FOG for Hero Section
        const hero = document.querySelector('.hero') || document.querySelector('.page-header');
        if (hero) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
            await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js');

            if (window.VANTA && window.VANTA.FOG) {
                hero.style.position = 'relative';
                // Remove exact background color so canvas shows behind content
                hero.style.backgroundColor = 'transparent';

                VANTA.FOG({
                    el: hero,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0xd4af37, // Gold
                    midtoneColor: 0x8a6d2b,
                    lowlightColor: 0x1a1a1a,
                    baseColor: 0x0a0a0a,
                    blurFactor: 0.60,
                    speed: 1.50,
                    zoom: 1.20
                });

                const contentContainers = hero.querySelectorAll('.hero-content, .container');
                contentContainers.forEach(container => {
                    container.style.position = 'relative';
                    container.style.zIndex = '10';
                    container.style.pointerEvents = 'none'; // let clicks pass through
                });

                const clickables = hero.querySelectorAll('a, button');
                clickables.forEach(c => c.style.pointerEvents = 'auto');
            }
        }
    } catch (error) {
        console.error('Failed to load 3D web enhancements:', error);
    }
}

// Ensure DOM is ready before injecting 3D scripts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DEnhancements);
} else {
    init3DEnhancements();
}


// --- Cart & Order Logic ---
let cart = [];
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.querySelector(".cart-count");
const cartTotalElement = document.getElementById("cart-total-amount");
const cartToggle = document.getElementById("cart-toggle");
const closeCart = document.getElementById("close-cart");
const proceedBtn = document.getElementById("proceed-btn");
const thankYouModal = document.getElementById("thank-you-modal");
const closeModal = document.getElementById("close-modal");

function updateCartUI() {
    // Update count
    const totalCount = cart.length;
    if (cartCountElement) cartCountElement.textContent = totalCount;

    // Update items list
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
            if (proceedBtn) proceedBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = "";
            cart.forEach((item, index) => {
                const itemEl = document.createElement("div");
                itemEl.className = "cart-item";
                itemEl.innerHTML = `
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
            if (proceedBtn) proceedBtn.disabled = false;
        }
    }

    // Update total
    const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    if (cartTotalElement) cartTotalElement.textContent = `$${totalAmount.toFixed(2)}`;
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartUI();
};

function addToCart(name, price) {
    console.log(`Adding to cart: ${name} at $${price}`);
    // alert(`Added ${name} to cart!`); // Optional: Uncomment for visual debug
    cart.push({ name, price });
    updateCartUI();

    // Open sidebar automatically
    if (cartSidebar && !cartSidebar.classList.contains("active")) {
        cartSidebar.classList.add("active");
    }
}

// Event Listeners for Add to Cart buttons - Using Robust Delegation
function setupCartListeners() {
    console.log("Cart listeners initialized.");
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart");
        if (btn) {
            e.preventDefault();
            const name = btn.getAttribute("data-name");
            const price = btn.getAttribute("data-price");
            console.log(`Button clicked! Target: ${name}, Price: ${price}`);
            if (name && price) {
                addToCart(name, price);
            } else {
                console.error("Missing data-name or data-price on button:", btn);
            }
        }
    });
}

// Sidebar Toggle
if (cartToggle) {
    cartToggle.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.toggle("active");
    });
}

if (closeCart) {
    closeCart.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.remove("active");
    });
}

// Proceed to Order
if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.remove("active");
        if (thankYouModal) thankYouModal.classList.add("active");
        // Clear cart
        cart = [];
        updateCartUI();
    });
}

// Close Thank You Modal
if (closeModal) {
    closeModal.addEventListener("click", () => {
        if (thankYouModal) thankYouModal.classList.remove("active");
    });
}

// Initialize cart listeners
document.addEventListener('DOMContentLoaded', () => {
    setupCartListeners();
    updateCartUI();
});

// Also run setup logic if it loads after DOMContentLoaded
if (document.readyState !== 'loading') {
    setupCartListeners();
    updateCartUI();
}

