import { Component } from 'react';
import { Modal, Button, Container, Col, Row, Table } from 'react-bootstrap';

export default class UpdateBuildingDialog extends Component {
    constructor(props) {
        super(props)
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
                            Level { this.props.building?.level }/{ this.props.building?.maxLevel }
                        </h6> 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={12} md={6}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Producted materials</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Golds</td>
                                            <td>0/h</td>
                                        </tr>
                                        <tr>
                                            <td>Irons</td>
                                            <td>0/h</td>
                                        </tr>
                                        <tr>
                                            <td>Stones</td>
                                            <td>0/h</td>
                                        </tr>
                                        <tr>
                                            <td>Woods</td>
                                            <td>0/h</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs={12} md={6}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Materials for updgrade</th>
                                        </tr>
                                    </thead>
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
                                                    <i class="bi bi-x"></i>
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
                                                    <i class="bi bi-x"></i>
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
                                                    <i class="bi bi-x"></i>
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
                                                    <i class="bi bi-x"></i>
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