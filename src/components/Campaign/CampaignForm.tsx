import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CampaignFormProps {
  onSubmit: (campaign: any) => void;
  initialData?: any;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [platforms, setPlatforms] = useState<string[]>(initialData?.platforms || []);
  const [budget, setBudget] = useState(initialData?.budget || '');
  const [dateRange, setDateRange] = useState([
    {
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
      key: 'selection'
    }
  ]);
  const [goals, setGoals] = useState<{[key: string]: number}>(initialData?.goals || {});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const availablePlatforms = [
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(current =>
      current.includes(platformId)
        ? current.filter(id => id !== platformId)
        : [...current, platformId]
    );
  };

  const handleGoalChange = (metric: string, value: string) => {
    setGoals(current => ({
      ...current,
      [metric]: parseInt(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      platforms,
      budget: parseInt(budget) || 0,
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
      goals
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Campaign Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {availablePlatforms.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformToggle(platform.id)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${platforms.includes(platform.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'}
              `}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget (USD)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Duration
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>
              {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
            </span>
            <span className="ml-2">📅</span>
          </button>
          
          {showDatePicker && (
            <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-md p-4">
              <DateRangePicker
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={dateRange}
                direction="horizontal"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Goals
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="engagement" className="block text-sm text-gray-500">
              Engagement Rate (%)
            </label>
            <input
              type="number"
              id="engagement"
              value={goals.engagement || ''}
              onChange={(e) => handleGoalChange('engagement', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="reach" className="block text-sm text-gray-500">
              Reach
            </label>
            <input
              type="number"
              id="reach"
              value={goals.reach || ''}
              onChange={(e) => handleGoalChange('reach', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="clicks" className="block text-sm text-gray-500">
              Click-through Rate (%)
            </label>
            <input
              type="number"
              id="clicks"
              value={goals.clicks || ''}
              onChange={(e) => handleGoalChange('clicks', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="conversions" className="block text-sm text-gray-500">
              Conversion Rate (%)
            </label>
            <input
              type="number"
              id="conversions"
              value={goals.conversions || ''}
              onChange={(e) => handleGoalChange('conversions', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Campaign
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
