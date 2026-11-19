import { getLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { setupPage, formatPrice } from "./ui.js";

setupPage();

const stats = document.getElementById("stats");

async function loadHome() {
    const laptops = await getLaptops(stats);

    if (!laptops) return;

    const lowestPrice = Math.min(...laptops.map(laptop => laptop.price));
    const totalLaptops = laptops.reduce(count => count + 1, 0);
    const favorites = getFavorites().length;

    stats.innerHTML = `
    <div class="laptop-card">
        <h2 class="text-lg">Total Laptops</h2>
        <p class="text-2xl font-bold">${totalLaptops}</p>
    </div>

    <div class="laptop-card">
        <h2 class="text-lg">Lowest Price</h2>
        <p class="text-2xl font-bold">${formatPrice(lowestPrice)}</p>
    </div>

    <div class="laptop-card">
        <h2 class="text-lg">My Favorites</h2>
        <p class="text-2xl font-bold">${favorites}</p>
    </div>
    `;
}

loadHome();