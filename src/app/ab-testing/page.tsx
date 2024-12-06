import { Suspense } from 'react';
import { TestDashboard } from '../../components/ABTesting/TestDashboard';
import { Card } from '../../components/common/Card';

export default function ABTestingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">A/B Testing</h1>
        <p className="text-gray-600 mt-2">
          Create and manage A/B tests to optimize your content performance
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </Card>
        }
      >
        <TestDashboard />
      </Suspense>
    </div>
  );
}
