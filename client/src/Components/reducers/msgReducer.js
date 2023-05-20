export const initialMsg=null;

export const msgReducer = (state,action) => {
  if(action.type == "UPDATE"){
    return action.payload;
  }
  if(action.type == "CLEAR"){
    return null;
  }
  return state;
}
