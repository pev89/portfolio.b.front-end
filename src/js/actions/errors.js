export const ERROR = 'ERROR'
export const CLEAN_ERROR = 'CLEAN_ERROR'

export function raiseError(error) {
  return {
    type: ERROR,
    error: error
  }
}

export function cleanError() {
  return {
    type: CLEAN_ERROR
  }
}