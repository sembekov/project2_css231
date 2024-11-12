const API_KEY = '649a96c0693b41d2968eb956b87a27a0';
const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=`;

const DEFAULT_SEARCH_TERM = 'pasta';

async function searchRecipes(query = null) {
    const searchTerm = query ? query.trim() : document.getElementById('search-bar').value.trim();
    if (!searchTerm) return alert('Please enter a search term!');

    try {
        const response = await fetch(`${API_URL}${searchTerm}&number=12`);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        alert('Failed to fetch recipes. Please check your API key or network connection.');
        console.error(error);
    }
}

function loadDefaultRecipes() {
    searchRecipes(DEFAULT_SEARCH_TERM);
}

function displayRecipes(recipes) {
    const recipesGrid = document.getElementById('recipes-grid');
    recipesGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}" onclick="showRecipeDetails(${recipe.id})">
            <h3>${recipe.title}</h3>
            <!-- View Details button -->
            <button class="view-details" onclick="showRecipeDetails(${recipe.id})">View Details</button>
            <button class="add-favorite" onclick="addToFavorites(${recipe.id}, '${recipe.title}', '${recipe.image}')">Add to Favorites</button>
        </div>
    `).join('');
}

async function showRecipeDetails(id) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();
        document.getElementById('recipe-details').innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Ingredients:</strong></p>
            <ul>${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
            <p><strong>Instructions:</strong> ${recipe.instructions || "No instructions available."}</p>
        `;
        document.getElementById('recipe-details-modal').style.display = 'block';
    } catch (error) {
        alert('Failed to load recipe details.');
        console.error(error);
    }
}

function closeModal() {
    document.getElementById('recipe-details-modal').style.display = 'none';
}

function addToFavorites(id, title, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.some(fav => fav.id === id)) return alert('Recipe already in favorites.');

    favorites.push({ id, title, image });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favorites')) || [];
    document.getElementById('favorite-recipes').innerHTML = favoriteRecipes.map(fav => `
        <div class="favorite-card">
            <img src="${fav.image}" alt="${fav.title}">
            <h3>${fav.title}</h3>
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultRecipes(); 
    displayFavorites();   
});
