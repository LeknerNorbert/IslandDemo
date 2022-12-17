import { Component } from "react";
import BuildingArea from './building-area/BuildingArea.js'
import Tile from './tile/Tile.js'
import React from "react";
import Building from "./building/Building.js";
import { Spinner } from 'react-bootstrap';


import './Map.css'

export default class Map extends Component {    

    constructor(props) {
        super(props)

        this.state = {
            tileSize: 0,
            waterWidth: 0,
            waterHeight: 0,
            waterX: 0,
            waterY: 0,
            islandWidth: 0,
            islandHeight: 0,
            islandX: 0,
            islandY: 0,
            isLeftButtonHolded: false,
            zoom: 0
        }
    }

    calculateCameraPosition() {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

        let tileSize = screenWidth / 30

        if (screenHeight > tileSize * 20) {  
            this.setState(state => ({
                ...state,
                tileSize: tileSize,
                waterWidth: screenWidth / 3 * 5,
                waterHeight: tileSize * 40,
                waterX: (window.innerWidth - screenWidth / 3 * 5) / 2,
                waterY: (window.innerHeight - tileSize * 40) / 2,
                islandWidth: screenWidth, 
                islandHeight: tileSize * 20, 
                islandX: (window.innerWidth - screenWidth) / 2,
                islandY: (window.innerHeight - tileSize * 20) / 2
            }))
        } else {
            tileSize = screenHeight / 20
            this.setState(state => ({
                ...state,
                tileSize: tileSize,
                waterWidth: tileSize * 50,
                waterHeight: screenHeight / 2 * 4,
                waterX: (window.innerWidth - tileSize * 50) / 2,
                waterY: (window.innerHeight - screenHeight / 2 * 4) / 2,
                islandWidth: tileSize * 30, 
                islandHeight: screenHeight,
                islandX: ((window.innerWidth - tileSize * 30) / 2),
                islandY: ((window.innerHeight - screenHeight) / 2)
            }))
        }
    }

    resize(scale, mouseX, mouseY) {
        const screenCenterX = window.innerWidth / 2
        const screenCenterY = window.innerHeight / 2

        let resizeOrigoX = mouseX
        let resizeOrigoY = mouseY

        let newIslandWidth = this.state.islandWidth * scale
        let newIslandHeight = this.state.islandHeight * scale
        let newIslandX = resizeOrigoX - (resizeOrigoX - this.state.islandX) * scale
        let newIslandY = resizeOrigoY - (resizeOrigoY - this.state.islandY) * scale

        if (newIslandX > screenCenterX || newIslandX + newIslandWidth < screenCenterX) {
            resizeOrigoX = screenCenterX
        }

        if (newIslandY > screenCenterY || newIslandY + newIslandHeight < screenCenterY) {
            resizeOrigoY = screenCenterY
        }

        this.setState(state => ({
            ...state,
            tileSize: state.tileSize * scale,
            waterWidth: state.waterWidth * scale,
            waterHeight: state.waterHeight * scale,
            waterX: resizeOrigoX - (resizeOrigoX - state.waterX) * scale,
            waterY: resizeOrigoY - (resizeOrigoY - state.waterY) * scale,
            islandWidth: state.islandWidth * scale,
            islandHeight: state.islandHeight * scale,
            islandX: resizeOrigoX - (resizeOrigoX - state.islandX) * scale,
            islandY: resizeOrigoY - (resizeOrigoY - state.islandY) * scale,
            zoom: state.zoom + scale
        }))
    }

    handlePreventDrag(event) {
        event.preventDefault()
    }

    handleMouseMove(event) {
        if (this.state.isLeftButtonHolded) {
            const screenCenterX = window.innerWidth / 2
            const screenCenterY = window.innerHeight / 2
            
            let newIslandX = this.state.islandX + event.movementX
            let newIslandY = this.state.islandY + event.movementY
            let newWaterX = this.state.waterX + event.movementX
            let newWaterY = this.state.waterY + event.movementY

            let different = 0

            if (newIslandX > screenCenterX ) {
                different = newIslandX - screenCenterX
                newIslandX -= different
                newWaterX -= different
            }

            if (newIslandX + this.state.islandWidth < screenCenterX) {
                different = newIslandX + this.state.islandWidth - screenCenterX
                newIslandX -= different
                newWaterX -= different
            }

            if (newIslandY > screenCenterY ) {              
                different = newIslandY - screenCenterY
                newIslandY -= different
                newWaterY -= different
            }

            if (newIslandY + this.state.islandHeight < screenCenterY) {
                different = newIslandY + this.state.islandHeight - screenCenterY
                newIslandY -= different
                newWaterY -= different
            }

            this.setState(state => ({
                ...state, 
                islandX: newIslandX,
                islandY: newIslandY,
                waterX: newWaterX,
                waterY: newWaterY
            }))
        }
    }

