function enableSse(dispatch, url = '/sse/all') {
  const source = new EventSource('/sse/all')

  source.onmessage = function(e) {
    const { type, payload } = JSON.parse(e.data)
    dispatch({ type: `sse/event/${type}`, payload })
  }

  dispatch({ type: 'sse/enabled', payload: url })

  return () => {
    dispatch({ type: 'sse/disabled', payload: url })
    source.close()
  }
}

export default enableSse
