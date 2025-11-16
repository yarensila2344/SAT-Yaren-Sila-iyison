// Header Başlığına Tıklandığında Renk Değiştirme (Mevcut işlev korundu)
const logo = document.querySelector("header .logo");
if (logo) {
    logo.addEventListener("click", () => {
        // CSS değişkeni kullanarak daha kontrollü renk değiştirme
        const currentColor = logo.style.color;
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        if (currentColor === accentColor) {
            logo.style.color = primaryColor;
        } else {
            logo.style.color = accentColor;
        }
    });
}

// Galeri Resimlerine Tıklandığında Büyütme (Modal)
// Tüm galeri sayfaları için modal fonksiyonu
function createImageModal(img) {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    
    // Modal stilini ve içeriğini ayarla
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.95)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.cursor = "pointer";
    modal.style.zIndex = "2000";
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.3s ease";

    // Resim içeriği
    const modalImg = document.createElement("img");
    modalImg.src = img.src;
    modalImg.alt = img.alt || "Fotoğraf";
    modalImg.style.maxWidth = "90%";
    modalImg.style.maxHeight = "90%";
    modalImg.style.borderRadius = "10px";
    modalImg.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.3)";
    modalImg.style.objectFit = "contain";
    modalImg.style.cursor = "default";
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Fade in animasyonu
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);

    // Kapatma fonksiyonu
    const closeModal = () => {
        modal.style.opacity = "0";
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    };

    // Modala tıklandığında kapat (resme değil, arka plana)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC tuşuna basıldığında kapat
    const escapeHandler = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", escapeHandler);
        }
    };
    document.addEventListener("keydown", escapeHandler);
}

// Ana sayfa featured gallery için
const featuredGalleryImages = document.querySelectorAll(".featured-gallery img");
featuredGalleryImages.forEach(img => {
    img.addEventListener("click", () => createImageModal(img));
});

// Kategori sayfalarındaki gallery-grid için
const galleryGridImages = document.querySelectorAll(".gallery-grid .gallery-item img");
galleryGridImages.forEach(img => {
    img.addEventListener("click", () => createImageModal(img));
});

// Gallery-item'a tıklandığında da çalışsın
const galleryItems = document.querySelectorAll(".gallery-item");
galleryItems.forEach(item => {
    const img = item.querySelector("img");
    if (img) {
        item.addEventListener("click", () => createImageModal(img));
    }
});

// Hero Section'daki Metin Animasyonları
document.addEventListener("DOMContentLoaded", () => {
    const texts = document.querySelectorAll('.animate-text');
    texts.forEach((text, index) => {
        text.style.opacity = 0;
        text.style.transform = 'translateY(20px)';
        setTimeout(() => {
            text.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            text.style.opacity = 1;
            text.style.transform = 'translateY(0)';
        }, index * 300);
    });

    // Smooth scroll için anchor linkler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Scroll animasyonları için Intersection Observer
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

    // Animasyon için elementleri gözlemle
    document.querySelectorAll('.service-card, .concept-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Slider Fonksiyonelliği
    initSlider();
});

// Slider Fonksiyonu
function initSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll('.slider-slide');
    const dots = sliderContainer.querySelectorAll('.dot');
    const prevBtn = sliderContainer.querySelector('.slider-btn-prev');
    const nextBtn = sliderContainer.querySelector('.slider-btn-next');
    
    let currentSlide = 0;
    let autoSlideInterval;

    // Slider'ı belirli bir slide'a götür
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Aktif slide'ı kaldır
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Yeni slide'ı aktif yap
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Sonraki slide'a geç
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Önceki slide'a geç
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Otomatik geçiş başlat
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // 5 saniyede bir geçiş
    }

    // Otomatik geçişi durdur
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    // Dot'lara tıklama
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Slider üzerine gelince otomatik geçişi durdur
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Klavye ile kontrol (ok tuşları)
    document.addEventListener('keydown', (e) => {
        if (sliderContainer.contains(document.activeElement) || 
            document.querySelector('.slider-container:hover')) {
            if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        }
    });

    // Slide'a tıklayınca modal aç
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            slide.addEventListener('click', () => {
                createImageModal(img);
            });
        }
    });

    // Otomatik geçişi başlat
    startAutoSlide();
}