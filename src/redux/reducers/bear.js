import {
  MOVE_BEAR,
  SPAWN_BEAR,
  UPDATE_BEAR_STATUS,
} from '../actions';

export default function bear(state = {}, action) {
  switch (action.type) {
    case MOVE_BEAR:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        index: action.index,
      };
    case SPAWN_BEAR:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        status: action.status,
        index: action.index,
      };
    case UPDATE_BEAR_STATUS:
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
