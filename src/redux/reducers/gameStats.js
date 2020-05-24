import {
  UPDATE_SCORE,
  UPDATE_ROUND_NUMBER,
} from '../actions';

const initialState = {
  score: 0,
  roundNumber: 1,
};

export default function gameStats(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SCORE:
      return {
        ...state,
        score: action.score,
      };
    case UPDATE_ROUND_NUMBER:
      return {
        ...state,
        roundNumber: action.roundNumber,
      };
    default:
      return state;
  }
}
