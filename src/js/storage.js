export const getFavorites = () =>
    JSON.parse(localStorage.getItem("favorites") || "[]");

export const getCompare = () =>
    JSON.parse(localStorage.getItem("compare") || "[]");

export function saveFavorites(ids) {
    localStorage.setItem("favorites", JSON.stringify(ids));
}

export function saveCompare(ids) {
    localStorage.setItem("compare", JSON.stringify(ids));
}

export function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
}

export function addCompare(id) {
    const selected = getCompare();

    if (selected.includes(id)) {
        return "Already selected";
    }

    if (selected.length >= 4) {
        return "You can compare only 4 laptops";
    }

    selected.push(id);
    saveCompare(selected);

    return "Added to comparison";
}

export function getTheme() {
    try {
        return JSON.parse(localStorage.getItem("theme") || '"saver"');
    } catch {
        return "saver";
    }
}

export function saveTheme(theme) {
    localStorage.setItem("theme", JSON.stringify(theme));
}