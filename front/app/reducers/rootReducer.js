function reducer(state = { online: 0 }, { type, payload }) {
  switch (type) {
    case 'sse/event/user_connection':
      return {
        ...state,
        online: payload.total
      }

    default:
      return state
  }
}


export default reducer
