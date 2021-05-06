import { useState, useEffect, useRef } from 'react';
import { useActions } from '../hooks/use-actions'
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';

import './text-editor.css';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell: { id, content } }) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.target && ref.current.contains(event.target as Node)) {
        return;
      }
      setEditing(false);
    }
    document.addEventListener('click', listener, { capture: true });

    return () => document.removeEventListener('click', listener, { capture: true });
  }, []);

  const editor = editing 
    ? <MDEditor value={content} onChange={(v) => updateCell({ id, content: v || ''})} /> 
    : <div className="card">
        <div className="card-content">
            <MDEditor.Markdown source={content || 'Click to edit'} />
          </div>
        </div>;

  return (
    <section className="text-editor" ref={ref} onClick={() => setEditing(true)}>
      {editor}
    </section>
  );
}

export default TextEditor;