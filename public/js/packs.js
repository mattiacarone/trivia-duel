// Trivia Duel Content Packs & Game Modes Registry

const GAME_PACKS = {
  speed: [
    {
      id: 'starter',
      title: 'Free Party Starter',
      category: 'General Pop Culture & Quirks',
      price: 'FREE',
      locked: false,
      badge: 'POPULAR',
      icon: '🎉',
      description: 'The ultimate icebreaker pack with witty pop culture, science, and quirky facts.',
      questions: [
        {
          question: "What is the collective noun for a group of flamingos?",
          options: ["A Flamboyance", "A Sparkle", "A Crimson", "A Squawk"],
          answer: 0,
          funFact: "A group of flamingos is officially called a 'flamboyance' because of their bright pink strut!"
        },
        {
          question: "Which company originally manufactured playing cards before becoming a gaming giant?",
          options: ["Sega", "Nintendo", "Sony", "Atari"],
          answer: 1,
          funFact: "Nintendo was founded in 1889 in Kyoto making handmade 'Hanafuda' playing cards!"
        },
        {
          question: "In the movie 'The Matrix', what was the original color of the code rain?",
          options: ["Neon Blue", "Laser Red", "Green", "Electric Purple"],
          answer: 2,
          funFact: "The famous falling green code symbols were actually scanned from Japanese sushi cookbooks!"
        },
        {
          question: "Which planet in our solar system rotates clockwise (retrograde rotation)?",
          options: ["Mars", "Venus", "Neptune", "Jupiter"],
          answer: 1,
          funFact: "Venus and Uranus spin in the opposite direction to most other planets!"
        },
        {
          question: "What was the first item ever sold on eBay in 1995?",
          options: ["A PEZ dispenser", "A broken laser pointer", "A vintage comic book", "A Macintosh floppy disk"],
          answer: 1,
          funFact: "Founder Pierre Omidyar sold a broken laser pointer for $14.83 to a collector of broken laser pointers!"
        }
      ]
    },
    {
      id: 'dev_humor',
      title: 'Dev Humor & Tech Lore',
      category: 'Software Engineering & Silicon Valley',
      price: '$3.49',
      locked: true,
      badge: 'BESTSELLER',
      icon: '💻',
      description: 'Caffeine, StackOverflow tears, Git disasters, and absurd computing history.',
      questions: [
        {
          question: "What was the very first bug in computer science history?",
          options: ["A dead moth in Harvard Mark II", "A burned capacitor", "A typo by Ada Lovelace", "An infinite punch card loop"],
          answer: 0,
          funFact: "In 1947, Grace Hopper's team taped a real moth removed from Relay #70 into their logbook!"
        },
        {
          question: "Why was the JavaScript language originally created in just 10 days?",
          options: ["Netscape was about to launch Navigator 2.0", "Brendan Eich had a flight to Tokyo", "A bet between Steve Jobs and Marc Andreessen", "To beat Microsoft's VBScript deadline"],
          answer: 0,
          funFact: "Brendan Eich wrote the prototype of Mocha/JavaScript in May 1995 in just 10 days under intense pressure!"
        },
        {
          question: "What does the HTTP 418 status code officially designate?",
          options: ["Unprocessable Entity", "I'm a Teapot", "Bandwidth Limit Exceeded", "DNS Resolution Failed"],
          answer: 1,
          funFact: "RFC 2324 defined 'I'm a teapot' as an April Fools' joke in 1998 for the Hyper Text Coffee Pot Control Protocol!"
        },
        {
          question: "Which Git command is universally known to rewrite history and terrify junior engineers?",
          options: ["git checkout -b", "git rebase -i", "git push --force", "git cherry-pick"],
          answer: 2,
          funFact: "Force pushing to main is the leading cause of sudden developer heart attacks worldwide."
        },
        {
          question: "What is the origin of the Python programming language's name?",
          options: ["The deadly constrictor snake", "Monty Python's Flying Circus", "A secret DARPA project", "Guido van Rossum's pet python"],
          answer: 1,
          funFact: "Creator Guido van Rossum was reading published scripts from Monty Python's Flying Circus when naming it!"
        }
      ]
    },
    {
      id: '90s_cartoons',
      title: '90s Cartoons & Saturday TV',
      category: 'Nostalgia & Animation',
      price: '$2.99',
      locked: true,
      badge: 'FAN FAVORITE',
      icon: '📺',
      description: 'Rugrats, Dexter, Sailor Moon, and Saturday morning cereal memories.',
      questions: [
        {
          question: "In 'Dexter's Laboratory', what was the phrase that Dexter could only say after learning French?",
          options: ["Bonjour Paris", "Omelette du Fromage", "Croissant d'Amour", "Merci Beaucoup"],
          answer: 1,
          funFact: "Even though grammatically it should be 'Omelette au fromage', the phrase became an iconic pop culture meme!"
        },
        {
          question: "What was Tommy Pickles' signature accessory stored in his diaper?",
          options: ["A walkie talkie", "A plastic screwdriver", "A juice box", "A teddy bear"],
          answer: 1,
          funFact: "Tommy used his screwdriver to unscrew playpen doors and launch daring toddler escapes!"
        },
        {
          question: "Which member of the Powerpuff Girls was created from sugar, spice, and everything nice plus Chemical X?",
          options: ["Blossom only", "Bubbles only", "Buttercup only", "All three of them"],
          answer: 3,
          funFact: "Professor Utonium accidentally spilled Chemical X into the batch, creating all three sisters at once!"
        },
        {
          question: "In 'Hey Arnold!', what was Arnold's pet pig named?",
          options: ["Abner", "Porky", "Bacon", "Barnaby"],
          answer: 0,
          funFact: "Abner was gifted to Arnold's parents during an expedition in San Lorenzo!"
        },
        {
          question: "What was the name of the rock band formed by the kids in 'Recess'?",
          options: ["The Playgrounders", "The King Bobs", "The Ashley Gang", "The Diggers"],
          answer: 0,
          funFact: "Recess aired for 6 seasons on Disney's One Saturday Morning block!"
        }
      ]
    },
    {
      id: 'true_crime',
      title: 'True Crime Fanatics',
      category: 'Heists, Mysteries & Forensic Lore',
      price: '$3.99',
      locked: true,
      badge: 'THRILLING',
      icon: '🔍',
      description: 'Legendary art heists, baffling cryptograms, and forensic breakthroughs.',
      questions: [
        {
          question: "In the 1990 Isabella Stewart Gardner Museum heist, what was the estimated value of the stolen artwork?",
          options: ["$50 Million", "$150 Million", "$500 Million", "$1 Billion"],
          answer: 2,
          funFact: "It remains the largest single-property theft in history, and the frames still hang empty on the walls today!"
        },
        {
          question: "What famous cryptogram was sent to the San Francisco Chronicle in 1969 and took 51 years to crack?",
          options: ["The 340 Cipher", "The Enigma Code", "The Beale Papers", "The Voynich Folio"],
          answer: 0,
          funFact: "Amateur codebreakers in the US, Australia, and Belgium cracked the Zodiac 340 Cipher in December 2020!"
        },
        {
          question: "Which everyday food condiment was used in 2003 to crack the infamous Antwerp Diamond Heist?",
          options: ["A mustard jar", "A half-eaten salami sandwich", "A jar of mayonnaise", "A bottle of ketchup"],
          answer: 1,
          funFact: "DNA from a half-eaten salami sandwich left near the crime scene led Belgian police directly to ringleader Leonardo Notarbartolo!"
        },
        {
          question: "What famous landmark was 'sold' twice by the legendary con artist Victor Lustig in 1925?",
          options: ["Big Ben", "The Eiffel Tower", "The Brooklyn Bridge", "The Colosseum"],
          answer: 1,
          funFact: "He posed as a government official and convinced scrap metal dealers Paris could no longer afford the Eiffel Tower!"
        },
        {
          question: "Which botanical forensic clue was first used in 1935 to solve the Lindbergh kidnapping case?",
          options: ["Tree pollen analysis", "Wood ring grain matching on a ladder", "Poisonous berry seeds", "Soil pH testing"],
          answer: 1,
          funFact: "Forester Arthur Koehler traced the wood grain of the kidnap ladder straight back to a mill in South Carolina and Hauptmann's attic floorboards!"
        }
      ]
    },
    {
      id: 'bachelorette',
      title: 'Bachelorette & Party Bash',
      category: 'Cocktails, Celebrations & Fun',
      price: '$4.99',
      locked: true,
      badge: 'EVENT SPECIAL',
      icon: '🥂',
      description: 'Romantic comedies, celebrity weddings, champagne trivia, and party lore.',
      questions: [
        {
          question: "Which celebrity couple had an estimated $100 million wedding featuring singing Beyoncé in 2018?",
          options: ["Isha Ambani & Anand Piramal", "Prince Harry & Meghan Markle", "Kim Kardashian & Kanye West", "George Clooney & Amal Alamuddin"],
          answer: 0,
          funFact: "The Ambani wedding in Mumbai was one of the most lavish wedding celebrations in modern history!"
        },
        {
          question: "What classic wedding tradition stems from ancient Rome to confuse evil spirits?",
          options: ["Throwing rice", "Bridesmaids wearing identical dresses", "Cutting the cake together", "Wearing a veil"],
          answer: 1,
          funFact: "Bridesmaids originally dressed like the bride as decoys to protect her from malevolent spirits and rejected suitors!"
        },
        {
          question: "In the movie 'Bridesmaids' (2011), what caused the infamous bridal shop disaster?",
          options: ["Spicy food poisoning from Brazilian BBQ", "Too much pink champagne", "Expired wedding cupcakes", "Allergic reaction to lace"],
          answer: 0,
          funFact: "The scene at the upscale bridal salon became an instant comedy classic!"
        },
        {
          question: "What is the official speed of a champagne cork popping out of a bottle?",
          options: ["Up to 25 mph (40 km/h)", "Up to 50 mph (80 km/h)", "Up to 15 mph (24 km/h)", "Up to 75 mph (120 km/h)"],
          answer: 0,
          funFact: "German scientists measured champagne cork velocities reaching up to 24.8 mph (40 km/h)!"
        },
        {
          question: "Which famous engagement ring featured a 12-carat oval blue sapphire surrounded by 14 solitaire diamonds?",
          options: ["Princess Diana / Kate Middleton", "Grace Kelly", "Elizabeth Taylor", "Audrey Hepburn"],
          answer: 0,
          funFact: "Prince William presented Prince Harry's inherited sapphire ring to Kate Middleton in 2010 in Kenya!"
        }
      ]
    },
    {
      id: 'gaming_lore',
      title: 'Video Game Legends & Lore',
      category: 'Gaming, Speedruns & Easter Eggs',
      price: '$3.49',
      locked: true,
      badge: 'GAMER CHOICE',
      icon: '🎮',
      description: 'Secret cheats, iconic boss encounters, glitches turned features, and gaming history.',
      questions: [
        {
          question: "Which iconic cheat code entered popular culture via the NES game Contra in 1988?",
          options: ["IDKFA", "The Konami Code (↑↑↓↓←→←→BA)", "Rosebud", "XYZZY"],
          answer: 1,
          funFact: "Kazuhisa Hashimoto invented the Konami Code while testing Gradius because he found the game too hard!"
        },
        {
          question: "In Minecraft, what beloved hostile mob was created by accident when an engineer mixed up height and length?",
          options: ["The Enderman", "The Creeper", "The Ghast", "The Blaze"],
          answer: 1,
          funFact: "Notch accidentally swapped the model dimensions while trying to code a pig, resulting in the iconic Creeper!"
        },
        {
          question: "What is Mario's original profession before he officially became a plumber in Mario Bros (1983)?",
          options: ["A carpenter", "A train conductor", "A pizza chef", "A clockmaker"],
          answer: 0,
          funFact: "In the 1981 arcade game Donkey Kong, Mario was called 'Jumpman' and was a carpenter on a construction site!"
        },
        {
          question: "Which game holds the record for the first ever documented in-game 'Easter Egg'?",
          options: ["Pac-Man", "Adventure (Atari 2600)", "Space Invaders", "Zork"],
          answer: 1,
          funFact: "Warren Robinett hid his name in a secret room in 1979 because Atari refused to credit game designers in the manual!"
        },
        {
          question: "In World of Warcraft, what accidental 2005 virtual pandemic was later studied by epidemiologists?",
          options: ["The Plague of Undeath", "The Corrupted Blood Incident", "The Fel Flu", "The Scourge Outbreak"],
          answer: 1,
          funFact: "A debuff from the boss Hakkar spread across major cities, killing millions of avatars and modeling real human epidemic behavior!"
        }
      ]
    },
    {
      id: 'science_cosmos',
      title: 'Cosmic Oddities & Weird Science',
      category: 'Astronomy, Physics & Biology',
      price: '$3.99',
      locked: true,
      badge: 'MIND BLOWING',
      icon: '🌌',
      description: 'Black holes, bizarre animal superpowers, quantum paradoxes, and deep space discoveries.',
      questions: [
        {
          question: "What color does the sun appear to set on Mars as viewed from the Martian surface?",
          options: ["Neon green", "Dusty blue", "Deep purple", "Crimson red"],
          answer: 1,
          funFact: "Martian fine dust particles scatter red light away, letting blue light pierce through directly near the sun!"
        },
        {
          question: "How long does it take a single photon born at the center of the Sun to escape to the surface?",
          options: ["8 minutes and 20 seconds", "Roughly 100,000 years", "Exactly 24 hours", "3.14 seconds"],
          answer: 1,
          funFact: "Photons undergo countless random collisions in the dense solar radiative zone before finally bursting free!"
        },
        {
          question: "Which sea creature has three hearts, blue blood, and nine brains?",
          options: ["The Colossal Squid", "The Octopus", "The Nautilus", "The Cuttlefish"],
          answer: 1,
          funFact: "Octopuses have a central brain and eight mini-brains in their arms, with copper-based hemocyanin making their blood blue!"
        },
        {
          question: "If you folded a standard sheet of paper in half 42 times, how far would it reach?",
          options: ["To the top of Mt Everest", "All the way to the Moon", "Across the Atlantic Ocean", "To the edge of the atmosphere"],
          answer: 1,
          funFact: "Due to exponential doubling ($0.1\\text{ mm} \\times 2^{42}$), the thickness exceeds 439,800 kilometers — past the Moon!"
        },
        {
          question: "Which everyday element has a melting point so low it will literally melt in your hand?",
          options: ["Gallium", "Bismuth", "Titanium", "Tungsten"],
          answer: 0,
          funFact: "Gallium melts at 29.76°C (85.57°F), just below normal human body temperature!"
        }
      ]
    },
    {
      id: 'movie_buff',
      title: 'Blockbusters & Cult Classics',
      category: 'Cinema, Famous Quotes & Hollywood',
      price: '$2.99',
      locked: true,
      badge: 'HOLLYWOOD',
      icon: '🎬',
      description: 'Oscar legends, behind-the-scenes drama, memorable lines, and unforgettable twists.',
      questions: [
        {
          question: "What line does Darth Vader ACTUALLY say to Luke Skywalker in 'The Empire Strikes Back'?",
          options: ["'Luke, I am your father.'", "'No, I am your father.'", "'It is true, I am your father.'", "'Search your feelings, I am your father.'"],
          answer: 1,
          funFact: "'Luke, I am your father' is one of the most widely misquoted lines in cinematic history — he actually says 'No, I am your father'!"
        },
        {
          question: "Which actor improvised the famous line 'You're gonna need a bigger boat' in Jaws (1975)?",
          options: ["Robert Shaw", "Roy Scheider", "Richard Dreyfuss", "Murray Hamilton"],
          answer: 1,
          funFact: "Roy Scheider kept ad-libbing the line as an inside joke because the production crew's support boat was way too small!"
        },
        {
          question: "In Pulp Fiction (1994), what is glowing inside Marsellus Wallace's mysterious briefcase?",
          options: ["The Holy Grail", "Wallace's stolen soul", "An unrevealed golden glow (orange bulb)", "A cache of diamonds"],
          answer: 2,
          funFact: "Quentin Tarantino confirmed it is whatever MacGuffin the audience wants it to be — on set, it was simply an orange lightbulb and a battery!"
        },
        {
          question: "Which animated movie was the first ever animated feature to be nominated for Best Picture at the Oscars?",
          options: ["The Lion King (1994)", "Beauty and the Beast (1991)", "Toy Story (1995)", "Spirited Away (2001)"],
          answer: 1,
          funFact: "Beauty and the Beast achieved this groundbreaking milestone in 1991 before the Best Animated Feature category existed!"
        },
        {
          question: "In Jurassic Park (1993), what real creature sounds were mixed to create the iconic T-Rex roar?",
          options: ["Lions, tigers, and bears", "An elephant pup, an alligator, and a tiger", "A revving jet engine and a hippo", "Whales and wolves"],
          answer: 1,
          funFact: "Sound designer Gary Rydstrom pitched down a baby elephant trumpeting, layered with an alligator hiss and tiger growls!"
        }
      ]
    },
    {
      id: 'foodie_feuds',
      title: 'Culinary Feuds & Midnight Bites',
      category: 'Food History, Scandals & Recipes',
      price: '$3.49',
      locked: true,
      badge: 'DELICIOUS',
      icon: '🍕',
      description: 'Street food battles, secret spice recipes, origin myths, and bizarre dining customs.',
      questions: [
        {
          question: "In which country was the beloved 'Hawaiian Pizza' (ham & pineapple) actually invented?",
          options: ["United States (Hawaii)", "Canada (Ontario)", "Australia", "Germany"],
          answer: 1,
          funFact: "Greek-Canadian chef Sam Panopoulos created it in 1962 at the Satellite Restaurant in Chatham, Ontario!"
        },
        {
          question: "Why was Coca-Cola originally advertised with a green leaf and wine in the 1880s?",
          options: ["It was inspired by French Coca Wine tonic", "It was sold as an organic tea", "It was marketed strictly for sailors", "It contained celery extract"],
          answer: 0,
          funFact: "John Pemberton invented it after reading about Angelo Mariani's viral French coca-infused Bordeaux wine!"
        },
        {
          question: "What is the spicy compound responsible for the mouth-numbing sensation in Sichuan peppercorns?",
          options: ["Capsaicin", "Hydroxy-alpha-sanshool", "Piperine", "Allyl isothiocyanate"],
          answer: 1,
          funFact: "Sanshool activates somatosensory tactile receptors, literally vibrating your lips at about 50 Hertz!"
        },
        {
          question: "Which popular snack was originally rejected by US astronauts because crumbs could float into delicate instrument panels?",
          options: ["Potato chips", "Bread and regular crackers", "M&Ms chocolate candies", "Peanut butter cups"],
          answer: 1,
          funFact: "Tortillas became the staple space carb in 1985 because they produce zero floating crumbs in zero-gravity!"
        },
        {
          question: "What prized delicacy was once so abundant in colonial Massachusetts that servants complained about eating it too often?",
          options: ["Caviar", "Lobster", "Truffles", "King Salmon"],
          answer: 1,
          funFact: "Lobsters were once considered the 'cockroach of the sea' and used as cheap prison food and crop fertilizer!"
        }
      ]
    }
  ],

  // Spectrum Co-op Decks (Wavelength style)
  spectrum: [
    {
      id: 'spec_1',
      left: 'Worst Superpower Ever',
      right: 'God-Tier Superpower',
      category: 'Superpowers & Abilities',
      icon: '⚡',
      examples: [
        { clue: 'Being able to change hair color by sneezing', target: 22 },
        { clue: 'Time travel with memory retention', target: 94 },
        { clue: 'Turn water into lukewarm diet soda', target: 15 },
        { clue: 'Telekinesis over furniture only', target: 68 },
        { clue: 'Instant teleportation anywhere on Earth', target: 98 }
      ]
    },
    {
      id: 'spec_2',
      left: 'Mildly Annoying Quirk',
      right: 'Straight to Federal Prison',
      category: 'Social Etiquette & Sins',
      icon: '🚨',
      examples: [
        { clue: 'Chewing soup loudly with an open mouth', target: 35 },
        { clue: 'Stealing someone else’s labelled lunch from the office fridge', target: 72 },
        { clue: 'Microwaving leftover raw salmon in the shared breakroom', target: 88 },
        { clue: 'Replying "k" to a 3-paragraph heartfelt text', target: 55 }
      ]
    },
    {
      id: 'spec_3',
      left: 'Repulsive Culinary Crime',
      right: '3-Star Michelin Perfection',
      category: 'Food & Gastronomy',
      icon: '🍔',
      examples: [
        { clue: 'Ketchup on a $90 dry-aged wagyu ribeye', target: 12 },
        { clue: 'Warm fresh churros dipped in rich Belgian dark chocolate', target: 92 },
        { clue: 'Pineapple and jalapeño on crispy wood-fired pizza', target: 65 },
        { clue: 'Dipping Oreos in tap water instead of milk', target: 8 }
      ]
    },
    {
      id: 'spec_4',
      left: 'Total Utter Slop',
      right: 'Timeless Cultural Masterpiece',
      category: 'Entertainment & Art',
      icon: '🎬',
      examples: [
        { clue: 'A 45-minute unedited influencer apology video with sighing', target: 6 },
        { clue: 'The Lord of the Rings: The Fellowship of the Ring', target: 97 },
        { clue: 'Shrek 2 dinner table argument scene', target: 91 },
        { clue: 'A corporate motivational dubstep remix', target: 18 }
      ]
    },
    {
      id: 'spec_5',
      left: 'Completely Useless Life Skill',
      right: 'Essential for Human Survival',
      category: 'Skills & Talents',
      icon: '🧠',
      examples: [
        { clue: 'Balancing a spoon on your nose for 10 minutes', target: 14 },
        { clue: 'Building a fire in pouring rain with flint', target: 89 },
        { clue: 'Knowing the lyrics to every 2000s R&B song', target: 48 },
        { clue: 'Performing CPR and using a defibrillator', target: 99 }
      ]
    }
  ],

  // Majority Rules Decks (Subjective prompts for crowd consensus)
  majority: [
    {
      id: 'maj_1',
      prompt: "What is the undisputed champion of late-night fast food when it's 2:00 AM?",
      category: 'Midnight Cravings',
      suggested: ["Crunchwrap Supreme", "McDonald's 20-piece McNuggets", "Greasy local diner waffle", "Corner street tacos", "Doner kebab with garlic sauce"]
    },
    {
      id: 'maj_2',
      prompt: "If animals could talk, which species would have the absolute worst attitude?",
      category: 'Animal Kingdom',
      suggested: ["House cats", "Canada Geese", "Seagulls", "Wasps", "Llamas", "Chihuahuas"]
    },
    {
      id: 'maj_3',
      prompt: "What is the biggest, most common lie people put on their dating profiles or resumes?",
      category: 'Modern Lies',
      suggested: ["'Proficient in Excel'", "'Loves hiking and the outdoors'", "'5 ft 11 in'", "'Great work-life balance seeker'", "'Fluent in Spanish'"]
    },
    {
      id: 'maj_4',
      prompt: "Which everyday household item would be the most terrifying if it suddenly started laughing?",
      category: 'Spooky Quirks',
      suggested: ["The microwave", "The bathroom mirror", "The Roomba under the bed", "The smart toaster", "The showerhead"]
    },
    {
      id: 'maj_5',
      prompt: "Which fictional character would be the most unbearable roommate to live with?",
      category: 'Roommate Nightmares',
      suggested: ["Sheldon Cooper", "Tony Stark", "Shrek", "The Grinch", "Gollum", "Barney Stinson"]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_PACKS;
}

