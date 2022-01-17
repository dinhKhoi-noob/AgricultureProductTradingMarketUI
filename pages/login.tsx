import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import {LayoutContext} from '../src/context/LayoutContext';
import loginImage from '../public/assets/login-image.svg';
import Image from 'next/image';

const Login = () => {
    const {changeOnLoginPageStatus} = useContext(LayoutContext);
    useEffect(()=>{
        changeOnLoginPageStatus(true);
        return ()=>{changeOnLoginPageStatus(false)};
    },[])
    return (
        <div>
            <div className="login-page__container">
                <Image src={loginImage} className="login-page_thumbnail"/>
                <div className="login-page__content">
                    <h1 className="login-page__title">
                        Sign In
                    </h1>
                    <form>
                        <div className="login-page__form__group">
                            <label htmlFor="login_username">Username</label>
                            <br/>
                            <input type="text" id="login_username" className="login-page__input"/>
                        </div>
                        <div className="login-page__form__group">
                            <label htmlFor="login_username">Password</label>
                            <br/>
                            <input type="text" id="login_username" className="login-page__input"/>
                        </div>
                    </form>
                </div>
            </div>
            <Link href="/">
                Hello
            </Link>
        </div>
    )
}

export default Login
