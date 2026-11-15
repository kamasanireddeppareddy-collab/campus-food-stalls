/* =====================================================
   Campus Food Stall Directory & Review Portal
   Plain JavaScript - no frameworks, no backend.
   Sections: 1 Data | 2 Storage | 3 Helpers | 4 Student side
             5 Reviews | 6 Admin | 7 Start-up
   ===================================================== */

/* ---------- 1. SAMPLE DATA ---------- */
const CATEGORIES = ['Indian', 'South Indian', 'Chinese', 'Fast Food', 'Beverages', 'Snacks', 'Healthy Food', 'Desserts'];
const ICONS = { 'Indian': '🍛', 'South Indian': '🥞', 'Chinese': '🥡', 'Fast Food': '🍔', 'Beverages': '🧃', 'Snacks': '🍟', 'Healthy Food': '🥗', 'Desserts': '🍨' };

// Small helper so each stall takes only one line
function makeStall(id, name, category, location, description, openingTime, closingTime, price, status, popularDishes, menu, contact) {
  return { id, name, category, location, description, image: 'images/stall' + id + '.svg',
           openingTime, closingTime, price, status, popularDishes, menu, contact };
}

const defaultStalls = [
  makeStall(1, 'Campus Cafe', 'Beverages', 'Library Block, Ground Floor', 'Cosy cafe with fresh coffee, sandwiches and a quiet place to study.', '08:00', '20:00', '₹₹', 'OPEN',
    ['Cold Coffee', 'Veg Sandwich'], ['Cold Coffee - ₹60', 'Veg Sandwich - ₹50', 'Cappuccino - ₹70'], '9876500001'),
  makeStall(2, 'South Indian Corner', 'South Indian', 'Main Canteen, Counter 2', 'Hot and crispy dosas with fresh chutneys and sambar.', '07:30', '16:00', '₹', 'OPEN',
    ['Masala Dosa', 'Idli Sambar'], ['Masala Dosa - ₹50', 'Idli Sambar - ₹35', 'Medu Vada - ₹30'], '9876500002'),
  makeStall(3, 'Spice Hub', 'Indian', 'Hostel Road', 'Home-style North Indian thalis and curries.', '11:00', '21:00', '₹₹', 'OPEN',
    ['Paneer Thali', 'Chole Bhature'], ['Paneer Thali - ₹90', 'Chole Bhature - ₹60', 'Dal Rice - ₹50'], '9876500003'),
  makeStall(4, 'Fresh Juice Point', 'Beverages', 'Sports Ground Gate', 'Fresh fruit juices and shakes made while you wait.', '09:00', '18:00', '₹', 'CLOSED',
    ['Orange Juice', 'Mango Shake'], ['Orange Juice - ₹30', 'Mango Shake - ₹50', 'Lemon Soda - ₹20'], '9876500004'),
  makeStall(5, 'Student Bites', 'Chinese', 'Engineering Block', 'Budget-friendly noodles, momos and fried rice.', '10:00', '19:00', '₹', 'OPEN',
    ['Veg Momos', 'Hakka Noodles'], ['Veg Momos - ₹40', 'Hakka Noodles - ₹60', 'Fried Rice - ₹60'], '9876500005'),
  makeStall(6, 'Pizza Corner', 'Fast Food', 'Student Centre', 'Freshly baked pizzas, burgers and cheesy garlic bread.', '12:00', '22:00', '₹₹₹', 'OPEN',
    ['Margherita Pizza', 'Cheese Burger'], ['Margherita Pizza - ₹150', 'Cheese Burger - ₹90', 'Garlic Bread - ₹80'], '9876500006'),
  makeStall(7, 'Tea & Snacks Hub', 'Snacks', 'Admin Block Lawn', 'Classic chai with samosas, pakoras and bread pakoda.', '08:00', '18:00', '₹', 'CLOSED',
    ['Masala Chai', 'Samosa'], ['Masala Chai - ₹15', 'Samosa - ₹15', 'Bread Pakoda - ₹20'], '9876500007'),
  makeStall(8, 'Healthy Bowl', 'Healthy Food', 'Gym Complex', 'Salads, fruit bowls and protein wraps for health-conscious students.', '09:00', '19:00', '₹₹', 'OPEN',
    ['Fruit Bowl', 'Protein Wrap'], ['Fruit Bowl - ₹70', 'Protein Wrap - ₹90', 'Greek Salad - ₹80'], '9876500008')
];

