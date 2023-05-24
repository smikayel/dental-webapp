import { WINGS } from '../../3dComponents/cosntants'
import { Icon } from '../Icon'
import style from './style.module.css'


export const ImplantsSection = () => {

    return (
        <div className={style.ImplantSection}>
            {WINGS.map(wing => {
                return (
                    <div className={style.btn}>
                        <Icon src={wing.icon} height='50px'/>
                        <p>{wing.name}</p>
                    </div>
                )
            })}
        </div>
    )
}
