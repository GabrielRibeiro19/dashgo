import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContex';
import { GetServerSidePropsContext } from 'next';
import { AuthTokenError } from '../errors/AuthTokenError';

interface AxiosErrorResponse {
  message?: string;
}

type Context = undefined | GetServerSidePropsContext;

type FailedRequestQueue = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedRequestsQueue = Array<FailedRequestQueue>();

export function setupAPIClient(ctx: Context = undefined) {

  let cookies = parseCookies(ctx);
  // const cookies = parseCookies(ctx);

  //console.log(cookies)

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  });

  api.interceptors.response.use(response => {
    return response
  }, (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response?.status === 401) {
      //console.log(error.response.data?.message)
      if (error.response.data?.message === 'Invalid Token!') {

        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config

        // renovar token
        cookies = parseCookies(ctx);

        if (!isRefreshing) {
          isRefreshing = true

          api.post('/refresh-token', {
            token: refreshToken,
          }).then(response => {
            const { token, refresh_token } = response.data

            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 dias
              path: '/'
            })
            setCookie(ctx, 'nextauth.refreshToken', refresh_token, {
              maxAge: 60 * 60 * 24 * 30, // 30 dias
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestsQueue?.forEach(request => request.onSuccess(token));
            failedRequestsQueue = [];

          }).catch(err => {
            failedRequestsQueue.forEach(request => request.onFailure(err));
            failedRequestsQueue = [];

            if (process.browser) {
              signOut()
            }

          }).finally(() => {
            isRefreshing = false
          })
        }
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {

              if (!originalConfig?.headers) {
                return //Eu coloquei um return mas pode colocar algum erro ou um reject
              }

              originalConfig.headers['Authorization'] = `Bearer ${token}`
              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            },
          })
        })
      } else {
        // deslogar o usuário
        if (process.browser) {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error);
  })

  return api
}
