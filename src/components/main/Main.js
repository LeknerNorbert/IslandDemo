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
        b.imagePath,
        b.goldsForUpdate,
        b.ironsForUpdate,
        b.stonesForUpdate,
        b.woodsForUpdate
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

  collectProducedItems = (items) => {
    console.log(items)
  }

  updateBuilding = (building) => {
    
    console.log(building)

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

  cancelUpdateBuilding = () => {
    this.setState(state => ({
      ...state,
      selectedBuildingToUpdate: null
    }))
  }

  selectBuildingToUpdate = (building) => {
    this.setState(state => ({
      ...state,
      selectedBuildingToUpdate: building
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
        '/assets/house-lvl-1.png',
        200,
        200,
        200,
        200
      )
      
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

  componentDidMount() {
    this.fetchInitFile()
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