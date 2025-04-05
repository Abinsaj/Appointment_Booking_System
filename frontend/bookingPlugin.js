(function () {
  const container = document.getElementById('booking-plugin');

  const style = document.createElement('style');
  style.innerHTML = `
    #booking-plugin { display: flex; justify-content: center; align-items: center; gap: 20px; font-family: Arial; padding: 20px; border: 1px solid #ccc; border-radius: 10px; max-width: 800px; margin: auto;}
    .left-section, .right-section { flex: 1; }
    .center-section { flex: 2; text-align: center; }
    .slot-item { margin: 8px 0; padding: 8px; border: 1px solid #aaa; border-radius: 5px; cursor: pointer; }
    .slot-item:hover { background-color: #f0f0f0; }
    .selected { background-color: #d3eaff; }
    .form-group { margin: 10px 0; }
    button { padding: 8px 12px; border: none; background-color: #4CAF50; color: white; cursor: pointer; border-radius: 5px; }
    #message { color: red; font-weight: bold; margin-top: 10px; min-height: 20px; }
    #message.success { color: green; }
  `;
  document.head.appendChild(style);

  let selectedSlot = null;
  let allSlots = [];

  container.innerHTML = `
    <div class="left-section">
      <h3>Select a Date</h3>
      <div class="form-group">
        <input type="date" id="date-picker" min="${new Date().toISOString().split('T')[0]}" />
      </div>
    </div>
    <div class="center-section">
      <h4>Available Slots</h4>
      <div id="slots-list">Select a date to load slots.</div>
    </div>
    <div class="right-section">
      <div id="booking-form" style="display:none;">
        <h4>Enter Your Details</h4>
        <div class="form-group">
          <input type="text" id="name" placeholder="Your Name" required />
        </div>
        <div class="form-group">
          <input type="tel" id="phone" placeholder="Your Phone" required />
        </div>
        <button id="submit-booking">Book Now</button>
        <div id="message"></div>
      </div>
    </div>
  `;

  const slotsList = document.getElementById('slots-list');
  const bookingForm = document.getElementById('booking-form');
  const messageDiv = document.getElementById('message');
  const datePicker = document.getElementById('date-picker');

  function generateTimeSlots(date) {
    const start = 10;
    const end = 17;
    const slots = [];

    for (let hour = start; hour < end; hour++) {
      if (hour === 13) continue;
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots.map(time => ({ date, time }));
  }

  async function renderSlots(date) {
    if (!date) return;
    allSlots = generateTimeSlots(date);
    slotsList.innerHTML = 'Loading booked slots...';

    let booked = [];
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${date}`);
      booked = await res.json();
    } catch (e) {
      console.error('Error fetching booked slots:', e);
    }

    const bookedSlots = booked.map(b => b.slot.time);
    slotsList.innerHTML = '';

    allSlots.forEach(slot => {
      const div = document.createElement('div');
      div.className = 'slot-item';
      div.textContent = `${slot.date} at ${slot.time}`;
      const isBooked = bookedSlots.includes(slot.time);

      if (isBooked) {
        div.style.backgroundColor = '#ddd';
        div.style.pointerEvents = 'none';
        div.textContent += ' (Booked)';
      } else {
        div.onclick = () => selectSlot(slot, div);
      }

      slotsList.appendChild(div);
    });
  }

  function showToast(message, type = 'success') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: type,           
      title: message,
      showConfirmButton: false,
      timer: 3000,          
      timerProgressBar: true,
    });
  }
  

  function selectSlot(slot, element) {
    selectedSlot = slot;
    bookingForm.style.display = 'block';
    messageDiv.textContent = '';
    messageDiv.className = '';

    document.querySelectorAll('.slot-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
  }

  document.getElementById('submit-booking').onclick = async () => {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!/^[A-Z][a-zA-Z\s]{1,}$/.test(name)) {
      showMessage('Name must start with a capital letter and contain only letters.');
      return;
    }
  

    const invalidPhones = ['0000000000', '1234567890'];
    const repeatedDigit = /^(\d)\1{9}$/;
  
    if (!/^\d{10}$/.test(phone)) {
      showMessage('Phone number must be exactly 10 digits.');
      return;
    }
  
    if (invalidPhones.includes(phone) || repeatedDigit.test(phone)) {
      showMessage('Invalid phone number. Please enter a valid one.');
      return;
    }
  
    if (!selectedSlot) {
      showMessage('Please select a time slot.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, slot: selectedSlot })
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, true);
        resetForm();
      } else {
        showMessage(data.message || 'Booking failed');
      }
    } catch (err) {
      showMessage('Error booking slot.');
    }
  };

  function showMessage(msg, isSuccess = false) {
    messageDiv.textContent = msg;
    messageDiv.className = isSuccess ? 'success' : '';
  }

  function resetForm() {
    bookingForm.style.display = 'none';
    selectedSlot = null;
    datePicker.value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    slotsList.innerHTML = 'Select a date to load slots.';
  }

  datePicker.onchange = (e) => {
    const date = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      showMessage('Cannot select a past date.');
      return;
    }

    showMessage('');
    renderSlots(date);
  };
})();
