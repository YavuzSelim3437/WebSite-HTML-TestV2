/**
 * AYAZ HAFRİYAT - CUSTOM JAVASCRIPT
 * Form doğrulama, smooth scrolling ve etkileşimler
 * 
 * Özellikler:
 * - Form doğrulama ve gönderim
 * - Smooth scrolling
 * - Animasyon tetikleyicileri
 * - Mobil optimizasyon
 * - Performans optimizasyonları
 */

// ===== DOM YÜKLENDİĞİNDE ÇALIŞACAK FONKSİYONLAR =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ayaz Hafriyat sitesi yüklendi');
    
    // Form doğrulama sistemini başlat
    initFormValidation();
    
    // Smooth scrolling başlat
    initSmoothScrolling();
    
    // Animasyonları başlat
    initAnimations();
    
    // Navbar scroll efekti
    initNavbarScroll();
    
    // Mobil optimizasyonlar
    initMobileOptimizations();
});

// ===== FORM DOĞRULAMA SİSTEMİ =====
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.warn('İletişim formu bulunamadı');
        return;
    }
    
    // Form submit event listener
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Form doğrulama
    if (!validateForm(form)) {
        return;
    }
    
    // Loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Gönderiliyor...';
    submitButton.disabled = true;
    
    // Simüle edilmiş gönderim (1.5 saniye)
    setTimeout(() => {
        // Başarı mesajını göster
        showSuccessMessage();
        
        // Form'u temizle
        form.reset();
        
        // Button'u eski haline getir
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Tüm hata mesajlarını temizle
        clearAllErrors(form);
        
    }, 1500);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Önceki hata mesajını temizle
    clearFieldError(e);
    
    // Boş alan kontrolü
    if (!value) {
        showFieldError(field, `${getFieldLabel(fieldName)} alanı zorunludur.`);
        return false;
    }
    
    // E-posta doğrulama
    if (fieldName === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Geçerli bir e-posta adresi giriniz.');
        return false;
    }
    
    // Telefon doğrulama
    if (fieldName === 'phone' && !isValidPhone(value)) {
        showFieldError(field, 'Geçerli bir telefon numarası giriniz.');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Ad Soyad',
        'email': 'E-posta',
        'phone': 'Telefon',
        'message': 'Mesaj'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    // Hata mesajı container'ı oluştur
    let errorContainer = field.parentElement.querySelector('.field-error');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'field-error text-danger small mt-1';
        field.parentElement.appendChild(errorContainer);
    }
    
    errorContainer.textContent = message;
    field.classList.add('is-invalid');
}

function clearFieldError(e) {
    const field = e.target;
    const errorContainer = field.parentElement.querySelector('.field-error');
    
    if (errorContainer) {
        errorContainer.remove();
    }
    
    field.classList.remove('is-invalid');
}

function clearAllErrors(form) {
    const errorContainers = form.querySelectorAll('.field-error');
    const invalidFields = form.querySelectorAll('.is-invalid');
    
    errorContainers.forEach(container => container.remove());
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
}

function showSuccessMessage() {
    // Bootstrap modal kullan
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Navbar yüksekliği için
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANİMASYONLAR =====
function initAnimations() {
    // Intersection Observer ile scroll animasyonları
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Animasyon yapılacak elementleri gözlemle
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// ===== NAVBAR SCROLL EFEKTİ =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

// ===== MOBİL OPTİMİZASYONLAR =====
function initMobileOptimizations() {
    // Touch events için optimizasyon
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight, { passive: true });
    
    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// ===== PERFORMANS OPTİMİZASYONLARI =====
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== HATA YÖNETİMİ =====
window.addEventListener('error', function(e) {
    console.error('JavaScript hatası:', e.error);
});

// ===== SAYFA YÜKLEME PERFORMANSI =====
window.addEventListener('load', function() {
    console.log('Sayfa tamamen yüklendi');
    
    // Lazy loading için
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// ===== WHATSAPP ENTEGRASYONU =====
function openWhatsApp() {
    // WhatsApp numarası (şimdilik placeholder, daha sonra gerçek numara eklenecek)
    const phoneNumber = '905551234567'; // Bu numara daha sonra değiştirilecek
    
    // Varsayılan mesaj
    const message = encodeURIComponent('Merhaba! Hafriyat hizmetleri hakkında bilgi almak istiyorum. Teşekkürler.');
    
    // WhatsApp URL'si oluştur
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    // Analytics için (isteğe bağlı)
    console.log('WhatsApp açıldı:', phoneNumber);
}


// ===== EK ETKİLEŞİMLER =====
// CTA butonuna tıklama efekti
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        // Buton animasyonu
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// WhatsApp butonuna tıklama efekti
document.addEventListener('click', function(e) {
    if (e.target.closest('.whatsapp-float')) {
        // WhatsApp buton animasyonu
        const whatsappBtn = e.target.closest('.whatsapp-float');
        whatsappBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            whatsappBtn.style.transform = '';
        }, 150);
    }
});

// Service card hover efektleri
document.addEventListener('mouseenter', function(e) {
    if (e.target.classList.contains('service-card')) {
        e.target.style.transform = 'translateY(-15px)';
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target.classList.contains('service-card')) {
        e.target.style.transform = 'translateY(0)';
    }
}, true);

// ===== SCROLL ANİMASYONLARI =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animasyon class'larına sahip elementleri gözlemle
    const animatedElements = document.querySelectorAll('.fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll animasyonlarını başlat
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// ===== GELİŞTİRİCİ ARAÇLARI =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Geliştirme modu aktif');
    
    // Debug fonksiyonları
    window.debugForm = function() {
        const form = document.getElementById('contact-form');
        console.log('Form durumu:', {
            form: form,
            inputs: form ? form.querySelectorAll('input, textarea') : null,
            submitButton: form ? form.querySelector('button[type="submit"]') : null
        });
    };
}