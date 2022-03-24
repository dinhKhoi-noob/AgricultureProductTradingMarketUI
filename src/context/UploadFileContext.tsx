import axios, { AxiosResponse } from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { LayoutContext } from "./LayoutContext";

interface UploadFileContextProps {
    children: ReactNode;
}

interface UploadFileContextDefault {
    fileName: File | undefined;
    fileNames: FileList | undefined;
    currentFilePath: string;
    currentFilePaths: string[];
    changeFileName: (name: File | undefined) => void;
    changeFilesArray: (files: FileList | undefined) => void;
    uploadSingleFile: (data: FormData) => Promise<AxiosResponse | null>;
    uploadMultipleFiles: (data: FormData) => Promise<string[] | null>;
    changeCurrentFilePath: (fileName: string) => void;
    changeCurrentFilePaths: (fileNames: string[]) => void;
}

export const UploadFileContext = createContext<UploadFileContextDefault>({
    fileName: undefined,
    fileNames: undefined,
    currentFilePath: "",
    currentFilePaths: [],
    changeFileName: () => null,
    changeFilesArray: () => null,
    uploadSingleFile: async () => null,
    uploadMultipleFiles: async () => null,
    changeCurrentFilePath: () => null,
    changeCurrentFilePaths: () => null,
});

const UploadFileContextProvider = ({ children }: UploadFileContextProps) => {
    const [fileName, setFileName] = useState<File>();
    const [fileNames, setFileNames] = useState<FileList>();
    const [currentFilePath, setCurrentFilePath] = useState("");
    const [currentFilePaths, setCurrentFilePaths] = useState<string[]>([]);

    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const host = "http://localhost:4000";

    const changeCurrentFilePaths = (fileNames: string[]) => {
        console.log(fileNames);
        setCurrentFilePaths(fileNames);
    };

    const changeCurrentFilePath = (fileName: string) => {
        setCurrentFilePath(fileName);
    };

    const changeFileName = (name: File | undefined) => {
        setFileName(name);
    };

    const changeFilesArray = (files: FileList | undefined) => {
        setFileNames(files);
    };

    const uploadSingleFile = async (data: FormData): Promise<AxiosResponse | null> => {
        try {
            const response = await axios.post(`${host}/api/upload/single`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response;
        } catch (error) {
            changeLoadingStatus(false);
            if (axios.isAxiosError(error)) {
                changeSnackbarValues({
                    content: "Tải ảnh lên không thành công",
                    type: "error",
                    isToggle: true,
                });
            }
            return null;
        }
    };

    const uploadMultipleFiles = async (data: FormData) => {
        try {
            const response = await axios.post(`${host}/api/upload/multi`, data);
            setFileNames(undefined);
            console.log(response.data.files);
            const fileList: string[] = response.data.files.map((file: any) => {
                return file.location;
            });
            return fileList;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                changeSnackbarValues({
                    content: "Tải ảnh lên không thành công",
                    type: "error",
                    isToggle: true,
                });
            }
            return null;
        }
    };

    const uploadFileContextData = {
        fileName,
        fileNames,
        currentFilePath,
        currentFilePaths,
        changeFileName,
        changeFilesArray,
        uploadSingleFile,
        uploadMultipleFiles,
        changeCurrentFilePath,
        changeCurrentFilePaths,
    };
    return <UploadFileContext.Provider value={uploadFileContextData}>{children}</UploadFileContext.Provider>;
};

export default UploadFileContextProvider;
