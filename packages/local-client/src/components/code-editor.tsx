import { useRef } from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

import './code-editor.css';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {

  const editorRef = useRef<any>();

  const onEditorMount: EditorProps["onMount"] = (editor) => {
    editorRef.current = editor;
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  }

  const onCodeChange = (code: string | undefined) => onChange(code || '');

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/, '');
    editorRef.current.setValue(formatted);
  }

  return (
    <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" onClick={onFormatClick}>Format</button>
      <MonacoEditor
        value={initialValue}
        onChange={onCodeChange}
        language="javascript" 
        theme="vs-dark" 
        height="100%"
        onMount={onEditorMount}
        options={{ 
          wordWrap: 'on',
          minimap: { enabled: false},
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 12,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2
        }} 
      />
    </div>
  );
};

export default CodeEditor;