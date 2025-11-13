// Skills Cards Animation on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("animate");
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // Close menu when clicking on a link
    const navLinks = navbar.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !navbar.contains(e.target) &&
        !menuToggle.contains(e.target) &&
        navbar.classList.contains("active")
      ) {
        navbar.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }

  // Hero section animations
  animateHeroSection();

  const skillCards = document.querySelectorAll(
    ".skills-wrapper-1, .skills-wrapper-2, .skills-wrapper-3, .skills-wrapper-4"
  );

  skillCards.forEach((card) => {
    observer.observe(card);
  });

  skillCards.forEach((card) => {
    card.addEventListener("click", function () {
      skillCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Button functionality
  const skillsBtn = document.querySelector(".btn-1");
  const experienceBtn = document.querySelector(".btn-2");

  if (skillsBtn) {
    skillsBtn.addEventListener("click", () => {
      const skillsSection = document.querySelector(".skills-section");
      if (skillsSection) {
        skillsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  if (experienceBtn) {
    experienceBtn.addEventListener("click", () => {
      showExperiencePopup();
    });
  }

  // Experience popup functionality
  const experienceOverlay = document.getElementById("experienceOverlay");
  const experiencePopup = document.getElementById("experiencePopup");
  const experienceCloseBtn = document.getElementById("experienceCloseBtn");

  if (experienceCloseBtn) {
    experienceCloseBtn.addEventListener("click", () => {
      hideExperiencePopup();
    });
  }

  if (experienceOverlay) {
    experienceOverlay.addEventListener("click", () => {
      hideExperiencePopup();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      experiencePopup &&
      experiencePopup.classList.contains("show")
    ) {
      hideExperiencePopup();
    }
  });

  // Contact section animations
  const contactInfoItems = document.querySelectorAll(".info-item");
  const contactForm = document.querySelector(".contact-form");

  contactInfoItems.forEach((item) => {
    observer.observe(item);
  });

  if (contactForm) {
    observer.observe(contactForm);
  }

  const contactFormElement = document.getElementById("contactForm");
  if (contactFormElement) {
    contactFormElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      clearFormErrors();

      let isValid = true;
      let errorMessage = "";

      if (!name || name.length < 2) {
        showFieldError(
          "name",
          "Please enter your name (at least 2 characters)"
        );
        isValid = false;
      }

      if (!email) {
        showFieldError("email", "Please enter your email address");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showFieldError("email", "Please enter a valid email address");
        isValid = false;
      }

      if (!message || message.length < 10) {
        showFieldError(
          "message",
          "Please enter a message (at least 10 characters)"
        );
        isValid = false;
      }

      if (isValid) {
        // Here you would typically send the data to a server
        // For example:
        // try {
        //   await sendEmail(name, email, message);
        //   showNotification(name, email);
        //   contactFormElement.reset();
        // } catch (error) {
        //   showErrorNotification("Failed to send message. Please try again later or contact me directly via email.");
        // }

        // For now, show success notification
        showNotification(name, email);
        contactFormElement.reset();
      } else {
        showErrorNotification("Please fill in all fields correctly.");
      }
    });

    // Real-time validation
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });
      input.addEventListener("input", function () {
        if (this.parentElement.classList.contains("error")) {
          validateField(this);
        }
      });
    });
  }

  const headerContactBtn = document.querySelector(".header .contact");
  if (headerContactBtn) {
    headerContactBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const contactSection = document.querySelector("#contact");
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }
});

