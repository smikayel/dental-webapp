import { Modal } from '../Modal/modal'
import style from './style.module.css'


const infoContent = [
    {
        icon: 'assets/images/keybord/keyboard-r.png',
        title: 'The R button',
        description: 'this button is changing the mode in the editor'
    },
    {
        icon: 'assets/images/keybord/keyboard-d.png',
        title: 'The D button',
        description: 'will delete the screw or the wing from screw'
    }
]

export const InfoModal = () => {
    console.log('asd')
    return (
        <div className={style.InfoModal}>
            <Modal width='70%' height='80%' content={infoContent}/>
        </div>
    )
}
