import { combineReducers } from 'redux';
import bear from './reducers/bear';
import lumberjack from './reducers/lumberjack';
import availablePinecone from './reducers/availablePinecone';
import firedPinecone from './reducers/firedPinecone';

export default combineReducers({
  bear,
  availablePinecone,
  firedPinecone,
  lumberjack,
});
