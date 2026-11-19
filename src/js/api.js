export async function getLaptops(element) {
    element.innerHTML = Array(3).fill(`
    <div class="laptop-card animate-pulse">
    <div class="mb-4 h-36 rounded bg-gray-400/30"></div>
    <div class="mb-3 h-5 rounded bg-gray-400/30"></div>
    <div class="h-5 w-2/3 rounded bg-gray-400/30"></div>
    </div>
    `).join("");

    try {
        const response = await fetch("data/laptops.json");

        if (!response.ok) {
            throw new Error("Could not load laptops");
        }

        return await response.json();
    } catch (error) {
        element.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        return null;
    }
}