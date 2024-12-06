import { Suspense } from 'react';
import { TestResults } from '../../../components/ABTesting/TestResults';
import { Card } from '../../../components/common/Card';

interface Props {
  params: {
    id: string;
  };
}

export default function TestDetailsPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <Card>
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </Card>
        }
      >
        <TestResults testId={params.id} />
      </Suspense>
    </div>
  );
}
