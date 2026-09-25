document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  if (!body.classList.contains("depth-showroom")) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const precisePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const navbar = document.querySelector(".navbar");
  const heroVisual = document.querySelector(".hero-visual");
  const storyImage = document.querySelector(".story-image");
  const menuCards = document.querySelectorAll(".menu-card");
  const mobileOrderDock = document.querySelector(".mobile-order-dock");
  const orderSection = document.getElementById("order");

  let pageFrame = 0;
  let scrollFrame = 0;

  function updateScrollDetails() {
    scrollFrame = 0;

    const scrollable = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const progress = Math.min(
      Math.max(window.scrollY / scrollable, 0),
      1
    );

    body.style.setProperty(
      "--scroll-progress",
      (progress * 100).toFixed(2) + "%"
    );

    if (navbar) {
      navbar.classList.toggle("is-scrolled", window.scrollY > 90);
    }
  }

  function requestScrollDetails() {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateScrollDetails);
    }
  }

  function resetDepth(element) {
    element.classList.remove("is-depth-active");
    element.style.setProperty("--depth-rx", "0deg");
    element.style.setProperty("--depth-ry", "0deg");
    element.style.setProperty("--depth-x", "0px");
    element.style.setProperty("--depth-y", "0px");
    element.style.setProperty("--depth-back-x", "0px");
    element.style.setProperty("--depth-back-y", "0px");
    element.style.setProperty("--light-x", "50%");
    element.style.setProperty("--light-y", "20%");
  }

  function bindDepth(element, options) {
    if (!element) {
      return;
    }

    const settings = Object.assign(
      {
        maxRotation: 4,
        travel: 0,
        backTravel: 0
      },
      options
    );

    element.addEventListener("pointermove", function (event) {
      if (reducedMotion.matches || !precisePointer.matches) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      const x = Math.min(
        Math.max((event.clientX - bounds.left) / bounds.width, 0),
        1
      );
      const y = Math.min(
        Math.max((event.clientY - bounds.top) / bounds.height, 0),
        1
      );
      const rotateX = (0.5 - y) * settings.maxRotation * 2;
      const rotateY = (x - 0.5) * settings.maxRotation * 2;
      const travelX = (x - 0.5) * settings.travel * 2;
      const travelY = (y - 0.5) * settings.travel * 2;
      const backX = (0.5 - x) * settings.backTravel * 2;
      const backY = (0.5 - y) * settings.backTravel * 2;

      element.classList.add("is-depth-active");
      element.style.setProperty("--depth-rx", rotateX.toFixed(2) + "deg");
      element.style.setProperty("--depth-ry", rotateY.toFixed(2) + "deg");
      element.style.setProperty("--depth-x", travelX.toFixed(2) + "px");
      element.style.setProperty("--depth-y", travelY.toFixed(2) + "px");
      element.style.setProperty("--depth-back-x", backX.toFixed(2) + "px");
      element.style.setProperty("--depth-back-y", backY.toFixed(2) + "px");
      element.style.setProperty("--light-x", (x * 100).toFixed(1) + "%");
      element.style.setProperty("--light-y", (y * 100).toFixed(1) + "%");
    });

    element.addEventListener("pointerleave", function () {
      resetDepth(element);
    });
  }

  bindDepth(heroVisual, {
    maxRotation: 3.5,
    travel: 11,
    backTravel: 8
  });

  bindDepth(storyImage, {
    maxRotation: 3.2
  });

  menuCards.forEach(function (card) {
    bindDepth(card, {
      maxRotation: 4.5
    });
  });

  document.addEventListener(
    "pointermove",
    function (event) {
      if (
        reducedMotion.matches ||
        !precisePointer.matches ||
        pageFrame
      ) {
        return;
      }

      pageFrame = window.requestAnimationFrame(function () {
        body.style.setProperty("--showroom-x", event.clientX + "px");
        body.style.setProperty("--showroom-y", event.clientY + "px");
        pageFrame = 0;
      });
    },
    { passive: true }
  );

  window.addEventListener("scroll", requestScrollDetails, {
    passive: true
  });
  window.addEventListener("resize", requestScrollDetails, {
    passive: true
  });

  updateScrollDetails();

  if (
    mobileOrderDock &&
    orderSection &&
    "IntersectionObserver" in window
  ) {
    const orderObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          mobileOrderDock.classList.toggle(
            "is-hidden",
            entry.isIntersecting
          );
        });
      },
      {
        threshold: 0.08
      }
    );

    orderObserver.observe(orderSection);
  }
});
