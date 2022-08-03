import { createStore, compose } from 'redux';

const initialStates = {
  searchList: {},
  defaultList: {},
  type: ''
};

function reducer(states = initialStates, action){
  const { payload, type } = action;

  switch(type){
    case 'ADD_DEFAULT':
      return {
        ...states,
        defaultList: payload,
        type
      }
    case 'ADD_SEARCH':
      return {
        ...states,
        searchList: {
          ...states.searchList,
          [payload.search]: payload.data
        }
      }
    default:
  }

  return states;
}

const composeEnhancer =
  // eslint-disable-next-line no-undef
  (process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) ||
  compose;


const store = createStore(reducer, composeEnhancer());

export default store;
