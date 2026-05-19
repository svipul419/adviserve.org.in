import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Code, Minus, X } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

function InlineInput({ label, placeholder, onSubmit, onCancel }: {
  label: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-2 py-1 bg-blue-50 border-b border-blue-200">
      <span className="text-xs text-gray-500 whitespace-nowrap">{label}:</span>
      <input
        type="url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded bg-ink-raised text-gray-900 focus:outline-none focus:border-blue-500"
        autoFocus
      />
      <button type="submit" className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1">
        Add
      </button>
      <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
        <X size={14} />
      </button>
    </form>
  );
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = (url: string) => {
    editor.chain().focus().setLink({ href: url }).run();
    setShowLinkInput(false);
  };

  const addImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setShowImageInput(false);
  };

  const ToolbarButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${active ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={18} />
        </ToolbarButton>
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
          <Code size={18} />
        </ToolbarButton>
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus size={18} />
        </ToolbarButton>
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => { setShowLinkInput(!showLinkInput); setShowImageInput(false); }} active={editor.isActive('link') || showLinkInput} title="Add Link">
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => { setShowImageInput(!showImageInput); setShowLinkInput(false); }} active={showImageInput} title="Add Image">
          <ImageIcon size={18} />
        </ToolbarButton>
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={18} />
        </ToolbarButton>
      </div>
      {showLinkInput && (
        <InlineInput
          label="Link URL"
          placeholder="https://example.com"
          onSubmit={addLink}
          onCancel={() => setShowLinkInput(false)}
        />
      )}
      {showImageInput && (
        <InlineInput
          label="Image URL"
          placeholder="https://example.com/image.jpg"
          onSubmit={addImage}
          onCancel={() => setShowImageInput(false)}
        />
      )}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus-within:ring-2 focus-within:ring-blue-500 [&_.tiptap]:outline-none [&_.tiptap]:min-h-[280px]"
      />
    </div>
  );
}
