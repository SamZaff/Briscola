const DEFAULT_STATE = {
  notes: ['test'],
};

const notesReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_NOTES':
      return {
        ...state,
        notes: action.notes,
      }
    default:
      return state;
  }
};

export default notesReducer;
