import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import ContentEditor from './Editor';

interface ContentFormProps {
  onSubmit: (content: any) => void;
  initialContent?: any;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  onSubmit,
  initialContent
}) => {
  const [title, setTitle] = useState(initialContent?.title || '');
  const [platform, setPlatform] = useState(initialContent?.platform || '');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    onSubmit({
      title,
      platform,
      content: rawContent,
      scheduled: isScheduled ? scheduledDate : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
          Platform
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select platform</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <ContentEditor
          onChange={setEditorState}
          placeholder="Write your content here..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          id="schedule"
          checked={isScheduled}
          onChange={(e) => setIsScheduled(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="schedule" className="text-sm font-medium text-gray-700">
          Schedule post
        </label>
        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        )}
      </div>

      <div className="flex justify-end space-x-3">
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
          {isScheduled ? 'Schedule Post' : 'Publish Now'}
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
