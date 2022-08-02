import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FAILED, SUCCESSFULL } from 'Constant';

const api = axios.create({
  baseURL: 'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4',
});

export const usePrevious = (val) => {
  const r = useRef();
  useEffect(() => {
    r.current = val;
  });
  return r.current;
};


export const useAxios = (url, method = 'get', timeout = 1000) => {
  const [states, setStates] = useState({
    loading: false,
    response: {},
    data: [],
    error: null,
    status: 1,
  });

  function withFormData(_headers, data, method = 'post') {
    const formHeader = {
      ..._headers,
      'Content-type': 'multipart/form-data',
    };
    const formData = new FormData();
    for (let key in data) {
      const d = data[key];
      formData.append(key, d);
    }

    let sent = api[method];
    if (sent) {
      return sent(url, formData, {
        headers: formHeader,
      });
    }
    return null;
  }

  function callApi(data = {}, headers = null, urlParam = null) {
    let a = null;
    const defaultHeader = {};
    const _headers = headers
      ? {
          ...defaultHeader,
          ...headers,
        }
      : defaultHeader;
    const _url = urlParam || url;
    switch (method) {
      case 'get':
        a = api.get(_url, {
          params: data,
          headers: _headers,
        });
        break;
      case 'post':
        a = api.post(_url, data, {
          headers: _headers,
        });
        break;
      case 'postformdata':
        a = withFormData(_headers, data, 'post', _url);
        break;
      default:
      case 'put':
        a = api.put(_url, data, {
          headers: _headers,
        });
        break;
      case 'putformdata':
        a = withFormData(_headers, data, 'put', _url);
        break;
    }
    setStates({
      ...setStates,
      loading: true,
      status: -1,
    });
    return new Promise((resolve, reject) => {
      a.then((r) => {
        setTimeout(() => {
          setStates({
            ...states,
            loading: false,
            data: r.data,
            response: r,
            status: SUCCESSFULL,
          });
          resolve(r.data);
        }, timeout);
      }).catch((err) => {
        setTimeout(() => {
          setStates({
            ...states,
            loading: false,
            data: err?.response?.data,
            err: err,
            status: FAILED,
          });
          reject(err);
        }, timeout);
      });
    });
  }

  return {
    send: callApi,
    loading: states.loading,
    status: states.status,
    response: states.response,
    error: states.error,
    data: states.data,
  }
};