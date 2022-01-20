import React, { createContext, ReactNode, useState } from 'react';

interface BuyingRequestProps{
    children: ReactNode
}

interface SelledUserProps{
    username: string;
    avatar: string;
    quantity: number;
}

interface OwnerProps{
    username: string;
    avatar: string;
}

interface ModalProps{
    owner: OwnerProps;
    quantity: number;
    title: string;
    price: number;
    selledUser: SelledUserProps[];
}

interface BuyingRequestProviderProps{
    isOpenedModal: boolean;
    changeIsOpenModalStatus: (status:boolean) => void;
    modalInformation: ModalProps
}

const BuyingRequestContextDefault = {
    isOpenedModal: false,
    changeIsOpenModalStatus: () => null,
    modalInformation: {
        owner:{
            username: "",
            avatar: ""
        },
        quantity: 0,
        title: "",
        price: 0,
        selledUser: []
    }
}

export const BuyingRequestContext = createContext<BuyingRequestProviderProps>(BuyingRequestContextDefault);

const BuyingRequestContextProvider = ({children}:BuyingRequestProps) => {

    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [modalInformation,setModalInformation] = useState({
        owner:{
            username: "",
            avatar: ""
        },
        quantity: 0,
        title: "",
        price: 0,
        selledUser: []
    })
    const changeIsOpenModalStatus = (status: boolean) => {
        setIsOpenedModal(status);
    }

    const BuyingRequestContextData = {
        isOpenedModal,
        modalInformation,
        changeIsOpenModalStatus
    }

    return (
        <BuyingRequestContext.Provider value={BuyingRequestContextData}>
            {children}
        </BuyingRequestContext.Provider>
    );
};

export default BuyingRequestContextProvider;
