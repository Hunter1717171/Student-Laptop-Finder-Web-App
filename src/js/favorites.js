import { getLaptops } from "./api.js";
import { getFavorites, saveFavorites, getCompare, saveCompare } from "./storage.js";
import { setupPage, showCards, formatPrice } from "./ui.js";

setupPage();

const list = document.getElementById("favoritesList");
const summary = document.getElementById("summary");
const clearBtn = document.getElementById("clear");

let allLaptops = [];

function renderFavorites() {
    const ids = getFavorites();
    const favorites = allLaptops.filter(laptop => ids.includes(laptop.id));

    const total = favorites.reduce((sum, laptop) => sum + laptop.price, 0);
    const average = favorites.length ? total / favorites.length : 0;

    summary.textContent =
        `Saved: ${favorites.length} | Total: ${formatPrice(total)} | Average: ${formatPrice(average)}`;

    showCards(list, favorites, renderFavorites);
}

clearBtn.addEventListener("click", () => {
    saveFavorites([]);
    saveCompare([]);
    renderFavorites();
});

async function loadPage() {
    const laptops = await getLaptops(list);

    if (!laptops) return;

    allLaptops = laptops;
    renderFavorites();
}

loadPage();