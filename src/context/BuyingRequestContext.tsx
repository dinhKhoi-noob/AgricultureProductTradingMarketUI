import React, { createContext, ReactNode, useState } from 'react';

interface BuyingRequestProps{
    children: ReactNode
}

export interface SelledUserProps{
    id: string;
    username: string;
    avatar: string;
    quantity: number;
}

export interface OwnerProps{
    id: string;
    username: string;
    avatar: string;
}

interface ModalProps{
    owner: OwnerProps;
    quantity: number;
    process: number;
    title: string;
    price: number;
    selledUser: SelledUserProps[];
}

interface BuyingRequestProviderProps{
    isOpenedModal: boolean;
    modalInformation: ModalProps;
    changeIsOpenModalStatus: (status:boolean) => void;
    changeModalInformation: (information:ModalProps) => void;
}

const BuyingRequestContextDefault = {
    isOpenedModal: false,
    modalInformation: {
        owner:{
            username: "",
            avatar: "",
            id:""
        },
        quantity: 0,
        process: 0,
        title: "",
        price: 0,
        selledUser: []
    },
    changeIsOpenModalStatus: () => null,
    changeModalInformation: ()=> null
}

export const BuyingRequestContext = createContext<BuyingRequestProviderProps>(BuyingRequestContextDefault);

const BuyingRequestContextProvider = ({children}:BuyingRequestProps) => {

    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [modalInformation,setModalInformation] = useState<ModalProps>({
        owner:{
            id:"",
            username: "",
            avatar: ""
        },
        quantity: 0,
        process:0,
        title: "",
        price: 0,
        selledUser: []
    })
    const changeModalInformation = (information: ModalProps) => {
        setModalInformation({
            owner: information.owner,
            quantity: information.quantity,
            title: information.title,
            price: information.price,
            process: information.process,
            selledUser: information.selledUser
        });
    }
    const changeIsOpenModalStatus = (status: boolean) => {
        setIsOpenedModal(status);
    }

    const BuyingRequestContextData = {
        isOpenedModal,
        modalInformation,
        changeIsOpenModalStatus,
        changeModalInformation
    }

    return (
        <BuyingRequestContext.Provider value={BuyingRequestContextData}>
            {children}
        </BuyingRequestContext.Provider>
    );
};

export default BuyingRequestContextProvider;