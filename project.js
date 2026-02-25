const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const flags = document.querySelectorAll('.country-scroll img');

//dishes from flags
const fetchByCountry = async (country) => {

    recipeContainer.innerHTML = "<h2>Loading...</h2>";

    const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`
    );

    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
        recipeContainer.innerHTML = "<h2>No recipes found 😢</h2>";
        return;
    }

    response.meals.forEach(async (meal) => {

        // 🔥 Get FULL details using lookup
        const detailData = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );

        const detailResponse = await detailData.json();
        const fullMeal = detailResponse.meals[0];

        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        recipeDiv.innerHTML = `
            <img src="${fullMeal.strMealThumb}">
            <h3>${fullMeal.strMeal}</h3>
            <p><b>From:</b> ${fullMeal.strArea}</p>
            <p><b>Category:</b> ${fullMeal.strCategory}</p>
        `;

        recipeDiv.addEventListener('click', () => {
            openRecipePopup(fullMeal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
};

document.addEventListener("DOMContentLoaded", () => {

    const flags = document.querySelectorAll('.country-scroll img');

    flags.forEach(flag => {
        flag.addEventListener('click', () => {

            flags.forEach(f => f.classList.remove('active'));
            flag.classList.add('active');

            const country = flag.dataset.country;
            fetchByCountry(country);
        });
    });

});


// fetching recipes
const fetchRecipes = async (query) => {

    recipeContainer.innerHTML = "<h2>Loading...</h2>";

    const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
        recipeContainer.innerHTML = "<h2>No recipes found 😢</h2>";
        return;
    }

    response.meals.forEach(meal => {

        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><b>From:</b> ${meal.strArea}</p>
            <p><b>Category:</b> ${meal.strCategory}</p>
        `;

        recipeDiv.addEventListener('click', () => {
            openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
};

// fetching ingredients
const fetchIngredients = (meal) => {

    let ingredientList = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientList += `<li>${ingredient} - ${measure}</li>`;
        }
    }

    return ingredientList;
};

// popup
const openRecipePopup = (meal) => {

    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <p><b>Origin:</b> ${meal.strArea}</p>
        <h3>Ingredients:</h3>
        <ul>${fetchIngredients(meal)}</ul>
        <h3>Procedure:</h3>
        <p>${meal.strInstructions}</p>
    `;

    document.querySelector('.recipe-details').style.display = "block";
};

// closeing popup
recipeCloseBtn.addEventListener('click', () => {
    document.querySelector('.recipe-details').style.display = "none";
});

// search
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput !== "") {
        fetchRecipes(searchInput);
    }
});