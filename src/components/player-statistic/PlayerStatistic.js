import { Component } from 'react'

import Card from 'react-bootstrap/Card';
import { Badge } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { OverlayTrigger } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';

import './PlayerStatistic.css'

export default class PlayerStatistic extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="stats">
                <Card style={{ width: '18rem' }} className="border-0 rounded-0">
                    <Card.Body>
                        <Card.Title as="h6" className="card-subtitle mb-2 text-muted">Your island has</Card.Title>
                        <Card.Title as="h5">Items</Card.Title>
                    </Card.Body>
                    <ListGroup variant="flush" className="border-top border-bottom">
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-center"
                        >
                            Golds
                            <Badge bg="primary" pill>
                            { this.props.items.golds }
                            </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-center"
                        >
                            Irons
                            <Badge bg="primary" pill>
                            { this.props.items.irons }
                            </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-center"
                        >
                            Stones
                            <Badge bg="primary" pill>
                            { this.props.items.stones }
                            </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-center"
                        >
                            Woods
                            <Badge bg="primary" pill>
                            { this.props.items.woods }
                            </Badge>
                        </ListGroup.Item>
                    </ListGroup>
                    {
                        this.props.unbuiltBuildings.length > 0 ?
                        <div>
                            <Card.Body>
                                <Card.Title as="h5">Unbuilt buildings</Card.Title>
                            </Card.Body>
                            <ListGroup variant="flush" className="border-top border-bottom">
                                {
                                    this.props.unbuiltBuildings.map((building, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            as="li"
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            { building.name }
                                            <ButtonGroup aria-label="Basic example">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => this.props.selectWaitToBuild(building.name)}
                                                    disabled={!building.checkCanBeBuilt(
                                                        this.props.items.golds, 
                                                        this.props.items.irons, 
                                                        this.props.items.stones, 
                                                        this.props.items.woods) || this.props.waitToBuild }>
                                                    Build
                                                </Button>
                                                <OverlayTrigger 
                                                    trigger="click" 
                                                    placement="right" 
                                                    overlay={
                                                        <Popover id="popover-basic">
                                                            <Popover.Header as="h3">Materials needed for building</Popover.Header>
                                                            <Popover.Body>
                                                                <p>Golds: { building.goldsForBuild }</p>
                                                                <p>Irons: { building.ironsForBuild }</p>
                                                                <p>Stones: { building.stonesForBuild }</p>
                                                                <p>Woods: { building.woodsForBuild }</p>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }>
                                                    <Button variant="outline-primary" size="sm">
                                                        <i className="bi bi-question-lg"></i>
                                                    </Button>
                                                </OverlayTrigger>
                                            </ButtonGroup>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        </div> :
                        null
                    }
                    <Card.Body>
                        <Card.Text><small className="text-muted">Last updated 3 mins ago</small></Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}