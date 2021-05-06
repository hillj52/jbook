import { useActions } from '../hooks/use-actions'; 
import { CellType } from '../state';
import ActionButton from './action-button';

import './add-cell.css';

interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {

  const { insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-buttons">
        <ActionButton 
          icon="fa-plus"
          buttonText="Code"
          onClick={() => insertCellAfter({ id: previousCellId, type: CellType.CODE })} 
          rounded
          smallIcon
        />
        <ActionButton
          icon="fa-plus"
          buttonText="Text" 
          onClick={() => insertCellAfter({ id: previousCellId, type: CellType.MARKDOWN })} 
          rounded
          smallIcon
        />
      </div>
      <div className="divider"></div>
    </div>
  );
}

export default AddCell;