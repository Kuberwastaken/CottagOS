// CottagOS Recipe Book
class RecipeBook {
  static initRecipes(windowNode) {
    console.log("Initializing recipe book...");
    const recipeContentArea = windowNode.querySelector('.recipe-content-area');
    const prevButton = windowNode.querySelector('.prev-page');
    const nextButton = windowNode.querySelector('.next-page');

    if (!recipeContentArea || !prevButton || !nextButton) {
      console.error("Recipe Book elements not found!");
      return;
    }

    // Create book pages structure
    const bookPages = document.createElement('div');
    bookPages.classList.add('book-pages');
    const leftPage = document.createElement('div');
    leftPage.classList.add('left-page');
    const rightPage = document.createElement('div');
    rightPage.classList.add('right-page');
    
    // Add page structure
    leftPage.innerHTML = `
      <div class="recipe-title"></div>
      <div class="recipe-description"></div>
      <div class="recipe-image"></div>
      <div class="ingredients-list">
        <div class="ingredients-title">Ingredients</div>
      </div>
      <div class="page-number">1</div>
    `;
    
    rightPage.innerHTML = `
      <div class="instructions-list">
        <div class="instructions-title">Instructions</div>
      </div>
      <div class="page-number">2</div>
    `;
    
    bookPages.appendChild(leftPage);
    bookPages.appendChild(rightPage);
    recipeContentArea.appendChild(bookPages);

    // Add book styling if not already present
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .book-pages {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .left-page, .right-page {
        flex: 1;
        background-color: #f8f5e6;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        position: relative;
      }
      .left-page {
        border-right: 1px solid #d4c1a1;
        border-radius: 5px 0 0 5px;
      }
      .right-page {
        border-left: 1px solid #d4c1a1;
        border-radius: 0 5px 5px 0;
      }
      .recipe-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 24px;
        color: #5a4a42;
        margin-bottom: 10px;
      }
      .recipe-description {
        font-family: 'Quicksand', sans-serif;
        font-size: 14px;
        color: #7d6b5d;
        margin-bottom: 15px;
      }
      .recipe-image {
        width: 100%;
        height: 120px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-bottom: 15px;
      }
      .ingredients-title, .instructions-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        color: #5a4a42;
        margin-bottom: 10px;
        border-bottom: 1px solid #d4c1a1;
        padding-bottom: 5px;
      }
      .ingredient-item, .instruction-item {
        display: flex;
        margin-bottom: 8px;
      }
      .ingredient-checkbox {
        width: 16px;
        height: 16px;
        border: 1px solid #d4c1a1;
        border-radius: 3px;
        margin-right: 8px;
        cursor: pointer;
      }
      .ingredient-checkbox.checked {
        background-color: #9caf88;
        position: relative;
      }
      .ingredient-checkbox.checked:after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 12px;
        top: -1px;
        left: 2px;
      }
      .ingredient-name {
        font-family: 'Quicksand', sans-serif;
        font-size: 14px;
        color: #7d6b5d;
      }
      .instruction-step {
        width: 24px;
        height: 24px;
        background-color: #9caf88;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
      }
      .instruction-text {
        font-family: 'Quicksand', sans-serif;
        font-size: 14px;
        color: #7d6b5d;
        flex: 1;
      }
      .page-number {
        position: absolute;
        bottom: 10px;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        color: #7d6b5d;
      }
      .left-page .page-number {
        right: 20px;
      }
      .right-page .page-number {
        left: 20px;
      }
      .book-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
      }
      .page-button {
        width: 30px;
        height: 30px;
        background-color: #9caf88;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
      }
      .page-button:hover {
        background-color: #7d9163;
      }
    `;
    document.head.appendChild(styleElement);

    // Recipe data
    const recipes = [
      {
        title: 'Moonbeam Tea',
        description: 'A calming herbal tea that shimmers with the light of the moon. Perfect for evening contemplation.',
        image: 'assets/icons/recipes.svg', // Using recipes icon as fallback
        ingredients: [
          '1 tbsp dried chamomile flowers',
          '1 tsp dried lavender buds',
          '1/2 tsp vanilla bean powder',
          'Honey to taste',
          'Edible silver dust (optional)'
        ],
        instructions: [
          'Boil water in a ceramic kettle under the moonlight (or regular kitchen light).',
          'Place herbs in a tea infuser and add to your favorite teacup.',
          'Pour hot water over herbs and cover with a saucer.',
          'Let steep for 5-7 minutes while contemplating the day\'s blessings.',
          'Remove infuser, add honey to taste, and sprinkle with silver dust if using.',
          'Sip slowly while watching the stars through your window.'
        ]
      },
      {
        title: 'Forest Mushroom Stew',
        description: 'A hearty vegetarian stew featuring wild mushrooms and root vegetables, perfect for a cozy dinner.',
        image: 'assets/icons/recipes.svg', // Using recipes icon as fallback
        ingredients: [
          '2 cups assorted wild mushrooms',
          '1 onion, diced',
          '2 carrots, chopped',
          '1 potato, cubed',
          '3 cloves garlic, minced',
          '1 sprig rosemary',
          '2 cups vegetable broth',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Sauté onions and garlic in a cast iron pot until translucent.',
          'Add mushrooms and cook until they release their moisture.',
          'Add carrots, potato, and rosemary.',
          'Pour in vegetable broth and simmer for 30 minutes.',
          'Season with salt and pepper.',
          'Serve with crusty bread and a sprinkle of fresh herbs.'
        ]
      },
      {
        title: 'Lavender Shortbread',
        description: 'Delicate, buttery cookies infused with lavender, perfect with afternoon tea.',
        image: 'assets/icons/recipes.svg', // Using recipes icon as fallback
        ingredients: [
          '1 cup butter, softened',
          '1/2 cup sugar',
          '2 cups flour',
          '1 tbsp dried culinary lavender',
          '1/4 tsp salt',
          '1 tsp vanilla extract'
        ],
        instructions: [
          'Cream butter and sugar until light and fluffy.',
          'Mix in vanilla extract.',
          'In a separate bowl, combine flour, lavender, and salt.',
          'Gradually add dry ingredients to butter mixture.',
          'Form dough into a log, wrap in parchment, and chill for 1 hour.',
          'Slice into rounds and bake at 325°F for 12-15 minutes.'
        ]
      }
    ];

    let currentPagePair = 0;

    function updatePages() {
      const recipeIndex = currentPagePair;
      const recipe = recipes[recipeIndex];

      if (!recipe) return;

      // Clear previous content cleanly
      const ingredientsList = leftPage.querySelector('.ingredients-list');
      const instructionsList = rightPage.querySelector('.instructions-list');
      
      if (ingredientsList) {
        ingredientsList.innerHTML = '<div class="ingredients-title">Ingredients</div>';
      }
      
      if (instructionsList) {
        instructionsList.innerHTML = '<div class="instructions-title">Instructions</div>';
      }

      // Update left page
      const titleElement = leftPage.querySelector('.recipe-title');
      const descriptionElement = leftPage.querySelector('.recipe-description');
      const recipeImageDiv = leftPage.querySelector('.recipe-image');
      
      if (titleElement) titleElement.textContent = recipe.title;
      if (descriptionElement) descriptionElement.textContent = recipe.description;
      
      if (recipeImageDiv) {
        try {
          // Using the recipes icon as a fallback if image doesn't exist
          recipeImageDiv.style.backgroundImage = `url(${recipe.image})`;
          recipeImageDiv.style.display = 'block';
          
          // Create a backup image element to handle load errors
          const testImg = new Image();
          testImg.onerror = () => {
            // If image fails to load, use a CSS gradient as fallback
            recipeImageDiv.style.backgroundImage = 'linear-gradient(135deg, #f0e6d2 0%, #d4c1a1 100%)';
          };
          testImg.src = recipe.image;
        } catch (e) {
          console.error("Error setting recipe image:", e);
          recipeImageDiv.style.backgroundImage = 'linear-gradient(135deg, #f0e6d2 0%, #d4c1a1 100%)';
        }
      }

      // Add new ingredients
      if (ingredientsList && recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const item = document.createElement('div');
          item.classList.add('ingredient-item');

          const checkbox = document.createElement('div');
          checkbox.classList.add('ingredient-checkbox');
          checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
          });

          const name = document.createElement('div');
          name.classList.add('ingredient-name');
          name.textContent = ingredient;

          item.appendChild(checkbox);
          item.appendChild(name);
          ingredientsList.appendChild(item);
        });
      }

      // Update right page
      if (instructionsList && recipe.instructions) {
        recipe.instructions.forEach((instruction, index) => {
          const item = document.createElement('div');
          item.classList.add('instruction-item');

          const step = document.createElement('span');
          step.classList.add('instruction-step');
          step.textContent = index + 1;

          const text = document.createElement('span');
          text.classList.add('instruction-text');
          text.textContent = instruction;

          item.appendChild(step);
          item.appendChild(text);
          instructionsList.appendChild(item);
        });
      }

      // Update page numbers
      const leftPageNumber = leftPage.querySelector('.page-number');
      const rightPageNumber = rightPage.querySelector('.page-number');
      
      if (leftPageNumber) leftPageNumber.textContent = recipeIndex * 2 + 1;
      if (rightPageNumber) rightPageNumber.textContent = recipeIndex * 2 + 2;
    }

    // Initial page load
    try {
      updatePages();
    } catch (e) {
      console.error("Error initializing recipe book:", e);
    }

    // Navigation
    prevButton.addEventListener('click', () => {
      if (currentPagePair > 0) {
        currentPagePair--;
        updatePages();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentPagePair < recipes.length - 1) {
        currentPagePair++;
        updatePages();
      }
    });
  }
}

// Add to window object for global access
window.cottageOS = window.cottageOS || {};
window.cottageOS.RecipeBook = RecipeBook;