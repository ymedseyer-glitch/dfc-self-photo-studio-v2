// NAV SCROLL EFFECT
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// FADE-IN SECTIONS
const faders = document.querySelectorAll(".fade-in");

const appear = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);

faders.forEach((el) => appear.observe(el));
// LIGHTBOX
const galleryImages = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightbox = document.querySelector(".close-lightbox");

galleryImages.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});
function setStatus(status) {
  const badge = document.getElementById('announcement');

  if (!badge) return;

  // Remove all status classes
  badge.classList.remove('open', 'closed', 'fully-booked');

  // Apply the new status
  badge.classList.add(status);

  // Update text + icon
  if (status === 'open') {
    badge.textContent = "🟢 We are Open Today 9am to 7pm — Walk-ins Welcome!";
  }
  if (status === 'closed') {
    badge.textContent = "🔴 Closed Today — See you tomorrow!";
  }
  if (status === 'fully-booked') {
    badge.textContent = "🟡 Fully Booked Today — Sorry!";
  }
}
fetch('/content/announcement.json')
  .then(res => res.json())
  .then(data => {
    setStatus(data.status);
    const badge = document.getElementById('announcement');
    const icon = data.status === 'open' ? '🟢' : data.status === 'closed' ? '🔴' : '🟡';
    badge.textContent = `${icon} ${data.message}`;
  });
fetch('/content/services.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('services-list');
    container.innerHTML = data.items.map(item => `
      <div class="service-card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.promo ? `<p class="promo">${item.promo_text}</p>` : ''}
        ${item.price ? `<p class="price">${item.price}</p>` : ''}
      </div>
    `).join('');
  });
fetch('/content/gallery')
  .then(res => res.json())
  .then(files => Promise.all(
    files.map(file => fetch(`/content/gallery/${file}`).then(r => r.json()))
  ))
  .then(images => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = images.map(img => `
      <img src="${img.image}" alt="${img.caption || ''}">
    `).join('');
  });

