import { Component, useState } from 'react';
import { Modal, Button, Container, Col, Row, Table, ModalBody } from 'react-bootstrap';

import "./UpdateBuildingDialog.css"

export default class UpdateBuildingDialog extends Component {
    constructor(props) {
        super(props)

        this.interval = null;
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                centered
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        { this.props.building?.name }    
                        <h6 className="card-subtitle mb-2 text-muted">
                            { this.props.building?.description }
                        </h6> 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={12} md={6}>
                                <Table responsive>
                                    <tbody>
                                        <tr>
                                            <td>Termelt arany</td>
                                            <td>{ this.props.building?.produceGoldCount }/{ this.props.building?.productionInterval } perc</td>
                                        </tr>
                                        <tr>
                                            <td>Termelt vas</td>
                                            <td>{ this.props.building?.produceIronsCount }/{ this.props.building?.productionInterval } perc</td>
                                        </tr>
                                        <tr>
                                            <td>Termelt kő</td>
                                            <td>{ this.props.building?.produceStonesCount }/{ this.props.building?.productionInterval } perc</td>
                                        </tr>
                                        <tr>
                                            <td>Termel fa</td>
                                            <td>{ this.props.building?.produceWoodsCount }/{ this.props.building?.productionInterval } perc</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs={12} md={6}>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Golds</td>
                                            <td>
                                            {this.props.items.golds}/{this.props.building?.goldsForUpdate}
                                            </td>
                                            <td>
                                                {
                                                    this.props.building?.goldsForUpdate <= this.props.items.golds ?
                                                    <i className="bi bi-check"></i> :
                                                    <i className="bi bi-x"></i>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Irons</td>
                                            <td>
                                            {this.props.items.irons}/{this.props.building?.ironsForUpdate}
                                            </td>
                                            <td>
                                                {
                                                    this.props.building?.ironsForUpdate <= this.props.items.irons ?
                                                    <i className="bi bi-check"></i> :
                                                    <i className="bi bi-x"></i>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Stones</td>
                                            <td>
                                                {this.props.items.stones}/{this.props.building?.stonesForUpdate}
                                            </td>
                                            <td>
                                                {
                                                    this.props.building?.stonesForUpdate <= this.props.items.stones ?
                                                    <i className="bi bi-check"></i> :
                                                    <i className="bi bi-x"></i>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Woods</td>
                                            <td>
                                            {this.props.items.woods}/{this.props.building?.woodsForUpdate}
                                            </td>
                                            <td>
                                                {
                                                    this.props.building?.woodsForUpdate <= this.props.items.woods ?
                                                    <i className="bi bi-check"></i> :
                                                    <i className="bi bi-x"></i>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        onClick={() => this.props.cancelUpdateBuilding()}
                        variant="outline-primary"
                        >
                        Close
                    </Button>
                    <Button 
                        onClick={() => this.props.updateBuilding(this.props.building)}
                        variant="primary" 
                        disabled={
                            !this.props.building?.checkCanBeUpdate(
                                this.props.items.golds,
                                this.props.items.irons,
                                this.props.items.stones,
                                this.props.items.woods,
                            )
                        }
                        >
                        Update <i className="bi bi-box-arrow-up"></i>
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}