import { getLaptops } from "./api.js";
import { getFavorites, getCompare, saveCompare } from "./storage.js";
import { setupPage, formatPrice } from "./ui.js";

setupPage();

const choices = document.getElementById("choices");
const comparison = document.getElementById("comparison");
const message = document.getElementById("message");

let allLaptops = [];

function renderCompare() {
    const favorites = getFavorites();
    let selected = getCompare().filter(id => favorites.includes(id));

    saveCompare(selected);

    const available = allLaptops.filter(laptop => favorites.includes(laptop.id));

    choices.innerHTML = available.length
        ? available.map(laptop => `
        <label class="laptop-card flex cursor-pointer items-center gap-3">
        <input type="checkbox" class="pick" value="${laptop.id}"
            ${selected.includes(laptop.id) ? "checked" : ""}>
        <span>${laptop.name}</span>
        </label>
    `).join("")
        : "<p>Add laptops to favorites first.</p>";

    choices.querySelectorAll(".pick").forEach(input => {
        input.addEventListener("change", () => {
            let ids = getCompare();

            if (input.checked) {
                if (ids.length >= 4) {
                    message.textContent = "You can compare only 4 laptops.";
                    input.checked = false;
                    return;
                }

                ids.push(Number(input.value));
            } else {
                ids = ids.filter(id => id !== Number(input.value));
            }

            saveCompare(ids);
            message.textContent = "";
            renderCompare();
        });
    });

    selected = getCompare();

    const laptops = allLaptops.filter(laptop => selected.includes(laptop.id));

    if (laptops.length < 2) {
        comparison.innerHTML = "<p>Select at least 2 laptops to compare.</p>";
        return;
    }

    const rows = [
        ["Price", "price", "min", "$"],
        ["RAM", "ramGB", "max", " GB"],
        ["Storage", "storageGB", "max", " GB"],
        ["Battery", "batteryHours", "max", " hours"],
        ["Weight", "weightKg", "min", " kg"]
    ];

    comparison.innerHTML = `
    <table class="w-full min-w-[600px] border-collapse text-sm">
        <thead>
        <tr class="bg-[var(--card-bg)]">
            <th class="border border-gray-400 p-3 text-left">Specification</th>
            ${laptops.map(laptop => `
            <th class="border border-gray-400 p-3">
                <img src="${laptop.image}" alt="${laptop.name}" class="mx-auto mb-2 h-24 object-contain">
                ${laptop.name}
            </th>
            `).join("")}
        </tr>
        </thead>

        <tbody>
        ${rows.map(row => {
        const values = laptops.map(laptop => laptop[row[1]]);
        const best = row[2] === "min"
            ? Math.min(...values)
            : Math.max(...values);

        return `
            <tr>
                <th class="border border-gray-400 p-3 text-left">${row[0]}</th>
                ${laptops.map(laptop => `
                <td class="border border-gray-400 p-3 text-center
                    ${laptop[row[1]] === best ? "font-bold text-green-500" : ""}">
                    ${row[1] === "price"
                ? formatPrice(laptop.price)
                : laptop[row[1]] + row[3]}
                </td>
                `).join("")}
            </tr>
            `;
    }).join("")}

        <tr>
            <th class="border border-gray-400 p-3 text-left">CPU</th>
            ${laptops.map(laptop => `
            <td class="border border-gray-400 p-3 text-center">${laptop.cpu}</td>
            `).join("")}
        </tr>

        <tr>
            <th class="border border-gray-400 p-3 text-left">Screen</th>
            ${laptops.map(laptop => `
            <td class="border border-gray-400 p-3 text-center">${laptop.screenInches} inches</td>
            `).join("")}
        </tr>

        <tr>
            <th class="border border-gray-400 p-3 text-left">Category</th>
            ${laptops.map(laptop => `
            <td class="border border-gray-400 p-3 text-center">${laptop.category}</td>
            `).join("")}
        </tr>
        </tbody>
    </table>
    `;
}

async function loadPage() {
    const laptops = await getLaptops(choices);

    if (!laptops) return;

    allLaptops = laptops;
    renderCompare();
}

loadPage();