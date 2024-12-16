const apiBase = "https://www.themealdb.com/api/json/v1/1";
let currentRecipeId = null;

async function searchRecipes() {
  const ingredient = document.getElementById("ingredient").value;
  if (!ingredient) return alert("Please enter an ingredient!");

  document.getElementById("loading").style.display = "block";
  document.querySelector(".search-box").classList.add("search-box-top");

  setTimeout(async () => {
    try {
      const response = await fetch(`${apiBase}/filter.php?i=${ingredient}`);
      const data = await response.json();

      document.getElementById("loading").style.display = "none";
      displayResults(data.meals);

    } catch (error) {
      alert("Error fetching recipes");
      console.error(error);
      document.getElementById("loading").style.display = "none";
    }
  }, 1000);
}

function displayResults(meals) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  
  meals.forEach(meal => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("recipe-card");
    mealDiv.id = `recipe-${meal.idMeal}`;

    mealDiv.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <p id="category-${meal.idMeal}">Loading category...</p>
    `;
    
    mealDiv.onclick = () => showRecipeDetails(meal.idMeal);
    results.appendChild(mealDiv);

    fetchRecipeCategory(meal.idMeal);
  });
}

function moveSearchBoxToTop() {
  document.querySelector(".search-box").classList.add("search-box-top");
}

async function fetchRecipeCategory(id) {
  try {
    const response = await fetch(`${apiBase}/lookup.php?i=${id}`);
    const data = await response.json();
    const category = data.meals[0].strCategory;

    const categoryElement = document.getElementById(`category-${id}`);
    if (categoryElement) {
      categoryElement.textContent = `Category: ${category}`;
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
}

async function showRecipeDetails(id) {
  const response = await fetch(`${apiBase}/lookup.php?i=${id}`);
  const data = await response.json();
  const meal = data.meals[0];

  currentRecipeId = id;

  document.getElementById("recipeTitle").textContent = meal.strMeal;
  document.getElementById("recipeImage").src = meal.strMealThumb;
  document.getElementById("recipeCategory").textContent = meal.strCategory;
  document.getElementById("recipeArea").textContent = meal.strArea;
  document.getElementById("recipeInstructions").textContent = meal.strInstructions;

  document.getElementById("recipeOverlay").style.display = "flex";
}

function closeOverlay() {
  document.getElementById("recipeOverlay").style.display = "none";
}

function deleteRecipe() {
  closeOverlay();

  if (currentRecipeId) {
    const recipeElement = document.getElementById(`recipe-${currentRecipeId}`);
    if (recipeElement) {
      recipeElement.remove();
    }
  }

  currentRecipeId = null;
}
