document.addEventListener("DOMContentLoaded", function () {
  /* ========================================
     MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll("#navMenu a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ========================================
     SCROLL ANIMATIONS
  ======================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  /*
   * Show the first section immediately.
   * This prevents the hero text and image from staying hidden.
   */

  document
    .querySelectorAll(".hero .reveal")
    .forEach(function (element) {
      element.classList.add("visible");
    });


  /* ========================================
     CURRENT YEAR
  ======================================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ========================================
     ORDER FORM ELEMENTS
  ======================================== */

  const orderForm = document.getElementById("orderForm");
  const quantityInput = document.getElementById("quantity");
  const totalPrice = document.getElementById("total-price");
  const totalInput = document.getElementById("total-input");
  const orderMethod = document.getElementById("method");
  const addressGroup = document.getElementById("address-group");
  const addressInput = document.getElementById("address");
  const dateInput = document.getElementById("date");
  const successMessage = document.getElementById("success-message");

  const COOKIE_PRICE = 89;


  /* ========================================
     AUTOMATIC TOTAL
  ======================================== */

  function updateTotal() {
    if (!quantityInput || !totalPrice || !totalInput) {
      return;
    }

    let quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
      quantity = 1;
      quantityInput.value = "1";
    }

    const total = quantity * COOKIE_PRICE;

    totalPrice.textContent = total.toLocaleString("en-PH");
    totalInput.value = "₱" + total.toLocaleString("en-PH");
  }

  if (quantityInput) {
    quantityInput.addEventListener("input", updateTotal);
    quantityInput.addEventListener("change", updateTotal);

    updateTotal();
  }


  /* ========================================
     PICKUP OR DELIVERY
  ======================================== */

  function updateOrderMethod() {
    if (!orderMethod || !addressGroup || !addressInput) {
      return;
    }

    const isDelivery = orderMethod.value === "Delivery";

    addressGroup.classList.toggle("show", isDelivery);
    addressInput.required = isDelivery;

    if (!isDelivery) {
      addressInput.value = "";
    }
  }

  if (orderMethod) {
    orderMethod.addEventListener("change", updateOrderMethod);

    updateOrderMethod();
  }


  /* ========================================
     SMART PREFERRED DATE
  ======================================== */

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function setMinimumOrderDate() {
    if (!dateInput) {
      return;
    }

    /*
     * Earliest order date is tomorrow.
     * This automatically prevents customers from choosing
     * today or a past date.
     */

    const minimumDate = new Date();

    minimumDate.setHours(0, 0, 0, 0);
    minimumDate.setDate(minimumDate.getDate() + 1);

    const minimumDateValue =
      formatDateForInput(minimumDate);

    dateInput.min = minimumDateValue;

    if (
      dateInput.value &&
      dateInput.value < minimumDateValue
    ) {
      dateInput.value = minimumDateValue;
    }
  }

  setMinimumOrderDate();

  if (dateInput) {
    dateInput.addEventListener("change", function () {
      if (
        dateInput.min &&
        dateInput.value < dateInput.min
      ) {
        dateInput.value = "";

        dateInput.setCustomValidity(
          "Please select tomorrow or a later date."
        );

        dateInput.reportValidity();
      } else {
        dateInput.setCustomValidity("");
      }
    });
  }


  /* ========================================
     FORMSPREE ORDER SUBMISSION
  ======================================== */

  if (orderForm) {
    orderForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton =
        orderForm.querySelector('button[type="submit"]');

      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      if (successMessage) {
        successMessage.textContent =
          "Submitting your order...";

        successMessage.classList.remove("error");
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          "Submitting order...";
      }

      try {
        const formData = new FormData(orderForm);

        const response = await fetch(orderForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Form submission failed.");
        }

        if (successMessage) {
          successMessage.textContent =
            "Thank you! Your UbeSmores Cookie order was submitted successfully. 💜";
        }

        orderForm.reset();

        updateTotal();
        updateOrderMethod();
        setMinimumOrderDate();
      } catch (error) {
        if (successMessage) {
          successMessage.textContent =
            "Sorry, your order could not be submitted. Please check your internet connection and try again.";

          successMessage.classList.add("error");
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML =
            "Submit Order <span>→</span>";
        }
      }
    });
  }


  /* ========================================
     CHATBOT ELEMENTS
  ======================================== */

  const chatbot = document.getElementById("chatbot");
  const chatLauncher =
    document.getElementById("chatLauncher");
  const closeChat =
    document.getElementById("closeChat");
  const chatForm =
    document.getElementById("chatForm");
  const chatInput =
    document.getElementById("chatInput");
  const chatMessages =
    document.getElementById("chatMessages");


  /* ========================================
     OPEN AND CLOSE CHATBOT
  ======================================== */

  function toggleChat(showChat) {
    if (!chatbot) {
      return;
    }

    chatbot.classList.toggle("open", showChat);
    chatbot.setAttribute(
      "aria-hidden",
      String(!showChat)
    );

    if (showChat && chatInput) {
      setTimeout(function () {
        chatInput.focus();
      }, 200);
    }
  }

  if (chatLauncher) {
    chatLauncher.addEventListener("click", function () {
      const chatbotIsOpen =
        chatbot &&
        chatbot.classList.contains("open");

      toggleChat(!chatbotIsOpen);
    });
  }

  if (closeChat) {
    closeChat.addEventListener("click", function () {
      toggleChat(false);
    });
  }


  /* ========================================
     CHATBOT ANSWERS
  ======================================== */

  const answers = {
    price:
      "One UbeSmores Cookie costs ₱89. Your total updates automatically when you change the quantity in the order form. 🍪",

    order:
      "To order, go to the order form, enter your information, choose pickup or delivery, select your preferred date, and press Submit Order. 💜",

    delivery:
      "Yes, delivery is available! Choose Delivery in the order form and enter your complete delivery address.",

    pickup:
      "Yes, pickup is available. Choose Pickup under Order Method, and the delivery-address field will automatically disappear.",

    advance:
      "Please place your order at least one day in advance. The smart calendar only allows tomorrow or a later date.",

    ingredients:
      "Our signature cookie has a soft and chewy ube base, toasted marshmallow on top, and a delicious caramel drizzle.",

    storage:
      "Keep your cookies in an airtight container. Warm them briefly before eating for a soft and gooey experience!",

    greeting:
      "Hi, cookie lover! 💜 Ask me about our price, cookie, ordering, pickup, delivery, preferred date, or storage.",

    thanks:
      "You’re very welcome! Have an ube-lievable day. ♡"
  };


  /* ========================================
     CHOOSE CHATBOT REPLY
  ======================================== */

  function getReply(message) {
    const text = message.toLowerCase().trim();

    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("magkano") ||
      text.includes("how much") ||
      text.includes("₱")
    ) {
      return answers.price;
    }

    if (
      text.includes("delivery") ||
      text.includes("deliver") ||
      text.includes("shipping") ||
      text.includes("address")
    ) {
      return answers.delivery;
    }

    if (
      text.includes("pickup") ||
      text.includes("pick up") ||
      text.includes("claim")
    ) {
      return answers.pickup;
    }

    if (
      text.includes("advance") ||
      text.includes("early") ||
      text.includes("date") ||
      text.includes("when")
    ) {
      return answers.advance;
    }

    if (
      text.includes("order") ||
      text.includes("buy") ||
      text.includes("purchase") ||
      text.includes("bili")
    ) {
      return answers.order;
    }

    if (
      text.includes("inside") ||
      text.includes("ingredient") ||
      text.includes("flavor") ||
      text.includes("cookie") ||
      text.includes("ube") ||
      text.includes("mallow") ||
      text.includes("marshmallow") ||
      text.includes("caramel")
    ) {
      return answers.ingredients;
    }

    if (
      text.includes("store") ||
      text.includes("storage") ||
      text.includes("keep") ||
      text.includes("expire") ||
      text.includes("shelf")
    ) {
      return answers.storage;
    }

    if (
      text === "hi" ||
      text.includes("hello") ||
      text.includes("hey") ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("good evening")
    ) {
      return answers.greeting;
    }

    if (
      text.includes("thank") ||
      text.includes("salamat")
    ) {
      return answers.thanks;
    }

    return "I’m still learning, but I’d love to help! Ask me about our ₱89 cookie, ordering, pickup, delivery, preferred date, or storage. 💜";
  }


  /* ========================================
     ADD CHAT MESSAGE
  ======================================== */

  function addMessage(message, sender) {
    if (!chatMessages) {
      return;
    }

    const messageBubble =
      document.createElement("div");

    messageBubble.className =
      "message " + sender;

    messageBubble.textContent = message;

    chatMessages.appendChild(messageBubble);
    chatMessages.scrollTop =
      chatMessages.scrollHeight;
  }


  /* ========================================
     SEND CHAT MESSAGE
  ======================================== */

  function sendMessage(message) {
    if (!message || !message.trim()) {
      return;
    }

    addMessage(message.trim(), "user");

    if (chatInput) {
      chatInput.value = "";
    }

    setTimeout(function () {
      addMessage(getReply(message), "bot");
    }, 450);
  }


  /* ========================================
     TYPED CHAT MESSAGES
  ======================================== */

  if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (chatInput) {
        sendMessage(chatInput.value);
      }
    });
  }


  /* ========================================
     QUICK CHATBOT BUTTONS
  ======================================== */

  document
    .querySelectorAll("[data-reply]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        const replyType =
          button.getAttribute("data-reply");

        let question = button.textContent.trim();

        if (replyType === "price") {
          question = "How much is one cookie?";
        }

        if (replyType === "order") {
          question = "How do I order?";
        }

        if (replyType === "menu") {
          question = "What is inside the cookie?";
        }

        sendMessage(question);
      });
    });
});
