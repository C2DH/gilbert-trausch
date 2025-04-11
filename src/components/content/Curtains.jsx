import { motion } from 'motion/react';
import bg from '../../assets/images/backgrounds/bg-transition.webp';

export default function Curtains() {

    return (
        <motion.div className='fixed inset-0 pointer-events-none z-[1000] flex justify-center items-center px-[30px] h-screen'
            style={{ background: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%'}}
            transition={{ ease: 'easeInOut', duration: 0.8 }}
        >
        </motion.div>
    )
}