import { useEffect } from 'react';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';

import './code-cell.css';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell: { id, content } }) => {

  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector(({ bundles }) => bundles[id]);
  const cumulativeCode = useCumulativeCode(id);

  useEffect(() => {
    if (!bundle) {
      createBundle({ id, content: cumulativeCode});
    }

    const timer = setTimeout(async () => {
      createBundle({ id, content: cumulativeCode})
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cumulativeCode, createBundle]);

  const onCodeEditorChange = (code: string) => {
    code && updateCell({ id, content: code });
  }

  return ( 
    <Resizable direction="vertical">
      <section style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor initialValue={content} onChange={onCodeEditorChange} />
        </Resizable>
        <div className="progress-wrapper">
        {
          !bundle || bundle.loading
          ? 
          <div className="progress-cover">
            <progress className="progress is-small is-primary" max="100">
              Loading
            </progress>
          </div>
          : <Preview code={bundle.code} error={bundle.error} />
        }
        </div>
      </section>
    </Resizable>
  );
};

export default CodeCell;
