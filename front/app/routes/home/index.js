import React from 'react'
import { connect } from 'react-redux'

class Home extends React.Component {
  render() {
    const { stats } = this.props
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>customer</th>
              <th>users</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((customer, idx1) =>
              <tr key={`customer-${customer.customerId}-${idx1}`}>
                <td>
                  {customer.customerId}
                </td>
                <td>
                  <div>
                    {customer.users.map((user, idx2) =>
                      <span key={`user-${user.userId}-${idx2}`}>
                        <b>userId:</b> {user.userId} <br/>
                        {user.fingerprints.map((finger, idx2) =>
                          <p key={`finger-${finger.fingerprintId}-${idx2}`}>
                            <b>fingerprintId:</b> {finger.fingerprintId} <br/>

                            <b>abas:</b> {finger.clients.length}
                          </p>
                        )}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stats: state.stats,
});

export default connect(mapStateToProps)(Home)
