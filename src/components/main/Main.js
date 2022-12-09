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
      waitToBuild: null,
      selectedBuildingToUpdate: null
    }

    this.startTimeout = null
    this.productionInterval = null
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
        b.description,
        b.imagePath,
        b.goldsForUpdate,
        b.ironsForUpdate,
        b.stonesForUpdate,
        b.woodsForUpdate,
        b.productionInterval,
        b.producedItems,
        b.lastCollectTime,
        b.goldsProduced,
        b.ironsProduced,
        b.stonesProduced,
        b.woodsProduced
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

    }))
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
      
      // Ez majd backendről fog jönni
      const newBuiltBuilding = new BuiltBuilding (
        chosenCoordX,
        chosenCoordY,
        1,
        3,
        chosenBuilding.name,
        "Example description",
        '/assets/house-lvl-1.png',
        200,
        200,
        200,
        200,
        10,
        [
          {
            type: 'Golds',
            count: '10'
          }
        ]
      )

      console.log(newBuiltBuilding)
      
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

  collectProducedItems = (building) => {
    console.log(building)
  }

  startProductionInterval() {
    const today = new Date()
    let minutes = today.getMinutes()

    const startTime = 10 - ( minutes % 10)
    
    this.startTimeout = setTimeout(() => {
      this.productionInterval = setInterval(() => {
        this.updateProducedItems()
      }, 10000)
    }, startTime)
  }

  clearProductionIntervals() {
    if (this.startTimeout != null) {
      clearTimeout(this.startTimeout)
    }

    if (this.productionInterval != null) {
      clearInterval(this.productionInterval)
    }
  }

  updateProducedItems() {

  }

  calculateProducedItemCount(lastCollectTime, count, interval) {
    const today = new Date()

    const elapsedTime = today - lastCollectTime
    const ticks = parseInt(elapsedTime / (interval * 60000))

    return ticks * count
  }

  componentDidMount() {
    this.calculateProducedItemCount('', 1, 1)
    this.fetchInitFile()
    this.startProductionInterval()
  }

  componentWillUnmount() {
    this.clearProductionIntervals()
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