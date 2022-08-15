import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";

const Sidebar = ({
    className,
    setParkingLotDimensions,
    parkingLotDimensions,
}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className={className}>
            <Button variant='secondary' onClick={handleShow}>
                Menu
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form.Group className='mb-3'>
                        <Form.Label>Rows</Form.Label>
                        <Form.Select
                            value={parkingLotDimensions.rows}
                            onChange={(e) => {
                                setParkingLotDimensions({
                                    ...parkingLotDimensions,
                                    rows: parseInt(e.target.value),
                                });
                            }}
                        >
                            {[...Array(4).keys()].map((_, i) => {
                                return (
                                    <option key={i} value={i + 4}>
                                        {i + 4}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Columns</Form.Label>
                        <Form.Select
                            value={parkingLotDimensions.columns}
                            onChange={(e) => {
                                setParkingLotDimensions({
                                    ...parkingLotDimensions,
                                    columns: parseInt(e.target.value),
                                });
                            }}
                        >
                            {[...Array(4).keys()].map((_, i) => {
                                return (
                                    <option key={i} value={i + 4}>
                                        {i + 4}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default Sidebar;
