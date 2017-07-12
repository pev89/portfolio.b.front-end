import React from "react";
import onClickOutside from 'react-onclickoutside'
import DatePicker from "react-datepicker"
class CODatePicker extends DatePicker {
  handleClickOutside = evt => {
    // ..handling code goes here...
    const { isShowing, onOutsideClick } = this.props
    if ( isShowing )
      onOutsideClick( )
  }
}
export default onClickOutside( CODatePicker )
