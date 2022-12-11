import './Building.css'

import MovablePopover from '../movable-popover/MovablePopover'
import React, { Component } from 'react';
import { OverlayTrigger, Button } from 'react-bootstrap';

export default class Building extends Component{
    constructor(props) {
        super(props)

        this.ref = React.createRef()
    }

    handleClick() {
        this.props.collectProducedItems(this.props.building)
    }

    render() {
        const display = (
            this.props.building.alreadyProducedGold +
            this.props.building.alreadyProducedIrons +
            this.props.building.alreadyProducedStones +
            this.props.building.alreadyProducedWoods > 0 )

        return (
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
                                        <li>{ this.props.building.alreadyProducedGold } termelt vas</li> : 
                                        null
                                    }  
                                    {
                                        this.props.building.alreadyProducedStones > 0 ? 
                                        <li>{ this.props.building.alreadyProducedGold } termelt kő</li> : 
                                        null
                                    }  
                                    {
                                        this.props.building.alreadyProducedWoods > 0 ? 
                                        <li>{ this.props.building.alreadyProducedGold } termelt fa</li> : 
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