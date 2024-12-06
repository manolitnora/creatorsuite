import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Dynamic import of the editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

interface ContentEditorProps {
  onChange: (content: EditorState) => void;
  initialContent?: EditorState;
  placeholder?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  onChange,
  initialContent,
  placeholder = 'Start creating your content...'
}) => {
  const [editorState, setEditorState] = useState(
    initialContent || EditorState.createEmpty()
  );

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    onChange(state);
  };

  return (
    <div className="min-h-[400px] border border-gray-200 rounded-lg">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          blockType: {
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote'],
          },
          textAlign: {
            options: ['left', 'center', 'right', 'justify'],
          },
        }}
        editorClassName="px-4 py-2 min-h-[350px]"
        toolbarClassName="sticky top-0 z-50 bg-white border-b border-gray-200"
      />
    </div>
  );
};

export default ContentEditor;
