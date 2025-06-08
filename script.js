// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")

    // Animate hamburger menu
    const bars = navToggle.querySelectorAll(".bar")
    bars.forEach((bar, index) => {
      if (navMenu.classList.contains("active")) {
        if (index === 0) bar.style.transform = "rotate(45deg) translate(5px, 5px)"
        if (index === 1) bar.style.opacity = "0"
        if (index === 2) bar.style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        bar.style.transform = "none"
        bar.style.opacity = "1"
      }
    })
  })
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu) {
      navMenu.classList.remove("active")
      const bars = navToggle?.querySelectorAll(".bar")
      bars?.forEach((bar) => {
        bar.style.transform = "none"
        bar.style.opacity = "1"
      })
    }
  })
})

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const header = document.querySelector(".header")
      const headerHeight = header ? header.offsetHeight : 80
      const targetPosition = targetElement.offsetTop - headerHeight - 20

      // Add smooth scrolling with easing
      smoothScrollTo(targetPosition, 800)

      // Update active nav link
      updateActiveNavLink(targetId)

      // Close mobile menu if open
      const navMenu = document.getElementById("nav-menu")
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        const bars = document.getElementById("nav-toggle")?.querySelectorAll(".bar")
        bars?.forEach((bar) => {
          bar.style.transform = "none"
          bar.style.opacity = "1"
        })
      }
    }
  })
})

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime = null

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }

  requestAnimationFrame(animation)
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t * t + b
  t -= 2
  return (c / 2) * (t * t * t + 2) + b
}

// Update active navigation link
function updateActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === targetId) {
      link.classList.add("active")
    }
  })
}

// Enhanced header background on scroll with scroll progress
let lastScrollTop = 0

window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (header) {
    // Add scrolled class for styling
    if (scrollTop > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Update header background based on theme
    const isDarkMode = document.body.classList.contains("dark-mode")
    if (scrollTop > 100) {
      header.style.background = isDarkMode ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)"
    } else {
      header.style.background = isDarkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"
    }
  }

  // Update scroll progress
  updateScrollProgress()

  // Update active nav link based on scroll position
  updateActiveNavOnScroll()

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
})

// Scroll progress indicator
function updateScrollProgress() {
  let scrollProgress = document.querySelector(".scroll-progress")
  if (!scrollProgress) {
    // Create scroll progress element if it doesn't exist
    scrollProgress = document.createElement("div")
    scrollProgress.className = "scroll-progress"
    document.body.appendChild(scrollProgress)
  }

  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  scrollProgress.style.width = scrollPercent + "%"
}

// Update active nav link based on scroll position with improved detection
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  const scrollPosition = window.scrollY + 150 // Offset for better detection

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = sectionId
    }
  })

  // Handle edge case for the last section
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    const lastSection = sections[sections.length - 1]
    if (lastSection) {
      current = lastSection.getAttribute("id")
    }
  }

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")

      // Animate skill bars
      if (entry.target.classList.contains("habilidad-item")) {
        const skillBar = entry.target.querySelector(".skill-bar")
        if (skillBar) {
          const level = skillBar.getAttribute("data-level")
          setTimeout(() => {
            skillBar.style.width = level + "%"
          }, 300)
        }
      }
    }
  })
}, observerOptions)

// Observe elements for animation
document
  .querySelectorAll(
    ".intro-item, .importance-item, .feature-card, .activity-card, .arquitectura-card, .habilidad-item, .certificacion-card, .demanda-column",
  )
  .forEach((el) => {
    observer.observe(el)
  })

// Parallax effect for floating elements
let ticking = false

function updateParallax() {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".element")

  parallaxElements.forEach((element, index) => {
    const speed = 0.3 + index * 0.05
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })

  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax)
    ticking = true
  }
})

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle")
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

// Check for saved theme preference or use device preference
const currentTheme = localStorage.getItem("theme") || (prefersDarkScheme.matches ? "dark" : "light")

// Set initial theme
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode")
  if (themeToggle) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }
}

