import { TestCreationWizard } from '../../../components/ABTesting/TestCreationWizard';

export default function CreateTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create A/B Test</h1>
        <p className="text-gray-600 mt-2">
          Set up a new A/B test to optimize your content
        </p>
      </div>

      <TestCreationWizard />
    </div>
  );
}
