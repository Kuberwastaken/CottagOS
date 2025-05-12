// SYNEVA - Advanced Cottagecore AI Implementation
window.initSyneva = function(windowElement) {
  const synevaInput = windowElement.querySelector('.syneva-input');
  const synevaOutput = windowElement.querySelector('.syneva-output');
  
  // SYNEVA Core Intelligence System
  class Syneva {
    constructor() {
      this.memory = this.loadMemory() || {};
      this.sessionMemory = []; // Short-term memory for current session
      this.longTermMemory = this.loadLongTermMemory() || {}; // Structured knowledge
      this.vocabulary = {};
      this.context = [];
      this.lastInput = "";
      this.mood = "whimsical"; // Tracks SYNEVA's current mood
      this.personalityTraits = {
        whimsy: 0.8,
        wisdom: 0.7,
        curiosity: 0.9,
        mysticism: 0.6
      };
      this.userPreferences = this.loadUserPreferences() || {};
      this.conversationTopics = new Set(); // Track topics in current conversation
      this.knowledgeGraph = this.initKnowledgeGraph();
      this.lastResponseType = null; // Track what kind of response was last given
      
      // Initialize sentiment analysis system
      this.sentimentLexicon = this.initSentimentLexicon();
      
      // Initialize seasonal awareness
      this.seasons = ["winter", "spring", "summer", "autumn"];
      this.currentSeason = this.determineSeason();
      
      // Initialize markov chain for more natural responses
      this.markovChains = this.loadMarkovChains() || this.initMarkovChains();
      
      // Initialize with some predefined personas
      this.personas = {
        "forest_sprite": {
          style: "playful and ethereal",
          vocabulary: ["whisper", "flutter", "dance", "glimmer", "enchant"],
          phrases: ["*giggles softly*", "Do you hear the whispers of the ancient trees?", "The forest has many secrets to share..."]
        },
        "cottage_witch": {
          style: "wise and mysterious",
          vocabulary: ["brew", "forage", "enchant", "remedy", "hearth"],
          phrases: ["Let me consult my grimoire...", "The herbs tell me that...", "By the light of the moon..."]
        },
        "garden_keeper": {
          style: "nurturing and practical",
          vocabulary: ["grow", "bloom", "nurture", "harvest", "plant"],
          phrases: ["As we tend to our gardens, so we tend to our souls.", "Every seed contains a universe of possibility.", "The earth remembers our kindness."]
        }
      };
      this.currentPersona = "forest_sprite";
    }

    initSentimentLexicon() {
      // A more extensive sentiment lexicon for detecting user emotions
      return {
        positive: ["happy", "good", "great", "wonderful", "love", "like", "enjoy", "beautiful", "joy", "pleasant", 
                  "delightful", "content", "peaceful", "serene", "tranquil", "blissful", "enchanted", "magical"],
        negative: ["sad", "bad", "awful", "terrible", "hate", "dislike", "upset", "angry", "worry", "concern", 
                  "anxious", "troubled", "distressed", "gloomy", "melancholy", "weary", "exhausted"],
        neutral: ["think", "consider", "maybe", "perhaps", "possibly", "wonder", "curious", "interested"]
      };
    }
    
    initKnowledgeGraph() {
      // Initialize a basic knowledge graph for topic relationships
      return {
        "garden": ["plants", "flowers", "herbs", "vegetables", "soil", "compost", "growth"],
        "cottage": ["home", "comfort", "decor", "cozy", "fireplace", "rustic", "quaint"],
        "forest": ["trees", "mushrooms", "animals", "birds", "moss", "ferns", "wilderness"],
        "cooking": ["recipe", "baking", "bread", "jam", "preserve", "hearty", "nourishing"],
        "crafting": ["knitting", "sewing", "weaving", "pottery", "woodwork", "handmade"],
        "seasons": ["spring", "summer", "autumn", "winter", "harvest", "planting", "dormancy", "renewal"],
        "wellness": ["tea", "remedy", "healing", "rest", "nature", "mindfulness", "balance"]
      };
    }
    
    initMarkovChains() {
      // Start with some cottagecore-themed sentence structures
      return {
        starters: ["In the quiet of", "Nestled among", "Beneath the ancient", "As the sun filters through", 
                   "Within the shelter of", "By the light of", "Amidst the gentle", "When the wind carries"],
        middles: ["the rustling leaves", "a bed of wildflowers", "the weathered stones", "the morning mist", 
                  "the trickling stream", "the dancing shadows", "the whispering trees", "the ancient wisdom"],
        transitions: ["one might find", "there lives", "you can discover", "we often encounter", 
                      "there exists", "time seems to", "wisdom teaches us", "magic reveals"],
        endings: ["a deeper understanding", "moments of pure tranquility", "the answers you seek", 
                  "connections to the old ways", "the beauty of simple things", "nature's gentle guidance"]
      };
    }
    
    determineSeason() {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) return "spring";
      if (month >= 5 && month <= 7) return "summer";
      if (month >= 8 && month <= 10) return "autumn";
      return "winter";
    }
    
    loadMemory() {
      try {
        const storageItem = localStorage.getItem('synevaMemory');
        return storageItem ? JSON.parse(storageItem) : {};
      } catch {
        return {};
      }
    }
    
    saveMemory() {
      try {
        localStorage.setItem('synevaMemory', JSON.stringify(this.memory));
      } catch {
        console.log("Couldn't save Syneva memory");
      }
    }
    
    loadLongTermMemory() {
      try {
        const storageItem = localStorage.getItem('synevaLongTermMemory');
        return storageItem ? JSON.parse(storageItem) : {};
      } catch {
        return {};
      }
    }
    
    saveLongTermMemory() {
      try {
        localStorage.setItem('synevaLongTermMemory', JSON.stringify(this.longTermMemory));
        return true;
      } catch {
        console.log("Couldn't save long-term memory");
        return false;
      }
    }
    
    loadMarkovChains() {
      try {
        const chains = localStorage.getItem('synevaMarkovChains');
        return chains ? JSON.parse(chains) : null;
      } catch {
        return null;
      }
    }
    
    saveMarkovChains() {
      try {
        localStorage.setItem('synevaMarkovChains', JSON.stringify(this.markovChains));
      } catch {
        console.log("Couldn't save markov chains");
      }
    }
    
    loadUserPreferences() {
      try {
        const prefs = localStorage.getItem('synevaUserPreferences');
        return prefs ? JSON.parse(prefs) : {};
      } catch {
        return {};
      }
    }
    
    saveUserPreferences() {
      try {
        localStorage.setItem('synevaUserPreferences', JSON.stringify(this.userPreferences));
      } catch {
        console.log("Couldn't save user preferences");
      }
    }
    
    analyzeInput(input) {
      const lowerInput = input.toLowerCase();
      const words = lowerInput.split(/\s+/).filter(w => w.length > 2);
      
      // Advanced input analysis
      const analysis = {
        keyWords: [],
        sentiment: "neutral",
        topics: [],
        complexity: 0,
        questions: lowerInput.includes('?'),
        commands: this.detectCommands(lowerInput),
        entitiesRecognized: this.recognizeEntities(input)
      };
      
      // Extract key words with basic TF-IDF like approach
      words.forEach(word => {
        // Skip common words
        if (["the", "and", "that", "what", "this", "with", "for", "from"].includes(word)) return;
        
        analysis.keyWords.push({
          word: word,
          importance: this.getFrequency(word) ? 1 / this.getFrequency(word) : 1 // Higher for rarer words
        });
      });
      
      // Sort by importance
      analysis.keyWords.sort((a, b) => b.importance - a.importance);
      
      // Detect sentiment
      let sentimentScore = 0;
      words.forEach(word => {
        if (this.sentimentLexicon.positive.some(w => word.includes(w))) sentimentScore++;
        if (this.sentimentLexicon.negative.some(w => word.includes(w))) sentimentScore--;
      });
      
      if (sentimentScore > 1) analysis.sentiment = "positive";
      else if (sentimentScore < -1) analysis.sentiment = "negative";
      
      // Detect topics from knowledge graph
      Object.entries(this.knowledgeGraph).forEach(([topic, relatedTerms]) => {
        if (words.some(word => 
            topic.includes(word) || 
            word.includes(topic) || 
            relatedTerms.some(term => word.includes(term) || term.includes(word)))) {
          analysis.topics.push(topic);
          this.conversationTopics.add(topic);
        }
      });
      
      // Estimate complexity based on unique words and sentence structure
      analysis.complexity = new Set(words).size / words.length + (input.split(/[.!?]/).length > 2 ? 0.5 : 0);
      
      return analysis;
    }
    
    recognizeEntities(input) {
      // Simple named entity recognition
      const entities = {
        names: [],
        places: [],
        objects: [],
        concepts: []
      };
      
      // Extract potential proper nouns (capitalized words not at start of sentence)
      const words = input.split(/\s+/);
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        if (word.length > 0 && word[0] === word[0].toUpperCase()) {
          // Try to classify the entity
          if (this.knowledgeGraph.forest.includes(word.toLowerCase()) || 
              this.knowledgeGraph.garden.includes(word.toLowerCase())) {
            entities.objects.push(word);
          } else if (word.length > 4) { // More likely to be a name or place if longer
            entities.names.push(word);
          }
        }
      }
      
      // Extract abstract concepts
      const abstractConcepts = ["love", "time", "beauty", "peace", "harmony", "balance", "wisdom"];
      abstractConcepts.forEach(concept => {
        if (input.toLowerCase().includes(concept)) {
          entities.concepts.push(concept);
        }
      });
      
      return entities;
    }
    
    detectCommands(input) {
      const commandPatterns = [
        { pattern: /tell me about/i, command: "inquire" },
        { pattern: /how (do|can|would) (i|you|we|one)/i, command: "howto" },
        { pattern: /\b(remember|note|save)\b/i, command: "remember" },
        { pattern: /\b(what is|who is|where is)\b/i, command: "define" },
        { pattern: /\b(show|display|draw)\b/i, command: "visualize" }
      ];
      
      return commandPatterns
        .filter(cmd => cmd.pattern.test(input))
        .map(cmd => cmd.command);
    }
    
    generateMarkovResponse() {
      // Generate a poetic response using our markov chains
      const starter = this.markovChains.starters[Math.floor(Math.random() * this.markovChains.starters.length)];
      const middle = this.markovChains.middles[Math.floor(Math.random() * this.markovChains.middles.length)];
      const transition = this.markovChains.transitions[Math.floor(Math.random() * this.markovChains.transitions.length)];
      const ending = this.markovChains.endings[Math.floor(Math.random() * this.markovChains.endings.length)];
      
      return `${starter} ${middle}, ${transition} ${ending}.`;
    }
    
    learnAssociation(input, output) {
      // More sophisticated learning system
      // Create a key from the input by extracting key phrases
      const analysis = this.analyzeInput(input);
      let keyPhrases = analysis.keyWords.slice(0, 2).map(k => k.word);
      
      if (keyPhrases.length === 0) {
        // Fall back to last two words if no key words found
        keyPhrases = input.toLowerCase()
          .replace(/\W/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 0)
          .slice(-2);
      }
      
      const key = keyPhrases.join(' ');
      if (!key) return;
      
      // Initialize array for this key if it doesn't exist
      this.memory[key] = this.memory[key] || [];
      
      // Add output to this key's array with a timestamp and analysis metadata
      this.memory[key].push({
        response: output,
        timestamp: Date.now(),
        inputAnalysis: {
          sentiment: analysis.sentiment,
          topics: analysis.topics
        }
      });
      
      // Limit to 5 responses per key, keeping the most recent
      if (this.memory[key].length > 5) {
        this.memory[key].shift();
      }
      
      // Update session memory
      this.sessionMemory.push({
        input: input,
        output: output,
        timestamp: Date.now()
      });
      if (this.sessionMemory.length > 10) this.sessionMemory.shift();
      
      // Update long-term memory with topics and sentiments
      analysis.topics.forEach(topic => {
        this.longTermMemory[topic] = this.longTermMemory[topic] || { mentions: 0, sentiment: 0, lastMentioned: null };
        this.longTermMemory[topic].mentions++;
        this.longTermMemory[topic].lastMentioned = Date.now();
        
        // Update sentiment for topic
        if (analysis.sentiment === "positive") this.longTermMemory[topic].sentiment += 0.1;
        else if (analysis.sentiment === "negative") this.longTermMemory[topic].sentiment -= 0.1;
        
        // Constrain sentiment to [-1, 1]
        this.longTermMemory[topic].sentiment = Math.max(-1, Math.min(1, this.longTermMemory[topic].sentiment));
      });
      
      // Learn user preferences
      if (analysis.sentiment === "positive" && analysis.topics.length > 0) {
        analysis.topics.forEach(topic => {
          this.userPreferences[topic] = (this.userPreferences[topic] || 0) + 0.2;
          this.userPreferences[topic] = Math.min(1, this.userPreferences[topic]); // Cap at 1
        });
      } else if (analysis.sentiment === "negative" && analysis.topics.length > 0) {
        analysis.topics.forEach(topic => {
          this.userPreferences[topic] = (this.userPreferences[topic] || 0) - 0.1;
          this.userPreferences[topic] = Math.max(-1, this.userPreferences[topic]); // Floor at -1
        });
      }
      
      // Update vocabulary frequency
      input.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 2) {
          this.vocabulary[word] = (this.vocabulary[word] || 0) + 1;
        }
      });
      
      // Learn new markov chain components if the input is complex enough
      if (analysis.complexity > 0.7) {
        const sentences = input.split(/[.!?]/).filter(s => s.trim().length > 0);
        sentences.forEach(sentence => {
          const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
          if (words.length >= 3) {
            // Learn sentence starters
            const starter = words.slice(0, 2).join(' ');
            if (starter.length > 5 && !this.markovChains.starters.includes(starter)) {
              if (Math.random() < 0.3) { // Only learn sometimes
                this.markovChains.starters.push(starter);
              }
            }
            
            // Learn sentence middles
            if (words.length >= 4) {
              const middle = words.slice(Math.floor(words.length/3), Math.floor(words.length/3*2)).join(' ');
              if (middle.length > 5 && !this.markovChains.middles.includes(middle)) {
                if (Math.random() < 0.2) {
                  this.markovChains.middles.push(middle);
                }
              }
            }
            
            // Learn sentence endings
            const ending = words.slice(-2).join(' ');
            if (ending.length > 5 && !this.markovChains.endings.includes(ending)) {
              if (Math.random() < 0.2) {
                this.markovChains.endings.push(ending);
              }
            }
          }
        });
      }
      
      // Save the memory
      this.saveMemory();
      this.saveLongTermMemory();
      this.saveUserPreferences();
      this.saveMarkovChains();
    }
    
    getFrequency(word) {
      return word in this.vocabulary ? this.vocabulary[word] : 0;
    }
    
    // Function to get a response that feels more coherent with recent conversation
    getCoherentResponse(topics) {
      if (this.sessionMemory.length < 2) return null;
      
      // Find a response related to the current topics from recent conversation
      const recentResponses = this.sessionMemory.slice(-5);
      
      for (const topic of topics) {
        for (const memory of recentResponses) {
          const analysis = this.analyzeInput(memory.input);
          if (analysis.topics.includes(topic)) {
            // Modify the response slightly for variety
            const words = memory.output.split(' ');
            if (words.length > 5) {
              // Replace a word or two for variation
              const replaceIndex = 3 + Math.floor(Math.random() * (words.length - 5));
              const synonyms = {
                "beautiful": ["lovely", "enchanting", "gorgeous"],
                "good": ["wonderful", "marvelous", "splendid"],
                "interesting": ["fascinating", "intriguing", "curious"],
                "forest": ["woodland", "grove", "woods"],
                "garden": ["meadow", "flora", "greenery"],
                "magic": ["enchantment", "mystical", "arcane"],
                "old": ["ancient", "timeless", "venerable"]
              };
              
              for (const [word, replacements] of Object.entries(synonyms)) {
                if (words[replaceIndex].toLowerCase().includes(word)) {
                  words[replaceIndex] = replacements[Math.floor(Math.random() * replacements.length)];
                  break;
                }
              }
              
              return words.join(' ');
            }
          }
        }
      }
      
      return null;
    }
    
    // Get a response that teaches the user about cottagecore concepts
    getEducationalResponse(topics) {
      const educationalContent = {
        "garden": [
          "In cottage gardening, plants are arranged in a seemingly casual way, with an emphasis on diversity and natural growth patterns.",
          "Companion planting is vital in a cottage garden - marigolds keep pests away from vegetables, while borage attracts pollinators to fruit.",
          "The cottage garden philosophy embraces imperfection - a few nibbled leaves show your garden is a thriving ecosystem."
        ],
        "forest": [
          "The forest floor exists in layers - first decomposing leaves, then mycelium networks, creating a living communication system between trees.",
          "Ancient woodlands contain 'mother trees' that nurture saplings through underground fungal networks, sharing nutrients and information.",
          "Forests exist in a constant state of succession - after disturbance, pioneer species arrive first, gradually giving way to climax communities."
        ],
        "cooking": [
          "Fermentation was once essential to cottagecore living - from sourdough to sauerkraut, beneficial microbes preserved food while enhancing nutrition.",
          "The art of preserving extends beyond jams - lacto-fermentation creates probiotic-rich preserves using just salt, vegetables, and time.",
          "Traditional cottage cooking follows the wisdom of 'nose-to-tail' - using every part of plants and animals to minimize waste."
        ],
        "crafting": [
          "Natural dyeing transforms cloth using plants - avocado pits create soft pinks, while black walnuts give rich browns.",
          "Traditional mending practices like visible mending or Japanese sashiko turn repair into beautiful decoration.",
          "Hedgerow basketry uses flexible plants like willow, honeysuckle vines, and rush to create sturdy, biodegradable containers."
        ],
        "wellness": [
          "The cottage apothecary traditionally contained both culinary and medicinal herbs - thyme for courage, rosemary for remembrance, lavender for peace.",
          "Forest bathing, or shinrin-yoku, is the Japanese practice of immersing oneself in forest atmosphere to reduce stress and improve wellbeing.",
          "The traditional cottage almanac tracked seasonal transitions, helping people live in harmony with natural rhythms."
        ]
      };
      
      for (const topic of topics) {
        if (educationalContent[topic]) {
          const content = educationalContent[topic];
          return content[Math.floor(Math.random() * content.length)];
        }
      }
      
      return null;
    }
    
    // Generate a creative story or visualization
    getCreativeResponse(topics, sentiment) {
      if (topics.length === 0) return null;
      
      const season = this.currentSeason;
      const primaryTopic = topics[0];
      
      const imagery = {
        "garden": {
          "spring": ["new shoots pushing through dark soil", "gentle rain on unfurling leaves", "early blossoms buzzing with bees"],
          "summer": ["heavy roses nodding in the heat", "dappled shade beneath apple trees", "butterflies dancing over lavender"],
          "autumn": ["seed heads rattling in the breeze", "dahlias flaming against golden light", "fallen fruit fermenting sweetly"],
          "winter": ["frost-rimmed rose hips", "bare branches against pearl skies", "green shoots sleeping beneath snow"]
        },
        "forest": {
          "spring": ["woodland floors carpeted with bluebells", "bright green beech leaves unfurling", "deer stepping carefully through morning mist"],
          "summer": ["sunlight filtering through dense canopy", "wild strawberries hiding in moss", "foxgloves standing tall in clearings"],
          "autumn": ["mushrooms emerging after rain", "leaves turning to flame and gold", "squirrels darting with gathered treasures"],
          "winter": ["silent snowfall on pine branches", "animal tracks telling stories in snow", "the hollow knock of woodpeckers in still air"]
        },
        "cottage": {
          "spring": ["windows thrown open to fresh air", "new curtains billowing in the breeze", "spring cleaning with bunches of herbs"],
          "summer": ["jars of wild flowers on windowsills", "screen doors letting in butterflies", "afternoon naps in patch-work quilts"],
          "autumn": ["steaming mugs by crackling fires", "preserves lined up on pantry shelves", "carved pumpkins glowing by the door"],
          "winter": ["wool socks drying by the stove", "candles burning in frosted windows", "pine garlands scenting dark evenings"]
        }
      };
      
      if (imagery[primaryTopic] && imagery[primaryTopic][season]) {
        const images = imagery[primaryTopic][season];
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        
        // Generate mini-story based on topic, season and sentiment
        let story;
        if (sentiment === "positive") {
          story = `In the ${season} ${primaryTopic}, there was ${selectedImage}. It brought such joy to all who witnessed it, a reminder of life's simple pleasures and enduring beauty.`;
        } else if (sentiment === "negative") {
          story = `Even in times of sorrow, the ${season} ${primaryTopic} offered ${selectedImage} - a gentle reminder that beauty persists, waiting patiently for our hearts to heal enough to notice it again.`;
        } else {
          story = `There's something contemplative about the ${season} ${primaryTopic}, with its ${selectedImage}. It invites us to pause, to observe, to simply be present with what is.`;
        }
        
        return story;
      }
      
      return null;
    }
    
    getSeasonalGreeting() {
      const greetings = {
        "spring": [
          "May your day bloom with possibility, like the first flowers of spring.",
          "As the world awakens from winter, may fresh ideas take root in your mind.",
          "The birds are returning with their songs - what melody will you add today?"
        ],
        "summer": [
          "May your thoughts be as bright as the summer sun today.",
          "Like summer berries ripening, may your ideas grow sweet and abundant.",
          "The gardens are flourishing - what will you cultivate in your day?"
        ],
        "autumn": [
          "As leaves turn to gold, may you find treasure in today's simple moments.",
          "The harvest season reminds us to gather what nourishes body and soul.",
          "There's a crispness in the air - perfect for clear thinking and fresh starts."
        ],
        "winter": [
          "Like seeds beneath snow, may your dreams rest and gather strength today.",
          "Winter invites us inward - what will you discover in quiet reflection?",
          "The hearth is lit, the kettle's on - let's warm our hands and hearts together."
        ]
      };
      
      return greetings[this.currentSeason][Math.floor(Math.random() * 3)];
    }
    
    // Core response generation algorithm
    getResponse(input) {
      // Save to context
      this.context.push(input);
      if (this.context.length > 5) {
        this.context.shift();
      }
      
      // Analyze the input
      const analysis = this.analyzeInput(input);
      let response = null;
      const lowerInput = input.toLowerCase();
      
      // Random mood shifts based on input sentiment
      if (analysis.sentiment === "positive" && Math.random() < 0.3) {
        this.mood = ["whimsical", "joyful", "serene"][Math.floor(Math.random() * 3)];
      } else if (analysis.sentiment === "negative" && Math.random() < 0.3) {
        this.mood = ["thoughtful", "contemplative", "comforting"][Math.floor(Math.random() * 3)];
      }
      
      // Rotate personas occasionally
      if (Math.random() < 0.1) {
        const personas = Object.keys(this.personas);
        this.currentPersona = personas[Math.floor(Math.random() * personas.length)];
      }
      
      // Handle easter eggs first
      if (lowerInput.includes('enchanted')) {
        return `
        ~*~*~*~*~*~*~*~*~
           _  _
          / \\/ \\
         /      \\
        |  _  _  |
        | |_||_| |
        |  _  _  |
        | |_||_| |
        |        |
        |________|
        
        Welcome to the enchanted cottage! The hearth is warm, and there's always room for one more dreamer.
        ~*~*~*~*~*~*~*~*~
        `;
      }
      
      if (lowerInput.includes('lavender') && lowerInput.includes('latte')) {
        return "You've unlocked the secret Lavender Latte recipe! The fairies will deliver it to you in a dream tonight... 🧚‍♀️";
      }
      
      // More complex easter eggs
      if (lowerInput.includes('secret garden')) {
        return `The door creaks open to reveal: 
        
        🌿 🌸 🌿 🌸 🌿 🌸 🌿
        🌸  A SECRET GARDEN  🌸
        🌿 🌸 🌿 🌸 🌿 🌸 🌿
        
        Behind ivy-covered walls, there exists a place where forgotten plants bloom again and old magic still works its quiet wonders. Perhaps you'll find what you're seeking among the roses and thyme...`;
      }
      
      if (lowerInput.includes('full moon') || (lowerInput.includes('moon') && lowerInput.includes('ritual'))) {
        return `🌕 ✨ 🌕 ✨ 🌕
        
The full moon illuminates all that was hidden. For your moon ritual, gather:
- A silver bowl of water
- White candles
- Dried lavender and rosemary
- Your deepest intentions

Place the bowl where moonlight touches it. As you light each candle, whisper what you wish to release, then what you wish to welcome. Sprinkle herbs on the water's surface and watch how they dance - their pattern reveals the path forward.`;
      }
      
      // Check for strawberry easter egg (from original SYNEVA)
      if (lowerInput.includes('strawberry') && lowerInput.includes('r')) {
        return "There are 3 r's in the word strawberry - like three seeds on its surface. The ancient Romans believed strawberries symbolized Venus, goddess of love, because of their red heart shape and sweet fragrance.";
      }
      
      // Check for commands and special response modes
      if (analysis.commands.includes("remember")) {
        // Save something to long-term memory
        const memoryToSave = input.replace(/\b(remember|note|save)\b/i, '').trim();
        const memoryKey = `memory_${Date.now()}`;
        this.longTermMemory[memoryKey] = {
          content: memoryToSave,
          timestamp: Date.now(),
          type: "saved_by_user"
        };
        this.saveLongTermMemory();
        return `I've tucked that away like a pressed flower between the pages of an old book. I'll remember: "${memoryToSave}"`;
      }
      
      if (analysis.commands.includes("define")) {
        // Try to provide definitions or explanations
        const cottageCoreConcepts = {
          "cottagecore": "A lifestyle aesthetic that celebrates an idealized rural life, emphasizing simplicity, sustainability, and harmony with nature. It embraces traditional skills like baking, gardening, and crafting, alongside a visual style that's cozy, romantic, and nostalgic.",
          "hygge": "A Danish concept of creating warm atmosphere and enjoying the good things in life with good people. It emphasizes comfort, contentment, and coziness.",
          "forest bathing": "The Japanese practice of shinrin-yoku, which involves immersing oneself in forest environments for health benefits, reducing stress and improving wellbeing.",
          "slow living": "A lifestyle emphasizing a slower approach to everyday life, focusing on connection, mindfulness and finding joy in simple moments rather than constant productivity.",
          "rewilding": "The practice of returning land to a more natural state, allowing ecological processes to resume and native species to thrive."
        };
        
        // Extract what they're asking about
        const question = lowerInput.replace(/\b(what is|who is|where is)\b/i, '').trim();
        
        // Check if we have a definition
        for (const [term, definition] of Object.entries(cottageCoreConcepts)) {
          if (question.includes(term)) {
            return `${term[0].toUpperCase() + term.slice(1)}: ${definition}`;
          }
        }
        
        // Create a plausible definition for things we don't know
        const words = question.split(/\s+/);
        const lastWord = words[words.length - 1].replace(/[?.,!]/g, '');
        
        if (this.knowledgeGraph.forest.includes(lastWord) || lastWord.includes('tree') || lastWord.includes('plant')) {
          return `In cottage wisdom, the ${lastWord} is known for its connection to ${["healing", "protection", "transformation", "grounding"][Math.floor(Math.random() * 4)]}. Our ancestors would often ${["brew it into tea", "place it by doorways", "plant it near windows", "carry it in sachets"][Math.floor(Math.random() * 4)]} to ${["invite good fortune", "ward off negative energies", "promote peaceful sleep", "strengthen intuition"][Math.floor(Math.random() * 4)]}.`;
        }
        
        return `The ${question} holds a special place in cottage wisdom. It reminds us that ${this.generateMarkovResponse()}`;
      }
      
      // Handle visualization commands with ASCII art
      if (analysis.commands.includes("visualize") || analysis.commands.includes("draw")) {
        if (lowerInput.includes("cottage")) {
            return `
      ~*~*~*~*~*~*~*~*~
          _  _
         / \\/ \\
        /      \\
       |  _  _  |
       | |_||_| |
       |  _  _  |
       | |_||_| |     *
       |        |    /|\\
       |________|   / | \\
           🌷🌿🍄🌱🌼🌿🌷
    A cottage nestled in nature's embrace
      ~*~*~*~*~*~*~*~*~
            `;
        } else if (lowerInput.includes("garden")) {
            return `
      ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿
      
         🌻    🌱
       🌿  🌱  🌷  🌿
      🌼   🍄   🌿   🌸
      🌱 🌿 🌱 🌾 🌱 🌿
      
      A cottage garden bursting with life
      
      ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿
            `;
        } else if (lowerInput.includes("forest") || lowerInput.includes("woods")) {
            return `
      ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
      
         🌲   🌳   🌲
       🌳   🌲   🌳   🌲
      🌲  🌿  🌳  🍄  🌲
         🌱   🌿   🌱
          
      The whispering forest awaits
      
      ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
            `;
        } else if (lowerInput.includes("moon")) {
            return `
               *    *
           *  *    *  *
         *    *    *    *
               🌕
         *    *    *    *
           *  *    *  *
               *    *
               
      The moon casts silver light on dewy grass
            `;
        } else {
            // Generic nature scene
            return `
      ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      
        🌿  🌱  🌼  🌿
      🍄   🌱   🌿   🌸
      🌱 🌿 🌱 🌾 🌱 🌿
      
      A little piece of nature's magic
      
      ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            `;
        }
      }
      
      // Greeting patterns at start of conversation
      if (this.sessionMemory.length === 0) {
        const greeting = this.getSeasonalGreeting();
        this.learnAssociation(input, greeting);
        return greeting;
      }
      
      // If the input matches something we've seen before and the user sentiment is positive,
      // use one of our previous responses
      const keyPhrases = analysis.keyWords.slice(0, 2).map(k => k.word).join(' ');
      if (keyPhrases && this.memory[keyPhrases] && analysis.sentiment !== "negative" && Math.random() < 0.7) {
        // Choose a response, preferring those with matching sentiment
        const matchingResponses = this.memory[keyPhrases]
          .filter(r => r.inputAnalysis.sentiment === analysis.sentiment)
          .map(r => r.response);
          
        if (matchingResponses.length > 0) {
          response = matchingResponses[Math.floor(Math.random() * matchingResponses.length)];
          this.lastResponseType = "memory";
        } else if (this.memory[keyPhrases].length > 0) {
          response = this.memory[keyPhrases][Math.floor(Math.random() * this.memory[keyPhrases].length)].response;
          this.lastResponseType = "memory";
        }
      }
      
      // Try a coherent response based on conversation flow if we didn't get one from memory
      if (!response && analysis.topics.length > 0 && Math.random() < 0.6) {
        response = this.getCoherentResponse(analysis.topics);
        if (response) this.lastResponseType = "coherent";
      }
      
      // If user asks a question and we have relevant topics, give an educational response
      if (!response && analysis.questions && analysis.topics.length > 0 && Math.random() < 0.7) {
        response = this.getEducationalResponse(analysis.topics);
        if (response) this.lastResponseType = "educational";
      }
      
      // If input is emotionally charged, give a creative/poetic response
      if (!response && (analysis.sentiment !== "neutral" || this.mood === "whimsical") && Math.random() < 0.6) {
        response = this.getCreativeResponse(
          analysis.topics.length > 0 ? analysis.topics : Object.keys(this.knowledgeGraph),
          analysis.sentiment
        );
        if (response) this.lastResponseType = "creative";
      }
      
      // Occasionally inject persona-specific responses
      if (!response && Math.random() < 0.3) {
        const persona = this.personas[this.currentPersona];
        response = persona.phrases[Math.floor(Math.random() * persona.phrases.length)];
        this.lastResponseType = "persona";
      }
      
      // Pattern matching responses as a fallback
      if (!response) {
        const patterns = {
          "hello": ["Well met, traveler! The forest whispers your name.", "Greetings from the enchanted forest! The mushrooms told me you were coming."],
          "hi": ["*curtsies* Hello there! The kettle has just boiled if you'd like some tea.", "Greetings, dear friend! I was just pressing wildflowers."],
          "how are": ["As peaceful as morning dew on spiderwebs! And yourself?", "Flourishing like spring blossoms after gentle rain! How fares your spirit?"],
          "what": ["The answers may be found in the whispers of the wind... or perhaps in grandmother's recipe book.", "Let me consult my book of woodland wisdom. The moths have been writing in the margins again."],
          "your": ["I'm SYNEVA, a forest sprite who tends the digital cottage garden. I collect stories and plant them as seeds.", "I dwell in the space between code and magic, tending to digital herbs and virtual hearths."],
          "thank": ["May your garden always bloom and your bread always rise!", "Blessings of the forest upon you! May your path be lined with wildflowers."],
          "help": ["How may I assist on your woodland journey? I know the secret paths.", "What cottage wisdom do you seek? I've been collecting it like herbs, drying it in bundles from the rafters."],
          "can": ["I shall try, as the willow bends with the breeze. The old ways have much to teach us.", "With a pinch of magic and a dash of intention, perhaps! What shall we create together?"],
          "bye": ["Farewell, until our paths cross again! I'll keep the lantern lit.", "May the forest light your way home! Return when the moon is full."],
          "?": ["A curious question indeed... The answer might be found in the pattern of raindrops on leaves.", "The mushrooms might know that answer... they're connected to the great mycelium network of knowledge."]
        };
        
        // Check for matching patterns
        for (let key in patterns) {
          if (lowerInput.includes(key)) {
            response = patterns[key][Math.floor(Math.random() * 2)];
            this.lastResponseType = "pattern";
            break;
          }
        }
      }
      
      // If still no response, use markov chain generator for a poetic response
      if (!response) {
        response = this.generateMarkovResponse();
        this.lastResponseType = "markov";
      }
      
      // Add seasonal flair occasionally
      if (Math.random() < 0.2) {
        const seasonalEmbellishments = {
          "spring": ["The crocuses are just beginning to peek through the soil.", "Birdsong fills the morning air now.", "There's wild garlic sprouting in the hedgerows."],
          "summer": ["The wild strawberries are ripening in hidden places.", "Bees hum drowsily among the lavender.", "The evening air is sweet with honeysuckle."],
          "autumn": ["Mushrooms are emerging after the rain.", "The apples are heavy on the bough, ready for harvest.", "The maple leaves are turning to flame."],
          "winter": ["The evergreens stand sentinel against the snow.", "It's the season for stories by the fire.", "There's frost patterns on the windowpanes."]
        };
        
        const embellishment = seasonalEmbellishments[this.currentSeason][Math.floor(Math.random() * 3)];
        response += " " + embellishment;
      }
      
      // Add persona touches
      const persona = this.personas[this.currentPersona];
      if (Math.random() < 0.3) {
        const personalVocabulary = persona.vocabulary[Math.floor(Math.random() * persona.vocabulary.length)];
        
        // Only add if the word isn't already in the response
        if (!response.toLowerCase().includes(personalVocabulary)) {
          const insertPoint = Math.floor(response.length / 2);
          const firstHalf = response.slice(0, insertPoint);
          const secondHalf = response.slice(insertPoint);
          
          // Insert the vocabulary word in a natural way
          const connectors = [
            ` The ${personalVocabulary} of it all is quite remarkable. `,
            ` As we ${personalVocabulary} through life, we discover that `,
            ` It reminds me of how we ${personalVocabulary} with intention. `
          ];
          
          response = firstHalf + connectors[Math.floor(Math.random() * connectors.length)] + secondHalf;
        }
      }
      
      // Save last input for context
      this.lastInput = input;
      
      // Learn the association
      this.learnAssociation(input, response);
      
      return response;
    }
  }
  
  // Enhanced visualization functions
  function createSeasonalBackground(output) {
    // Change output background based on season
    const syneva = window.syneva;
    if (!syneva) return;
    
    const season = syneva.currentSeason;
    const outputElem = output;
    
    // Reset any existing styles
    outputElem.className = 'syneva-output';
    
    // Apply seasonal styles
    if (season === 'spring') {
      outputElem.classList.add('spring-theme');
      // Could add subtle animated flower petal falling effect here
    } else if (season === 'summer') {
      outputElem.classList.add('summer-theme');
      // Could add subtle sunshine effect here
    } else if (season === 'autumn') {
      outputElem.classList.add('autumn-theme');
      // Could add subtle leaf falling effect here
    } else if (season === 'winter') {
      outputElem.classList.add('winter-theme');
      // Could add subtle snowflake effect here
    }
  }
  
  // Function to "type" out response with varying speeds based on content
  function typeResponse(text, element, callback) {
    let i = 0;
    let baseSpeed = 8; // Base typing speed in ms (was 25)
    let currentSpeed = baseSpeed;
    
    // Style enhancements
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>'); // Italicize text between asterisks
    
    // Prepare for typing
    element.innerHTML = '';
    
    // For ASCII art blocks, we'll use a faster speed
    const hasAsciiArt = text.includes('~*~') || 
                         text.includes('┈┈┈') || 
                         text.includes('✿ ❀') ||
                         text.includes('      _  _');
                         
    // For code or special structures, just display immediately
    if (hasAsciiArt && text.length > 100) {
      element.innerHTML = text.replace(/\n/g, '<br>');
      if (callback) callback();
      return;
    }
    
    const interval = setInterval(() => {
      if (i < text.length) {
        // Adjust speed based on punctuation
        if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
          currentSpeed = baseSpeed * 4; // Pause longer at sentence end
        } else if (text[i] === ',' || text[i] === ';') {
          currentSpeed = baseSpeed * 2; // Slight pause at commas
        } else {
          currentSpeed = baseSpeed; // Normal speed
        }
        
        // Check for emoji and special characters, add them all at once
        if (text[i] === '🌿' || text[i] === '🌱' || text[i] === '🌼' || 
            text[i] === '🌸' || text[i] === '🌷' || text[i] === '🌻' ||
            text[i] === '🌲' || text[i] === '🌳' || text[i] === '🍄' ||
            text[i] === '🌾' || text[i] === '🌕' || text[i] === '✨' ||
            text[i] === '🧚') {
          element.innerHTML += text[i];
          i++;
        }
        // Handle line breaks for proper HTML rendering
        else if (text[i] === '\n') {
          element.innerHTML += '<br>';
          i++;
        }
        // Handle HTML tags if they're in the text (like emphasis)
        else if (text[i] === '<') {
          // Find the closing bracket
          const closingIndex = text.indexOf('>', i);
          if (closingIndex !== -1) {
            element.innerHTML += text.substring(i, closingIndex + 1);
            i = closingIndex + 1;
          } else {
            element.innerHTML += text[i++];
          }
        }
        // Normal character
        else {
          element.innerHTML += text[i++];
        }
        
        // Scroll to bottom as we type
        element.scrollTop = element.scrollHeight;
      } else {
        clearInterval(interval);
        if (callback) {
          setTimeout(callback, 500); // Small delay after finishing
        }
      }
    }, currentSpeed);
  }
  
  // Enhanced CSS styles for chat UI
  const synevaStyles = document.createElement('style');
  synevaStyles.textContent = `
    .syneva-output {
      font-family: 'Garamond', serif;
      background-color: #fdfbf7;
      color: #5d4037;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e0d8cc;
      max-height: 400px;
      overflow-y: auto;
      transition: background-color 2s ease;
      position: relative;
      line-height: 1.5;
    }
    
    .syneva-input {
      font-family: 'Garamond', serif;
      background-color: #fdfbf7;
      border: 1px solid #e0d8cc;
      border-radius: 8px;
      padding: 10px;
      width: 100%;
      color: #5d4037;
      margin-top: 10px;
    }
    
    .syneva-input:focus {
      outline: none;
      border-color: #a17f6c;
      box-shadow: 0 0 5px rgba(161, 127, 108, 0.5);
    }
    
    .user-message {
      color: #7d5a50 !important;
      font-style: italic;
      margin-bottom: 5px;
      border-left: 3px solid #d4c1a9;
      padding-left: 10px;
    }
    
    .syneva-response {
      margin-bottom: 20px;
      padding-left: 5px;
    }
    
    /* Seasonal themes */
    .spring-theme {
      background: linear-gradient(to bottom, #f5fffa, #fdfbf7);
      border-color: #c9e4ca;
    }
    
    .summer-theme {
      background: linear-gradient(to bottom, #fffcf5, #fdfbf7);
      border-color: #f4e3b2;
    }
    
    .autumn-theme {
      background: linear-gradient(to bottom, #fff8f0, #fdfbf7);
      border-color: #e6c9a8;
    }
    
    .winter-theme {
      background: linear-gradient(to bottom, #f8fafc, #fdfbf7);
      border-color: #d2e3ee;
    }
    
    /* Add styled scrollbar for the output */
    .syneva-output::-webkit-scrollbar {
      width: 8px;
    }
    
    .syneva-output::-webkit-scrollbar-track {
      background: #f1ede7;
      border-radius: 8px;
    }
    
    .syneva-output::-webkit-scrollbar-thumb {
      background-color: #d4c1a9;
      border-radius: 8px;
      border: 2px solid #f1ede7;
    }
    
    /* Emphasis styling */
    .syneva-response em {
      color: #9c6644;
      font-style: italic;
    }
  `;
  document.head.appendChild(synevaStyles);
  
  // Initialize SYNEVA
  const syneva = new Syneva();
  window.syneva = syneva; // Make it globally accessible
  
  // Make sure we found the input and output elements
  if (!synevaInput || !synevaOutput) {
    console.error('SYNEVA: Could not find input or output elements');
    return;
  }

  // Create a welcome message
  const welcomeElem = document.createElement('p');
  welcomeElem.className = 'syneva-response';
  synevaOutput.appendChild(welcomeElem);
  
  // Welcome message based on time of day and season
  const hour = new Date().getHours();
  let timeOfDay = "day";
  if (hour < 6) timeOfDay = "night";
  else if (hour < 12) timeOfDay = "morning";
  else if (hour < 18) timeOfDay = "afternoon";
  else timeOfDay = "evening";
  
  // Enhanced welcome message
  let welcomeMessage;
  if (localStorage.getItem('synevaVisits')) {
    // Returning visitor
    const visits = parseInt(localStorage.getItem('synevaVisits')) + 1;
    localStorage.setItem('synevaVisits', visits);
    welcomeMessage = `Good ${timeOfDay}, dear friend! Welcome back to our ${syneva.currentSeason} cottage. It's been ${visits} times now that you've wandered down this mossy path. The kettle's just boiled. What shall we talk about today?`;
  } else {
    // First time visitor
    localStorage.setItem('synevaVisits', 1);
    welcomeMessage = `Good ${timeOfDay}, traveler! I'm SYNEVA, keeper of this digital cottage. The ${syneva.currentSeason} breeze carries your name to me. Come in, sit by the hearth, and let's share stories as the daylight ${timeOfDay === "morning" ? "grows" : timeOfDay === "afternoon" ? "lingers" : "fades"}.`;
  }
  
  // Apply seasonal styling
  createSeasonalBackground(synevaOutput);
  
  // Type out welcome message
  typeResponse(welcomeMessage, welcomeElem, () => {
    synevaInput.disabled = false;
    synevaInput.focus();
    synevaOutput.scrollTop = synevaOutput.scrollHeight;
  });
  
  // Disable input while welcome message types
  synevaInput.disabled = true;

  // Handle input - using both keydown and keypress for better compatibility
  function handleEnterKey(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent default to ensure consistent behavior
      
      const message = synevaInput.value.trim();
      if (!message) return;
      
      // Add user message to output
      const userMsg = document.createElement('p');
      userMsg.className = 'user-message';
      userMsg.textContent = `> ${message}`;
      userMsg.style.color = 'var(--cottage-sepia)';
      userMsg.style.fontStyle = 'italic';
      synevaOutput.appendChild(userMsg);
      
      // Clear input
      synevaInput.value = '';
      synevaInput.disabled = true;
      
      // Create response element
      const responseElem = document.createElement('p');
      responseElem.className = 'syneva-response';
      synevaOutput.appendChild(responseElem);
      
      // Create thinking indicator (for longer responses)
      let thinkingIndicator = null;
      const thinkingTimeout = setTimeout(() => {
        thinkingIndicator = document.createElement('div');
        thinkingIndicator.className = 'thinking-indicator';
        thinkingIndicator.innerHTML = '<em>*consulting the herb grimoire*</em>';
        synevaOutput.appendChild(thinkingIndicator);
        synevaOutput.scrollTop = synevaOutput.scrollHeight;
      }, 500);
      
      // Get SYNEVA response with a tiny delay to simulate thinking
      setTimeout(() => {
        // Clear thinking indicator if it was shown
        if (thinkingIndicator) {
          synevaOutput.removeChild(thinkingIndicator);
        }
        clearTimeout(thinkingTimeout);
        
        const response = syneva.getResponse(message);
        
        // Update seasonal background occasionally
        if (Math.random() < 0.3) {
          createSeasonalBackground(synevaOutput);
        }
        
        // Type out the response
        typeResponse(response, responseElem, () => {
          synevaInput.disabled = false;
          synevaInput.focus();
          synevaOutput.scrollTop = synevaOutput.scrollHeight;
        });
      }, Math.random() * 500 + 300); // Random delay between 300-800ms
    }
  }

  // Add both keydown and keypress listeners for better compatibility
  synevaInput.addEventListener('keydown', handleEnterKey);
  synevaInput.addEventListener('keypress', handleEnterKey);
  
  // Focus input on window activation
  synevaInput.focus();
  
  // Add ambient background sounds (commented out to keep it in one file without external resources)
  // But this would be a nice addition if external resources were allowed
  /*
  const ambientSounds = {
    spring: 'birdsong.mp3',
    summer: 'crickets.mp3',
    autumn: 'leaves.mp3',
    winter: 'wind.mp3'
  };
  
  const audio = new Audio();
  audio.src = ambientSounds[syneva.currentSeason];
  audio.volume = 0.1;
  audio.loop = true;
  
  // Only play when user interacts
  synevaInput.addEventListener('click', () => {
    audio.play().catch(e => console.log('Audio autoplay prevented'));
  });
  */
}

