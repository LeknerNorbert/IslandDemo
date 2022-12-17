import { Component } from "react"
import Map from "../map/Map"
import BuildingNotification from "../building-notification/BuildingNotification.js"
import PlayerStatistic from "../player-statistic/PlayerStatistic"
import { BuiltBuilding, UnbuiltBuilding, BuildingArea as BuildingArea } from './Models'
import UpdateBuildingDialog from "../map/update-building-dialog/UpdateBuildingDialog"

export default class Main extends Component {
  constructor() {
    super()

    this.state = {
      isInitReady: false,
      availableBuildingAreas: [],
      builtBuildings: [],
      unbuiltBuildings: [],
      stats: {
        xp: 0,
        strength: 0,
        ability: 0,
        intelligence: 0
      },
      items: {
        woods: 0,
        stones: 0,
        irons: 0,
        golds: 0
      },
      npcWays: [],
      waitToBuild: null,
      selectedBuildingToUpdate: null
    }

    this.updateItemStartTimers = []
    this.updateItemIntervals = []
  }
    
  async fetchInitFile() {
    const response = await fetch('/init.json');

    if (!response.ok) {
      // Hibakezelést megcsinálni
      return
    }
    const initFile = await response.json()

    this.processInitFile(initFile)
  }

  processInitFile(initFile) {
    const availableBuildingAreas = initFile.availableBuildingAreas?.map(b => 
      new BuildingArea(
        b.coordX, 
        b.coordY
      )  
    )

    const builtBuildings = initFile.builtBuildings?.map(b => 
      new BuiltBuilding(
        b.coordX, 
        b.coordY, 
        b.level, 
        b.maxLevel, 
        b.name, 
        new Date(b.buildDate),
        b.description, 
        b.imagePath, 
        b.goldsForUpdate, 
        b.ironsForUpdate, 
        b.stonesForUpdate, 
        b.woodsForUpdate, 
        b.productionInterval,
        new Date(b.lastCollectTime),
        b.produceGoldCount,
        b.produceIronsCount,
        b.produceStonesCount,
        b.produceWoodsCount,
        this.calculateProducedItem(new Date(b.lastCollectTime), b.produceGoldCount, b.productionInterval),
        this.calculateProducedItem(new Date(b.lastCollectTime), b.produceIronsCount, b.productionInterval),
        this.calculateProducedItem(new Date(b.lastCollectTime), b.produceStonesCount, b.productionInterval),
        this.calculateProducedItem(new Date(b.lastCollectTime), b.produceWoodsCount, b.productionInterval),
        this.addMilisecondsToDate(this.calculateStartTimeInMiliseconds(new Date(b.buildDate), b.productionInterval))
      )
    )


    const unbuiltBuildings = initFile.unbuiltBuildings?.map(b => 
      new UnbuiltBuilding(
        b.name,
        b.goldsForBuild,
        b.ironsForBuild,
        b.stonesForBuild,
        b.woodsForBuild
      )  
    )

    this.setState(state => ({
      ...state,
      isInitReady: true,
      availableBuildingAreas: availableBuildingAreas,
      builtBuildings: builtBuildings,
      unbuiltBuildings: unbuiltBuildings,
      stats: {
        xp: initFile.stats.xp,
        strength: initFile.stats.strength,
        ability: initFile.stats.ability,
        intelligence: initFile.stats.intelligence
      },
      items: {
        woods: initFile.items.woods,
        stones: initFile.items.stones,
        irons: initFile.items.irons,
        golds: initFile.items.golds
      },
      npcRoutes: initFile.npcRoutes
    }), () => {
      for(let building of this.state.builtBuildings) {
        this.startUpdateItemTimer(building)
      }
    })
  }
  
  selectWaitToBuild = (name) => {
    this.setState(state => ({
      ...state,
      waitToBuild: name
    }))
  }

  cancelWaitToBuild = () =>  {
    this.setState(state => ({
      ...state,
      waitToBuild: null
    }))
  }

