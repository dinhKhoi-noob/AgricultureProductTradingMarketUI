import { useRouter } from "next/router";
import React from "react";
import Cookie from "universal-cookie";
import axios from "axios";

const Authorization = () => {
    const host = `http://localhost:4000`;
    const setCookie = async () => {
        const router = useRouter();
        const token = router.query["token"];
        if (token) {
            const response = await axios.post(`${host}/api/user/verify`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response) {
                console.log(response);
                const cookie = new Cookie();
                cookie.set("uid", response?.data?.id, {
                    path: "/",
                    expires: new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
                });
                router.push("/");
            }
        }
    };
    setCookie();
    return <div>authorization</div>;
};

export default Authorization;
