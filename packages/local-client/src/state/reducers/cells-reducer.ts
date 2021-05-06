import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL: {
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    }
    case ActionType.DELETE_CELL: {
      const id = action.payload;
      delete state.data[id];
      state.order = state.order.filter((cellId) => cellId !== id);
      return state;
    }
    case ActionType.MOVE_CELL: {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((cellId) => cellId === id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.order.length) {
        return state;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
      return state;
    }
    case ActionType.INSERT_CELL_AFTER: {
      const { id, type } = action.payload;
      const cell: Cell = {
        id: randomId(),
        type,
        content: '',
      };
      state.data[cell.id] = cell;
      const index = state.order.findIndex((cellId) => cellId === id);
      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }
      return state;
    }
    case ActionType.FETCH_CELLS: {
      state.loading = true;
      state.error = null;
      return state;
    }
    case ActionType.FETCH_CELLS_COMPLETE: {
      state.order = action.payload.map(({ id }) => id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
      return state;
    }
    case ActionType.FETCH_CELLS_ERROR: {
      state.loading = false;
      state.error = action.payload;
      return state;
    }
    case ActionType.SAVE_CELLS_ERROR: {
      state.error = action.payload;
      return state;
    }
    default:
      return state;
  }
});

const randomId = () => Math.random().toString(36).substr(2, 5);

export default reducer;
