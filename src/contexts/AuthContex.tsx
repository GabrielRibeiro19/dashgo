import { ReactNode, createContext, useEffect, useState } from "react";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/apiClient";
import { toast } from 'react-toastify';

type User = {
  name: string;
  email: string;
  cellphone?: string;
  avatar?: string;
  cep?: string;
  road?: string;
  number?: string;
  roles?: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContexData = {
  signIn: (credentials: SignInCredentials) => Promise<boolean>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContexData)

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  authChannel.postMessage('signOut');

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          Router.push('/');
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      api.get('users/profile')
        .then(response => {
          const { name, email, avatar, cellphone, cep, number, road, roles } = response.data

          //console.log(response)

          setUser({ name, email, avatar, cellphone, cep, number, road, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        password,
        email
      })


      console.log(response)

      const { token, refresh_token, roles, user } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refresh_token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      })

      setUser({
        email,
        name: user.name,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;


      Router.push('/dashboard')
      return true
    }
    catch (err: any) {
      toast.error(`${err.response.data.message}`);
      return false
      //console.log(err)
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