// Theme toggle click event
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")

    // Update button icon
    if (document.body.classList.contains("dark-mode")) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      localStorage.setItem("theme", "dark")
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      localStorage.setItem("theme", "light")
    }

    // Update header background based on theme
    const header = document.querySelector(".header")
    if (header && window.scrollY > 100) {
      header.style.background = document.body.classList.contains("dark-mode")
        ? "rgba(15, 23, 42, 0.98)"
        : "rgba(255, 255, 255, 0.98)"
    }
  })
}

// Enhanced navigation experience
function initializeNavigation() {
  // Set initial active link
  const currentHash = window.location.hash
  if (currentHash) {
    updateActiveNavLink(currentHash)
  } else {
    // Set first nav link as active by default
    const firstNavLink = document.querySelector(".nav-link")
    if (firstNavLink) {
      firstNavLink.classList.add("active")
    }
  }

  // Add keyboard navigation support
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const activeLink = document.querySelector(".nav-link.active")
      const navLinks = Array.from(document.querySelectorAll(".nav-link"))
      const currentIndex = navLinks.indexOf(activeLink)

      let nextIndex
      if (e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % navLinks.length
      } else {
        nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length
      }

      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        navLinks[nextIndex].click()
      }
    }
  })
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeNavigation)

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start)

    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    }
  }, 16)
}

// Initialize counter animations when stats come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number")
        statNumbers.forEach((stat) => {
          const target = Number.parseInt(stat.textContent)
          if (!isNaN(target)) {
            stat.textContent = "0"
            setTimeout(() => {
              animateCounter(stat, target)
            }, 500)
          }
        })
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

const heroStats = document.querySelector(".hero-stats")
if (heroStats) {
  statsObserver.observe(heroStats)
}

// Add loading animation to page
window.addEventListener("load", () => {
  // Remove loading class if it exists
  document.body.classList.remove("loading")

  // Initialize any lazy-loaded content
  const lazyElements = document.querySelectorAll("[data-lazy]")
  lazyElements.forEach((element) => {
    element.classList.remove("loading")
  })
})

// Add hover effects to cards
document.querySelectorAll(".feature-card, .activity-card, .importance-item, .certificacion-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Enhanced floating elements interaction
document.querySelectorAll(".element").forEach((element) => {
  element.addEventListener("mouseenter", function () {
    this.style.animationPlayState = "paused"
    this.style.transform += " scale(1.2) rotate(10deg)"
  })

  element.addEventListener("mouseleave", function () {
    this.style.animationPlayState = "running"
    this.style.transform = this.style.transform.replace(" scale(1.2) rotate(10deg)", "")
  })
})

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu?.classList.contains("active")) {
    navMenu.classList.remove("active")
    const bars = navToggle?.querySelectorAll(".bar")
    bars?.forEach((bar) => {
      bar.style.transform = "none"
      bar.style.opacity = "1"
    })
  }
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
  // Any additional scroll handling can go here
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

// Initialize tooltips for tech icons
document.querySelectorAll(".tech-icons i").forEach((icon) => {
  icon.addEventListener("mouseenter", function () {
    const title = this.getAttribute("title")
    if (title) {
      const tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      tooltip.textContent = title
      tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: var(--white);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 500;
                z-index: 1000;
                pointer-events: none;
                transform: translateX(-50%);
                white-space: nowrap;
                box-shadow: var(--shadow);
            `

      this.style.position = "relative"
      this.appendChild(tooltip)

      // Position tooltip
      const rect = this.getBoundingClientRect()
      tooltip.style.left = "50%"
      tooltip.style.top = "-40px"
    }
  })

  icon.addEventListener("mouseleave", function () {
    const tooltip = this.querySelector(".tooltip")
    if (tooltip) {
      tooltip.remove()
    }
  })
})

// Console message
console.log(`
🚀 Sitio web de Desarrollo Web cargado correctamente!
📚 Creado por: Andrés Araya Saborío - Estudiante de 12mo año
💻 Especialidad en Desarrollo Web
⭐ ¡Gracias por visitar nuestro sitio!
`)

// Error handling
window.addEventListener("error", (e) => {
  console.error("Error en el sitio web:", e.error)
})

// Service worker registration (if needed in the future)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker can be registered here for PWA functionality
    console.log("Service Worker support detected")
  })
}
