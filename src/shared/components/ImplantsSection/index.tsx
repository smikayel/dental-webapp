import { useContext } from 'react';
import { WINGS } from '../../3dComponents/cosntants'
import { WingContext } from '../../Contexts/ChoosedWingsContext/provider';
import { Icon } from '../Icon'
import style from './style.module.css'


export const ImplantsSection = () => {
    const { choosedWingType, updateWingType } = useContext(WingContext);

    const handleSelectWing = (wingType:string) => {
        updateWingType(wingType)
    }
    
    return (
        <div className={style.ImplantSection}>
            {WINGS.map(wing => {
                return (
                    <div 
                        className={`${style.btn} ${choosedWingType !== wing.name ? '' : style.btnActive}`}
                        onClick={() => handleSelectWing(wing.name)}
                        key={wing.name}
                    >
                        <Icon src={wing.icon} height='50px'/>
                        <p>{wing.name}</p>
                    </div>
                )
            })}
        </div>
    )
}
