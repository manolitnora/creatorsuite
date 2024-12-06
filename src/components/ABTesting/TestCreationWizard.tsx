import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import ContentEditor from '../ContentCreation/Editor';

interface Variant {
  id: string;
  content: string;
  isControl: boolean;
  predictedPerformance?: {
    engagement: number;
    reach: number;
    clicks: number;
  };
}

interface TestCreationWizardProps {
  onSubmit: (test: any) => void;
  initialData?: any;
}

export const TestCreationWizard: React.FC<TestCreationWizardProps> = ({
  onSubmit,
  initialData
}) => {
  const [step, setStep] = useState(1);
  const [testData, setTestData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    platform: initialData?.platform || '',
    minSampleSize: initialData?.minSampleSize || 1000,
    maxDurationHours: initialData?.maxDurationHours || 24,
    confidenceLevel: initialData?.confidenceLevel || 95,
    metricsWeights: initialData?.metricsWeights || {
      engagement: 0.4,
      reach: 0.3,
      clicks: 0.3
    }
  });
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants || [
      { id: '1', content: '', isControl: true },
      { id: '2', content: '', isControl: false }
    ]
  );

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVariantChange = (id: string, content: string) => {
    setVariants(current =>
      current.map(variant =>
        variant.id === id ? { ...variant, content } : variant
      )
    );
  };

  const addVariant = () => {
    setVariants(current => [
      ...current,
      { id: String(current.length + 1), content: '', isControl: false }
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(current => current.filter(variant => variant.id !== id));
  };

  const handleMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...testData,
      variants
    });
  };

  const platforms = ['twitter', 'linkedin', 'facebook', 'instagram'];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                  ${step >= num ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`h-1 w-16 mx-2 ${
                    step > num ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium">Basic Info</span>
          <span className="text-sm font-medium">Variants</span>
          <span className="text-sm font-medium">Metrics</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Test Name
            </label>
            <input
              type="text"
              id="name"
              value={testData.name}
              onChange={(e) => setTestData({ ...testData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={testData.description}
              onChange={(e) => setTestData({ ...testData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              id="platform"
              value={testData.platform}
              onChange={(e) => setTestData({ ...testData, platform: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select platform</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create Test Variants
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Create different versions of your content to test. The first variant will be your control.</p>
              </div>
              
              <div className="mt-6 space-y-6">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {variant.isControl ? 'Control Variant' : `Variant ${index}`}
                      </h4>
                      {!variant.isControl && (
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <ContentEditor
                      onChange={(state: EditorState) => {
                        const content = state.getCurrentContent().getPlainText();
                        handleVariantChange(variant.id, content);
                      }}
                      placeholder="Enter your content variant here..."
                    />
                  </div>
                ))}
              </div>

              {variants.length < 4 && (
                <button
                  type="button"
                  onClick={addVariant}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Variant
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleMetricsSubmit} className="space-y-6">
          <div>
            <label htmlFor="minSampleSize" className="block text-sm font-medium text-gray-700">
              Minimum Sample Size
            </label>
            <input
              type="number"
              id="minSampleSize"
              value={testData.minSampleSize}
              onChange={(e) => setTestData({ ...testData, minSampleSize: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min="100"
              required
            />
          </div>

          <div>
            <label htmlFor="maxDuration" className="block text-sm font-medium text-gray-700">
              Maximum Test Duration (hours)
            </label>
            <input
              type="number"
              id="maxDuration"
              value={testData.maxDurationHours}
              onChange={(e) => setTestData({ ...testData, maxDurationHours: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min="1"
              max="720"
              required
            />
          </div>

          <div>
            <label htmlFor="confidenceLevel" className="block text-sm font-medium text-gray-700">
              Confidence Level (%)
            </label>
            <input
              type="number"
              id="confidenceLevel"
              value={testData.confidenceLevel}
              onChange={(e) => setTestData({ ...testData, confidenceLevel: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min="90"
              max="99"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metrics Weights
            </label>
            <div className="space-y-4">
              {Object.entries(testData.metricsWeights).map(([metric, weight]) => (
                <div key={metric}>
                  <label className="block text-sm text-gray-500 mb-1">
                    {metric.charAt(0).toUpperCase() + metric.slice(1)} Weight
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weight}
                    onChange={(e) =>
                      setTestData({
                        ...testData,
                        metricsWeights: {
                          ...testData.metricsWeights,
                          [metric]: parseFloat(e.target.value)
                        }
                      })
                    }
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{(weight * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Test
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestCreationWizard;
