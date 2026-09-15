/* =========================
   ENHANCED BUS BOOKING + FOOD ZONE SYSTEM
   Bus booking + Food cart with localStorage
========================= */

/* BUS BOOKING */
const buses = [
    { 
        booked: [2,5,7,10,15],
        name: 'Volvo AC Semi-Sleeper',
        time: '10:00 AM',
        price: 800
    },
    { 
        booked: [1,3,8,12,20,25],
        name: 'AC Sleeper',
        time: '08:00 PM',
        price: 1200
    },
    { 
        booked: [4,6,9],
        name: 'Non-AC Seater',
        time: '06:00 AM',
        price: 500
    }
];

let currentBus = null;
let selectedSeats = [];
let currentPricePerSeat = 0;

/* FOOD ZONE */
const foods = [
    { name: '🍛 Chicken Biryani', desc: 'Spicy basmati rice with chicken', price: 250, time: '10min' },
    { name: '🍕 Margherita Pizza', desc: 'Fresh cheese & tomato pizza', price: 350, time: '15min' },
    { name: '🥪 Club Sandwich', desc: 'Grilled chicken & veggies', price: 150, time: '5min' },
    { name: '🥤 Fresh Juice', desc: 'Orange & carrot mix', price: 80, time: '2min' },
    { name: '🍦 Ice Cream', desc: 'Vanilla with toppings', price: 100, time: '1min' },
    { name: '🥗 Salad Bowl', desc: 'Fresh veggies & grilled paneer', price: 200, time: '8min' }
];

let foodCart = JSON.parse(localStorage.getItem('foodCart')) || [];

window.foods = foods; // Global access
window.foodCart = foodCart;

// DOM Elements
const modal = document.getElementById("bookingModal");
const seatGrid = document.getElementById("seatGrid");
const confirmBtn = document.getElementById("confirmBooking");
const closeBtn = document.getElementById("closeModal");
const successPopup = document.getElementById("successPopup");
const selectedCountEl = document.getElementById("selectedCount");
const totalPriceEl = document.getElementById("totalPrice");

// Initialize UI on load
document.addEventListener('DOMContentLoaded', updateUI);

document.querySelectorAll(".book-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        currentBus = buses[index];
        currentPricePerSeat = currentBus.price;
        openModal();
    });
});

function openModal(){
    modal.style.display = "flex";
    seatGrid.innerHTML = "";
    selectedSeats = [];
    updateSeatInfo();

    for(let i=1; i<=40; i++){
        const seat = document.createElement("button");
        seat.innerText = i;
        seat.className = "seat";

        if(currentBus.booked.includes(i)){
            seat.classList.add("booked");
            seat.disabled = true;
        } else {
            seat.classList.add("available");
            seat.onclick = () => toggleSeat(i, seat);
        }

        seatGrid.appendChild(seat);
    }
}

function toggleSeat(seatNum, seatEl) {
    seatEl.classList.toggle("selected");

    if(selectedSeats.includes(seatNum)){
        selectedSeats = selectedSeats.filter(s => s !== seatNum);
    } else {
        selectedSeats.push(seatNum);
    }
    
    updateSeatInfo();
}

function updateSeatInfo() {
    selectedCountEl.textContent = selectedSeats.length;
    totalPriceEl.textContent = selectedSeats.length * currentPricePerSeat;
}

confirmBtn.addEventListener("click", () => {
    if(selectedSeats.length === 0){
        alert("⚠️ Please select at least 1 seat");
        return;
    }

    confirmBtn.innerText = "Processing...";
    confirmBtn.disabled = true;

    setTimeout(() => {
        // Save booking data for booking.html
        sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        sessionStorage.setItem('busDetails', JSON.stringify({
            name: currentBus.name,
            seats: selectedSeats.join(', '),
            price: currentPricePerSeat,
            total: selectedSeats.length * currentPricePerSeat
        }));

        currentBus.booked.push(...selectedSeats);
        closeModal();
        updateUI();
        showSuccess();
        
        // Redirect to booking confirmation after success
        setTimeout(() => {
            window.location.href = 'booking.html';
        }, 2000);
    }, 1500);
});

