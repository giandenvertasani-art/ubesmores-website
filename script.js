const orderForm = document.querySelector(".order-form");
// =========================
// UBE ASSISTANT CHATBOT
// =========================

const chatbotToggle =
    document.querySelector("#chatbot-toggle");

const chatbotWindow =
    document.querySelector("#chatbot-window");

const chatbotClose =
    document.querySelector("#chatbot-close");

const chatbotMessages =
    document.querySelector("#chatbot-messages");

const faqButtons =
    document.querySelectorAll(".faq-button");


const faqAnswers = {

    price:
        "Our UbeSmores Cookie is ₱89 each. 💜🍪",

    delivery:
        "Yes! We offer delivery. Choose Delivery in the order form and enter your delivery address.",

    order:
        "Click Order Now, fill out the order form, choose your quantity and order method, then submit your order.",

    advance:
        "Please place your order at least 1 day in advance so we have enough time to prepare your cookies.",

    pickup:
        "Yes! Pickup is available. Just choose Pickup under Order Method when placing your order."

};


chatbotToggle.addEventListener(
    "click",
    function () {

        chatbotWindow.classList.toggle("active");

    }
);


chatbotClose.addEventListener(
    "click",
    function () {

        chatbotWindow.classList.remove("active");

    }
);


faqButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const question =
                button.textContent.trim();

            const answerKey =
                button.dataset.question;


            const userMessage =
                document.createElement("div");

            userMessage.className =
                "user-message";

            userMessage.textContent =
                question;


            const botMessage =
                document.createElement("div");

            botMessage.className =
                "bot-message";

            botMessage.textContent =
                faqAnswers[answerKey];


            chatbotMessages.appendChild(
                userMessage
            );

            chatbotMessages.appendChild(
                botMessage
            );


            chatbotMessages.scrollTop =
                chatbotMessages.scrollHeight;

        }
    );

});
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


methodSelect.addEventListener(
    "change",
    updateAddressField
);


// =========================
// MINIMUM ORDER DATE
// =========================

function setMinimumDate() {

    const tomorrow = new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    const year =
        tomorrow.getFullYear();

    const month =
        String(tomorrow.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(tomorrow.getDate())
            .padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}


// =========================
// SUBMIT ORDER
// =========================

orderForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        successMessage.textContent = "";

        const selectedDate =
            dateInput.value;

        const minimumDate =
            dateInput.min;


        if (!selectedDate) {

            successMessage.textContent =
                "Please select your preferred order date.";

            return;
        }


        if (selectedDate < minimumDate) {

            successMessage.textContent =
                "Please select a date at least 1 day in advance.";

            return;
        }


        updateTotal();


        const formData =
            new FormData(orderForm);


        try {

            const response =
                await fetch(
                    orderForm.action,
                    {
                        method: "POST",

                        body: formData,

                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


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

    }
);


// =========================
// RUN WHEN PAGE LOADS
// =========================

updateTotal();
updateAddressField();
setMinimumDate();
