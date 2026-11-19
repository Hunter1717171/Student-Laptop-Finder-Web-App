import { getLaptops } from "./api.js";
import { setupPage, showCards } from "./ui.js";

setupPage();

const list = document.getElementById("laptopList");
const search = document.getElementById("search");
const category = document.getElementById("category");
const maxPrice = document.getElementById("maxPrice");
const minRam = document.getElementById("minRam");
const sort = document.getElementById("sort");
const count = document.getElementById("count");

let allLaptops = [];

function renderLaptops() {
    const text = search.value.toLowerCase();

    let result = allLaptops.filter(laptop => {
        const matchesSearch =
            laptop.name.toLowerCase().includes(text) ||
            laptop.brand.toLowerCase().includes(text);

        const matchesCategory =
            category.value === "" || laptop.category === category.value;

        const matchesPrice =
            maxPrice.value === "" || laptop.price <= Number(maxPrice.value);

        const matchesRam =
            minRam.value === "" || laptop.ramGB >= Number(minRam.value);

        return matchesSearch && matchesCategory && matchesPrice && matchesRam;
    });

    result = [...result];

    if (sort.value === "priceAsc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sort.value === "priceDesc") {
        result.sort((a, b) => b.price - a.price);
    } else if (sort.value === "batteryAsc") {
        result.sort((a, b) => a.batteryHours - b.batteryHours);
    } else if (sort.value === "batteryDesc") {
        result.sort((a, b) => b.batteryHours - a.batteryHours);
    } else if (sort.value === "weightAsc") {
        result.sort((a, b) => a.weightKg - b.weightKg);
    } else if (sort.value === "weightDesc") {
        result.sort((a, b) => b.weightKg - a.weightKg);
    }

    count.textContent = `${result.length} laptops found`;
    showCards(list, result, renderLaptops);
}

async function loadPage() {
    const laptops = await getLaptops(list);

    if (!laptops) return;

    allLaptops = laptops;
    renderLaptops();
}

[search, category, maxPrice, minRam, sort].forEach(input => {
    input.addEventListener("input", renderLaptops);
});

loadPage();