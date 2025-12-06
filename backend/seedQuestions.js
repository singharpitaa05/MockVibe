// SEED QUESTIONS

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Question from './models/Question.js';

dotenv.config();

// Sample questions to seed the database
const sampleQuestions = [
  // Coding Questions
  {
    questionText: 'Write a function to reverse a string without using built-in reverse methods.',
    category: 'Coding',
    subcategory: 'Strings',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer'],
    tags: ['strings', 'algorithms', 'basic'],
    codingDetails: {
      language: 'Any',
      starterCode: 'function reverseString(str) {\n  // Your code here\n}',
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"', isHidden: false },
        { input: '"world"', expectedOutput: '"dlrow"', isHidden: false },
        { input: '""', expectedOutput: '""', isHidden: true },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    sampleAnswer: 'You can iterate through the string from end to start and build a new string, or convert to array, reverse, and join.',
    hints: ['Think about iterating backwards', 'Consider using a loop'],
  },
  {
    questionText: 'Implement a function to check if a string is a palindrome.',
    category: 'Coding',
    subcategory: 'Strings',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer'],
    tags: ['strings', 'algorithms', 'palindrome'],
    codingDetails: {
      language: 'Any',
      starterCode: 'function isPalindrome(str) {\n  // Your code here\n}',
      testCases: [
        { input: '"racecar"', expectedOutput: 'true', isHidden: false },
        { input: '"hello"', expectedOutput: 'false', isHidden: false },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    sampleAnswer: 'Compare characters from both ends moving towards the center.',
    hints: ['Use two pointers approach', 'Compare first and last characters'],
  },
  {
    questionText: 'Find the two numbers in an array that sum up to a target value.',
    category: 'Coding',
    subcategory: 'Arrays',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Backend Developer', 'Full Stack Developer'],
    tags: ['arrays', 'hash-map', 'two-pointer'],
    codingDetails: {
      language: 'Any',
      starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    sampleAnswer: 'Use a hash map to store visited numbers and their indices.',
    hints: ['Consider using a hash map', 'What is the complement of each number?'],
  },
  {
    questionText: 'Implement a binary search algorithm on a sorted array.',
    category: 'Coding',
    subcategory: 'Search Algorithms',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Backend Developer'],
    tags: ['algorithms', 'binary-search', 'arrays'],
    codingDetails: {
      language: 'Any',
      starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n}',
      testCases: [
        { input: '[1,2,3,4,5], 3', expectedOutput: '2', isHidden: false },
        { input: '[1,2,3,4,5], 6', expectedOutput: '-1', isHidden: false },
      ],
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
    },
    sampleAnswer: 'Repeatedly divide the search space in half by comparing the middle element.',
  },
  {
    questionText: 'Design a URL shortener service like bit.ly. Discuss the architecture, database design, and scaling considerations.',
    category: 'System Design',
    subcategory: 'Web Services',
    difficulty: 'Expert',
    relevantRoles: ['Software Developer', 'Backend Developer', 'Full Stack Developer'],
    tags: ['system-design', 'scalability', 'databases'],
    sampleAnswer: 'Use hash functions for URL encoding, consider distributed systems, caching layer, load balancing, and database sharding.',
    evaluationCriteria: [
      { criterion: 'Database design', weight: 25 },
      { criterion: 'Scalability approach', weight: 30 },
      { criterion: 'API design', weight: 20 },
      { criterion: 'Caching strategy', weight: 25 },
    ],
    followUpQuestions: [
      'How would you handle collision in hash functions?',
      'What caching strategy would you use?',
      'How would you ensure high availability?',
    ],
  },

  // Behavioral Questions
  {
    questionText: 'Tell me about a time when you had to work with a difficult team member. How did you handle it?',
    category: 'Behavioral',
    subcategory: 'Teamwork',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['teamwork', 'conflict-resolution', 'communication'],
    sampleAnswer: 'Use STAR method: Describe the Situation, Task, Action taken, and Result achieved.',
    evaluationCriteria: [
      { criterion: 'Communication skills', weight: 30 },
      { criterion: 'Problem-solving approach', weight: 30 },
      { criterion: 'Emotional intelligence', weight: 40 },
    ],
  },
  {
    questionText: 'Describe a situation where you had to learn a new technology quickly. How did you approach it?',
    category: 'Behavioral',
    subcategory: 'Learning Agility',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer'],
    tags: ['learning', 'adaptability', 'growth'],
    sampleAnswer: 'Discuss research approach, hands-on practice, seeking help, and applying the knowledge.',
  },
  {
    questionText: 'Give an example of a project where you had to deal with ambiguous requirements. What did you do?',
    category: 'Behavioral',
    subcategory: 'Problem Solving',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Full Stack Developer'],
    tags: ['problem-solving', 'communication', 'clarification'],
    sampleAnswer: 'Describe how you asked clarifying questions, broke down the problem, and iteratively refined requirements.',
  },
  {
    questionText: 'Tell me about a time when you failed. What did you learn from it?',
    category: 'Behavioral',
    subcategory: 'Growth Mindset',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['failure', 'learning', 'resilience'],
    sampleAnswer: 'Be honest about the failure, focus on lessons learned and how you applied them later.',
  },

  // HR Questions
  {
    questionText: 'Why do you want to work for our company?',
    category: 'HR',
    subcategory: 'Motivation',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Product Manager'],
    tags: ['motivation', 'company-fit', 'career-goals'],
    sampleAnswer: 'Research the company, mention specific aspects that align with your values and career goals.',
  },
  {
    questionText: 'Where do you see yourself in 5 years?',
    category: 'HR',
    subcategory: 'Career Goals',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Product Manager', 'Data Analyst'],
    tags: ['career-goals', 'ambition', 'planning'],
    sampleAnswer: 'Focus on professional growth, skill development, and alignment with the role.',
  },
  {
    questionText: 'What are your salary expectations?',
    category: 'HR',
    subcategory: 'Compensation',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer'],
    tags: ['compensation', 'negotiation'],
    sampleAnswer: 'Research market rates, provide a range based on experience and location.',
  },

  // Technical Theory Questions
  {
    questionText: 'Explain the difference between SQL and NoSQL databases. When would you use each?',
    category: 'Technical Theory',
    subcategory: 'Databases',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Backend Developer', 'Full Stack Developer'],
    tags: ['databases', 'sql', 'nosql'],
    sampleAnswer: 'SQL: structured data, ACID compliance. NoSQL: flexible schema, horizontal scaling. Use SQL for complex queries, NoSQL for high scalability.',
  },
  {
    questionText: 'What is the difference between authentication and authorization?',
    category: 'Technical Theory',
    subcategory: 'Security',
    difficulty: 'Beginner',
    relevantRoles: ['Software Developer', 'Backend Developer', 'Full Stack Developer'],
    tags: ['security', 'authentication', 'authorization'],
    sampleAnswer: 'Authentication verifies who you are. Authorization determines what you can access.',
  },
  {
    questionText: 'Explain how RESTful APIs work and their key principles.',
    category: 'Technical Theory',
    subcategory: 'Web Development',
    difficulty: 'Intermediate',
    relevantRoles: ['Software Developer', 'Backend Developer', 'Full Stack Developer'],
    tags: ['rest', 'api', 'web-development'],
    sampleAnswer: 'REST uses HTTP methods, stateless communication, resource-based URLs, and standard status codes.',
  },
  {
    questionText: 'What is the event loop in JavaScript? How does it work?',
    category: 'Technical Theory',
    subcategory: 'JavaScript',
    difficulty: 'Intermediate',
    relevantRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Developer'],
    tags: ['javascript', 'async', 'event-loop'],
    sampleAnswer: 'Event loop handles async operations through call stack, callback queue, and microtask queue.',
  },
];

const seedQuestions = async () => {
  try {
    await connectDB();

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Seeded ${sampleQuestions.length} questions successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();