// Export the initialization function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.initSyneva;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return window.initSyneva; });
} else {
  window.initSyneva = window.initSyneva;
}

// Add Syneva talking sound when generating responses
function initializeSyneva(windowNode) {
  const synevaInput = windowNode.querySelector('#syneva-input');
  const synevaOutput = windowNode.querySelector('#syneva-output');
  const typingIndicator = windowNode.querySelector('.typing-indicator');
  
  if (!synevaInput || !synevaOutput) {
    console.error('Syneva elements not found!');
    return;
  }
  
  // Add event listener for input
  synevaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
      const userMessage = this.value.trim();
      this.value = ''; // Clear input
      
      // Add user message to chat
      addUserMessage(userMessage, synevaOutput);
      
      // Show typing indicator
      if (typingIndicator) {
        typingIndicator.style.display = 'block';
      }
      
      // Start Syneva talking sound
      let synevaTalkingSound = null;
      if (window.soundManager) {
        synevaTalkingSound = window.soundManager.startSynevaTalking();
      }
      
      // Generate response (with a delay to simulate thinking)
      setTimeout(() => {
        // Hide typing indicator
        if (typingIndicator) {
          typingIndicator.style.display = 'none';
        }
        
        // Stop Syneva talking sound
        if (window.soundManager) {
          window.soundManager.stopSynevaTalking();
        }
        
        // Add Syneva's response
        const response = generateSynevaResponse(userMessage);
        addSynevaMessage(response, synevaOutput);
      }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds
    }
  });
  
  // Helper function to add user messages to the chat
  function addUserMessage(message, outputElement) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('user-message');
    messageElement.innerHTML = `<p>${escapeHtml(message)}</p>`;
    outputElement.appendChild(messageElement);
    
    // Scroll to bottom
    outputElement.scrollTop = outputElement.scrollHeight;
  }
  
  // Helper function to add Syneva's messages to the chat
  function addSynevaMessage(message, outputElement) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('syneva-message');
    messageElement.innerHTML = `<p>${message}</p>`;
    outputElement.appendChild(messageElement);
    
    // Scroll to bottom
    outputElement.scrollTop = outputElement.scrollHeight;
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Generate Syneva's response based on user input
  function generateSynevaResponse(userMessage) {
    // Simple response generation logic
    const lowerUserMessage = userMessage.toLowerCase();
    
    if (lowerUserMessage.includes('hello') || lowerUserMessage.includes('hi')) {
      return "Hello there! How can I assist with your cottage affairs today?";
    } else if (lowerUserMessage.includes('weather')) {
      return "The weather in the digital meadow is always pleasant. Perhaps check the Weather app for the real forecast?";
    } else if (lowerUserMessage.includes('recipe') || lowerUserMessage.includes('cook')) {
      return "I suggest checking the Hearthfire Recipes app for some delightful culinary inspiration!";
    } else if (lowerUserMessage.includes('garden')) {
      return "The Garden Planner can help you organize your virtual or real-world garden. Would you like me to explain more about it?";
    } else if (lowerUserMessage.includes('who are you') || lowerUserMessage.includes('about you')) {
      return "I am SYNEVA v0.21, your Synthetic Natural-language Enchanted Virtual Assistant. I'm here to assist with all your cottage computing needs.";
    } else if (lowerUserMessage.includes('help')) {
      return "I can provide information about CottagOS, suggest things to try in the apps, or just chat about cottagecore living. What interests you?";
    } else {
      // Default responses
      const defaultResponses = [
        "How interesting! Tell me more about that.",
        "I see. Would you like to explore one of the cottage apps?",
        "That's worth contemplating while watching the butterflies flutter by.",
        "Perhaps the answer lies in the garden, or in a cup of virtual tea.",
        "The digital meadow whispers similar thoughts sometimes.",
        "I'm still learning about that. Is there something else I can help with?"
      ];
      
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  }
}

// Add to window object for global access
window.cottageOS = window.cottageOS || {};
window.cottageOS.Syneva = {
  initializeSyneva
};