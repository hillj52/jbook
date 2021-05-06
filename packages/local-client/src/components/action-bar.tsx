import { useActions } from '../hooks/use-actions';
import ActionButton from './action-button';

import './action-bar.css';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <ActionButton icon="fa-arrow-up" onClick={() => moveCell({ id, direction: 'up'})} />
      <ActionButton icon="fa-arrow-down" onClick={() => moveCell({ id, direction: 'down'})} />
      <ActionButton icon="fa-times" onClick={() => deleteCell({ id })} />
    </div>
  );
}

export default ActionBar;