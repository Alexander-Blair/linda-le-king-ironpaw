import {
  PICK_UP_AVAILABLE_PINECONE,
  SPAWN_AVAILABLE_PINECONE,
} from '../actions';

export default function availablePinecone(state = {}, action) {
  switch (action.type) {
    case SPAWN_AVAILABLE_PINECONE:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        index: action.index,
      };
    case PICK_UP_AVAILABLE_PINECONE:
      return {
        ...state,
        xCoordinate: undefined,
        yCoordinate: undefined,
        index: undefined,
      };
    default:
      return state;
  }
}
