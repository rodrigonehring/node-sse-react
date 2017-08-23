import React from 'react'
import { connect } from 'react-redux'

class Home extends React.Component {
  render() {
    const { online } = this.props
    return (
      <div>
        home - { online }
      </div>
    )
  }
}

const mapStateToProps = state => ({ online: state.online })

export default connect(mapStateToProps)(Home)
