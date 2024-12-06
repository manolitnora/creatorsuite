import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Form, FormField, FormGroup } from '../../components/common/Form';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';

interface TestVariant {
  id: string;
  content: string;
  description: string;
}

interface TestConfig {
  name: string;
  description: string;
  type: 'content' | 'layout' | 'cta' | 'timing';
  goal: string;
  targetAudience: string;
  duration: number;
  sampleSize: number;
  variants: TestVariant[];
  successMetric: 'engagement' | 'clicks' | 'conversions' | 'time_spent';
  minimumConfidence: number;
}

const INITIAL_CONFIG: TestConfig = {
  name: '',
  description: '',
  type: 'content',
  goal: '',
  targetAudience: '',
  duration: 7,
  sampleSize: 1000,
  variants: [
    { id: '1', content: '', description: 'Control Group' },
    { id: '2', content: '', description: 'Variant B' },
  ],
  successMetric: 'engagement',
  minimumConfidence: 95,
};

export function CreateABTest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<TestConfig>(INITIAL_CONFIG);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (id: string, field: keyof TestVariant, value: string) => {
    setConfig((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const addVariant = () => {
    if (config.variants.length >= 4) {
      toast.error('Maximum 4 variants allowed');
      return;
    }

    setConfig((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: (prev.variants.length + 1).toString(),
          content: '',
          description: `Variant ${String.fromCharCode(
            65 + prev.variants.length
          )}`,
        },
      ],
    }));
  };

  const removeVariant = (id: string) => {
    if (config.variants.length <= 2) {
      toast.error('Minimum 2 variants required');
      return;
    }

    setConfig((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/ab-testing/tests', config);
      toast.success('A/B test created successfully!');
      navigate('/ab-testing');
    } catch (error) {
      toast.error('Failed to create A/B test');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <FormField
        label="Test Name"
        name="name"
        value={config.name}
        onChange={handleChange}
        required
        placeholder="Enter a descriptive name for your test"
      />

      <FormField
        label="Description"
        name="description"
        value={config.description}
        onChange={handleChange}
        required
        placeholder="Describe what you're testing and why"
      />

      <FormGroup label="Test Type" required>
        <Select name="type" value={config.type} onChange={handleChange}>
          <option value="content">Content Test</option>
          <option value="layout">Layout Test</option>
          <option value="cta">Call-to-Action Test</option>
          <option value="timing">Timing Test</option>
        </Select>
      </FormGroup>

      <FormField
        label="Test Goal"
        name="goal"
        value={config.goal}
        onChange={handleChange}
        required
        placeholder="What do you want to achieve with this test?"
      />

      <FormField
        label="Target Audience"
        name="targetAudience"
        value={config.targetAudience}
        onChange={handleChange}
        required
        placeholder="Who is this test targeting?"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {config.variants.map((variant) => (
        <Card key={variant.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{variant.description}</h3>
            {variant.id !== '1' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeVariant(variant.id)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <FormField
              label="Variant Description"
              value={variant.description}
              onChange={(e) =>
                handleVariantChange(variant.id, 'description', e.target.value)
              }
              placeholder="Describe this variant"
            />

            <FormGroup label="Content">
              <textarea
                className="w-full h-32 px-3 py-2 border rounded-md"
                value={variant.content}
                onChange={(e) =>
                  handleVariantChange(variant.id, 'content', e.target.value)
                }
                placeholder="Enter the content for this variant"
              />
            </FormGroup>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addVariant}
        className="w-full"
      >
        Add Variant
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FormGroup label="Success Metric" required>
        <Select
          name="successMetric"
          value={config.successMetric}
          onChange={handleChange}
        >
          <option value="engagement">Engagement Rate</option>
          <option value="clicks">Click-through Rate</option>
          <option value="conversions">Conversion Rate</option>
          <option value="time_spent">Time Spent</option>
        </Select>
      </FormGroup>

      <FormField
        label="Test Duration (days)"
        name="duration"
        type="number"
        value={config.duration}
        onChange={handleChange}
        required
        min={1}
        max={90}
      />

      <FormField
        label="Sample Size"
        name="sampleSize"
        type="number"
        value={config.sampleSize}
        onChange={handleChange}
        required
        min={100}
      />

      <FormField
        label="Minimum Confidence Level (%)"
        name="minimumConfidence"
        type="number"
        value={config.minimumConfidence}
        onChange={handleChange}
        required
        min={80}
        max={99}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Create A/B Test</h2>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Step {step} of 3:{' '}
                {step === 1
                  ? 'Basic Information'
                  : step === 2
                  ? 'Test Variants'
                  : 'Test Configuration'}
              </div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setStep((prev) => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={loading}>
                  Create Test
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
