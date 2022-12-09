export class BuildingArea {
    constructor(coordX, coordY) {
        this.coordX = coordX
        this.coordY = coordY
    }
}

export class BuiltBuilding {
    constructor (
        coordX, 
        coordY, 
        level, 
        maxLevel, 
        name, 
        description, 
        imagePath, 
        goldsForUpdate, 
        ironsForUpdate, 
        stonesForUpdate, 
        woodsForUpdate, 
        productionInterval,
        lastCollectTime,
        goldsProduced,
        ironsProduced,
        stonesProduced,
        woodsProduced) {
        
        this.coordX = coordX
        this.coordY = coordY
        this.level = level
        this.maxLevel = maxLevel
        this.name = name
        this.description = description
        this.imagePath = imagePath
        this.goldsForUpdate = goldsForUpdate
        this.ironsForUpdate = ironsForUpdate
        this.stonesForUpdate = stonesForUpdate
        this.woodsForUpdate = woodsForUpdate
        this.productionInterval = productionInterval
        this.lastCollectTime = lastCollectTime
        this.goldsProduced = goldsProduced
        this.ironsProduced = ironsProduced
        this.stonesProduced = stonesProduced
        this.woodsProduced = woodsProduced
    }

    checkCanBeUpdate(availableGolds, availableIrons, availableStones, availableWoods) {        
        return ( 
            this.goldsForUpdate <= availableGolds &&
            this.ironsForUpdate <= availableIrons && 
            this.stonesForUpdate <= availableStones && 
            this.woodsForUpdate <= availableWoods &&
            this.level < this.maxLevel)
    }
}

export class UnbuiltBuilding {
    constructor(
        name, goldsForBuild, ironsForBuild, stonesForBuild, woodsForBuild) {
        
        this.name = name
        this.goldsForBuild = goldsForBuild
        this.ironsForBuild = ironsForBuild
        this.stonesForBuild = stonesForBuild
        this.woodsForBuild = woodsForBuild
    }

    checkCanBeBuilt(
        availableGolds, availableIrons, availableStones, availableWoods) {
        
        return ( 
            this.goldsForBuild <= availableGolds && 
            this.ironsForBuild <= availableIrons && 
            this.stonesForBuild <= availableStones && 
            this.woodsForBuild <= availableWoods )
    }
}