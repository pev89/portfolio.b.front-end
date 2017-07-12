import React from "react";
import { render } from "react-dom"
import { Link } from 'react-router'

class Footer extends React.Component {
  render() {
    const { left, right, left_name, right_name, id } = this.props
    return <div className="sidebar-footer">
        {(left_name && left) &&
            <div onClick={() => left()} className="btn btn-neutral">{left_name}</div>
        }
        {(right_name && right) &&
            <div onClick={() => right()} className="btn btn-shadow float-right">{right_name}</div>
        }
    </div>;
  }
}

export default Footer