import { AxiosError, AxiosRequestConfig, AxiosResponseHeaders } from 'axios'

export interface AxiosErrorWithMessage extends AxiosError {
  response: {
    status: number
    statusText: string
    headers: AxiosResponseHeaders
    config: AxiosRequestConfig<any>
    data: {
      message: string
    }
  }
}
