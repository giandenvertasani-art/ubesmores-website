document.addEventListener("DOMContentLoaded", function () {
  /* ========================================
     MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    document
      .querySelectorAll("#navMenu a")
      .forEach(function (link) {
        link.addEventListener("click", function () {
          navMenu.classList.remove("open");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );
        });
      });
  }


  /* ========================================
     SCROLL ANIMATIONS
  ======================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

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
    yearElement.textContent =
      new Date().getFullYear();
  }


  /* ========================================
     ORDER FORM ELEMENTS
  ======================================== */

  const orderForm =
    document.getElementById("orderForm");

  const flavorSelect =
    document.getElementById("flavor");

  const quantityInput =
    document.getElementById("quantity");

  const unitPriceDisplay =
    document.getElementById("unit-price");

  const totalPriceDisplay =
    document.getElementById("total-price");

  const unitPriceInput =
    document.getElementById("unit-price-input");

  const totalInput =
    document.getElementById("total-input");

  const orderMethod =
    document.getElementById("method");

  const addressGroup =
    document.getElementById("address-group");

  const addressInput =
    document.getElementById("address");

  const dateInput =
    document.getElementById("date");

  const successMessage =
    document.getElementById("success-message");


  /* ========================================
     FLAVOR INFORMATION
  ======================================== */

  const flavorInformation = {
    "ube-smores": {
      name: "UbeSmores Cookie",
      price: 89
    },

    "chocolate-chunk": {
      name: "Classic Chocolate Chunk",
      price: 79
    },

    "cookies-cream": {
      name: "Cookies & Cream",
      price: 85
    },

    "red-velvet": {
      name: "Red Velvet Cream Cheese",
      price: 95
    },

    "matcha": {
      name: "Matcha White Chocolate",
      price: 95
    },

    "biscoff": {
      name: "Biscoff Caramel Lava",
      price: 99
    },

    "salted-caramel": {
      name: "Salted Caramel Pretzel",
      price: 89
    },

    "classic-smores": {
      name: "Classic S’mores",
      price: 89
    }
  };


  /* ========================================
     AUTOMATIC FLAVOR PRICE AND TOTAL
  ======================================== */

  function getSelectedPrice() {
    if (!flavorSelect || !flavorSelect.value) {
      return 0;
    }

    const selectedFlavor =
      flavorInformation[flavorSelect.value];

    if (!selectedFlavor) {
      return 0;
    }

    return selectedFlavor.price;
  }

  function updateOrderTotal() {
    let quantity = 1;

    if (quantityInput) {
      quantity = Number(quantityInput.value);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        quantity = 1;
        quantityInput.value = "1";
      }
    }

    const unitPrice = getSelectedPrice();
    const totalPrice = unitPrice * quantity;

    if (unitPriceDisplay) {
      unitPriceDisplay.textContent =
        unitPrice.toLocaleString("en-PH");
    }

    if (totalPriceDisplay) {
      totalPriceDisplay.textContent =
        totalPrice.toLocaleString("en-PH");
    }

    if (unitPriceInput) {
      unitPriceInput.value =
        "₱" + unitPrice.toLocaleString("en-PH");
    }

    if (totalInput) {
      totalInput.value =
        "₱" + totalPrice.toLocaleString("en-PH");
    }
  }

  if (flavorSelect) {
    flavorSelect.addEventListener(
      "change",
      updateOrderTotal
    );
  }

  if (quantityInput) {
    quantityInput.addEventListener(
      "input",
      updateOrderTotal
    );

    quantityInput.addEventListener(
      "change",
      updateOrderTotal
    );
  }

  updateOrderTotal();


  /* ========================================
     MENU ORDER BUTTONS
  ======================================== */

  document
    .querySelectorAll("[data-menu-flavor]")
    .forEach(function (orderButton) {
      orderButton.addEventListener(
        "click",
        function () {
          const selectedFlavor =
            orderButton.getAttribute(
              "data-menu-flavor"
            );

          if (
            flavorSelect &&
            flavorInformation[selectedFlavor]
          ) {
            flavorSelect.value = selectedFlavor;

            updateOrderTotal();

            setTimeout(function () {
              flavorSelect.focus();
            }, 600);
          }
        }
      );
    });


  /* ========================================
     PICKUP OR DELIVERY
  ======================================== */

  function updateOrderMethod() {
    if (
      !orderMethod ||
      !addressGroup ||
      !addressInput
    ) {
      return;
    }

    const deliverySelected =
      orderMethod.value === "Delivery";

    addressGroup.classList.toggle(
      "show",
      deliverySelected
    );

    addressInput.required = deliverySelected;

    if (!deliverySelected) {
      addressInput.value = "";
    }
  }

  if (orderMethod) {
    orderMethod.addEventListener(
      "change",
      updateOrderMethod
    );

    updateOrderMethod();
  }


  /* ========================================
     SMART PREFERRED DATE
  ======================================== */

  function formatDateForInput(date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function setMinimumOrderDate() {
    if (!dateInput) {
      return;
    }

    const tomorrow = new Date();

    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minimumDate =
      formatDateForInput(tomorrow);

    dateInput.min = minimumDate;

    if (
      dateInput.value &&
      dateInput.value < minimumDate
    ) {
      dateInput.value = "";
    }
  }

  setMinimumOrderDate();

  if (dateInput) {
    dateInput.addEventListener(
      "change",
      function () {
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
      }
    );
  }


  /* ========================================
     FORMSPREE SUBMISSION
  ======================================== */

  if (orderForm) {
    orderForm.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();

        const submitButton =
          orderForm.querySelector(
            'button[type="submit"]'
          );

        if (!orderForm.checkValidity()) {
          orderForm.reportValidity();
          return;
        }

        if (!getSelectedPrice()) {
          if (flavorSelect) {
            flavorSelect.setCustomValidity(
              "Please choose a cookie flavor."
            );

            flavorSelect.reportValidity();

            flavorSelect.setCustomValidity("");
          }

          return;
        }

        if (successMessage) {
          successMessage.textContent =
            "Submitting your order...";

          successMessage.classList.remove(
            "error"
          );
        }

        if (submitButton) {
          submitButton.disabled = true;

          submitButton.textContent =
            "Submitting order...";
        }

        try {
          const formData =
            new FormData(orderForm);

          const response = await fetch(
            orderForm.action,
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json"
              }
            }
          );

          if (!response.ok) {
            throw new Error(
              "Form submission failed."
            );
          }

          if (successMessage) {
            successMessage.textContent =
              "Thank you! Your UbeSmores Cookie order was submitted successfully. 💜";
          }

          orderForm.reset();

          updateOrderTotal();
          updateOrderMethod();
          setMinimumOrderDate();
        } catch (error) {
          if (successMessage) {
            successMessage.textContent =
              "Sorry, your order could not be submitted. Please check your connection and try again.";

            successMessage.classList.add(
              "error"
            );
          }
        } finally {
          if (submitButton) {
            submitButton.disabled = false;

            submitButton.innerHTML =
              "Submit Order <span>→</span>";
          }
        }
      }
    );
  }


  /* ========================================
     CHATBOT ELEMENTS
  ======================================== */

  const chatbot =
    document.getElementById("chatbot");

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

    chatbot.classList.toggle(
      "open",
      showChat
    );

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
    chatLauncher.addEventListener(
      "click",
      function () {
        const chatbotIsOpen =
          chatbot &&
          chatbot.classList.contains("open");

        toggleChat(!chatbotIsOpen);
      }
    );
  }

  if (closeChat) {
    closeChat.addEventListener(
      "click",
      function () {
        toggleChat(false);
      }
    );
  }


  /* ========================================
     CHATBOT ANSWERS
  ======================================== */

  const chatbotAnswers = {
    greeting:
      "Hi, cookie lover! 💜 Ask me about our eight flavors, prices, ordering, pickup, delivery, preferred date, or social-media accounts.",

    flavors:
      "We have eight flavors: UbeSmores, Classic Chocolate Chunk, Cookies & Cream, Red Velvet Cream Cheese, Matcha White Chocolate, Biscoff Caramel Lava, Salted Caramel Pretzel, and Classic S’mores. 🍪",

    prices:
      "Our prices are: UbeSmores ₱89, Chocolate Chunk ₱79, Cookies & Cream ₱85, Red Velvet ₱95, Matcha ₱95, Biscoff Caramel Lava ₱99, Salted Caramel Pretzel ₱89, and Classic S’mores ₱89.",

    order:
      "Choose a flavor from the menu or order form, enter the quantity and your details, choose pickup or delivery, select a preferred date, then press Submit Order.",

    delivery:
      "Delivery is available! Choose Delivery in the order form and enter your complete delivery address.",

    pickup:
      "Pickup is available. Choose Pickup under Order Method, and the delivery-address field will stay hidden.",

    date:
      "Please place your order at least one day in advance. The calendar allows tomorrow or a later date.",

    storage:
      "Keep your cookies in an airtight container. Warm them briefly before eating for a soft and gooey experience.",

    socials:
      "Follow us on Facebook at Ube.Smores.Cookie, Instagram at @ubesmoresc.o, and X at @UbeSmoresC0. You can tap the social cards near the bottom of the website.",

    thanks:
      "You’re very welcome! Have an ube-lievable day. ♡"
  };


  /* ========================================
     CHOOSE CHATBOT REPLY
  ======================================== */

  function getChatbotReply(message) {
    const text =
      message.toLowerCase().trim();

    if (
      text === "hi" ||
      text.includes("hello") ||
      text.includes("hey") ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("good evening")
    ) {
      return chatbotAnswers.greeting;
    }

    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("magkano") ||
      text.includes("how much")
    ) {
      return chatbotAnswers.prices;
    }

    if (
      text.includes("flavor") ||
      text.includes("menu") ||
      text.includes("available") ||
      text.includes("cookie")
    ) {
      return chatbotAnswers.flavors;
    }

    if (
      text.includes("delivery") ||
      text.includes("deliver") ||
      text.includes("shipping") ||
      text.includes("address")
    ) {
      return chatbotAnswers.delivery;
    }

    if (
      text.includes("pickup") ||
      text.includes("pick up") ||
      text.includes("claim")
    ) {
      return chatbotAnswers.pickup;
    }

    if (
      text.includes("date") ||
      text.includes("advance") ||
      text.includes("early") ||
      text.includes("when")
    ) {
      return chatbotAnswers.date;
    }

    if (
      text.includes("order") ||
      text.includes("buy") ||
      text.includes("purchase") ||
      text.includes("bili")
    ) {
      return chatbotAnswers.order;
    }

    if (
      text.includes("store") ||
      text.includes("storage") ||
      text.includes("keep") ||
      text.includes("expire")
    ) {
      return chatbotAnswers.storage;
    }

    if (
      text.includes("facebook") ||
      text.includes("instagram") ||
      text.includes("social") ||
      text.includes("twitter") ||
      text === "x"
    ) {
      return chatbotAnswers.socials;
    }

    if (
      text.includes("thank") ||
      text.includes("salamat")
    ) {
      return chatbotAnswers.thanks;
    }

    return "I’m still learning, but I’d love to help! Ask me about our flavors, prices, ordering, pickup, delivery, dates, or social-media accounts. 💜";
  }


  /* ========================================
     ADD CHAT MESSAGE
  ======================================== */

  function addChatMessage(message, sender) {
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

  function sendChatMessage(message) {
    if (!message || !message.trim()) {
      return;
    }

    addChatMessage(
      message.trim(),
      "user"
    );

    if (chatInput) {
      chatInput.value = "";
    }

    setTimeout(function () {
      addChatMessage(
        getChatbotReply(message),
        "bot"
      );
    }, 450);
  }


  /* ========================================
     TYPED CHAT MESSAGES
  ======================================== */

  if (chatForm) {
    chatForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        if (chatInput) {
          sendChatMessage(chatInput.value);
        }
      }
    );
  }


  /* ========================================
     QUICK CHATBOT BUTTONS
  ======================================== */

  document
    .querySelectorAll("[data-reply]")
    .forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          const replyType =
            button.getAttribute("data-reply");

          if (replyType === "menu") {
            sendChatMessage(
              "What flavors are available?"
            );
          } else if (replyType === "order") {
            sendChatMessage(
              "How do I order?"
            );
          } else if (replyType === "price") {
            sendChatMessage(
              "What are the prices?"
            );
          }
        }
      );
    });
});
