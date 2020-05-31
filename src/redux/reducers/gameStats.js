import {
  UPDATE_SCORE,
  UPDATE_ROUND_NUMBER,
  UPDATE_SECONDS_REMAINING,
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
    case UPDATE_SECONDS_REMAINING:
      return {
        ...state,
        secondsRemaining: action.secondsRemaining,
      };
    default:
      return state;
  }
}
