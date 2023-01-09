import { AnimateKeyframes } from 'react-simple-animate'
import './NPC.css'

export default function NPC ({ width, height, walkingKeyframes, duration }) {

    return (
        <div
            style={{
                width: width,
                height: height
            }}
            className="npc"
        >
            <AnimateKeyframes
                play
                duration={duration}
                direction="normal"
                easeType="step-end"
                keyframes={walkingKeyframes}
            />
        </div>
    )
}