import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { IconType } from "react-icons";
import { LayoutContext } from "../../../context/LayoutContext";

interface NavigationItemInterface {
    icon: IconType;
    title: string;
    url: string;
    isSubItem: boolean;
}

const NavigationItem = (props: NavigationItemInterface) => {
    const { icon, title, url, isSubItem } = props;
    const router = useRouter();
    const DisplayIcon = icon;
    const { changeOnSellingPageStatus } = useContext(LayoutContext);
    return url === "request/buying" || url === "request/selling" ? (
        url === "request/buying" ? (
            <div
                className={isSubItem ? "navbar-subitem-item" : "navbar-item m-tb-1rem"}
                onClick={() => {
                    changeOnSellingPageStatus(false);
                    router.push(`/${url}`);
                }}
            >
                <DisplayIcon className="navbar-item-icon"></DisplayIcon>
                <div className={isSubItem ? "navbar-subitem-title" : "navbar-item-title"}>{title}</div>
            </div>
        ) : (
            <div
                className={isSubItem ? "navbar-subitem-item" : "navbar-item m-tb-1rem"}
                onClick={() => {
                    changeOnSellingPageStatus(true);
                    router.push(`/${url}`);
                }}
            >
                <DisplayIcon className="navbar-item-icon"></DisplayIcon>
                <div className={isSubItem ? "navbar-subitem-title" : "navbar-item-title"}>{title}</div>
            </div>
        )
    ) : (
        <Link href={"/" + url}>
            <div className={isSubItem ? "navbar-subitem-item" : "navbar-item m-tb-1rem"}>
                <DisplayIcon className="navbar-item-icon"></DisplayIcon>
                <div className={isSubItem ? "navbar-subitem-title" : "navbar-item-title"}>{title}</div>
            </div>
        </Link>
    );
};

export default NavigationItem;
