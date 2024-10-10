import { createContext } from 'react'
const user = {
    id: 1,
    fullName: 'John Wick',
    role: 'Manager',
    email: 'iluvmydog@gmail.com',
    phone: '0911122233',
    userName: 'Babayaga',
    pass: 'ineedagun' 
}
const UserContext = createContext(user)
const UserProvider = ({children}) => {
  return(
    <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
  )
}

export {UserProvider, UserContext}