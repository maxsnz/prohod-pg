import axios from 'axios';
import { tryCatch } from 'utils';

export const axiosRequest = axios.create({
  baseURL: '/',
  headers: { Accept: 'application/json' },
  transformResponse: response => {
    // JSON.parse взят из axios defaults
    // https://github.com/axios/axios/blob/master/lib/defaults.js
    if (!(typeof response === 'string') || response.length === 0) return false;
    const [parseError, parseResult] = tryCatch(JSON.parse, response);
    if (parseError) {
      throw { errorMessage: 'Ошибка: неправильный формат ответа сервера', errorCode: 'parse_response_error' };
    } else if (parseResult && parseResult.errorMessage) {
      throw parseResult
    } else {
      return parseResult;
    }
  },
});

const adaptResponse = ({ data }) => data;

// isDataSend - post, patch или put запрос
const adaptError = error => {
  const { errorMessage, errorCode } = error;
  if (errorMessage) {
    throw errorMessage;
  } else {
    throw 'Нет соединения, попробуйте позже';
  }
}

export default {
  get: (...params) => 
    axiosRequest.get(...params)
      .then(adaptResponse)
      .catch(error => adaptError(error)),
  post: (...params) => 
    axiosRequest.post(...params)
      .then(adaptResponse)
      .catch(error => adaptError(error, true)),
  put: (...params) => 
    axiosRequest.put(...params)
      .then(adaptResponse)
      .catch(error => adaptError(error, true)),
  delete: (...params) => 
    axiosRequest.delete(...params)
      .then(adaptResponse)
      .catch(error => adaptError(error)),
  patch: (...params) => 
    axiosRequest.patch(...params)
      .then(adaptResponse)
      .catch(error => adaptError(error, true)),
};
