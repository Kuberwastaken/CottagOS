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
    
    // Create flipping page element
    const flippingPage = document.createElement('div');
    flippingPage.classList.add('flipping-page');
    const flippingPageContent = document.createElement('div');
    flippingPageContent.classList.add('flipping-page-content');
    const flippingPageBack = document.createElement('div');
    flippingPageBack.classList.add('flipping-page-back');
    
    // Add pages to container
    flippingPage.appendChild(flippingPageContent);
    flippingPage.appendChild(flippingPageBack);
    bookPages.appendChild(leftPage);
    bookPages.appendChild(rightPage);
    bookPages.appendChild(flippingPage);
    recipeContentArea.appendChild(bookPages);

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
    
    // Initialize with the same content as the right page
    flippingPageContent.innerHTML = rightPage.innerHTML;

    // Add book styling if not already present
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .book-pages {
        display: flex;
        width: 100%;
        height: 100%;
        perspective: 1000px;
        transform-style: preserve-3d;
        position: relative;
        overflow: hidden;
      }
      .left-page, .right-page {
        flex: 1;
        background-color: #f8f5e6;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        position: relative;
        backface-visibility: hidden;
      }
      .left-page {
        border-right: 1px solid #d4c1a1;
        border-radius: 5px 0 0 5px;
        z-index: 1;
      }
      .right-page {
        border-left: 1px solid #d4c1a1;
        border-radius: 0 5px 5px 0;
        z-index: 0;
      }
      
      /* Page flipping effect */
      .flipping-page {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        overflow: visible;
        z-index: 2;
        transform-origin: left center;
        transform-style: preserve-3d;
        transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
        border-radius: 0 5px 5px 0;
      }
      
      .flipping-page-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f8f5e6;
        backface-visibility: hidden;
        padding: 20px;
        box-sizing: border-box;
        border-left: 1px solid #d4c1a1;
        border-radius: 0 5px 5px 0;
        overflow: auto;
      }
      
      .flipping-page-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: rotateY(180deg);
        background-color: #f8f5e6;
        backface-visibility: hidden;
        padding: 20px;
        box-sizing: border-box;
        border-right: 1px solid #d4c1a1;
        border-radius: 5px 0 0 5px;
        overflow: auto;
      }
      
      .page-flip-next .flipping-page {
        transform: rotateY(-180deg);
        box-shadow: -5px 5px 10px rgba(0,0,0,0.1);
      }
      
      /* Page fold shadow effect */
      .flipping-page::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        height: 100%;
        background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
        opacity: 0;
        transition: opacity 0.6s ease;
        z-index: 10;
      }
      
      .page-flip-next .flipping-page::after {
        opacity: 1;
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
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        padding: 8px;
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
        image: 'assets/recipes/moonbeam-tea.svg',
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
        image: 'assets/recipes/forest-mushroom-stew.svg',
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
        image: 'assets/recipes/lavender-shortbread.svg',
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
    
    // Create page turn sound effect
    const pageTurnSound = new Audio('https://cdn.jsdelivr.net/gh/Kuberwastaken/CottagOS@main/assets/sounds/page-turn.mp3');
    pageTurnSound.volume = 0.3;

    function updatePages() {
      const recipeIndex = currentPagePair;
      if (recipeIndex >= recipes.length) {
        // No more recipes, disable next button
        nextButton.style.opacity = "0.5";
        nextButton.style.pointerEvents = "none";
      } else {
        nextButton.style.opacity = "1";
        nextButton.style.pointerEvents = "auto";
      }
      
      if (recipeIndex <= 0) {
        // First page, disable prev button
        prevButton.style.opacity = "0.5";
        prevButton.style.pointerEvents = "none";
      } else {
        prevButton.style.opacity = "1";
        prevButton.style.pointerEvents = "auto";
      }
      
      if (recipeIndex < recipes.length) {
        const recipe = recipes[recipeIndex];
        
        // Update left page (recipe details)
        leftPage.querySelector('.recipe-title').textContent = recipe.title;
        leftPage.querySelector('.recipe-description').textContent = recipe.description;
        
        // Set the recipe image
        const recipeImage = leftPage.querySelector('.recipe-image');
        if (recipe.image && recipe.image.endsWith('.svg')) {
          // For SVG images, we'll embed them directly
          fetch(recipe.image)
            .then(response => response.text())
            .then(svgContent => {
              recipeImage.innerHTML = svgContent;
              recipeImage.style.backgroundImage = 'none';
              recipeImage.style.display = 'flex';
              recipeImage.style.justifyContent = 'center';
              recipeImage.style.alignItems = 'center';
            })
            .catch(error => {
              console.error('Error loading SVG:', error);
              recipeImage.style.backgroundImage = `url(${recipe.image})`;
              recipeImage.innerHTML = '';
            });
        } else {
          // For non-SVG images, use background-image
          recipeImage.style.backgroundImage = `url(${recipe.image})`;
          recipeImage.innerHTML = '';
        }
        
        // Update ingredients
        const ingredientsList = leftPage.querySelector('.ingredients-list');
        // Clear existing ingredients, keeping the title
        const ingredientsTitle = ingredientsList.querySelector('.ingredients-title');
        ingredientsList.innerHTML = '';
        ingredientsList.appendChild(ingredientsTitle);
        
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
        
        // Update right page (instructions)
        const instructionsList = rightPage.querySelector('.instructions-list');
        // Clear existing instructions, keeping the title
        const instructionsTitle = instructionsList.querySelector('.instructions-title');
        instructionsList.innerHTML = '';
        instructionsList.appendChild(instructionsTitle);
        
        recipe.instructions.forEach((instruction, index) => {
          const item = document.createElement('div');
          item.classList.add('instruction-item');
          
          const step = document.createElement('div');
          step.classList.add('instruction-step');
          step.textContent = index + 1;
          
          const text = document.createElement('div');
          text.classList.add('instruction-text');
          text.textContent = instruction;
          
          item.appendChild(step);
          item.appendChild(text);
          instructionsList.appendChild(item);
        });
        
        // Update page numbers to reflect recipe index
        leftPage.querySelector('.page-number').textContent = (recipeIndex * 2) + 1;
        rightPage.querySelector('.page-number').textContent = (recipeIndex * 2) + 2;
        
        // Update flipping page content - create a direct copy of the right page content
        flippingPageContent.innerHTML = '';
        
        // Clone the right page content
        const rightTitle = document.createElement('div');
        rightTitle.classList.add('instructions-title');
        rightTitle.textContent = 'Instructions';
        flippingPageContent.appendChild(rightTitle);
        
        // Clone the instruction list items
        const instructionItems = Array.from(rightPage.querySelectorAll('.instruction-item'));
        instructionItems.forEach(item => {
          flippingPageContent.appendChild(item.cloneNode(true));
        });
        
        // Add page number
        const pageNum = document.createElement('div');
        pageNum.classList.add('page-number');
        pageNum.textContent = (recipeIndex * 2) + 2;
        pageNum.style.left = '20px';
        flippingPageContent.appendChild(pageNum);
        
        // Check if there's a next recipe to prepare the back of the flipping page
        if (recipeIndex + 1 < recipes.length) {
          const nextRecipe = recipes[recipeIndex + 1];
          
          // Update the back of the flipping page with the next recipe's content
          flippingPageBack.innerHTML = '';
          
          // Add recipe title
          const titleElem = document.createElement('div');
          titleElem.classList.add('recipe-title');
          titleElem.textContent = nextRecipe.title;
          flippingPageBack.appendChild(titleElem);
          
          // Add recipe description
          const descElem = document.createElement('div');
          descElem.classList.add('recipe-description');
          descElem.textContent = nextRecipe.description;
          flippingPageBack.appendChild(descElem);
          
          // Add recipe image
          const imgElem = document.createElement('div');
          imgElem.classList.add('recipe-image');
          imgElem.style.backgroundImage = `url(${nextRecipe.image})`;
          flippingPageBack.appendChild(imgElem);
          
          // Add ingredients list
          const ingredientsListElem = document.createElement('div');
          ingredientsListElem.classList.add('ingredients-list');
          
          const ingredientsTitleElem = document.createElement('div');
          ingredientsTitleElem.classList.add('ingredients-title');
          ingredientsTitleElem.textContent = 'Ingredients';
          ingredientsListElem.appendChild(ingredientsTitleElem);
          
          nextRecipe.ingredients.forEach(ingredient => {
            const item = document.createElement('div');
            item.classList.add('ingredient-item');
            
            const checkbox = document.createElement('div');
            checkbox.classList.add('ingredient-checkbox');
            
            const name = document.createElement('div');
            name.classList.add('ingredient-name');
            name.textContent = ingredient;
            
            item.appendChild(checkbox);
            item.appendChild(name);
            ingredientsListElem.appendChild(item);
          });
          
          flippingPageBack.appendChild(ingredientsListElem);
          
          // Add page number
          const pageNumBack = document.createElement('div');
          pageNumBack.classList.add('page-number');
          pageNumBack.textContent = (recipeIndex + 1) * 2 + 1;
          pageNumBack.style.right = '20px';
          flippingPageBack.appendChild(pageNumBack);
        }
      }
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
        // Play page turn sound
        pageTurnSound.currentTime = 0;
        pageTurnSound.play().catch(e => console.log('Sound play error:', e));
        
        // Update the content immediately for previous page
        currentPagePair--;
        updatePages();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentPagePair < recipes.length - 1) {
        // Play page turn sound
        pageTurnSound.currentTime = 0;
        pageTurnSound.play().catch(e => console.log('Sound play error:', e));
        
        // Add page flipping animation class
        bookPages.classList.add('page-flip-next');
        
        // Wait for animation to complete before updating content
        setTimeout(() => {
          currentPagePair++;
          updatePages();
          bookPages.classList.remove('page-flip-next');
        }, 600);
      }
    });
  }
}

// Add to window object for global access
window.cottageOS = window.cottageOS || {};
window.cottageOS.RecipeBook = RecipeBook;