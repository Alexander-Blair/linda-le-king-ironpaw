import {
  BEAR_ATTACK_LUMBERJACK,
  MOVE_LUMBERJACK,
  SPAWN_LUMBERJACK,
  UPDATE_LUMBERJACK_STATUS,
} from '../actions';

export default function lumberjack(state = {}, action) {
  switch (action.type) {
    case BEAR_ATTACK_LUMBERJACK:
      return {
        ...state,
        numberOfLives: action.numberOfLives,
      };
    case MOVE_LUMBERJACK:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        direction: action.direction,
        index: action.index,
      };
    case SPAWN_LUMBERJACK:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        numberOfLives: action.numberOfLives,
        status: action.status,
        index: action.index,
        maxPinecones: action.maxPinecones,
      };
    case UPDATE_LUMBERJACK_STATUS:
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
