import React, { useState } from 'react';

interface AIAssistantProps {
  onSuggestionSelect: (suggestion: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestionSelect }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with backend AI service
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Assistant</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            What kind of content would you like to create?
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., Write a tweet about our new feature..."
            />
            <button
              onClick={generateSuggestions}
              disabled={loading || !prompt}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Suggestions:</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => onSuggestionSelect(suggestion)}
                  className="p-3 rounded-md border border-gray-200 hover:border-indigo-500 cursor-pointer transition-colors"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            Improve tone
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            Make shorter
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            Add hashtags
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
