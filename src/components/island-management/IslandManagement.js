import { Component } from "react";
import BuildingArea from './building-area/BuildingArea.js'
import Tile from './tile/Tile.js'
import React from "react";
import Building from "./building/Building.js";
import { Spinner } from 'react-bootstrap';
import { AnimateKeyframes }  from 'react-simple-animate';

import './IslandManagement.css'
import NPC from "../NPC/NPC.js";

export default class IslandManagement extends Component {    

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
            zoom: 0,
            npcAnimations: [],
        }

        this.animationTimeout = null
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

    // Animation

    scheduleNextNPCAnimations() {
        const nextScheduleTime = Math.floor(Math.random() * 5000) + 5000

        this.animationTimeout = setTimeout(() => {
            this.startNPCAnimation()
            this.scheduleNextNPCAnimations()
        }, nextScheduleTime)
    }

    startNPCAnimation() {
        const routeTilesMap = this.convertRoutesToMap(this.props.routeTiles)
        const startCoordinatesMap = this.searchStartCoordinates(routeTilesMap)
        const startCoordinate = this.chooseRandomCoordinate(startCoordinatesMap)
        const routeCoordinates = this.createRouteForNPC(startCoordinate, routeTilesMap)
        const movements = this.convertRouteCoordinatesToMovements(routeCoordinates)
        const npcAnimation = this.createNPCAnimation(startCoordinate, movements)

        const extendedNPCAnimations = this.state.npcAnimations.slice()
        extendedNPCAnimations.push(npcAnimation)

        let npcAnimations = this.state.npcAnimations
        npcAnimations = this.animationGarbageCollect(npcAnimations)

        if (npcAnimations.length < 6) {
            console.log('OK')
            this.setState(state => ({
                ...state,
                npcAnimations: extendedNPCAnimations
            }))
        }
    }

    animationGarbageCollect(animations) {
        const runningAnimations = []
        const now = new Date()

        for(const animation of animations) {
            if (animation.endTime > now) {
                runningAnimations.push(animation)
            }
        }

        return runningAnimations
    }

    convertRoutesToMap(routes) {
        const map = new Map()

        for(const route of routes) {
            map.set(`${route.coordX}${route.coordY}`, route)
        }

        return map
    }  

    searchStartCoordinates(routeTilesMap) {
        const startCoordinates = []

        for (const routeTileMap of routeTilesMap) {

            const topNeighbourRouteKey = `${ routeTileMap[1].coordX }${ routeTileMap[1].coordY + 1 }`
            const rightNeighbourRouteKey = `${ routeTileMap[1].coordX + 1 }${ routeTileMap[1].coordY }`
            const bottomNeighbourRouteKey = `${ routeTileMap[1].coordX }${ routeTileMap[1].coordY - 1 }`
            const leftNeighbourRouteKey = `${routeTileMap[1].coordX - 1}${ routeTileMap[1].coordY }`

            let numberOfNeighbors = 0

            if (routeTilesMap.get(topNeighbourRouteKey)) {
                numberOfNeighbors++
            }

            if (routeTilesMap.get(rightNeighbourRouteKey)) {
                numberOfNeighbors++
            }

            if (routeTilesMap.get(bottomNeighbourRouteKey)) {
                numberOfNeighbors++
            }

            if (routeTilesMap.get(leftNeighbourRouteKey)) {
                numberOfNeighbors++
            }

            if (numberOfNeighbors === 1) {
                startCoordinates.push(routeTileMap)
            } 
        }

        return startCoordinates
    }

    chooseRandomCoordinate(coordinates) {
        const randomIndex = Math.floor(Math.random() * coordinates.length);

        return coordinates[randomIndex][1]
    } 

    createRouteForNPC(startingCoordinate, routeTilesMap) {
        const touchedRouteTiles = new Map()
        const npcRouteCoordinates = [ startingCoordinate ]

        let currentStep = startingCoordinate
        let isReachedEndOfRoute = false

        while(!isReachedEndOfRoute) {

            const possibleSteps = []

            const keyOfTopStep = `${currentStep.coordX}${currentStep.coordY + 1}`
            const keyOfRightStep = `${currentStep.coordX + 1}${currentStep.coordY}`
            const keyOfBottomStep = `${currentStep.coordX}${currentStep.coordY - 1}`
            const keyOfLeftStep = `${currentStep.coordX - 1}${currentStep.coordY}`

            if (routeTilesMap.get(keyOfTopStep) && !touchedRouteTiles.get(keyOfTopStep)) {
                possibleSteps.push(
                    routeTilesMap.get(keyOfTopStep)
                )
            }

            if (routeTilesMap.get(keyOfRightStep) && !touchedRouteTiles.get(keyOfRightStep)) {
                possibleSteps.push(
                    routeTilesMap.get(keyOfRightStep)
                )
            }

            if (routeTilesMap.get(keyOfBottomStep) && !touchedRouteTiles.get(keyOfBottomStep)) {
                possibleSteps.push(
                    routeTilesMap.get(keyOfBottomStep)
                )
            }

            if (routeTilesMap.get(keyOfLeftStep) && !touchedRouteTiles.get(keyOfLeftStep)) {
                possibleSteps.push(
                    routeTilesMap.get(keyOfLeftStep)
                )
            }

            if (possibleSteps.length === 1) {
                npcRouteCoordinates.push(possibleSteps[0])
                touchedRouteTiles.set(`${currentStep.coordX}${currentStep.coordY}`, currentStep)

                currentStep = possibleSteps[0]

            } else if (possibleSteps.length > 1) {
                const randomIndex = Math.floor(Math.random() * possibleSteps.length);
                
                npcRouteCoordinates.push(possibleSteps[randomIndex])
                touchedRouteTiles.set(`${currentStep.coordX}${currentStep.coordY}`, currentStep)

                currentStep = possibleSteps[randomIndex]

            } else {
                isReachedEndOfRoute = true
            }
        }

        return npcRouteCoordinates
    }

    // Kiszervervezni külön fileba
    Directions = {
        top: 0,
        right: 1,
        bottom: 2,
        left: 3
    }

    convertRouteCoordinatesToMovements(routeCoordinates) {
        const movements = []

        let currentMovementDirection = null
        let currentMovementIndex = -1

        for (let i = 1; i < routeCoordinates.length; i++) {
            
            let newMovementDirection
            
            if (routeCoordinates[i - 1].coordX > routeCoordinates[i].coordX) {
                newMovementDirection = this.Directions.left
            }

            if (routeCoordinates[i - 1].coordY > routeCoordinates[i].coordY) {
                newMovementDirection = this.Directions.top
            }

            if (routeCoordinates[i - 1].coordX < routeCoordinates[i].coordX) {
                newMovementDirection = this.Directions.right
            }

            if (routeCoordinates[i - 1].coordY < routeCoordinates[i].coordY) {
                newMovementDirection = this.Directions.bottom
            }

            if (newMovementDirection != currentMovementDirection) {
                currentMovementIndex++
                currentMovementDirection = newMovementDirection

                movements.push({ direction: currentMovementDirection, steps: 1 })
            } else {
                movements[currentMovementIndex].steps++
            }
        }

        return movements
    }

    createNPCAnimation (startCoordinate, movements) {
        const keyframes = []
        const islandWidthCoordinatesOnePercent = 0.3
        const islandHeightCoordinatesOnePercent = 0.2
        const stepTime = 3.5

        const allSteps = movements.reduce((r, a) => r + a.steps, 0)
        let currentTranslateX = startCoordinate.coordX / islandWidthCoordinatesOnePercent
        let currentTranslateY = startCoordinate.coordY / islandHeightCoordinatesOnePercent
        let animationKeyframePercent = 0

        keyframes.push({ 0: `transform: translateX(${ currentTranslateX }%) translateY(${ currentTranslateY }%);` })

        for (const movement of movements) {

            let keyframe = {}

            animationKeyframePercent += movement.steps / (allSteps / 100)
            if (animationKeyframePercent > 100) animationKeyframePercent = 100
            
            switch(movement.direction) {
                case this.Directions.top:
                    currentTranslateY -= movement.steps / islandHeightCoordinatesOnePercent
                    keyframe[animationKeyframePercent] = `transform: translateX(${ currentTranslateX }%) translateY(${ currentTranslateY }%);`

                    keyframes.push(keyframe)

                    break;
                case this.Directions.right:
                    currentTranslateX += movement.steps / islandWidthCoordinatesOnePercent
                    keyframe[animationKeyframePercent] = `transform: translateX(${ currentTranslateX }%) translateY(${ currentTranslateY }%);`

                    keyframes.push(keyframe)
                
                    break;
                case this.Directions.bottom:
                    currentTranslateY += movement.steps / islandHeightCoordinatesOnePercent
                    keyframe[animationKeyframePercent] = `transform: translateX(${ currentTranslateX }%) translateY(${ currentTranslateY }%);`

                    keyframes.push(keyframe)

                    break;
                case this.Directions.left:
                    currentTranslateX -= movement.steps / islandWidthCoordinatesOnePercent
                    keyframe[animationKeyframePercent] = `transform: translateX(${ currentTranslateX }%) translateY(${ currentTranslateY }%)`

                    keyframes.push(keyframe)

                    break;  
            }
        }

        // Walking animaton
        const sprites = {
            animationFrequency: 8,
            spritePath: '/assets/sprites/sprite-0001.png',
        }

        let spriteXPosition = 0
        const walkingKeyframes = []
        const walkingAnimationKeyframePercent = 100 / (allSteps * sprites.animationFrequency) 
        let currentWalkingAnimationKeyframePercent = 0

        for(const movement of movements) {
            for (let step = 0; step < movement.steps; step++) {
                for (let keyframes = 0; keyframes < sprites.animationFrequency; keyframes++) {
                    
                    const walkingKeyframe = {}

                    switch(movement.direction) {
                        case this.Directions.top:
                            walkingKeyframe[currentWalkingAnimationKeyframePercent] = 
                                `background-image: url(/assets/sprites/sprite-0001.png); background-position: ${100 / 3 * spriteXPosition}% ${100 / 3 * 2}%`
                            walkingKeyframes.push(walkingKeyframe)

                            break;
                        case this.Directions.right:
                            walkingKeyframe[currentWalkingAnimationKeyframePercent] = 
                                `background-image: url(/assets/sprites/sprite-0001.png); background-position: ${100 / 3 * spriteXPosition}% ${100 / 3}%`
                            walkingKeyframes.push(walkingKeyframe)

                            break;
                        case this.Directions.bottom:
                            walkingKeyframe[currentWalkingAnimationKeyframePercent] = 
                                `background-image: url(/assets/sprites/sprite-0001.png); background-position: ${100 / 3 * spriteXPosition}% ${0}%`
                            walkingKeyframes.push(walkingKeyframe)

                            break;
                        case this.Directions.left:
                            walkingKeyframe[currentWalkingAnimationKeyframePercent] = 
                                `background-image: url(/assets/sprites/sprite-0001.png); background-position: ${100 / 3 * spriteXPosition}% ${100}%`
                            walkingKeyframes.push(walkingKeyframe)

                            break;  
                    }

                    spriteXPosition < 3 ? spriteXPosition++ : spriteXPosition = 0
                    
                    currentWalkingAnimationKeyframePercent += walkingAnimationKeyframePercent
                    if (currentWalkingAnimationKeyframePercent > 100) currentWalkingAnimationKeyframePercent = 100
                }
            }
        }

        const createTime = Date.now()
        const duration = allSteps * stepTime

        return {
            duration: duration,
            keyframes: keyframes,
            walkingKeyframes: walkingKeyframes,
            createTime: new Date(),
            endTime: new Date(createTime + (duration * 1000))
        }
    }

    componentDidMount() {
        this.calculateCameraPosition()
        this.scheduleNextNPCAnimations()

        window.addEventListener('resize', () => {
            this.calculateCameraPosition()
        })
    }

    componentWillUnmount() {
        if (this.animationTimeout != null) {
            clearTimeout(this.animationTimeout)
        }
    }

    render() {
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
                        
                    <div className="animations">
                        
                        {
                            this.state.npcAnimations.map((animation, index) => (
                                <AnimateKeyframes
                                    play
                                    duration={animation.duration}
                                    direction="normal"
                                    keyframes={animation.keyframes}
                                    key={index}
                                >
                                    <NPC 
                                        width={this.state.tileSize} 
                                        height={this.state.tileSize}
                                        walkingKeyframes={animation.walkingKeyframes}
                                        duration={animation.duration}
                                    />
                                </AnimateKeyframes>
                            ))
                        }
                    </div>

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