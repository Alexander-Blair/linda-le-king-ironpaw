import {
  PICK_UP_PINECONE,
  SPAWN_PINECONE,
} from '../actions';

export default function pinecone(state = {}, action) {
  switch (action.type) {
    case SPAWN_PINECONE:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        index: action.index,
      };
    case PICK_UP_PINECONE:
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
