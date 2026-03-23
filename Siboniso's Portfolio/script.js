/* ================================================================
   SIBONISO SHUSHE — PORTFOLIO JAVASCRIPT
   
   📚 LEARNING NOTE: JavaScript (JS) makes your HTML page interactive.
   While HTML is the structure and CSS is the style, JS is the BEHAVIOUR.
   
   This file handles:
   1. Navbar scroll effect
   2. Mobile menu toggle
   3. Typing animation in the hero
   4. Canvas particle background
   5. Scroll reveal animations
   6. Active navigation highlighting
   7. Contact form handling
================================================================ */

/* ----------------------------------------------------------------
   📚 LEARNING NOTE: 'use strict' enables strict mode.
   It catches common coding mistakes and prevents using undeclared 
   variables. Always a good practice for cleaner code.
---------------------------------------------------------------- */
'use strict';

/* ----------------------------------------------------------------
   WAIT FOR DOM TO LOAD
   
   📚 LEARNING NOTE: 'DOMContentLoaded' fires when the browser has 
   finished reading all the HTML and built the "DOM" (Document Object 
   Model — the tree of elements on the page). 
   
   We wrap everything in this event so our JS doesn't run before 
   the HTML elements exist. Without this, document.getElementById() 
   would return null because the element isn't created yet.
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. NAVBAR — SCROLL EFFECT
     
     📚 LEARNING NOTE: window.addEventListener('scroll', fn) calls 
     our function every time the user scrolls.
     window.scrollY is how many pixels from the top the user has scrolled.
     We toggle a CSS class based on scroll position.
  ================================================================ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    /* Add "scrolled" class when user scrolls past 50px */
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* ================================================================
     2. MOBILE HAMBURGER MENU
     
     📚 LEARNING NOTE: classList.toggle() adds the class if it's not 
     there, removes it if it is. Perfect for on/off toggles!
     We toggle the 'open' class on both the button and the nav links.
  ================================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Close mobile menu when a link is clicked */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ================================================================
     3. TYPING ANIMATION
     
     📚 LEARNING NOTE: This creates the illusion of someone typing
     by adding one character at a time with setInterval().
     
     setInterval(fn, ms) calls fn every `ms` milliseconds until cleared.
     setTimeout(fn, ms) calls fn ONCE after `ms` milliseconds — used 
     here to add a pause before the next word starts.
  ================================================================ */
  const typingEl = document.getElementById('typing-text');

  /* These are the words that will cycle through */
  const roles = [
    'Junior Software Engineer',
    'Android Developer',
    'Problem Solver',
    'Code Learner',
    'CS Student'
  ];

  let roleIndex = 0;      /* Which word we're currently on */
  let charIndex = 0;      /* Which character within that word */
  let isDeleting = false; /* Are we typing or erasing? */

  function type() {
    /* Get the current word */
    const currentRole = roles[roleIndex];

    /* Build the string to display */
    if (isDeleting) {
      /* Erasing: remove one character from the end */
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      /* Typing: add one character */
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    /* Determine the speed of this tick */
    let speed = isDeleting ? 60 : 110;  /* Erase faster than type */

    if (!isDeleting && charIndex === currentRole.length) {
      /* Finished typing the word — pause, then start deleting */
      speed = 2000;  /* Wait 2 seconds before erasing */
      isDeleting = true;

    } else if (isDeleting && charIndex === 0) {
      /* Finished erasing — move to next word */
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;  /* Loop back to 0 */
      speed = 400;  /* Short pause before typing next word */
    }

    /* 
      📚 LEARNING NOTE: setTimeout schedules the next call to type().
      Since type() keeps scheduling itself, it runs indefinitely —
      this pattern is called a "recursive timeout."
    */
    setTimeout(type, speed);
  }

  /* Start the typing animation */
  setTimeout(type, 1000);


  /* ================================================================
     4. HERO CANVAS — PARTICLE ANIMATION
     
     📚 LEARNING NOTE: HTML Canvas is a drawing surface. We use the 
     Canvas 2D API to draw and animate shapes with JavaScript.
     
     Think of it like an Etch A Sketch — we clear it and redraw 
     everything ~60 times per second using requestAnimationFrame().
     requestAnimationFrame() is like setTimeout but synced to the 
     screen refresh rate for smooth animation.
  ================================================================ */
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');  /* Get the drawing context */

  let particles = [];
  let animationId;

  /* Resize canvas to match window */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  /* 
    📚 LEARNING NOTE: A "class" in JavaScript is a blueprint for objects.
    Each particle is an instance of this Particle class with its own 
    position, speed, size, and opacity values.
  */
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      /* Random position across the canvas */
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      
      /* Random small size */
      this.size = Math.random() * 1.5 + 0.5;
      
      /* Random slow drift upward */
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      
      /* Random opacity for depth effect */
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    /* Update position each frame */
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.fadeSpeed;

      /* Reset when particle drifts off screen or fades out */
      if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;  /* Start from bottom again */
        this.opacity = Math.random() * 0.3 + 0.1;
      }
    }

    /* Draw this particle */
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      /* Use the accent color (cyan-green) with this particle's opacity */
      ctx.fillStyle = `rgba(0, 229, 160, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    /* Create one particle per ~8000 pixels of screen area */
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    /* Clear the canvas each frame */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Update and draw every particle */
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    /* Schedule next frame — this creates the animation loop */
    animationId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();


  /* ================================================================
     5. SCROLL REVEAL ANIMATION
     
     📚 LEARNING NOTE: IntersectionObserver watches elements and fires 
     a callback when they enter or leave the viewport (visible screen area).
     
     This is MUCH better than listening to the 'scroll' event because:
     - It's more performant (browser optimized)
     - No manual scroll math needed
     - Clean and simple to use
  ================================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  /* 
    📚 LEARNING NOTE: querySelectorAll returns a NodeList of ALL 
    elements matching the CSS selector. We then use forEach to 
    handle each one.
  */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        /* entry.isIntersecting = true when element is visible */
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Stop observing once revealed — no need to watch it anymore */
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,    /* Trigger when 15% of element is visible */
      rootMargin: '0px'
    }
  );

  /* Observe every .reveal element */
  revealElements.forEach(el => revealObserver.observe(el));

  /* Trigger visible elements immediately (they might already be in view) */
  window.dispatchEvent(new Event('scroll'));


  /* ================================================================
     6. ACTIVE NAV LINK HIGHLIGHTING
     
     📚 LEARNING NOTE: As the user scrolls, we want the correct nav 
     link to appear "active" (highlighted). We do this by checking 
     which section is currently visible using IntersectionObserver.
  ================================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          /* Remove active from all links */
          navAnchors.forEach(a => a.classList.remove('active'));

          /* Add active to the matching link */
          const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    {
      threshold: 0.4  /* Section must be 40% visible to trigger */
    }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ================================================================
     7. CONTACT FORM
     
     📚 LEARNING NOTE: event.preventDefault() stops the form from 
     doing its default action (reloading the page). Instead, we handle 
     the submission ourselves with JavaScript.
     
     FormData is a browser API that automatically collects all input 
     values from a form element. Easy and clean!
  ================================================================ */
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();  /* Stop the page from reloading */

    /* Collect form data */
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    /* Basic validation */
    if (!name || !email || !message) {
      showFormNote('Please fill in all fields.', 'error');
      return;
    }

    /* Email format check using RegEx */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormNote('Please enter a valid email address.', 'error');
      return;
    }

    /* 
      📚 LEARNING NOTE: In a real portfolio, you'd send this data to 
      a backend server or email service (like EmailJS, Formspree, etc.).
      
      For now, we simulate a successful send with a timeout.
      When you're ready to make it real, replace this block with 
      a fetch() call to your backend endpoint.
    */
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    /* Simulate network delay */
    setTimeout(() => {
      showFormNote(`Thanks ${name}! I'll get back to you soon. 🚀`, 'success');
      contactForm.reset();
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled = false;
    }, 1500);
  });

  function showFormNote(message, type) {
    formNote.textContent = message;
    formNote.className = `form-note ${type}`;  /* Adds success or error class */
    
    /* Clear the message after 5 seconds */
    setTimeout(() => {
      formNote.textContent = '';
      formNote.className = 'form-note';
    }, 5000);
  }


  /* ================================================================
     8. SMOOTH STAGGER FOR SKILL CARDS & PROJECT CARDS
     
     📚 LEARNING NOTE: We add a CSS animation-delay to each card 
     so they appear one after another (staggered) instead of all at once.
     This creates a much more polished entrance effect.
  ================================================================ */
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    /* index is 0, 1, 2, 3... so delays are 0ms, 100ms, 200ms, 300ms */
    card.style.transitionDelay = `${index * 100}ms`;
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 120}ms`;
  });


  /* ================================================================
     9. CURRENT YEAR IN FOOTER
     
     📚 LEARNING NOTE: new Date().getFullYear() returns the current year 
     as a number (e.g. 2025). This keeps the copyright year always up to date 
     without you having to manually edit the HTML every year. 
  ================================================================ */
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });


  /* ================================================================
     10. CONSOLE EASTER EGG
     
     📚 LEARNING NOTE: Developers often check the browser console 
     (F12 → Console) of portfolios they admire. A friendly message 
     here is a nice personal touch that shows personality. 
     console.log() prints to the browser's developer console.
  ================================================================ */
  console.log('%c👋 Hey developer!', 'color: #00e5a0; font-size: 18px; font-weight: bold;');
  console.log('%cThanks for peeking at my code. I\'m Siboniso — currently learning and building. Let\'s connect!', 'color: #8888aa; font-size: 13px;');
  console.log('%cGitHub: github.com/siboniso', 'color: #00e5a0; font-size: 12px;');

});


/* ================================================================
   📚 LEARNING NOTE: This function lives OUTSIDE the DOMContentLoaded 
   listener because it doesn't need to wait for the DOM — it sets up 
   a CSS custom property (variable) that tracks mouse position.
   
   This creates the subtle glow-follow effect on project cards
   by updating --mouse-x and --mouse-y CSS variables as you hover.
================================================================ */
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    /* 
      getBoundingClientRect() gives the exact position and size of 
      an element on screen. We use it to calculate where the mouse 
      is relative to each card.
    */
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    /* Store mouse position as CSS variables for use in the glow effect */
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
