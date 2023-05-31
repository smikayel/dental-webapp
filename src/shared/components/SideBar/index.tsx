import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Icon } from '../../components/Icon';
import styles from './style.module.css'
import { ImplantsSection } from '../ImplantsSection';
import { ModalContext } from '../../Contexts/ModalContext/modalContext';

export const SideBar = () => {
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const { state, updateState } = useContext(ModalContext);


    const openInfoBar = () => {
        updateState(true)
    }

    return (
        <>
            <Sidebar 
                collapsed={collapsed}
                className={styles.ToolBar}
            >
                <Menu>
                <div className={styles.ProductHeader}>
                    <Icon src='assets/images/Product/logo.png' height='80px'/>
                    {!collapsed && <h3>Power Dental</h3>}
                </div>
                    <MenuItem
                    icon={<Icon src='assets/images/Toolbar/menu.png'/>}
                    onClick={() => setCollapsed(!collapsed)}
                    >
                        Hide Menu
                    </MenuItem>
                    <SubMenu 
                        label="Implants/Wings"
                        icon={<Icon src='assets/images/Toolbar/implant.png'/>}
                    >
                        <MenuItem style={{height: 'auto', padding: '5px'}}>
                            <ImplantsSection />
                        </MenuItem>
                    </SubMenu>
                    <MenuItem
                        icon={<Icon src='assets/images/Toolbar/report-generator.png' height='40px'/>}
                    > 
                        Generate Report 
                    </MenuItem>
                    <MenuItem
                        icon={<Icon src='assets/images/Toolbar/info-icon.png' height='40px'/>}
                        onClick={openInfoBar}
                    > 
                        how to use ?
                    </MenuItem>
                </Menu>
            </Sidebar>
        </>
    )
}