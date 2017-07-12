import React from "react"
import {connect} from 'react-redux'
import {render} from "react-dom"
import DatePicker from "react-datepicker"
import moment from "moment"
import {hashHistory} from 'react-router'
import autoBind from 'react-autobind';
import {CURRENCY} from '../../config'
class EditPatchTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patch_test_notes: "",
      patch_test_date: null,
      patch_test_stylist_id: null,
      patch_test_stylist: null
    }
    autoBind(this)
  }
  componentDidMount() {
    const {client} = this.props
    if (client) {
      this.setClient(client)
    }
  }
  componentWillReceiveProps(nextProps) {
    const {client} = nextProps
    if (client) {
      this.setClient(client)
    }
  }
  setClient(client) {
    this.setState({
      patch_test_notes: client["patch_test_notes"]
        ? client["patch_test_notes"]
        : "",
      patch_test_date: client["patch_test_date"]
        ? moment(client["patch_test_date"])
        : null,
      patch_test_stylist_id: client["patch_test_stylist_id"],
      patch_test_stylist: client["patch_test_stylist"]
    })
  }
  handleChange(event) {
    let newstate = {}
    newstate[event.target.name] = event.target.value;
    this.setState(newstate);
  }
  render() {
    const {isError, errors, onClickStylist} = this.props
    return (
      <div className='profile'>
        <div className="patch">
          <p>Patch Test
            <span className="float-right">
              {this.state.patch_test_date
                ? this.state.patch_test_date.format('MMMM Do YYYY')
                : "Not taken"}
            </span>
          </p>
          <div className="list-select" onClick={onClickStylist}>
            <div className="item list-align-left">
              <i className="zmdi zmdi-account-o"></i>Test Stylist</div>
            <div className="item list-align-right">{this.state.patch_test_stylist
                ? this.state.patch_test_stylist.first_name + " " + this.state.patch_test_stylist.last_name
                : ""}
              <i className="zmdi zmdi-chevron-right"></i>
            </div>
          </div>
          <label className="list-select list-input" htmlFor="patch_notes_field">
            <div className="title">
              <i className="zmdi zmdi-comment-outline"></i>Notes</div>
            <textarea id="patch_notes_field" onChange={(event) => this.setState({patch_test_notes: event.target.value})} className='form-control' placeholder='' value={this.state.patch_test_notes}/>
          </label>
        </div>
      </div>
    )
  }
}
export default EditPatchTest
