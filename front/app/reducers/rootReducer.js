function reducer(state = { stats: [] }, { type, payload }) {
  switch (type) {
    case 'sse/event/user_connection':
      return {
        ...state,
        stats: payload
      }

    default:
      return state
  }
}


export default reducer
