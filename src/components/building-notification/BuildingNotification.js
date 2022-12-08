import { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, CloseButton } from 'react-bootstrap';
import "./BuildingNotification.css"

export default class BuildingNotification extends Component {
    constructor(props) {
        super(props)
    }

    render() {   
        return (
            <div className="building-notification">
                <Card style={{ width: '18rem' }} className="border-0 rounded-0">
                    <Card.Body className="d-flex justify-content-between">
                        { this.props.name }
                        <CloseButton onClick={() => this.props.cancelWaitToBuild()}/> 
                    </Card.Body>
                </Card>
            </div>
        )
    }
}