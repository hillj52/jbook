import { ActionType } from '../action-types';
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
} from '../actions';
import { Cell, CellType } from '../cell';
import { Dispatch } from 'redux';
import bundle from '../../bundler';
import axios from 'axios';
import { RootState } from '../reducers';

interface UpdateCellArgs {
  id: string;
  content: string;
}

export const updateCell = ({
  id,
  content,
}: UpdateCellArgs): UpdateCellAction => ({
  type: ActionType.UPDATE_CELL,
  payload: { id, content },
});

interface DeleteCellArgs {
  id: string;
}

export const deleteCell = ({ id }: DeleteCellArgs): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

interface MoveCellArgs {
  id: string;
  direction: Direction;
}

export const moveCell = ({ id, direction }: MoveCellArgs): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: { id, direction },
});

interface InsertCellAfterArgs {
  id: string | null;
  type: CellType;
}

export const insertCellAfter = ({
  id,
  type,
}: InsertCellAfterArgs): InsertCellAfterAction => ({
  type: ActionType.INSERT_CELL_AFTER,
  payload: { id, type },
});

interface CreateBundleArgs {
  id: string;
  content: string;
}

export const createBundle = ({ id, content }: CreateBundleArgs) => async (
  dispatch: Dispatch<Action>
) => {
  dispatch({
    type: ActionType.BUNDLE_START,
    payload: {
      cellId: id,
    },
  });

  const { code, error } = await bundle(content);

  dispatch({
    type: ActionType.BUNDLE_COMPLETE,
    payload: {
      cellId: id,
      bundle: { code, error },
    },
  });
};

export const fetchCells = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: ActionType.FETCH_CELLS });
  try {
    const { data }: { data: Cell[] } = await axios.get('/cells');
    dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
  } catch (err) {
    dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message });
  }
};

export const saveCells = () => async (
  dispatch: Dispatch<Action>,
  getState: () => RootState
) => {
  const {
    cells: { data, order },
  } = getState();

  const cells = order.map((id) => data[id]);

  try {
    await axios.post('/cells', { cells });
  } catch (err) {
    dispatch({ type: ActionType.SAVE_CELLS_ERROR, payload: err.message });
  }
};
