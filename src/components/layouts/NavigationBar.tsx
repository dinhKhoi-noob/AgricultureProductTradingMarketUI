import NavigationSubItemContainer from './navigation_bar/NavigationSubItemContainer';
import NavigationItem from './navigation_bar/NavigationItem';
import { LayoutContext } from '../../context/LayoutContext';
import { AiOutlineHome,AiOutlineLineChart } from "react-icons/ai";
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { FiPieChart } from 'react-icons/fi';
import { CgUserList } from 'react-icons/cg';
import { ImUserTie } from 'react-icons/im';
import { SiCodechef } from 'react-icons/si';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi';
import { RiShieldUserLine } from 'react-icons/ri';
import { FaFileInvoiceDollar, FaOpencart, FaRegUserCircle } from 'react-icons/fa';
import { GiEntryDoor } from 'react-icons/gi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { useContext } from 'react';

const NavigationBar:React.FC = () => 
    {
        const {changeToggleOnNavbarStatus} = useContext(LayoutContext);
        return (
            <>
                <div className="navbar-close-btn" onClick={
                    ()=>{
                        changeToggleOnNavbarStatus();
                    }
                }>
                    <BsArrowLeftCircleFill/>
                </div>
                <NavigationItem icon={AiOutlineHome} title="Trang chủ" url="" isSubItem={false}/>
                <div className="navbar-subcontainer">
                    <div className="navbar-subtitle">
                        Management
                    </div>
                    <NavigationSubItemContainer
                        parentIcon={FiPieChart}
                        parentTitle='Yêu cầu'
                        subItems={[{icon:IoFastFoodOutline,title:'Yêu cầu mua',url:"buying"},{icon:HiOutlineUserGroup,title:'Yêu cầu bán',url:"selling"}]}
                        url="request"
                    />
                    <NavigationSubItemContainer
                        parentIcon={CgUserList}
                        parentTitle='Tài khoản'
                        subItems={[{icon:ImUserTie,title:'Người quản lý',url:"manager"},{icon:SiCodechef,title:'Nhà tiêu thụ',url:"consumer"},{icon:SiCodechef,title:'Nông dân',url:"farmer"},{icon:SiCodechef,title:'Nhân viên thu mua',url:"packing_employee"}]}
                        url="employees"
                    />
                    <NavigationItem icon={HiUserGroup} title="Loại nông sản" url="product_type" isSubItem={false}/>
                    <NavigationItem icon={IoFastFoodOutline} title="Nông sản" url="product" isSubItem={false}/>
                    <NavigationItem icon={FaFileInvoiceDollar} title="Đơn đặt hàng" url="order" isSubItem={false}/>
                    <NavigationItem icon={FaOpencart} title="Báo cáo" url="login" isSubItem={false}/>
                </div>
                <div className="navbar-subcontainer">
                    <div className="navbar-subtitle">
                        Others
                    </div>
                    <NavigationSubItemContainer
                        parentIcon={RiShieldUserLine}
                        parentTitle='Người dùng'
                        subItems={[{icon:FaRegUserCircle,title:'Hồ sơ',url:"profile"},{icon:GiEntryDoor,title:'Logout',url:""}]}
                        url="authentication"
                    />
                    <div className="navbar-item m-tb-1rem">
                        <div>
                            <AiOutlineLineChart className="navbar-item-icon"></AiOutlineLineChart>
                            <div className="navbar-item-title">
                                Charts
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
export default NavigationBar;