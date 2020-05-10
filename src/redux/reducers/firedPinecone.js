import {
  THROW_PINECONE,
  MOVE_FIRED_PINECONE,
  REMOVE_FIRED_PINECONE,
} from '../actions';

export default function firedPinecone(state = {}, action) {
  switch (action.type) {
    case THROW_PINECONE:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        direction: action.direction,
        index: action.index,
      };
    case MOVE_FIRED_PINECONE:
      return {
        ...state,
        xCoordinate: action.xCoordinate,
        yCoordinate: action.yCoordinate,
        index: action.index,
      };
    case REMOVE_FIRED_PINECONE:
      return {
        ...state,
        xCoordinate: undefined,
        yCoordinate: undefined,
        direction: undefined,
        index: undefined,
      };
    default:
      return state;
  }
}
