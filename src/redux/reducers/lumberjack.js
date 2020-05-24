import {
  BEAR_ATTACK_LUMBERJACK,
  MOVE_LUMBERJACK,
  PICK_UP_AVAILABLE_PINECONE,
  SPAWN_LUMBERJACK,
  THROW_PINECONE,
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
    case PICK_UP_AVAILABLE_PINECONE:
      return {
        ...state,
        numberOfPinecones: action.lumberjackNumberOfPinecones,
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
    case THROW_PINECONE:
      return {
        ...state,
        numberOfPinecones: action.lumberjackNumberOfPinecones,
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
