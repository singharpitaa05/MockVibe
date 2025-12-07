import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Question from './models/Question.js';

dotenv.config();

// Pre-generated questions database
const questionsToSeed = [
  // BEHAVIORAL QUESTIONS - BEGINNER
  {
    questionText: "Tell me about a time when you had to learn something new quickly.",
    category: 'Behavioral',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst', 'Product Manager'],
    tags: ['learning', 'adaptability', 'growth mindset'],
  },
  {
    questionText: "Describe a situation where you had to work with someone you didn't get along with. How did you handle it?",
    category: 'Behavioral',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Product Manager', 'Business Analyst'],
    tags: ['teamwork', 'conflict resolution', 'communication'],
  },
  {
    questionText: "Give an example of a goal you set for yourself and how you achieved it.",
    category: 'Behavioral',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst', 'Product Manager'],
    tags: ['goal setting', 'determination', 'achievement'],
  },
  {
    questionText: "Tell me about a project you're proud of and explain your role in it.",
    category: 'Behavioral',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['accomplishment', 'responsibility', 'portfolio'],
  },
  {
    questionText: "Describe a time when you received critical feedback. How did you respond?",
    category: 'Behavioral',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Product Manager', 'Business Analyst'],
    tags: ['feedback', 'growth', 'resilience'],
  },

  // BEHAVIORAL QUESTIONS - INTERMEDIATE
  {
    questionText: "Tell me about a time when you had to make a decision with incomplete information. How did you approach it?",
    category: 'Behavioral',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Business Analyst'],
    tags: ['decision making', 'leadership', 'analysis'],
  },
  {
    questionText: "Describe a situation where you had to lead a team or group to achieve a specific goal.",
    category: 'Behavioral',
    difficulty: 'Intermediate',
    relevantRoles: ['Product Manager', 'Business Analyst', 'Software Developer'],
    tags: ['leadership', 'team management', 'goal achievement'],
  },
  {
    questionText: "Tell me about a time when a project failed. What did you learn from it?",
    category: 'Behavioral',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['failure', 'learning', 'resilience'],
  },
  {
    questionText: "Describe a situation where you had to prioritize multiple urgent tasks. How did you handle it?",
    category: 'Behavioral',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Business Analyst'],
    tags: ['prioritization', 'time management', 'stress management'],
  },
  {
    questionText: "Tell me about a time when you had to mentor or help someone else succeed.",
    category: 'Behavioral',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['mentoring', 'leadership', 'empathy'],
  },

  // BEHAVIORAL QUESTIONS - EXPERT
  {
    questionText: "Describe a complex problem you solved that required cross-functional collaboration. What was your approach?",
    category: 'Behavioral',
    difficulty: 'Expert',
    relevantRoles: ['Product Manager', 'Software Developer', 'Business Analyst'],
    tags: ['problem solving', 'collaboration', 'complexity'],
  },
  {
    questionText: "Tell me about a time when you had to deliver bad news to stakeholders. How did you handle it?",
    category: 'Behavioral',
    difficulty: 'Expert',
    relevantRoles: ['Product Manager', 'Business Analyst', 'Software Developer'],
    tags: ['communication', 'leadership', 'stakeholder management'],
  },
  {
    questionText: "Describe a situation where you had to challenge the status quo or disagree with a decision. What was the outcome?",
    category: 'Behavioral',
    difficulty: 'Expert',
    relevantRoles: ['Product Manager', 'Software Developer', 'Business Analyst'],
    tags: ['initiative', 'courage', 'influence'],
  },

  // CODING QUESTIONS - BEGINNER
  {
    questionText: "Write a function that takes an array of integers and returns the sum of all elements.",
    category: 'Coding',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['arrays', 'basic algorithms', 'loops'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '[1, 2, 3, 4, 5]',
      expectedOutput: '15',
    },
  },
  {
    questionText: "Write a function that checks if a given string is a palindrome.",
    category: 'Coding',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer'],
    tags: ['strings', 'basic algorithms'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '"racecar"',
      expectedOutput: 'true',
    },
  },
  {
    questionText: "Write a function that returns the largest element in an array without using built-in max() method.",
    category: 'Coding',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['arrays', 'iteration'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '[3, 7, 2, 9, 1]',
      expectedOutput: '9',
    },
  },
  {
    questionText: "Write a function that removes duplicate elements from an array.",
    category: 'Coding',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer'],
    tags: ['arrays', 'data structures'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '[1, 2, 2, 3, 3, 3]',
      expectedOutput: '[1, 2, 3]',
    },
  },

  // CODING QUESTIONS - INTERMEDIATE
  {
    questionText: "Write a function that finds two numbers in an array that add up to a target sum.",
    category: 'Coding',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['arrays', 'hash tables', 'two pointers'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: 'array: [2, 7, 11, 15], target: 9',
      expectedOutput: '[0, 1] (because nums[0] + nums[1] == 9)',
    },
  },
  {
    questionText: "Implement a function to reverse a string without using built-in reverse() method.",
    category: 'Coding',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer'],
    tags: ['strings', 'algorithms'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '"hello"',
      expectedOutput: '"olleh"',
    },
  },
  {
    questionText: "Write a function that finds the longest substring without repeating characters.",
    category: 'Coding',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer'],
    tags: ['strings', 'sliding window', 'hash map'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: '"abcabcbb"',
      expectedOutput: '3 (the string "abc")',
    },
  },
  {
    questionText: "Implement a function to perform binary search on a sorted array.",
    category: 'Coding',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['searching', 'divide and conquer'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: 'array: [1, 3, 5, 7, 9], target: 5',
      expectedOutput: '2 (index of target)',
    },
  },

  // CODING QUESTIONS - EXPERT
  {
    questionText: "Implement the LRU (Least Recently Used) Cache with get and put operations. Both should run in O(1) time complexity.",
    category: 'Coding',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['data structures', 'design patterns', 'hash map', 'linked list'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: 'LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3);',
      expectedOutput: 'Cache operates correctly with capacity 2',
    },
  },
  {
    questionText: "Design and implement a system to handle rate limiting for an API. Describe your approach to handle high traffic.",
    category: 'Coding',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'algorithms', 'scalability'],
    codingDetails: {
      language: 'JavaScript',
      exampleInput: 'Design a rate limiter that allows 100 requests per minute per IP',
      expectedOutput: 'Implementation with appropriate data structures',
    },
  },

  // TECHNICAL THEORY - BEGINNER
  {
    questionText: "Explain what a variable is and how it works in programming.",
    category: 'Technical Theory',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['fundamentals', 'variables'],
  },
  {
    questionText: "What is the difference between an array and a list? When would you use each?",
    category: 'Technical Theory',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['data structures'],
  },
  {
    questionText: "Explain the concept of a loop and give examples of different types of loops.",
    category: 'Technical Theory',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer'],
    tags: ['control flow', 'loops'],
  },

  // TECHNICAL THEORY - INTERMEDIATE
  {
    questionText: "Explain the difference between synchronous and asynchronous programming. When would you use each?",
    category: 'Technical Theory',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer'],
    tags: ['async programming', 'concurrency'],
  },
  {
    questionText: "What is the difference between SQL and NoSQL databases? Give examples of when to use each.",
    category: 'Technical Theory',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Data Analyst', 'Business Analyst'],
    tags: ['databases'],
  },
  {
    questionText: "Explain the concept of Big O notation and its importance in algorithm analysis.",
    category: 'Technical Theory',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Data Analyst'],
    tags: ['algorithms', 'complexity analysis'],
  },

  // TECHNICAL THEORY - EXPERT
  {
    questionText: "Design a distributed caching system. What challenges would you face and how would you solve them?",
    category: 'Technical Theory',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'distributed systems'],
  },
  {
    questionText: "Explain CAP theorem and its implications for distributed systems design.",
    category: 'Technical Theory',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['distributed systems', 'consistency'],
  },

  // SYSTEM DESIGN - INTERMEDIATE
  {
    questionText: "Design a URL shortening service like bit.ly. What would be your approach?",
    category: 'System Design',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'scalability'],
  },
  {
    questionText: "How would you design a parking lot system? Think about data structures and functionality.",
    category: 'System Design',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'OOP'],
  },

  // SYSTEM DESIGN - EXPERT
  {
    questionText: "Design Instagram's feed. How would you handle billions of users and millions of posts?",
    category: 'System Design',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'scalability', 'distributed systems'],
  },
  {
    questionText: "Design Netflix's video streaming platform. Consider CDN, caching, and user experience.",
    category: 'System Design',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer'],
    tags: ['system design', 'streaming', 'scalability'],
  },

  // HR QUESTIONS
  {
    questionText: "Why are you interested in this position and this company?",
    category: 'HR',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst', 'Business Analyst'],
    tags: ['motivation', 'company knowledge'],
  },
  {
    questionText: "What are your strengths and weaknesses?",
    category: 'HR',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['self-awareness', 'honesty'],
  },
  {
    questionText: "Where do you see yourself in 5 years?",
    category: 'HR',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['career goals', 'ambition'],
  },
  {
    questionText: "Tell me about a time you failed and what you learned from it.",
    category: 'HR',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Business Analyst'],
    tags: ['resilience', 'growth mindset'],
  },
];

async function seedQuestions() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing questions (optional - comment out to keep existing data)
    // await Question.deleteMany({});
    // console.log('Cleared existing questions');

    // Insert new questions
    const insertedQuestions = await Question.insertMany(questionsToSeed);
    console.log(`✓ Successfully seeded ${insertedQuestions.length} questions to the database!`);

    // Display summary
    const byCategory = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nQuestions by Category:');
    byCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count}`);
    });

    const byDifficulty = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nQuestions by Difficulty:');
    byDifficulty.forEach(diff => {
      console.log(`  ${diff._id}: ${diff.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
