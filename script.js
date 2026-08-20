// Mobile navigation

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll("#navMenu a").forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


// Scroll animations

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".reveal").forEach(function (item) {
  observer.observe(item);
});


// Automatically display the current year

document.getElementById("year").textContent =
  new Date().getFullYear();


// Chatbot elements

const chatbot = document.getElementById("chatbot");
const chatLauncher = document.getElementById("chatLauncher");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");


// Open and close the chatbot

function toggleChat(showChat) {
  chatbot.classList.toggle("open", showChat);
  chatbot.setAttribute("aria-hidden", !showChat);

  if (showChat) {
    setTimeout(function () {
      chatInput.focus();
    }, 200);
  }
}

chatLauncher.addEventListener("click", function () {
  const chatbotIsOpen = chatbot.classList.contains("open");

  toggleChat(!chatbotIsOpen);
});

closeChat.addEventListener("click", function () {
  toggleChat(false);
});


// Chatbot answers

const answers = {
  menu:
    "Our signature cookie is soft and chewy, packed with rich ube flavor, topped with toasted marshmallow, and finished with caramel drizzle. 💜",

  order:
    "You can order through our Facebook or Instagram page. Tap the “Order now” button on the website after replacing the sample link with your real page!",

  price:
    "Our prices will be posted soon! You can message us with the quantity you need, and we’ll help you right away. 🍪",

  delivery:
    "Delivery availability depends on your location. Send us your area and preferred date so we can check it for you.",

  storage:
    "Store your cookies in an airtight container. Warm them briefly before eating for that fresh-baked and gooey experience!",

  hello:
    "Hi there! 💜 Ask me about our cookie, price, ordering, delivery, or storage.",

  thanks:
    "You’re very welcome! Have an ube-lievable day. ♡"
};


// Decide which answer to send

function getReply(message) {
  const text = message.toLowerCase();

  if (
    text.includes("price") ||
    text.includes("cost") ||
    text.includes("magkano") ||
    text.includes("how much")
  ) {
    return answers.price;
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
    text.includes("delivery") ||
    text.includes("deliver") ||
    text.includes("location") ||
    text.includes("shipping")
  ) {
    return answers.delivery;
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
    text.includes("inside") ||
    text.includes("ingredient") ||
    text.includes("flavor") ||
    text.includes("cookie") ||
    text.includes("ube") ||
    text.includes("mallow") ||
    text.includes("caramel")
  ) {
    return answers.menu;
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("good morning") ||
    text.includes("good evening")
  ) {
    return answers.hello;
  }

  if (
    text.includes("thank") ||
    text.includes("salamat")
  ) {
    return answers.thanks;
  }

  return "I’m still learning, but I’d love to help! Try asking about our cookie, price, ordering, delivery, or storage. 💜";
}


// Add a message bubble

function addMessage(message, sender) {
  const bubble = document.createElement("div");

  bubble.className = "message " + sender;
  bubble.textContent = message;

  chatMessages.appendChild(bubble);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Send a message

function sendMessage(message) {
  if (!message.trim()) {
    return;
  }

  addMessage(message, "user");

  chatInput.value = "";

  setTimeout(function () {
    const botReply = getReply(message);

    addMessage(botReply, "bot");
  }, 450);
}


// Send typed messages

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  sendMessage(chatInput.value);
});


// Quick-reply buttons

document.querySelectorAll("[data-reply]").forEach(function (button) {
  button.addEventListener("click", function () {
    sendMessage(button.textContent);
  });
});
