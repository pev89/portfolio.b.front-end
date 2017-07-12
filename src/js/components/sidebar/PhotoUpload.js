import {render} from "react-dom";
import React from "react"
import Dropzone from 'react-dropzone'
import {hashHistory} from 'react-router'
import autoBind from 'react-autobind'
import {API_ROOT} from '../../config'
import {receiveStylist, fetchStylist} from '../../actions/salon'
class PhotoUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      model: 'stylist',
      id: undefined,
      total_progress: "0",
      progress_visible: false,
      progress: {},
      photo_url: ""
    }
    autoBind(this)
  }
  componentDidMount() {
    const {id, model, preview} = this.props
    this.setState({id: id, model: model, preview: preview})
  }
  componentWillReceiveProps(nextProps) {
    const {preview, model, id} = nextProps
    this.setState({photo_url: preview, model: model, id: id})
  }
  signedUpload(file, signedUrl, onProgress, onDone) {
    return new Promise((resolve, reject) => {
      const xhr = this.createCorsRequest('POST', signedUrl)
      const token = localStorage.getItem('token');
      const handleProgress = event => {
        const progress = event.lengthComputable && Math.round((event.loaded / event.total) * 100)
        return onProgress(progress, signedUrl)
      }
      xhr.upload.addEventListener('progress', handleProgress)
      xhr.addEventListener('progress', handleProgress)
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          onProgress(100, signedUrl)
          resolve()
        } else {
          reject(new Error(`Upload error: ${xhr.status}`))
        }
      })
      xhr.addEventListener('error', () => reject(new Error('Failed to upload to S3')))
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.onreadystatechange = function() { //Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          // Request finished. Do processing here.
          onDone(JSON.parse(xhr.response))
        }
      }
      let fileData = new FormData()
      fileData.append('file', file)
      xhr.send(fileData)
    })
  }
  createCorsRequest(method, url) {
    let xhr = new XMLHttpRequest()
    if (xhr.withCredentials !== null) {
      xhr.open(method, url, true)
    } else if (typeof XDomainRequest !== 'undefined') {
      xhr = new XDomainRequest()
      xhr.open(method, url)
    } else {
      throw new Error('CORS is not supported')
    }
    return xhr
  }
  fillProgress(_value, _file_id) {
    var current_p = this.state.progress
    var new_total = 0
    var file_number = 0
    current_p[_file_id] = _value
    this.setState({progress: current_p})
    for (let key in this.state.progress) {
      new_total = new_total + this.state.progress[key]
      file_number++
    }
    new_total = new_total / file_number
    this.setState({total_progress: new_total})
  }
  upload(_file) {
    const {on_complete} = this.props
    const token = localStorage.getItem('token');
    if (!token) {
      hashHistory.replace("/login")
    }
    this.setState({progress_visible: true})
    this.signedUpload(_file[0], API_ROOT + this.state.model + "/" + this.state.id + "/photo/", this.fillProgress, this.onDone)
  }
  onDone(response) {
    const {onComplete} = this.props
    this.setState({preview: response['image'], progress_visible: false})
  }
  render() {
    var style = {
      backgroundImage: "url(" + this.state.preview + ")"
    }
    return <div className="profile-photo">
      <Dropzone onDrop={this.upload} className="uploader">
        <div className="profile-image" style={style}></div>
      </Dropzone>
      <div className={`progress ${this.state.progress_visible
        ? "visible"
        : ""}`}>
        <div className="progress-container">
          <p>{this.state.total_progress}%</p>
          <progress value={this.state.total_progress} max="100"></progress>
        </div>
      </div>
    </div>
  }
}
export default PhotoUpload;
