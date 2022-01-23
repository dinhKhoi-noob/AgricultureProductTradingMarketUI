import React, { createContext, ReactNode, useState } from "react";

interface TestContextProps {
    children: ReactNode;
}

interface TestContextDefault {
    color: string;
    changeColor: (color: string) => void;
}

export const TestContext = createContext<TestContextDefault>({
    color: "blue",
    changeColor: () => null,
});

const TestContextProvider = ({ children }: TestContextProps) => {
    const [color, setColor] = useState("Blue");
    const changeColor = (color: string) => {
        setColor(color);
    };
    const testContextValue = {
        color,
        changeColor,
    };
    return <TestContext.Provider value={testContextValue}>{children}</TestContext.Provider>;
};

export default TestContextProvider;