  buildBuilding = (chosenCoordX, chosenCoordY) => {
    if(this.state.waitToBuild != null) {  
      const chosenBuilding = this.state.unbuiltBuildings.find(u => u.name == this.state.waitToBuild)
      
      const buildDate = new Date()
      buildDate.setMinutes(buildDate.getMinutes() + 2)

      // Ez majd backendről fog jönni
      const newBuiltBuilding = new BuiltBuilding (
        chosenCoordX,
        chosenCoordY,
        1,
        3,
        chosenBuilding.name,
        buildDate,
        "...",
        '/assets/house-lvl-1.png',
        200,
        200,
        200,
        200,
        180000,
        new Date(),
        0,
        30,
        10,
        20,
        0,
        0,
        0,
        0,
        this.addMilisecondsToDate(this.calculateStartTimeInMiliseconds(buildDate, 180000))
      )
      
      this.startUpdateItemTimer(newBuiltBuilding)

      this.setState(state => ({
        ...state,
        availableBuildingAreas: state.availableBuildingAreas.filter(a => !(a.coordX == chosenCoordX && a.coordY == chosenCoordY)),
        builtBuildings: [...state.builtBuildings, newBuiltBuilding],
        unbuiltBuildings: state.unbuiltBuildings.filter(u => u.name != this.state.waitToBuild),
        items: {
          woods: state.items.woods - chosenBuilding.woodsForBuild,
          stones: state.items.stones - chosenBuilding.stonesForBuild,
          irons: state.items.irons - chosenBuilding.ironsForBuild,
          golds: state.items.golds - chosenBuilding.goldsForBuild
        },
        waitToBuild: null
      }))
    }
  }

  selectBuildingToUpdate = (building) => {
    this.setState(state => ({
      ...state,
      selectedBuildingToUpdate: building
    }))
  }

  cancelUpdateBuilding = () => {
    this.setState(state => ({
      ...state,
      selectedBuildingToUpdate: null
    }))
  }

  updateBuilding = (building) => {

    // Frissítési logika, ami ki lesz törölve, ha lesz backend
    building.level = building.level < building.maxLevel ? building.level + 1 : 3
    building.imagePath = `assets/house-lvl-${building.level}.png`
    
    this.setState(state => ({
      ...state,
      builtBuildings: state.builtBuildings.map(b => (
        b.name == building.name ? building : b
      )),
      items: {
        woods: state.items.woods - building.woodsForUpdate,
        stones: state.items.stones - building.stonesForUpdate,
        irons: state.items.irons - building.ironsForUpdate,
        golds: state.items.golds - building.goldsForUpdate
      },
      selectedBuildingToUpdate: null
    }))
  }

  calculateStartTimeInMiliseconds(buildDate, productionInterval) {
    const today = new Date()
    const elapsedTimeSinceBuild = today - buildDate

    let time

    if (elapsedTimeSinceBuild > 0){
      time = productionInterval - (elapsedTimeSinceBuild % productionInterval)
    } else {
      time = Math.abs(elapsedTimeSinceBuild) + productionInterval
    }

    return time
  }

  handleProducedItemUpdate(building) {
    const tickedBuilding = this.state.builtBuildings.find(b => b.name == building.name)

    tickedBuilding.alreadyProducedGold += tickedBuilding.produceGoldCount
    tickedBuilding.alreadyProducedIrons += tickedBuilding.produceIronsCount
    tickedBuilding.alreadyProducedStones += tickedBuilding.produceStonesCount
    tickedBuilding.alreadyProducedWoods += tickedBuilding.produceWoodsCount
    tickedBuilding.nextProductionDate = this.addMilisecondsToDate(tickedBuilding.productionInterval)

    this.setState(state => ({
      ...state,
      builtBuildings: state.builtBuildings.map(b => (
        b.name == tickedBuilding.name ? tickedBuilding : b
      ))
    }))
  }

