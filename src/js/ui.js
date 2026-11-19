import { getTheme, saveTheme, getFavorites, toggleFavorite } from "./storage.js";

export function setupPage() {
    const header = document.getElementById("header");

    header.innerHTML = `
    <nav class="bg-[var(--card-bg)] p-4 shadow-sm">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <a href="index.html" class="text-xl font-bold">Laptop Finder</a>

        <div class="flex items-center gap-2">
          <button id="themeBtn" class="btn-action text-sm"></button>
          <button id="menuBtn" class="btn-action text-sm md:hidden">Menu</button>
        </div>

        <div id="navLinks" class="hidden w-full flex-col gap-4 md:flex md:w-auto md:flex-row">
          <a href="index.html" class="hover:underline">Home</a>
          <a href="laptops.html" class="hover:underline">Laptops</a>
          <a href="favorites.html" class="hover:underline">Favorites</a>
          <a href="compare.html" class="hover:underline">Compare</a>
        </div>
      </div>
    </nav>
  `;

    const themeBtn = document.getElementById("themeBtn");

    function applyTheme() {
        const theme = getTheme();

        document.documentElement.classList.toggle("performance", theme === "performance");

        themeBtn.textContent = theme === "performance"
            ? "Performance Mode"
            : "Battery Saver Mode";
    }

    themeBtn.addEventListener("click", () => {
        const next = getTheme() === "saver" ? "performance" : "saver";
        saveTheme(next);
        applyTheme();
    });

    document.getElementById("menuBtn").addEventListener("click", () => {
        document.getElementById("navLinks").classList.toggle("hidden");
    });

    applyTheme();
}

export const formatPrice = price => "$" + price.toLocaleString();

export function laptopCard(laptop) {
    const saved = getFavorites().includes(laptop.id);

    return `
    <div class="laptop-card">
        <img src="${laptop.image}" alt="${laptop.name}" class="mb-4 h-40 w-full object-contain">

        <h2 class="text-lg font-bold">${laptop.name}</h2>
        <p>${laptop.brand}</p>

        <p class="my-2 font-bold">${formatPrice(laptop.price)}</p>
        <p class="text-sm">${laptop.cpu}</p>
        <p class="mb-4 text-sm">${laptop.ramGB} GB RAM | ${laptop.storageGB} GB SSD</p>

        <div class="flex flex-wrap gap-2">
        <a href="details.html?id=${laptop.id}" class="btn-action">Details</a>
        <button class="btn-action favoriteBtn" data-id="${laptop.id}">
            ${saved ? "Remove Favorite" : "Add Favorite"}
        </button>
        </div>
    </div>
    `;
}

export function showCards(element, laptops, refresh) {
    if (laptops.length === 0) {
        element.innerHTML = "<p>No laptops found.</p>";
        return;
    }

    element.innerHTML = laptops.map(laptopCard).join("");

    element.querySelectorAll(".favoriteBtn").forEach(button => {
        button.addEventListener("click", () => {
            toggleFavorite(Number(button.dataset.id));
            refresh();
        });
    });
}