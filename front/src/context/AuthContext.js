import { createContext } from 'react'

function mockedFunc() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: mockedFunc,
    logout: mockedFunc,
    isAuthenticated: false
})