// Each review: [stallId, name, rating, text]
const defaultReviews = [
  [1, 'Aarav', 5, 'Best cold coffee on campus and a calm place to study.'], [1, 'Meera', 4, 'Good sandwiches but gets crowded in the evening.'],
  [2, 'Rohan', 5, 'Crispy dosa and amazing chutney. Worth the queue!'], [2, 'Sneha', 4, 'Cheap and filling breakfast.'],
  [3, 'Kabir', 4, 'The paneer thali tastes like home.'], [3, 'Isha', 3, 'Good food but service is slow at lunch.'],
  [4, 'Nikhil', 5, 'Super fresh juice, very hygienic.'], [4, 'Pooja', 4, 'Mango shake is thick and tasty.'],
  [5, 'Dev', 4, 'Momos are great for the price.'], [5, 'Ananya', 3, 'Noodles were a bit oily today.'],
  [6, 'Yash', 5, 'Great cheesy pizza, perfect for group hangouts.'], [6, 'Riya', 3, 'A little costly for students.'],
  [7, 'Arjun', 5, 'Chai and samosa after class is the best.'], [8, 'Tanvi', 5, 'Fresh fruit bowls. Healthy and tasty.'],
  [8, 'Karan', 4, 'Protein wrap is a good post-gym meal.']
].map((r, i) => ({ id: i + 1, stallId: r[0], name: r[1], rating: r[2], text: r[3], date: '2026-09-' + String(i + 1).padStart(2, '0') }));

let stalls = [];
let reviews = [];
let isAdmin = false;
let pickedRating = 0;

/* ---------- 2. LOCAL STORAGE ---------- */
// Save everything to the browser so it survives a refresh
function saveToLocalStorage() {
  localStorage.setItem('cfd_stalls', JSON.stringify(stalls));
  localStorage.setItem('cfd_reviews', JSON.stringify(reviews));
  localStorage.setItem('cfd_admin', isAdmin);
}
// Load saved data; if nothing is saved yet, use the sample data
function loadFromLocalStorage() {
  stalls = JSON.parse(localStorage.getItem('cfd_stalls')) || defaultStalls;
  reviews = JSON.parse(localStorage.getItem('cfd_reviews')) || defaultReviews;
  isAdmin = localStorage.getItem('cfd_admin') === 'true';
}

/* ---------- 3. SMALL HELPERS ---------- */
const $ = id => document.getElementById(id);

// Stop users from injecting HTML through names/reviews
function esc(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }
function starsText(n) { const r = Math.round(n); return '★'.repeat(r) + '☆'.repeat(5 - r); }
function reviewsOf(stallId) { return reviews.filter(r => r.stallId === stallId); }
function ratingOf(stallId) {
  const list = reviewsOf(stallId);
  return list.length ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0;
}
function stallName(id) { const s = stalls.find(x => x.id === id); return s ? s.name : 'Deleted stall'; }
function averageRating() { return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0; }
function to12h(t) { const [h, m] = t.split(':'); return ((h % 12) || 12) + ':' + m + (h >= 12 ? ' PM' : ' AM'); }
function hours(s) { return to12h(s.openingTime) + ' - ' + to12h(s.closingTime); }
function badge(s) { return '<span class="badge ' + s.status.toLowerCase() + '">' + s.status + '</span>'; }

