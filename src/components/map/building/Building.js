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
        return (
            <div className="w-100 h-100">
                <div className="overlay-container" ref={this.ref}></div>
                <OverlayTrigger
                    show={ true }
                    container={ this.ref }
                    trigger={null}
                    overlay={
                        <MovablePopover zoom={this.props.zoom}> 
                            <div className="d-flex flex-column justify-content-center">
                        
                                <Button 
                                    onClick={() => this.handleClick()}

                                    className="mt-2"
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