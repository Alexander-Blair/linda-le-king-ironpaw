import { combineReducers } from 'redux';
import bear from './reducers/bear';
import lumberjack from './reducers/lumberjack';
import pinecone from './reducers/pinecone';

export default combineReducers({
  lumberjack,
  bear,
  pinecone,
});
