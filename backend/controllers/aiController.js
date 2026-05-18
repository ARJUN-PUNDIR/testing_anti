const axios = require('axios');
const Employee = require('../models/Employee');

// @desc    Get AI recommendations for an employee
// @route   POST /api/ai/recommend
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, error: 'Please provide an employee ID' });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'AI API Key not configured' });
    }

    // Prepare prompt
    const prompt = `
      Analyze the following employee data and provide a performance evaluation.
      Employee Name: ${employee.name}
      Department: ${employee.department}
      Skills: ${employee.skills.join(', ')}
      Performance Score: ${employee.performanceScore}/100
      Experience: ${employee.experience} years

      Please provide a JSON response with the following keys:
      - "promotionRecommendation": A short sentence on whether they are ready for a promotion.
      - "trainingSuggestions": An array of strings with suggested training/courses.
      - "employeeRanking": A general category (e.g., "Top Performer", "Needs Improvement", "Solid Contributor").
      - "feedback": Constructive feedback based on their score and experience.

      Only respond with the raw JSON object, no markdown blocks.
    `;

    // Make request to OpenRouter or OpenAI
    // Assuming standard OpenAI format which OpenRouter also uses
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions', // Or https://api.openai.com/v1/chat/completions
      {
        model: 'openai/gpt-3.5-turbo', // You can change this to another supported model
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000', // Optional, required by OpenRouter
          'X-Title': 'Employee Analytics App', // Optional, required by OpenRouter
        },
      }
    );

    let aiData;
    try {
      const responseContent = response.data.choices[0].message.content.trim();
      // Try parsing JSON directly, sometimes LLMs add backticks
      aiData = JSON.parse(responseContent.replace(/```json/g, '').replace(/```/g, ''));
    } catch (parseError) {
      console.error('Failed to parse AI response:', response.data.choices[0].message.content);
      return res.status(500).json({ success: false, error: 'Failed to parse AI response' });
    }

    res.status(200).json({
      success: true,
      data: aiData,
    });
  } catch (error) {
    console.error('AI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
};
