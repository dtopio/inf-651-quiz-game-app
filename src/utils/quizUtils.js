/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets a random selection of questions from a category
 * @param {Array} questions - All questions from a category
 * @param {number} count - Number of questions to select (default: 10)
 * @returns {Array} - Random selection of questions
 */
export function getRandomQuestions(questions, count = 10) {
  if (!questions || questions.length === 0) {
    return [];
  }
  
  // If we have fewer questions than requested, return all of them shuffled
  if (questions.length <= count) {
    return shuffleArray(questions);
  }
  
  // Shuffle all questions and take the first 'count' questions
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

/**
 * Load questions from JSON file
 * @param {string} categoryKey - The category key (e.g., 'science', 'history')
 * @returns {Promise<Array>} - Array of questions for the category
 */
export async function loadQuestionsForCategory(categoryKey) {
  try {
    const questionBank = await import('@/data/questions.json');
    return questionBank.default[categoryKey] || [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}
