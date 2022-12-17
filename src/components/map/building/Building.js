import './Building.css'

import MovablePopover from '../movable-popover/MovablePopover'
import React, { Component } from 'react';
import { OverlayTrigger, Button } from 'react-bootstrap';

export default class Building extends Component{
    constructor(props) {
        super(props)

        this.ref = React.createRef()

        this.state = {
            remainingTime: null
        }

        let interval;
    }

    handleClick() {
        this.props.collectProducedItems(this.props.building)
    }

    checkAlreadyBuilded() {
        const today = new Date()

        return this.props.building.buildDate > today ? false : true
    }

    startReaminingTimeTimer() {
        this.handleTimeChange()

        this.interval = setInterval(() => this.handleTimeChange(), 1000)
    }

    handleTimeChange() {
        const today = new Date()
        const time = this.props.building.buildDate - today

        if (time > 0) {
            this.setState(state => ({
                ...state,
                remainingTime: new Date(time)
            }))
        } else {
            this.setState(state => ({
                ...state,
                remainingTime: null
            }))

            this.clearRemainingTime()
        }
    }

    componentDidMount() {
        if (!this.checkAlreadyBuilded()) {
            this.startReaminingTimeTimer()
        }
    }
    
    clearRemainingTime() {
        clearInterval(this.interval)
    }

    componentWillUnmount() {
        this.clearRemainingTime()
    }

    render() {
        const display = (
            this.props.building.alreadyProducedGold +
            this.props.building.alreadyProducedIrons +
            this.props.building.alreadyProducedStones +
            this.props.building.alreadyProducedWoods > 0 )

        return this.state.remainingTime != null ? 
        (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                <i className="bi bi-hammer fs-4"></i>
                <span className="fw-bold">{ this.state.remainingTime.getHours() - 1 }h { this.state.remainingTime.getMinutes() }m { this.state.remainingTime.getSeconds() }s</span>
            </div>
        ) :
        (

            <div className="w-100 h-100">
                <div className="overlay-container" ref={this.ref}></div>
                <OverlayTrigger
                    show={ display }
                    container={ this.ref }
                    trigger={null}
                    overlay={
                        <MovablePopover 
                            zoom={this.props.zoom} 
                            building={this.props.building}
                        > 
                            <div className="d-flex flex-column justify-content-center">
                                <ul className="list-unstyled">
                                    {
                                        this.props.building.alreadyProducedGold > 0 ? 
                                        <li>{ this.props.building.alreadyProducedGold } termelt arany</li> : 
                                        null
                                    }    
                                    {
                                        this.props.building.alreadyProducedIrons > 0 ? 
                                        <li>{ this.props.building.alreadyProducedIrons } termelt vas</li> : 
                                        null
                                    }  
                                    {
                                        this.props.building.alreadyProducedStones > 0 ? 
                                        <li>{ this.props.building.alreadyProducedStones } termelt kő</li> : 
                                        null
                                    }  
                                    {
                                        this.props.building.alreadyProducedWoods > 0 ? 
                                        <li>{ this.props.building.alreadyProducedWoods } termelt fa</li> : 
                                        null
                                    }  
                                </ul>

                                <Button 
                                    onClick={() => this.handleClick()}
                                    variant="primary">
                                    <i className="bi bi-cart-check-fill"></i>
                                </Button>
                            </div>
                        </MovablePopover>
                    }
                    >
                    <div
                        onClick={() => this.props.selectBuildingToUpdate(this.props.building)}
                        className="w-100 h-100 sprite-image"
                        style={{
                            backgroundImage: `url(${this.props.building.imagePath})`
                        }}>
                    </div>
                </OverlayTrigger>
            </div>
        )
    }
}