// Pop-up message (green = success, red = error)
function showNotification(message, isError) {
  const t = $('toast');
  t.textContent = message;
  t.className = 'toast show' + (isError ? ' error-toast' : '');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---------- 4. STUDENT SIDE: CARDS, SEARCH, FILTERS, DETAILS ---------- */
function statsHTML() {
  const open = stalls.filter(s => s.status === 'OPEN').length;
  const items = [[stalls.length, 'Total Food Stalls'], [open, 'Open Now'], [averageRating().toFixed(1) + ' ★', 'Average Rating'], [reviews.length, 'Total Reviews']];
  return items.map(i => '<div class="stat"><b>' + i[0] + '</b><span>' + i[1] + '</span></div>').join('');
}

function cardHTML(s) {
  return '<article class="card"><img src="' + esc(s.image) + '" alt="' + esc(s.name) + '" onerror="this.src=\'images/default.svg\'">' +
    '<div class="card-body"><div class="row-between"><h3>' + esc(s.name) + '</h3>' + badge(s) + '</div>' +
    '<span class="meta">' + ICONS[s.category] + ' ' + s.category + ' • ' + s.price + '</span>' +
    '<span class="meta">📍 ' + esc(s.location) + '</span><span class="meta">🕒 ' + hours(s) + '</span>' +
    '<span><span class="stars">' + starsText(ratingOf(s.id)) + '</span> ' + ratingOf(s.id).toFixed(1) + ' (' + reviewsOf(s.id).length + ' reviews)</span>' +
    '<p class="meta">' + esc(s.description) + '</p>' +
    '<div class="card-actions"><button class="btn small" onclick="viewStallDetails(' + s.id + ')">View Details</button>' +
    '<button class="btn small ghost" onclick="openReviewForm(' + s.id + ')">Write Review</button></div></div></article>';
}

// Draw a list of stalls into the directory grid
function renderStalls(list) {
  $('stallGrid').innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">No food stalls found.</p>';
}

// Look at the search box + every filter and return the matching stalls
function filterStalls() {
  const word = $('searchInput').value.trim().toLowerCase();
  const cat = $('fCategory').value, minRating = Number($('fRating').value);
  const status = $('fStatus').value, price = $('fPrice').value;
  return stalls.filter(s => {
    // Searchable text = name + category + location + description + dishes + menu
    const text = [s.name, s.category, s.location, s.description, ...s.popularDishes, ...s.menu].join(' ').toLowerCase();
    return (!word || text.includes(word)) &&
           (cat === 'All' || s.category === cat) &&
           ratingOf(s.id) >= minRating &&
           (status === 'all' || s.status === status) &&
           (price === 'all' || s.price === price);
  });
}
// Called whenever the user types or changes a filter
function searchStalls() { renderStalls(filterStalls()); }

function renderCategories() {
  $('categoryCards').innerHTML = CATEGORIES.map(c =>
    '<div class="cat-card" onclick="chooseCategory(\'' + c + '\')"><div class="emoji">' + ICONS[c] + '</div><h3>' + c + '</h3><p class="meta">' +
    stalls.filter(s => s.category === c).length + ' stalls</p></div>').join('');
}
function chooseCategory(c) {
  $('fCategory').value = c;
  searchStalls();
  location.hash = '#directory';
}

function viewStallDetails(id) {
  const s = stalls.find(x => x.id === id);
  const list = reviewsOf(id).map(r => '<div class="review"><b>' + esc(r.name) + '</b> <span class="stars">' + starsText(r.rating) + '</span><p>' + esc(r.text) + '</p></div>').join('') || '<p>No reviews yet.</p>';
  $('modalBody').innerHTML = '<img src="' + esc(s.image) + '" alt="' + esc(s.name) + '" onerror="this.src=\'images/default.svg\'">' +
    '<div class="modal-content"><h2>' + esc(s.name) + ' ' + badge(s) + '</h2>' +
    '<p class="meta">' + s.category + ' • ' + s.price + ' • 📍 ' + esc(s.location) + ' • 🕒 ' + hours(s) + ' • 📞 ' + esc(s.contact) + '</p>' +
    '<p><span class="stars">' + starsText(ratingOf(id)) + '</span> ' + ratingOf(id).toFixed(1) + ' (' + reviewsOf(id).length + ' reviews)</p>' +
    '<p>' + esc(s.description) + '</p>' +
    '<h4>Popular Dishes</h4><ul>' + s.popularDishes.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul>' +
    '<h4>Menu</h4><ul>' + s.menu.map(m => '<li>' + esc(m) + '</li>').join('') + '</ul>' +
    '<h4>Student Reviews</h4>' + list +
    '<br><button class="btn" onclick="closeModal();openReviewForm(' + id + ')">Write Review</button></div>';
  $('modal').hidden = false;
}
function closeModal() { $('modal').hidden = true; }

/* ---------- 5. REVIEWS ---------- */
function fillStallDropdowns() {
  $('rStall').innerHTML = stalls.map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('');
}

function renderReviews() {
  const newest = [...reviews].reverse();
  $('reviewList').innerHTML = newest.map(r =>
    '<div class="review"><b>' + esc(r.name) + '</b> on <i>' + esc(stallName(r.stallId)) + '</i><br>' +
    '<span class="stars">' + starsText(r.rating) + '</span> <small>' + r.date + '</small><p>' + esc(r.text) + '</p></div>').join('') || '<p>No reviews yet.</p>';
}

// Jump to the review form with the chosen stall selected
function openReviewForm(id) {
  $('rStall').value = id;
  location.hash = '#reviews';
  $('rName').focus({ preventScroll: true });
}

// 1-5 clickable stars
function drawStarPicker() {
  let html = '';
  for (let i = 1; i <= 5; i++) html += '<span data-v="' + i + '" class="' + (i <= pickedRating ? 'on' : '') + '">★</span>';
  $('starPicker').innerHTML = html;
}

function submitReview(e) {
  e.preventDefault();
  const name = $('rName').value.trim(), text = $('rText').value.trim();
  // Validation: nothing may be empty
  if (!name) return fail('rError', 'Please enter your name.');
  if (!pickedRating) return fail('rError', 'Please select a star rating.');
  if (!text) return fail('rError', 'Please write your review.');
  reviews.push({ id: Date.now(), stallId: Number($('rStall').value), name, rating: pickedRating, text, date: new Date().toISOString().slice(0, 10) });
  saveToLocalStorage();
  $('reviewForm').reset();
  pickedRating = 0; drawStarPicker(); $('rError').textContent = '';
  refreshAll();
  showNotification('Thank you! Your review was added.');
}

// Shows an error under a form and in a toast
function fail(boxId, message) { $(boxId).textContent = message; showNotification(message, true); return false; }

/* ---------- 6. ADMIN ---------- */
function loginAdmin(e) {
  e.preventDefault();
  const u = $('uUser').value.trim(), p = $('uPass').value.trim();
  if (!u || !p) return fail('loginError', 'Enter both username and password.');
  if (u !== 'admin' || p !== 'admin123') return fail('loginError', 'Wrong username or password.');
  isAdmin = true; saveToLocalStorage();
  $('loginForm').reset(); $('loginError').textContent = '';
  showAdminArea(); showNotification('Welcome, admin!');
}
function logoutAdmin() { isAdmin = false; saveToLocalStorage(); showAdminArea(); showNotification('Logged out.'); }
function showAdminArea() { $('loginForm').hidden = isAdmin; $('dashboard').hidden = !isAdmin; if (isAdmin) renderDashboard(); }

// Fills statistics, category summary and both admin tables
function renderDashboard() {
  const open = stalls.filter(s => s.status === 'OPEN').length;
  const items = [[stalls.length, 'Total Stalls'], [reviews.length, 'Total Reviews'], [averageRating().toFixed(1) + ' ★', 'Average Rating'], [open, 'Open Stalls'], [stalls.length - open, 'Closed Stalls']];
  $('dashStats').innerHTML = items.map(i => '<div class="stat"><b>' + i[0] + '</b><span>' + i[1] + '</span></div>').join('');
  $('dashCats').innerHTML = CATEGORIES.map(c => '<span class="chip">' + ICONS[c] + ' ' + c + ': <b>' + stalls.filter(s => s.category === c).length + '</b></span>').join('');

  $('adminStalls').innerHTML = '<tr><th>Name</th><th>Category</th><th>Status</th><th>Actions</th></tr>' + stalls.map(s =>
    '<tr><td>' + esc(s.name) + '</td><td>' + s.category + '</td><td>' + badge(s) + '</td><td>' +
    '<button class="btn small ghost" onclick="editStall(' + s.id + ')">Edit</button>' +
    '<button class="btn small green" onclick="updateStallStatus(' + s.id + ')">Open/Close</button>' +
    '<button class="btn small" onclick="deleteStall(' + s.id + ')">Delete</button></td></tr>').join('');

  $('adminReviews').innerHTML = '<tr><th>Student</th><th>Stall</th><th>Rating</th><th>Review</th><th></th></tr>' + reviews.map(r =>
    '<tr><td>' + esc(r.name) + '</td><td>' + esc(stallName(r.stallId)) + '</td><td>' + r.rating + '★</td><td>' + esc(r.text) + '</td>' +
    '<td><button class="btn small" onclick="deleteReview(' + r.id + ')">Delete</button></td></tr>').join('');
}

// Reads the add/edit form, validates it, then adds a new stall or saves the edited one
function addStall(e) {
  e.preventDefault();
  const v = id => $(id).value.trim();
  if (!v('sName') || !v('sLocation') || !v('sDesc') || !v('sOpen') || !v('sClose') || !v('sImage') || !v('sDishes'))
    return fail('sError', 'Please fill in all fields.');
  if (!/^\d{10}$/.test(v('sPhone'))) return fail('sError', 'Contact number must be exactly 10 digits.');

  const dishes = v('sDishes').split(',').map(d => d.trim()).filter(Boolean);
  const data = { name: v('sName'), category: v('sCategory'), location: v('sLocation'), description: v('sDesc'),
                 openingTime: v('sOpen'), closingTime: v('sClose'), price: v('sPrice'), contact: v('sPhone'),
                 image: v('sImage'), popularDishes: dishes, status: v('sStatus') };

  if (v('sId')) {                                  // editing an existing stall
    const s = stalls.find(x => x.id === Number(v('sId')));
    Object.assign(s, data);
    showNotification('Stall updated.');
  } else {                                         // adding a new stall
    stalls.push({ id: Date.now(), menu: dishes.slice(), ...data });
    showNotification('Stall added successfully.');
  }
  saveToLocalStorage(); clearStallForm(); refreshAll();
}

// Copies a stall's details into the form so the admin can change them
function editStall(id) {
  const s = stalls.find(x => x.id === id);
  $('sId').value = s.id; $('sName').value = s.name; $('sCategory').value = s.category; $('sLocation').value = s.location;
  $('sDesc').value = s.description; $('sOpen').value = s.openingTime; $('sClose').value = s.closingTime; $('sPrice').value = s.price;
  $('sPhone').value = s.contact; $('sImage').value = s.image; $('sDishes').value = s.popularDishes.join(', '); $('sStatus').value = s.status;
  $('formTitle').textContent = 'Edit Food Stall'; $('sSubmit').textContent = 'Save Changes';
  $('stallForm').scrollIntoView({ behavior: 'smooth' });
}
function clearStallForm() {
  $('stallForm').reset(); $('sId').value = ''; $('sError').textContent = '';
  $('formTitle').textContent = 'Add Food Stall'; $('sSubmit').textContent = 'Add Stall';
}

function deleteStall(id) {
  if (!confirm('Are you sure you want to delete this food stall?')) return;
  stalls = stalls.filter(s => s.id !== id);
  reviews = reviews.filter(r => r.stallId !== id);   // remove its reviews too
  saveToLocalStorage(); refreshAll(); showNotification('Stall deleted.');
}
function updateStallStatus(id) {
  const s = stalls.find(x => x.id === id);
  s.status = s.status === 'OPEN' ? 'CLOSED' : 'OPEN';
  saveToLocalStorage(); refreshAll(); showNotification(s.name + ' is now ' + s.status + '.');
}
function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  reviews = reviews.filter(r => r.id !== id);
  saveToLocalStorage(); refreshAll(); showNotification('Review deleted.');
}

