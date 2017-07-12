import React from "react";
import {render} from "react-dom";
import {Link} from 'react-router'
class SalonButton extends React.Component {
  render() {
    const {salon, onClickLink} = this.props
    return <Link to={`/salon/${salon.id}`} className="salon-button" onClick={onClickLink}>{salon.name}</Link>
  }
}
export default SalonButton
