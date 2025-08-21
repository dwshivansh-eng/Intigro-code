// Mobile nav toggle
const navToggleButton = document.getElementById('nav-toggle');
const nav = document.getElementById('primary-nav');
if (navToggleButton && nav) {
  navToggleButton.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !navToggleButton.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// Smooth scroll for internal links with [data-scroll]
document.querySelectorAll('[data-scroll]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
      }
      if (nav && nav.classList.contains('open')) nav.classList.remove('open');
    }
  });
});

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Handle enrollment and WhatsApp redirect
function handleEnrollment() {
  // Store enrollment intent with timestamp
  const enrollmentData = {
    intent: 'true',
    timestamp: Date.now(),
    amount: 7000
  };
  
  try {
    localStorage.setItem('enrollmentIntent', JSON.stringify(enrollmentData));
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
  
  // Show payment confirmation dialog
  if (confirm('You will be redirected to Razorpay to pay ₹7,000. Continue?')) {
    // Set timeout for payment completion (10 minutes)
    setTimeout(() => {
      checkPaymentAndRedirect();
    }, 600000); // 10 minutes timeout
  } else {
    try {
      localStorage.removeItem('enrollmentIntent');
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
}

function checkPaymentAndRedirect() {
  try {
    const enrollmentData = JSON.parse(localStorage.getItem('enrollmentIntent') || '{}');
    const currentTime = Date.now();
    const timeDiff = currentTime - enrollmentData.timestamp;
    
    // Check if payment timeout hasn't expired (10 minutes)
    if (enrollmentData.intent === 'true' && timeDiff < 600000) {
      // Show success message and redirect to WhatsApp
      alert('Payment successful! Redirecting to WhatsApp group...');
      
      // Redirect to WhatsApp group
      const whatsappGroupLink = 'https://chat.whatsapp.com/GG4HfG5TQsmFp8aJXGyKkB?mode=ac_t';
      window.open(whatsappGroupLink, '_blank');
      
      // Clear the intent
      try {
        localStorage.removeItem('enrollmentIntent');
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    } else if (timeDiff >= 600000) {
      // Payment timeout
      alert('Payment session expired. Please try again.');
      try {
        localStorage.removeItem('enrollmentIntent');
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    }
  } catch (error) {
    console.error('Error checking payment:', error);
    try {
      localStorage.removeItem('enrollmentIntent');
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
}

// Check for payment completion on page load
window.addEventListener('load', () => {
  try {
    const enrollmentData = JSON.parse(localStorage.getItem('enrollmentIntent') || '{}');
    const currentTime = Date.now();
    const timeDiff = currentTime - enrollmentData.timestamp;
    
    if (enrollmentData.intent === 'true' && timeDiff < 600000) {
      // Check after 3 seconds if payment was completed
      setTimeout(() => {
        checkPaymentAndRedirect();
      }, 3000);
    } else if (timeDiff >= 600000) {
      // Clear expired payment intent
      try {
        localStorage.removeItem('enrollmentIntent');
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    }
  } catch (error) {
    console.error('Error on page load:', error);
    try {
      localStorage.removeItem('enrollmentIntent');
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }
});

// Add payment amount validation
function validatePaymentAmount(amount) {
  return amount === 7000;
}