    handleMouseLeave() {
        this.setState(state => ({
            ...state,
            isLeftButtonHolded: false
        }))
    }

    handleMouseDown() {
        this.setState(state => ({
            ...state,
            isLeftButtonHolded: true
        }))
    }

    handleMouseUp() {
        this.setState(state => ({
            ...state,
            isLeftButtonHolded: false
        }))
    }

    handleWheel(event) {
        if (event.deltaY > 0) {
            this.resize(0.9, event.pageX, event.pageY)
        } else {
            this.resize(1.1, event.pageX, event.pageY)
        }
    }

    componentDidMount() {
        this.calculateCameraPosition()

        window.addEventListener('resize', () => {
            this.calculateCameraPosition()
        })
    }

    render() {

        const coords = []

        for(let i = 0; i < 20; i++) {
            const latitude = []

            for (let j = 0; j < 30; j++) {
                latitude.push({ x: j, y: i })
            }

            coords.push(latitude)
        }

        return !this.props.isInitReady ? (
            <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
                <Spinner animation="grow" />
            </div>
        ) : (
            <div 
                className="camera"
                    onMouseMove={ e => this.handleMouseMove(e) }
                    onMouseLeave={ () => this.handleMouseLeave() }
                    onMouseDown={ () => this.handleMouseDown() }
                    onMouseUp={ () => this.handleMouseUp() }
                    onWheel={ e => this.handleWheel(e) }
                >
                <div 
                    className="water"
                    onDragStart={event => this.handlePreventDrag(event)}
                    style={{
                        width: this.state.waterWidth,
                        height: this.state.waterHeight,
                        top: this.state.waterY,
                        left: this.state.waterX, 
                    }}>

                </div>
                <div 
                    className="island"
                    onDragStart={event => this.handlePreventDrag(event)}
                    style={{
                        width: this.state.islandWidth,
                        height: this.state.islandHeight,
                        top: this.state.islandY,
                        left: this.state.islandX,
                    }}>

                    {/* {
                        coords.map(coord => (
                            coord.map(latitude => (
                                <Tile 
                                    key={`${latitude.x}:${latitude.y}`}
                                    width={this.state.tileSize}
                                    height={this.state.tileSize}
                                    top={(latitude.y * this.state.tileSize)}
                                    left={(latitude.x * this.state.tileSize)}
                                >
                                    { `${latitude.x}:${latitude.y}` }
                                </Tile>
                            ))
                        ))
                    } */}

                    {
                        this.props.availableBuildingAreas.map((area, index) => (
                            <Tile 
                                key={index}
                                width={this.state.tileSize}
                                height={this.state.tileSize}
                                top={(area.coordY * this.state.tileSize)}
                                left={(area.coordX * this.state.tileSize)}
                            >
                                <BuildingArea 
                                    active={ this.props.waitToBuild != null }
                                    coordX={area.coordX}
                                    coordY={area.coordY}
                                    buildBuilding={this.props.buildBuilding}
                                />
                            </Tile>
                        ))
                    }
                    
                    {
                        this.props.builtBuildings.map((building, index) => (
                            <Tile 
                                key={index}
                                width={this.state.tileSize}
                                height={this.state.tileSize}
                                top={(building.coordY * this.state.tileSize)}
                                left={(building.coordX * this.state.tileSize)}>
                                <Building 
                                    building={building}
                                    zoom={this.state.zoom}
                                    collectProducedItems={this.props.collectProducedItems}
                                    selectBuildingToUpdate={this.props.selectBuildingToUpdate}
                                />
                            </Tile>
                        ))
                    }
                </div>
            </div>
        )
    }
}