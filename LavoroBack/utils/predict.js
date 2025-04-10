const axios = require('axios');

// Configuration
const AI_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
const API_BASE_URL = "https://api-inference.huggingface.co/models";
const API_KEY = process.env.HUGGINGFACE_API_KEY || "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";
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds

async function predictProjectFields(name, description) {
  try {
    // Step 1: Get detailed analysis with retry logic
    const analysisPrompt = createAnalysisPrompt(name, description);
    const analysis = await queryWithRetry(analysisPrompt);
    
    // Step 2: Convert to JSON with retry logic
    const jsonPrompt = createJsonPrompt(analysis);
    const jsonResponse = await queryWithRetry(jsonPrompt);
    
    // Process and validate the response
    const result = processApiResponse(jsonResponse, name, description);
    
    return {
      ...result,
      source: "ai-prediction"
    };
  } catch (error) {
    console.error("AI prediction failed:", error.message);
    return getEnhancedFallback(name, description);
  }
}

// Helper Functions

async function queryWithRetry(prompt, retries = MAX_RETRIES, timeout = INITIAL_TIMEOUT) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${AI_MODEL}`,
        {
          inputs: prompt,
          parameters: {
            return_full_text: false,
            max_new_tokens: 250,
            wait_for_model: true
          }
        },
        {
          headers: { "Authorization": `Bearer ${API_KEY}` },
          timeout: timeout * (attempt + 1) // Exponential backoff
        }
      );
      
      if (!response.data || !response.data[0]?.generated_text) {
        throw new Error("Empty response from API");
      }
      
      return response.data[0].generated_text;
    } catch (error) {
      if (attempt === retries - 1) throw error;
      
      const delay = 1000 * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function createAnalysisPrompt(name, description) {
  return `Analyze this project and provide estimates:
Project: "${name}"
Description: "${description}"

Provide analysis in this exact format:
Complexity: [1-10]
Skill Level: [Junior/Intermediate/Senior]
Risks: [comma separated list]
Team Size: [number]
Budget Range: [low,high] USD
Timeframe: [weeks]`;
}

function createJsonPrompt(analysis) {
  return `Convert this analysis to JSON. Return ONLY this structure:
{
  "budget": /* number */,
  "duration": /* months */,
  "task_count": /* number */,
  "team_member_count": /* number */,
  "priority": "Low/Medium/High",
  "risk_level": "Low/Medium/High"
}

Analysis to convert:
${analysis.substring(0, 500)}`; // Limit input size
}

function processApiResponse(rawResponse, name, description) {
  const responseText = rawResponse.trim();
  
  // Try multiple parsing strategies
  const parsingAttempts = [
    () => JSON.parse(responseText),
    () => JSON.parse(extractStrictJson(responseText)),
    () => extractPartialData(responseText)
  ];
  
  for (const attempt of parsingAttempts) {
    try {
      const result = attempt();
      if (isValidPrediction(result)) {
        return result;
      }
    } catch (e) {
      continue;
    }
  }
  
  throw new Error("Could not parse API response");
}

function extractStrictJson(text) {
  const jsonMatch = text.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
  return jsonMatch ? jsonMatch[0] : '{}';
}

function extractPartialData(text) {
  const numberPattern = /(\d+)/g;
  const numbers = text.match(numberPattern) || [];
  
  return {
    budget: parseInt(numbers[0]) || 5000,
    duration: parseInt(numbers[1]) || 1,
    task_count: parseInt(numbers[2]) || 10,
    team_member_count: parseInt(numbers[3]) || 2,
    priority: text.includes('High') ? 'High' : 
             text.includes('Medium') ? 'Medium' : 'Low',
    risk_level: text.includes('High') ? 'High' : 
               text.includes('Medium') ? 'Medium' : 'Low'
  };
}

function isValidPrediction(result) {
  const requiredFields = ['budget', 'duration', 'task_count', 'team_member_count'];
  return requiredFields.every(field => field in result && !isNaN(result[field]));
}

function getEnhancedFallback(name, description) {
  const content = `${name} ${description}`;
  const wordCount = content.split(/\s+/).length;
  const charCount = content.length;
  const hasComplexKeywords = /complex|integrate|api|custom|scalable/i.test(content);
  
  const complexity = Math.min(10, Math.max(1, 
    (wordCount / 50) + 
    (charCount / 500) + 
    (hasComplexKeywords ? 3 : 0)
  ));

  return {
    budget: Math.round(2000 + (complexity * 3000)),
    duration: Math.max(1, Math.round(complexity)),
    task_count: Math.max(5, Math.round(complexity * 8)),
    team_member_count: Math.max(1, Math.round(1 + complexity/2)),
    priority: complexity > 7 ? 'High' : complexity > 4 ? 'Medium' : 'Low',
    risk_level: complexity > 6 ? 'High' : complexity > 3 ? 'Medium' : 'Low',
    source: "enhanced-fallback",
    warning: "AI model unavailable - using algorithmic estimates"
  };
}

module.exports = { predictProjectFields };