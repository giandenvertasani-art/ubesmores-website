const orderForm = document.querySelector(".order-form");
const successMessage = document.querySelector("#success-message");

const quantityInput = document.querySelector("#quantity");
const totalPrice = document.querySelector("#total-price");
const totalInput = document.querySelector("#total-input");

const methodSelect = document.querySelector("#method");
const addressGroup = document.querySelector("#address-group");
const addressInput = document.querySelector("#address");

const dateInput = document.querySelector("#date");

const cookiePrice = 89;


// =========================
// TOTAL PRICE
// =========================

function updateTotal() {
    let quantity = Number(quantityInput.value);

    if (quantity < 1) {
        quantity = 1;
        quantityInput.value = 1;
    }

    const total = quantity * cookiePrice;

    totalPrice.textContent = total;
    totalInput.value = "₱" + total;
}

quantityInput.addEventListener("input", updateTotal);


// =========================
// PICKUP / DELIVERY
// =========================

function updateAddressField() {
    if (methodSelect.value === "Delivery") {

        addressGroup.style.display = "block";
        addressInput.required = true;

    } else {

        addressGroup.style.display = "none";
        addressInput.required = false;
        addressInput.value = "";
    }
}

methodSelect.addEventListener("change", updateAddressField);


// =========================
// MINIMUM ORDER DATE
// =========================

function setMinimumDate() {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    const minimumDate = `${year}-${month}-${day}`;

    dateInput.min = minimumDate;
}


// =========================
// SUBMIT ORDER
// =========================

orderForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const selectedDate = dateInput.value;

    if (!selectedDate) {
        successMessage.textContent =
            "Please select your preferred order date.";

        return;
    }

    const minimumDate = dateInput.min;

    if (selectedDate < minimumDate) {
        successMessage.textContent =
            "Please select a date at least 1 day in advance.";

        return;
    }

    updateTotal();

    const formData = new FormData(orderForm);

    try {

        const response = await fetch(orderForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {

            successMessage.textContent =
                "Order submitted successfully! 💜🍪 We’ll contact you shortly to confirm your order.";

            orderForm.reset();

            quantityInput.value = 1;

            updateTotal();
            updateAddressField();
            setMinimumDate();

        } else {

            successMessage.textContent =
                "Something went wrong. Please try again.";
        }

    } catch (error) {

        successMessage.textContent =
            "Unable to submit your order. Please check your internet connection and try again.";
    }
});


// =========================
// RUN WHEN PAGE LOADS
// =========================

updateTotal();
updateAddressField();
setMinimumDate();