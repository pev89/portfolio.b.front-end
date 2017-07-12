import { connect } from 'react-redux'
import React from "react";
import { Link, hashHistory } from 'react-router';

import { recoveryUser } from '../../actions/authentication'
import { cleanError } from '../../actions/errors'

class Recovery extends React.Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        const { dispatch } = this.props
        dispatch(cleanError())
        dispatch(recoveryUser({
            phone: this.refs.phone.value.trim(),
        }, 'GET')).then(() => {
            hashHistory.push(`/login/changepassword/` + this.refs.phone.value.trim());
        })
    }
    render(){
        return <div className='login-wrapper'>
                    <div className='login-container'>
                        <div className='login'>
                            <div className='logo'></div>
                            <p>Insert the phone number that you use to registered bellow. If it matches our records we will send you a recovery code via SMS.</p>
                            <div className="form-group">
                                <label htmlFor="InputPhone1">Phone number</label>
                                <input ref='phone' placeholder="Phone" className="form-control input-lg" id="InputPhone1"/>
                            </div>
                            <button onClick={this.handleClick} className="btn btn-primary btn-shadow">
                                Send me the code
                            </button>
                        </div>
                    </div>
                </div>
    }
}

function mapStateToProps(state) {

    return {}
}

export default connect(mapStateToProps)(Recovery);