  calculateProducedItem(lastCollectTime, itemCount, interval) {
    const today = new Date()

    const elapsedTimeFromLastCollection = today - lastCollectTime
    const multiplier = parseInt(elapsedTimeFromLastCollection / interval)

    return itemCount * multiplier
  }

  addMilisecondsToDate(miliseconds) {
    const today = new Date()

    today.setTime(today.getTime() + miliseconds)
    return today
  }

  startUpdateItemTimer(building) {
    let start = this.calculateStartTimeInMiliseconds(building.buildDate, building.productionInterval)
    let timer 
    let interval 

    timer = setTimeout(() => {
      this.handleProducedItemUpdate(building) 

      interval = setInterval(() => {
        this.handleProducedItemUpdate(building)
      }, building.productionInterval)
    }, start) 

    this.updateItemStartTimers.push(timer)
    this.updateItemIntervals.push(interval)
  }

  clearUpdateItemStartTimers() {
    for(let timer of this.updateItemStartTimers) {
      clearTimeout(timer)
    }
  }

  clearUpdateItemIntervals() {
    for(let interval of this.updateItemIntervals) {
      clearInterval(interval)
    }
  }

  collectProducedItems = (building) => {
    
    // Elküldeni a szervernek a frissítás dátumát

    const buildingAfterCollect = new BuiltBuilding(
      building.coordX, 
      building.coordY, 
      building.level, 
      building.maxLevel, 
      building.name, 
      building.buildDate,
      building.description, 
      building.imagePath, 
      building.goldsForUpdate, 
      building.ironsForUpdate, 
      building.stonesForUpdate, 
      building.woodsForUpdate, 
      building.productionInterval,
      new Date(),
      building.produceGoldCount,
      building.produceIronsCount,
      building.produceStonesCount,
      building.produceWoodsCount,
      0,
      0,
      0,
      0,
      this.addMilisecondsToDate(this.calculateStartTimeInMiliseconds(building.buildDate, building.productionInterval))
    )

    this.setState(state => ({
      ...state,
      builtBuildings: state.builtBuildings.map(b => (
        b.name == buildingAfterCollect.name ? buildingAfterCollect : b
      )),
      items: {
        woods: state.items.woods + building.alreadyProducedWoods,
        stones: state.items.stones + building.alreadyProducedStones,
        irons: state.items.irons + building.alreadyProducedIrons,
        golds: state.items.golds + building.alreadyProducedGold
      }
    }))
  }

  componentDidMount() {
    this.fetchInitFile()
  }

  componentWillUnmount() {
    this.clearUpdateItemStartTimers()
    this.clearUpdateItemIntervals()
  }

  render() {
    let waitToBuildNotification;

    if (this.state.waitToBuild) {
      waitToBuildNotification = <BuildingNotification name={this.state.waitToBuild} cancelWaitToBuild={this.cancelWaitToBuild}/>
    }

    return (
      <div>
        { waitToBuildNotification }
        <PlayerStatistic 
          items={this.state.items}
          unbuiltBuildings={this.state.unbuiltBuildings}
          selectWaitToBuild={this.selectWaitToBuild}
          waitToBuild={this.state.waitToBuild}
          />
        <Map 
          isInitReady={this.state.isInitReady}
          buildBuilding={this.buildBuilding}
          availableBuildingAreas={this.state.availableBuildingAreas}
          builtBuildings={this.state.builtBuildings}
          waitToBuild={this.state.waitToBuild}
          collectProducedItems={this.collectProducedItems}
          selectBuildingToUpdate={this.selectBuildingToUpdate}
          />
          <UpdateBuildingDialog
            show={this.state.selectedBuildingToUpdate != null}
            building={this.state.selectedBuildingToUpdate}
            items={this.state.items}
            updateBuilding={this.updateBuilding}
            cancelUpdateBuilding={this.cancelUpdateBuilding}
          />
      </div>)
  }
}