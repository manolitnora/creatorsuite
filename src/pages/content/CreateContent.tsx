import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Form, FormField, FormGroup } from '../../components/common/Form';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Tooltip } from '../../components/common/Tooltip';
import { InfoTooltip } from '../../components/common/Tooltip';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

interface ContentForm {
  title: string;
  description: string;
  content: string;
  platform: string;
  targetAudience: string;
  scheduledDate: string;
  tags: string[];
}

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const audiences = [
  { value: 'general', label: 'General Audience' },
  { value: 'professional', label: 'Professional' },
  { value: 'youth', label: 'Youth' },
  { value: 'tech-savvy', label: 'Tech-Savvy' },
];

export function CreateContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContentForm>({
    title: '',
    description: '',
    content: '',
    platform: '',
    targetAudience: '',
    scheduledDate: '',
    tags: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/content', formData);
      toast.success('Content created successfully!');
      navigate('/dashboard/content');
    } catch (error) {
      toast.error('Failed to create content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags }));
  };

  const generateAIContent = async () => {
    if (!formData.title || !formData.platform || !formData.targetAudience) {
      toast.error('Please fill in the title, platform, and target audience first.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/content/generate', {
        title: formData.title,
        platform: formData.platform,
        targetAudience: formData.targetAudience,
      });

      setFormData((prev) => ({
        ...prev,
        content: response.content,
        description: response.description,
        tags: response.tags,
      }));

      toast.success('AI content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create New Content</h2>
            <Button
              variant="secondary"
              onClick={generateAIContent}
              loading={loading}
            >
              Generate with AI
            </Button>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <FormGroup
              label="Platform"
              required
              helpText="Select the platform where this content will be published"
            >
              <Select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select Platform</option>
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup
              label="Target Audience"
              required
              helpText="Choose the primary audience for this content"
            >
              <Select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                required
              >
                <option value="">Select Target Audience</option>
                {audiences.map((audience) => (
                  <option key={audience.value} value={audience.value}>
                    {audience.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              helpText="Brief summary of your content"
            />

            <FormGroup
              label="Content"
              required
              labelFor="content-editor"
            >
              <Editor
                id="content-editor"
                initialValue={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                    'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                    'help', 'wordcount'
                  ],
                  toolbar:
                    'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                }}
              />
            </FormGroup>

            <FormField
              label={
                <div className="flex items-center space-x-2">
                  <span>Tags</span>
                  <InfoTooltip content="Separate tags with commas" />
                </div>
              }
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas"
            />

            <FormField
              label="Schedule Publication"
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              helpText="Leave empty to save as draft"
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/content')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                Create Content
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
