(() => {
  "use strict";

  const responses = [
    ["2026-09-19", 5, 5, 5, "Worth it."],
    ["2026-09-19", 5, 4, 5, "I liked the s’mores."],
    ["2026-09-19", 5, 5, 5, "Worth it."],
    ["2026-09-19", 4, 3, 4, "The product looks appetizing."],
    ["2026-09-19", 5, 4, 5, "I liked the s’mores."],
    ["2026-09-19", 5, 5, 5, "I liked the filling."],
    ["2026-09-19", 5, 3, 4, "I liked the ube halaya and toasted marshmallow."],
    ["2026-09-19", 5, 5, 5, "I like the marshmallow in it. It tastes good."],
    ["2026-09-19", 4, 4, 4, "I liked the ube halaya and toasted marshmallow."],
    ["2026-09-19", 4, 4, 4, "I liked how the flavor melts in my mouth."],
    ["2026-09-19", 4, 3, 4, "Add more marshmallow."],
    ["2026-09-19", 5, 5, 5, "It tastes so good."],
    ["2026-09-19", 5, 3, 5, "Yummy."],
    ["2026-09-19", 5, 5, 5, "I liked the ube halaya."],
    ["2026-09-19", 5, 5, 5, "Overall good. Thank you!"],
    ["2026-09-19", 5, 5, 5, "I liked the whole cookie."],
    ["2026-09-19", 5, 5, 5, "Try to sell it as a business."],
    ["2026-09-19", 1, 4, 5, "The cookie itself tells you it’s delicious. Improve the baking time and temperature."],
    ["2026-09-19", 2, 3, 4, "I liked the flavor."],
    ["2026-09-19", 5, 5, 5, "I like how soft and chewy it is."],
    ["2026-09-19", 5, 5, 5, "I liked the chocolate."],
    ["2026-09-19", 5, 5, 5, "Ang sarap po! ><"],
    ["2026-09-19", 5, 4, 5, "Super swak yung combination."],
    ["2026-09-19", 5, 3, 5, "Love the product, but it needs more improvement."],
    ["2026-09-19", 5, 5, 4, "I like the toasted marshmallows with everything else, but the chocolate adds too much sweetness."],
    ["2026-09-19", 5, 5, 5, "I liked the ube."],
    ["2026-09-19", 4, 4, 5, "I liked the ube."],
    ["2026-09-19", 5, 5, 5, "I liked the overall combination."],
    ["2026-09-19", 1, 1, 1, "Overall super sarap, not too sweet, balanced lang."],
    ["2026-09-19", 5, 5, 5, "Keep up the good work."],
    ["2026-09-19", 5, 5, 5, "Masarap yung recipe nila, kulang lang talaga sa ube."],
    ["2026-09-19", 5, 5, 5, "I liked the texture and the marshmallows."],
    ["2026-09-19", 5, 5, 5, "I liked the inside of it."],
    ["2026-09-19", 5, 5, 5, "All of the ingredients combined create a great cookie, and I really like the fillings in the middle."],
    ["2026-09-19", 4, 4, 5, "Medyo matamis po, pero masarap naman."],
    ["2026-09-19", 5, 5, 5, "Super sarap."],
    ["2026-09-19", 5, 5, 5, "Super delicious and yummy."],
    ["2026-09-19", 5, 5, 5, "I liked the taste."],
    ["2026-09-19", 5, 5, 5, "I liked the softness of the product."],
    ["2026-09-19", 5, 5, 5, "Ube."],
    ["2026-09-19", 5, 5, 5, "I liked the texture, color, and taste."],
    ["2026-09-19", 5, 5, 5, "Smooth and yummy."],
    ["2026-09-19", 5, 5, 5, "Pwede na ibenta, promise kikita ’to. Thank you sa food, hehe."],
    ["2026-09-19", 5, 5, 5, "Add more filling lang po."],
    ["2026-09-19", 5, 4, 3, "Maybe add more of the s’mores part so it’s more flavorful."],
    ["2026-09-19", 5, 5, 5, "I liked the chocolate."],
    ["2026-09-19", 5, 5, 5, "Ang sarap."],
    ["2026-09-19", 5, 5, 5, "I liked the yema drizzle."],
    ["2026-09-19", 5, 5, 5, "I liked the ube."],
    ["2026-09-19", 4, 4, 5, "Medyo matamis po, pero overall masarap naman po."],
    ["2026-09-19", 4, 4, 4, "I liked the ube. Everything is good."],
    ["2026-09-19", 4, 4, 4, "I liked the taste and texture."],
    ["2026-09-19", 5, 5, 5, "I liked the filling. Everything is good."],
    ["2026-09-19", 5, 5, 5, "Perfect, masarap. 10/10."],
    ["2026-09-19", 5, 5, 5, "I liked the ube halaya filling."],
    ["2026-09-20", 5, 5, 5, "Benta n’yo na ’yan."],
    ["2026-09-20", 5, 5, 5, "I think you can make the portion bigger so it doesn’t leave you wanting more. :)))"]
  ];

  const grid = document.getElementById("gformReviewGrid");
  const toggle = document.getElementById("gformReviewToggle");
  if (!grid || !toggle) return;

  const dateFormatter = new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila"
  });
  let expanded = false;

  function createRating(label, value) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value + "/5";
    item.append(term, description);
    return item;
  }

  function createCard(response, index) {
    const [date, appearance, texture, flavor, comment] = response;
    const average = ((appearance + texture + flavor) / 3).toFixed(1);
    const card = document.createElement("article");
    card.className = "gform-review-card";

    const header = document.createElement("header");
    const avatar = document.createElement("span");
    avatar.className = "gform-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = String(index + 1).padStart(2, "0");

    const identity = document.createElement("div");
    const name = document.createElement("strong");
    const time = document.createElement("time");
    name.textContent = "Anonymous";
    time.dateTime = date;
    time.textContent = dateFormatter.format(new Date(date + "T12:00:00+08:00"));
    identity.append(name, time);

    const averageLabel = document.createElement("span");
    averageLabel.className = "gform-average";
    averageLabel.setAttribute("aria-label", "Average rating " + average + " out of 5");
    averageLabel.textContent = average + " ★";
    header.append(avatar, identity, averageLabel);

    const quote = document.createElement("blockquote");
    quote.textContent = "“" + comment + "”";

    const ratings = document.createElement("dl");
    ratings.append(
      createRating("Appearance", appearance),
      createRating("Texture", texture),
      createRating("Flavor", flavor)
    );

    card.append(header, quote, ratings);
    return card;
  }

  function render() {
    const count = expanded ? responses.length : 6;
    const fragment = document.createDocumentFragment();
    responses.slice(0, count).forEach((response, index) => {
      fragment.append(createCard(response, index));
    });
    grid.replaceChildren(fragment);

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↓";
    toggle.replaceChildren(
      document.createTextNode(expanded ? "Show fewer reviews " : "Show all 57 reviews "),
      arrow
    );
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  toggle.addEventListener("click", () => {
    expanded = !expanded;
    render();
    if (!expanded) {
      document.getElementById("gformReviews").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  render();
})();
