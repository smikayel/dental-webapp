import { useContext } from 'react'
import style from './style.module.css'
import { ModalContext } from '../../Contexts/ModalContext/modalContext'
import { Icon } from '../Icon'

interface IContent {
    icon?: string
    title?: string
    description?: string
}

interface IModal {
    height: string | number,
    width: string | number,
    content: IContent[],
}

export const Modal = ({height, width, content}: IModal) => {
    const {state, updateState} = useContext(ModalContext)
    const closeModal = () => {
        updateState(!state)
    }
    return (
        <div className={style.ModalBox} style={{height: height, width: width}}>
            {content.map(el => {
                return (
                    <div className={style.contentContainer}>  
                        {el.icon && <Icon src={el.icon} height={60}/>}
                        <div className={style.InfoBar}>
                            {el.title && <h4 className={style.titleBlock}> {el.title} </h4>}
                            <div className={style.descriptionBlock}>
                                {el.description}
                            </div>
                        </div>
                    </div>
                )
            })}
            <button onClick={closeModal}>Close</button>
        </div>
    )
}