/* ---------- 7. START-UP ---------- */
// Redraw every part of the page that depends on the data
function refreshAll() {
  $('homeStats').innerHTML = statsHTML();
  const featured = [...stalls].sort((a, b) => ratingOf(b.id) - ratingOf(a.id)).slice(0, 3);
  $('featuredGrid').innerHTML = featured.map(cardHTML).join('');
  fillStallDropdowns(); renderCategories(); renderReviews(); searchStalls();
  if (isAdmin) renderDashboard();
}

function init() {
  loadFromLocalStorage();
  const options = list => list.map(c => '<option>' + c + '</option>').join('');
  $('fCategory').innerHTML = options(['All', ...CATEGORIES]);
  $('sCategory').innerHTML = options(CATEGORIES);

  // Connect events
  ['searchInput', 'fCategory', 'fRating', 'fStatus', 'fPrice'].forEach(id => $(id).addEventListener('input', searchStalls));
  $('heroSearch').addEventListener('input', e => { $('searchInput').value = e.target.value; searchStalls(); });
  $('reviewForm').addEventListener('submit', submitReview);
  $('loginForm').addEventListener('submit', loginAdmin);
  $('stallForm').addEventListener('submit', addStall);
  $('sCancel').addEventListener('click', clearStallForm);
  $('logoutBtn').addEventListener('click', logoutAdmin);
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  $('starPicker').addEventListener('click', e => { if (e.target.dataset.v) { pickedRating = Number(e.target.dataset.v); drawStarPicker(); } });
  // Hamburger menu
  $('menuBtn').addEventListener('click', () => $('navLinks').classList.toggle('open'));
  $('navLinks').addEventListener('click', () => $('navLinks').classList.remove('open'));

  drawStarPicker(); refreshAll(); showAdminArea();
}
document.addEventListener('DOMContentLoaded', init);