closeBtn.addEventListener("click", closeModal);

function closeModal(){
    modal.style.display = "none";
    confirmBtn.innerText = "Confirm Booking";
    confirmBtn.disabled = false;
}

function updateUI(){
    const cards = document.querySelectorAll(".bus-card");
    cards.forEach((card, index) => {
        const booked = buses[index].booked.length;
        const available = 40 - booked;
        
        const bookedEl = card.querySelector(`#booked-${index}`);
        const availableEl = card.querySelector(`#available-${index}`);
        
        if(bookedEl) bookedEl.textContent = booked;
        if(availableEl) availableEl.textContent = available;
    });
}

function showSuccess(){
    successPopup.style.display = "flex";
}

function closeSuccess(){
    successPopup.style.display = "none";
}

// Expose for booking.html
window.closeSuccess = closeSuccess;

// Food cart functions
function addToFoodCart(index, qty = 1) {
    const item = { ...foods[index], qty, id: Date.now() };
    foodCart.push(item);
    localStorage.setItem('foodCart', JSON.stringify(foodCart));
    updateFoodCartUI();
}

function removeFromCart(id) {
    foodCart = foodCart.filter(item => item.id !== id);
    localStorage.setItem('foodCart', JSON.stringify(foodCart));
    updateFoodCartUI();
}

function updateFoodCartUI() {
    const count = foodCart.reduce((sum, item) => sum + item.qty, 0);
    const total = foodCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartTotalEl) cartTotalEl.textContent = total;
    
    const modalCartTotal = document.getElementById('modalCartTotal');
    if (modalCartTotal) modalCartTotal.textContent = total;
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (foodCart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
    } else {
        foodCart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee;';
            div.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x <input type="number" value="${item.qty}" min="1" onchange="updateQty(${item.id}, this.value)" style="width: 50px;"></p>
                </div>
                <div>
                    <strong>₹${item.price * item.qty}</strong>
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #f44336; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
                </div>
            `;
            cartItems.appendChild(div);
        });
    }
    
    modal.style.display = 'flex';
    updateFoodCartUI();
}

function updateQty(id, newQty) {
    foodCart = foodCart.map(item => item.id == id ? { ...item, qty: parseInt(newQty) } : item);
    localStorage.setItem('foodCart', JSON.stringify(foodCart));
    updateFoodCartUI();
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function confirmFoodOrder() {
    if (foodCart.length > 0) {
        foodCart = [];
        localStorage.setItem('foodCart', '[]');
        closeCartModal();
        document.getElementById('foodSuccess').style.display = 'flex';
        updateFoodCartUI();
    }
}

function closeFoodSuccess() {
    document.getElementById('foodSuccess').style.display = 'none';
}

// Event listeners for cart modal
document.addEventListener('click', function(e) {
    if (e.target.id === 'closeCartModal') closeCartModal();
    if (e.target.id === 'confirmOrder') confirmFoodOrder();
});

// Init food cart on load
document.addEventListener('DOMContentLoaded', function() {
    updateFoodCartUI();
    
    // Add to cart buttons
    document.querySelectorAll('.add-cart-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => addToFoodCart(index));
    });
    
    // View cart button
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) viewCartBtn.addEventListener('click', openCartModal);
});

// Smooth animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        80% { transform: translateY(-5px); }
    }
    .success-popup, #foodSuccess {
        animation: bounce 0.6s;
    }
    .cart-item input { border: 1px solid #ddd; border-radius: 4px; text-align: center; }
`;
document.head.appendChild(style);

// Expose functions globally
window.addToFoodCart = addToFoodCart;
window.removeFromCart = removeFromCart;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.confirmFoodOrder = confirmFoodOrder;
window.closeFoodSuccess = closeFoodSuccess;
window.updateFoodCartUI = updateFoodCartUI;
