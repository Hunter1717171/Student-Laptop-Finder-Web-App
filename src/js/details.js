import { getLaptops } from "./api.js";
import { setupPage, formatPrice } from "./ui.js";
import { getFavorites, toggleFavorite, saveFavorites, addCompare } from "./storage.js";

setupPage();

const container = document.getElementById("details");
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function loadDetails() {
    if (!params.has("id") || !Number.isInteger(id)) {
        container.innerHTML = "<p>Laptop not found.</p>";
        return;
    }

    const laptops = await getLaptops(container);

    if (!laptops) return;

    const laptop = laptops.find(item => item.id === id);

    if (!laptop) {
        container.innerHTML = "<p>Laptop not found.</p>";
        return;
    }

    const specs = [
        ["Brand", laptop.brand],
        ["Category", laptop.category],
        ["CPU", laptop.cpu],
        ["RAM", laptop.ramGB + " GB"],
        ["Storage", laptop.storageGB + " GB"],
        ["Battery", laptop.batteryHours + " hours"],
        ["Weight", laptop.weightKg + " kg"],
        ["Screen", laptop.screenInches + " inches"],
        ["Price", formatPrice(laptop.price)],
        ["Description", laptop.description]
    ];

    container.innerHTML = `
    <div class="laptop-card">
        <img src="${laptop.image}" alt="${laptop.name}" class="mb-5 h-56 w-full object-contain">

        <h2 class="mb-2 text-2xl font-bold">${laptop.name}</h2>
        <p class="mb-5">${laptop.description}</p>

        <div class="overflow-x-auto">
        <table class="mb-6 w-full min-w-64 border-collapse">
            ${specs.map(spec => `
            <tr class="border-b border-gray-400">
                <th class="p-3 text-left">${spec[0]}</th>
                <td class="p-3">${spec[1]}</td>
            </tr>
            `).join("")}
        </table>
        </div>

        <div class="flex flex-wrap gap-3">
        <button id="favoriteBtn" class="btn-action"></button>
        <button id="compareBtn" class="btn-action">Add to Compare</button>
        </div>

        <p id="message" class="mt-4"></p>
    </div>
    `;

    const favoriteBtn = document.getElementById("favoriteBtn");

    function updateButton() {
        favoriteBtn.textContent = getFavorites().includes(id)
            ? "Remove Favorite"
            : "Add Favorite";
    }

    favoriteBtn.addEventListener("click", () => {
        toggleFavorite(id);
        updateButton();
    });

    document.getElementById("compareBtn").addEventListener("click", () => {
        const message = addCompare(id);

        if (message === "Added to comparison" && !getFavorites().includes(id)) {
            saveFavorites([...getFavorites(), id]);
            updateButton();
        }

        document.getElementById("message").textContent = message;
    });

    updateButton();
}

loadDetails();