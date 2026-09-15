// Data storage
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Utility functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'rooms') displayRooms();
    if (sectionId === 'bookings') {
        updateAvailableRooms();
    }
    if (sectionId === 'admin') updateAdminDashboard();
    if (sectionId === 'reports') displayReports();
}

function showAddRoomForm() {
    document.getElementById('addRoomForm').style.display = 'block';
}

function hideAddRoomForm() {
    document.getElementById('addRoomForm').style.display = 'none';
}

// Room Management
function addRoom(event) {
    event.preventDefault();
    const number = document.getElementById('roomNumber').value;
    const type = document.getElementById('roomType').value;
    const price = parseFloat(document.getElementById('roomPrice').value);
    const amenities = document.getElementById('roomAmenities').value;

    const defaultImages = {
        'Deluxe Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'Honeymoon Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'Normal Room': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };
    const image = defaultImages[type];

    rooms.push({ number, type, price, amenities, image, status: 'available' });
    localStorage.setItem('rooms', JSON.stringify(rooms));
    hideAddRoomForm();
    displayRooms();
    updateAdminDashboard();
}

function displayRooms() {
    const roomSections = document.getElementById('roomSections');
    roomSections.innerHTML = '';

    const roomTypes = ['Deluxe Room', 'Honeymoon Suite', 'Normal Room'];

    roomTypes.forEach(type => {
        const section = document.createElement('div');
        section.className = 'room-type-section';
        section.innerHTML = `<h3>${type}s</h3><div class="room-grid" id="grid-${type.replace(' ', '-')}"></div>`;
        roomSections.appendChild(section);

        const grid = document.getElementById(`grid-${type.replace(' ', '-')}`);
        const typeRooms = rooms.filter(room => room.type === type);

        typeRooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <img src="${room.image}" alt="${room.type}">
                <div class="content">
                    <h4>${room.number}</h4>
                    <p class="price">$${room.price}/night</p>
                    <p>${room.amenities}</p>
                    <p>Status: ${room.status}</p>
                </div>
            `;
            grid.appendChild(roomCard);
        });
    });
}

// Search and filter - removed

// Booking Management
function updateAvailableRooms() {
    const roomType = document.getElementById('bookingRoomType').value;
    const availableRoomsSelect = document.getElementById('availableRoomsSelect');
    availableRoomsSelect.innerHTML = '<option value="">Select Room</option>';

    if (!roomType) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Choose room type first';
        availableRoomsSelect.appendChild(emptyOption);
        return;
    }

    const availableRooms = rooms.filter(room => room.type === roomType && room.status === 'available');
    if (availableRooms.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'No available rooms for this type';
        availableRoomsSelect.appendChild(emptyOption);
        return;
    }

    availableRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.number;
        option.textContent = `Room ${room.number} - $${room.price}/night`;
        availableRoomsSelect.appendChild(option);
    });
}

function saveAdminWhatsApp() {
    const num = document.getElementById('adminWhatsAppNumber').value.trim();
    if (!num) {
        document.getElementById('adminWhatsAppStatus').textContent = 'Please enter a valid number.';
        document.getElementById('adminWhatsAppStatus').style.color = '#e74c3c';
        return;
    }
    localStorage.setItem('adminWhatsAppNumber', num);
    document.getElementById('adminWhatsAppStatus').textContent = 'Number saved successfully!';
    document.getElementById('adminWhatsAppStatus').style.color = '#27ae60';
}

function loadAdminWhatsApp() {
    const saved = localStorage.getItem('adminWhatsAppNumber');
    if (saved) {
        document.getElementById('adminWhatsAppNumber').value = saved;
    }
}

function sendOwnerWhatsApp(booking) {
    const ownerNumber = '7985122529';  // Hardcoded owner WhatsApp number (Alakshendra ji)
    if (!ownerNumber) return;

    const message = `🏨 New Booking Alert!\n\n` +
        `Guest: ${booking.guestName}\n` +
        `Email: ${booking.guestEmail}\n` +
        `Phone: ${booking.guestPhone}\n` +
        `Room: ${booking.roomNumber}\n` +
        `Check-in: ${new Date(booking.checkIn).toLocaleDateString()}\n` +
        `Check-out: ${new Date(booking.checkOut).toLocaleDateString()}\n` +
        `Guests: ${booking.numGuests}\n` +
        `Total: $${booking.totalPrice}\n\n` +
        `Booking ID: ${booking.id}`;

    // Check if running via server (localhost) or fix file:// CORS
    if (window.location.protocol === 'file:') {
        console.log('📱 FILE MODE DEMO - WhatsApp to', ownerNumber);
        console.log('Message:', message);
        console.log('---');
        console.log('Run via http://localhost:3000/index.html for full API!');
    } else {
        fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: ownerNumber, message })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                console.log('Owner notification sent:', data.demo ? '(demo mode)' : '(via Twilio)');
            } else {
                console.error('Owner notification failed:', data.error);
            }
        })
        .catch(err => console.error('Owner notification error:', err));
    }
}

function createBooking(event) {
    event.preventDefault();
    const guestName = document.getElementById('guestName').value.trim();
    const guestEmail = document.getElementById('guestEmail').value.trim();
    const guestPhone = document.getElementById('guestPhone').value.trim();
    const whatsappNumber = document.getElementById('whatsappNumber').value.trim();
    const roomNumber = document.getElementById('availableRoomsSelect').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const numGuests = parseInt(document.getElementById('numGuests').value, 10);

    if (!roomNumber) {
        alert('Please select an available room before booking.');
        return;
    }

    const room = rooms.find(r => r.number === roomNumber);
    if (!room) {
        alert('Selected room not found. Please choose another room.');
        updateAvailableRooms();
        return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
        alert('Please select valid check-in and check-out dates.');
        return;
    }

    const totalPrice = room.price * nights;

    const booking = {
        id: Date.now(),
        guestName,
        guestEmail,
        guestPhone,
        whatsappNumber,
        roomNumber,
        checkIn,
        checkOut,
        numGuests,
        totalPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Update room status
    room.status = 'occupied';
    localStorage.setItem('rooms', JSON.stringify(rooms));

    // Prepare receipt data and show directly
    window.currentBooking = booking;
    showReceipt();

    // Show/hide WhatsApp button based on whether number is provided
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappNumber) {
        whatsappBtn.style.display = 'inline-block';
    } else {
        whatsappBtn.style.display = 'none';
    }

    // Auto-send WhatsApp notification to owner
    sendOwnerWhatsApp(booking);

    // Reset form and refresh room selection
    event.target.reset();
    document.getElementById('availableRoomsSelect').innerHTML = '<option value="">Select Room</option>';
    updateAdminDashboard();
    displayRooms();
}

function showReceipt() {
    const booking = window.currentBooking;
    if (!booking) return;

    const receiptDetails = document.getElementById('receiptDetails');
    receiptDetails.innerHTML = `
        <div class="receipt-row">
            <span class="label">Booking ID:</span>
            <span class="value">${booking.id}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Guest Name:</span>
            <span class="value">${booking.guestName}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Email:</span>
            <span class="value">${booking.guestEmail}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Phone:</span>
            <span class="value">${booking.guestPhone}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Room Number:</span>
            <span class="value">${booking.roomNumber}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Room Type:</span>
            <span class="value">${rooms.find(r => r.number === booking.roomNumber)?.type || 'N/A'}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Check-in Date:</span>
            <span class="value">${booking.checkIn}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Check-out Date:</span>
            <span class="value">${booking.checkOut}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Number of Guests:</span>
            <span class="value">${booking.numGuests}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Number of Nights:</span>
            <span class="value">${Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}</span>
        </div>
        <div class="receipt-row total">
            <span class="label">Total Amount:</span>
            <span class="value">$${booking.totalPrice}</span>
        </div>
        <div class="receipt-row">
            <span class="label">Booking Date:</span>
            <span class="value">${new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
    `;

    document.getElementById('receiptModal').style.display = 'block';
}

function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
}

function sendWhatsApp() {
    if (!window.currentBooking) {
        alert('No booking found. Please complete a booking first.');
        return;
    }

    const booking = window.currentBooking;
    const whatsappNumber = booking.whatsappNumber;

    if (!whatsappNumber) {
        alert('Please enter a WhatsApp number to send confirmation.');
        return;
    }

    const message = `🎉 Your Booking is Confirmed! 🎉\n\n` +
        `Booking ID: ${booking.id}\n` +
        `Guest Name: ${booking.guestName}\n` +
        `Room Number: ${booking.roomNumber}\n` +
        `Check-in: ${new Date(booking.checkIn).toLocaleDateString()}\n` +
        `Check-out: ${new Date(booking.checkOut).toLocaleDateString()}\n` +
        `Total Amount: $${booking.totalPrice}\n` +
        `Number of Guests: ${booking.numGuests}\n\n` +
        `Thank you for choosing our hotel! 🏨\n` +
        `We look forward to your stay.`;

    fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: whatsappNumber,
            message
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('WhatsApp confirmation भेज दी गयी है!');
            } else {
                throw new Error(data.error || 'Unable to send WhatsApp message.');
            }
        })
        .catch(err => {
            console.error('WhatsApp send error:', err);
            alert('WhatsApp भेजने में समस्या आई। कृपया backend server चलाएं और फिर से प्रयास करें.');
        });
}

function printInvoice() {
    if (!window.currentBooking) {
        alert('No booking found.');
        return;
    }
    window.print();
}

// Admin Dashboard
function updateAdminDashboard() {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupiedRooms = totalRooms - availableRooms;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    document.getElementById('totalRooms').textContent = totalRooms;
    document.getElementById('availableRooms').textContent = availableRooms;
    document.getElementById('occupiedRooms').textContent = occupiedRooms;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;

    // Recent bookings
    const recentBookingsDiv = document.getElementById('recentBookings');
    recentBookingsDiv.innerHTML = '<h4>Recent Bookings</h4>';
    const recentBookings = bookings.slice(-5).reverse();
    recentBookings.forEach(booking => {
        const div = document.createElement('div');
        div.className = 'booking-item';
        div.innerHTML = `
            <strong>${booking.guestName}</strong> - Room ${booking.roomNumber}<br>
            ${booking.checkIn} to ${booking.checkOut} - $${booking.totalPrice}
        `;
        recentBookingsDiv.appendChild(div);
    });

    // Current guests
    const currentGuestsDiv = document.getElementById('currentGuests');
    currentGuestsDiv.innerHTML = '<h4>Current Guests</h4>';
    const currentDate = new Date().toISOString().split('T')[0];
    const currentGuests = bookings.filter(b =>
        b.status === 'confirmed' && b.checkIn <= currentDate && b.checkOut >= currentDate
    );
    currentGuests.forEach(guest => {
        const div = document.createElement('div');
        div.className = 'guest-item';
        div.innerHTML = `
            <strong>${guest.guestName}</strong> - Room ${guest.roomNumber}<br>
            Check-out: ${guest.checkOut}
        `;
        currentGuestsDiv.appendChild(div);
    });
}

// Reports
function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    const filteredBookings = bookings.filter(b => b.createdAt >= startDate && b.createdAt <= endDate + 'T23:59:59');

    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const reportResults = document.getElementById('reportResults');
    reportResults.innerHTML = `
        <h3>Report Results (${startDate} to ${endDate})</h3>
        <p><strong>Total Bookings:</strong> ${totalBookings}</p>
        <p><strong>Total Revenue:</strong> $${totalRevenue}</p>
        <p><strong>Average Booking Value:</strong> $${avgBookingValue.toFixed(2)}</p>
        <h4>Booking Details:</h4>
        <ul>
            ${filteredBookings.map(b => `<li>${b.guestName} - $${b.totalPrice} (${b.checkIn} to ${b.checkOut})</li>`).join('')}
        </ul>
    `;
}

function displayReports() {
    // Set default dates to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('reportStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('reportEndDate').value = endDate.toISOString().split('T')[0];

    generateReport();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Clear existing data and add fresh sample rooms
    rooms = [];
    bookings = [];
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('bookings', JSON.stringify(bookings));

    const roomTypes = ['Deluxe Room', 'Honeymoon Suite', 'Normal Room'];
    const prices = { 'Deluxe Room': 200, 'Honeymoon Suite': 350, 'Normal Room': 100 };
    const amenities = { 
        'Deluxe Room': 'Mini-bar, City View, Balcony, Room Service', 
        'Honeymoon Suite': 'Jacuzzi, Champagne, Heart-shaped Bed, Private Terrace, Breakfast Included', 
        'Normal Room': 'TV, Basic Amenities, Clean Linens' 
    };
    const images = {
        'Deluxe Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'Honeymoon Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'Normal Room': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };

    roomTypes.forEach(type => {
        for (let i = 1; i <= 167; i++) {  // Add 167 of each type for total 501 rooms
            const roomNumber = `${type.split(' ')[0]}${i}`;
            rooms.push({
                number: roomNumber,
                type: type,
                price: prices[type],
                amenities: amenities[type],
                image: images[type],
                status: 'available'
            });
        }
    });
    localStorage.setItem('rooms', JSON.stringify(rooms));

    showSection('home');
    displayRooms();
    updateAdminDashboard();
    loadAdminWhatsApp();
});
