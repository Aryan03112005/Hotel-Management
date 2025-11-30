document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables and Constants ---
    const roomCards = document.querySelectorAll('.room-card');
    const grandTotalElement = document.getElementById('grandTotalValue');
    const summaryTaxesElement = document.querySelector('.summary-taxes .summary-price');
    const summaryChargesElement = document.querySelector('.total-charges .summary-price');
    const nightsLabel = document.querySelector('.nights-label');
    const btnConfirmReservation = document.querySelector('.btn-confirm-reservation'); // NEW: Get the Confirm button

    // --- Price and Tax Configuration ---
    const TAX_RATE = 0.18; // 18% GST/Taxes (Example Rate)

    // --- Date and Nights Calculation ---
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    const numNightsInput = document.getElementById('numNights');
    const summaryCheckIn = document.getElementById('summaryCheckIn');
    const summaryCheckOut = document.getElementById('summaryCheckOut');

    // flatpickr initialization (Kept original logic)
    let checkInDate = flatpickr(checkInInput, {
        dateFormat: "d M, Y",
        defaultDate: new Date(),
        onChange: (selectedDates) => {
            updateDates(selectedDates[0], checkOutDate.selectedDates[0]);
        }
    });

    let checkOutDate = flatpickr(checkOutInput, {
        dateFormat: "d M, Y",
        defaultDate: new Date().fp_incr(1), // Default +1 day
        minDate: new Date().fp_incr(1),
        onChange: (selectedDates) => {
            updateDates(checkInDate.selectedDates[0], selectedDates[0]);
        }
    });

    // Function to calculate and display nights (Kept original logic)
    function updateDates(inDate, outDate) {
        if (!inDate || !outDate) return;

        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        numNightsInput.value = `${diffDays} night${diffDays !== 1 ? 's' : ''}`;
        nightsLabel.textContent = `${diffDays} night${diffDays !== 1 ? 's' : ''}`;

        // Update summary display dates
        summaryCheckIn.firstChild.textContent = checkInDate.formatDate(inDate, "d M, Y");
        summaryCheckOut.textContent = checkInDate.formatDate(outDate, "d M, Y");
        
        updateTotal();
    }
    
    // Initial call to set defaults
    updateDates(checkInDate.selectedDates[0], checkOutDate.selectedDates[0]);


    // --- Price and Quantity Control ---

    function calculateTotal() {
        let subtotal = 0;
        const nights = parseInt(nightsLabel.textContent);

        roomCards.forEach(card => {
            const priceElement = card.querySelector('.price-value');
            const qtyInput = card.querySelector('.room-qty');

            // Get per night price (remove commas) and quantity
            const pricePerNight = parseFloat(priceElement.textContent.replace(/,/g, ''));
            const quantity = parseInt(qtyInput.value);

            if (quantity > 0) {
                subtotal += (pricePerNight * quantity);
            }
        });
        
        const totalCharges = subtotal * nights;
        const totalTaxes = totalCharges * TAX_RATE;
        const grandTotal = totalCharges + totalTaxes;

        // Display results
        summaryChargesElement.textContent = `INR ${totalCharges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        summaryTaxesElement.textContent = `INR ${totalTaxes.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        grandTotalElement.textContent = grandTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateTotal() {
        // Debounce update to prevent lag on rapid clicks/changes
        clearTimeout(window.updateTimer);
        window.updateTimer = setTimeout(calculateTotal, 100);
    }

    // Add event listeners for room quantity buttons
    roomCards.forEach(card => {
        const minusButton = card.querySelector('.qty-minus');
        const plusButton = card.querySelector('.qty-plus');
        const qtyInput = card.querySelector('.room-qty');
        const mealSelect = card.querySelector('.room-selectors select');

        minusButton.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 0) {
                qtyInput.value = currentQty - 1;
                updateTotal();
            }
        });

        plusButton.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value);
            // Limit rooms to 5 per type (arbitrary limit for example)
            if (currentQty < 5) {
                qtyInput.value = currentQty + 1;
                updateTotal();
            }
        });
        
        // Add event listener for meal plan change (though not included in total calculation here)
        mealSelect.addEventListener('change', updateTotal); 
    });

    // Initial calculation on load
    updateTotal();
    
    // ------------------------------------------------------------------
    // 🎯 NEW: CONFIRM & CONTINUE Logic
    // ------------------------------------------------------------------
    
    btnConfirmReservation.addEventListener('click', () => {
    const grandTotalText = grandTotalElement.textContent; // e.g., "5,920.00"

    // Basic check to ensure at least one room is selected
    if (parseFloat(grandTotalText.replace(/,/g, '')) <= 0) {
        alert("Please select at least one room to proceed with the booking.");
        return;
    }

    // Pass the grand total to the payment page via URL parameter
    window.location.href = `payment.html?total=${grandTotalText}`;
});
    
});