// Notification Popup Functions
function showNotification(name, email) {
  let overlay = document.querySelector(".notification-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "notification-overlay";
    document.body.appendChild(overlay);
  }

  let popup = document.querySelector(".notification-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "notification-popup";
    popup.innerHTML = `
      <div class="notification-popup-content">
        <div class="notification-icon">✓</div>
        <h4>Message Sent!</h4>
        <p>
          Thank you, <strong>${name}</strong>! Your message has been received. 
          I'll get back to you soon at <span class="notification-email">${email}</span>.
        </p>
        <button class="notification-close-btn">Got it</button>
      </div>
    `;
    document.body.appendChild(popup);

    const closeBtn = popup.querySelector(".notification-close-btn");
    closeBtn.addEventListener("click", () => {
      hideNotification();
    });

    overlay.addEventListener("click", () => {
      hideNotification();
    });
  } else {
    const content = popup.querySelector(".notification-popup-content");
    content.innerHTML = `
      <div class="notification-icon">✓</div>
      <h4>Message Sent!</h4>
      <p>
        Thank you, <strong>${name}</strong>! Your message has been received. 
        I'll get back to you soon at <span class="notification-email">${email}</span>.
      </p>
      <button class="notification-close-btn">Got it</button>
    `;

    const closeBtn = popup.querySelector(".notification-close-btn");
    closeBtn.addEventListener("click", () => {
      hideNotification();
    });
  }

  setTimeout(() => {
    overlay.classList.add("show");
    popup.classList.add("show");
  }, 10);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  const overlay = document.querySelector(".notification-overlay");
  const popup = document.querySelector(".notification-popup");

  if (overlay) {
    overlay.classList.remove("show");
  }
  if (popup) {
    popup.classList.remove("show");
    // Remove error class after animation
    setTimeout(() => {
      popup.classList.remove("error");
    }, 300);
  }
}

function showErrorNotification(message) {
  let overlay = document.querySelector(".notification-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "notification-overlay";
    document.body.appendChild(overlay);
  }

  let popup = document.querySelector(".notification-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "notification-popup error";
    document.body.appendChild(popup);
  } else {
    popup.classList.add("error");
  }

  popup.innerHTML = `
    <div class="notification-popup-content">
      <div class="notification-icon">✕</div>
      <h4>Error</h4>
      <p>${message}</p>
      <button class="notification-close-btn">Close</button>
    </div>
  `;

  const closeBtn = popup.querySelector(".notification-close-btn");
  closeBtn.addEventListener("click", () => {
    hideNotification();
  });

  overlay.addEventListener("click", () => {
    hideNotification();
  });

  setTimeout(() => {
    overlay.classList.add("show");
    popup.classList.add("show");
  }, 10);

  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.parentElement;
  formGroup.classList.add("error");

  let errorMsg = formGroup.querySelector(".error-message");
  if (!errorMsg) {
    errorMsg = document.createElement("div");
    errorMsg.className = "error-message";
    formGroup.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}

function clearFormErrors() {
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    group.classList.remove("error");
    const errorMsg = group.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  const formGroup = field.parentElement;
  let isValid = true;
  let errorMessage = "";

  if (field.id === "name") {
    if (!value || value.length < 2) {
      isValid = false;
      errorMessage = "Name must be at least 2 characters";
    }
  } else if (field.id === "email") {
    if (!value) {
      isValid = false;
      errorMessage = "Email is required";
    } else if (!isValidEmail(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  } else if (field.id === "message") {
    if (!value || value.length < 10) {
      isValid = false;
      errorMessage = "Message must be at least 10 characters";
    }
  }

  if (isValid) {
    formGroup.classList.remove("error");
    const errorMsg = formGroup.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }
  } else {
    showFieldError(field.id, errorMessage);
  }

  return isValid;
}

// Experience Popup Functions
function showExperiencePopup() {
  const overlay = document.getElementById("experienceOverlay");
  const popup = document.getElementById("experiencePopup");

  if (overlay && popup) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    }, 10);
  }
}

function hideExperiencePopup() {
  const overlay = document.getElementById("experienceOverlay");
  const popup = document.getElementById("experiencePopup");

  if (overlay && popup) {
    overlay.classList.remove("show");
    popup.classList.remove("show");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Hero Section Animations
function animateHeroSection() {
  const heroElements = [
    document.querySelector(".home-content h3"),
    document.querySelector(".home-content h2"),
    document.querySelector(".home-content p"),
    document.querySelector(".btn-box"),
    document.querySelector(".img-box"),
  ];

  heroElements.forEach((element, index) => {
    if (element) {
      setTimeout(() => {
        element.classList.add("animate");
      }, index * 200);
    }
  });

  const nameSpan = document.querySelector(".home-content h2 span");
  if (nameSpan) {
    setTimeout(() => {
      const h2 = document.querySelector(".home-content h2");
      if (h2 && h2.classList.contains("animate")) {
        nameSpan.classList.add("animate");
      }
    }, 600);
  }
}
