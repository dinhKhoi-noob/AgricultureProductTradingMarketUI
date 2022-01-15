import React,{createContext, ReactNode, useReducer, useState} from 'react'

interface testContextProps{
    children: ReactNode
}

interface testReducerProps{
    username: string;
    password: string;
}

type testReducerActionType =
	| {
			type: String
			payload: Number
	  }
	| { type: String; payload: String }

const testReducer = (state:testReducerProps, action: testReducerActionType) => {
    switch(action.type){
        case 'test':
            return {...state,username:"Dinh Khoi",password:"123456"};
        default:
            return state;
    }
}
const TestContext = createContext({username:"",password:""})
const TestContextProvider = ({children}:testContextProps) => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [user,dispatch] = useReducer(testReducer,{username:"",password:""})
    const TestContextData = {
        username,
        password
    }
    return (
        <TestContext.Provider value={TestContextData}>
            {children}
        </TestContext.Provider>
    )
}
export default TestContextProvider