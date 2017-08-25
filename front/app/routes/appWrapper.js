import React from 'react'
import { connect } from 'react-redux'
import sse from '../actions/sse'

class AppWrapper extends React.Component {

  componentWillMount() {
    this.props.sseAll()
    this.props.sseStats()
  }

  render() {
    const { children } = this.props

    return (
      <div>
        {children}
      </div>
    )
  }
}

const mapStateToProps = state => ({ online: state.online })

const mapDispatchToProps = (dispatch) => {
  return {
    sseAll: () => sse(dispatch, '/sse/accounts/customerid1/userid1'),
    sseStats: () => sse(dispatch, '/sse/stats'),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)
