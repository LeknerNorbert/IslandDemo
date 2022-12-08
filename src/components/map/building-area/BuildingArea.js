import './BuildingArea.css'
import classNames from "classnames";

export default function BuildingArea(props) {
    return (
        <div 
            style={{ width: '100%', height: '100%' }} 
            className={classNames({
                'bg-light': props.active 
            })}
            onClick={() => props.buildBuilding(props.coordX, props.coordY)}
        ></div>
    )
}