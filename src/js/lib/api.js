import Raven from 'raven-js'

//GENERAL FUNCTION FOR API CALLS
export function fetchEndpoint(_url, _config, _on_start, _on_success, _error_500, _error_400, _additional_function){
    _on_start()

    return fetch(_url, _config)
    .then(response => {
        return response.json().then(json => {
          if (!response.ok) {
                _error_400(json)
            } else {
                if(_additional_function){
                    _additional_function(json)
                }
                _on_success(json)
                return json
            }
        })
    })
    .catch((err) => {
        _error_500()
        Raven.captureException(err)
    })
}