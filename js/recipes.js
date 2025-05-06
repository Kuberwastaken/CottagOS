// CottagOS Recipe Book
class RecipeBook {
  static initRecipes(windowNode) {
    const bookPages = windowNode.querySelector('.book-pages');
    const leftPage = windowNode.querySelector('.left-page');
    const rightPage = windowNode.querySelector('.right-page');
    const prevButton = windowNode.querySelector('.prev-page');
    const nextButton = windowNode.querySelector('.next-page');

    if (!bookPages || !leftPage || !rightPage || !prevButton || !nextButton) {
      console.error("Recipe Book elements not found!");
      return;
    }

    // Recipe data
    const recipes = [
      {
        title: 'Moonbeam Tea',
        description: 'A calming herbal tea that shimmers with the light of the moon. Perfect for evening contemplation.',
        image: 'assets/images/moonbeam-tea.jpg',
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
        image: 'assets/images/mushroom-stew.jpg',
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
        image: 'assets/images/lavender-cookies.jpg',
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
      ingredientsList.innerHTML = '<div class="ingredients-title">Ingredients</div>';
      instructionsList.innerHTML = '<div class="instructions-title">Instructions</div>';

      // Update left page
      leftPage.querySelector('.recipe-title').textContent = recipe.title;
      leftPage.querySelector('.recipe-description').textContent = recipe.description;
      const recipeImageDiv = leftPage.querySelector('.recipe-image');
      if (recipe.image) {
        recipeImageDiv.style.backgroundImage = `url(${recipe.image})`;
        recipeImageDiv.style.display = 'block';
      } else {
        recipeImageDiv.style.backgroundImage = 'none';
        recipeImageDiv.style.display = 'none';
      }

      // Add new ingredients
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

      // Update right page
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

      // Update page numbers
      leftPage.querySelector('.page-number').textContent = recipeIndex * 2 + 1;
      rightPage.querySelector('.page-number').textContent = recipeIndex * 2 + 2;
    }

    // Initial page load
    updatePages();

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