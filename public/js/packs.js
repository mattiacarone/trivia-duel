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

