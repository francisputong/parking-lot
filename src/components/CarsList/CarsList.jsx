import moment from "moment";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { createCarLabel } from "../../utils/helpers";
import "./cars-list.css";

const CarsList = ({ carsList, handleSelectCar }) => {
    return (
        <div className='cars'>
            {carsList.map((car, i) => {
                if (!car.isParked) {
                    return (
                        <div key={i}>
                            <Card className='cars-card'>
                                <Card.Body>
                                    <Card.Title>
                                        {createCarLabel(car)}
                                    </Card.Title>
                                    <Card.Text style={{ fontSize: 14 }}>
                                        {car.parkStartTime ? (
                                            <div>
                                                <div>
                                                    Time in:{" "}
                                                    {moment(
                                                        car.parkStartTime
                                                    ).format("HH:mm:ss")}
                                                </div>
                                                <div>
                                                    Exit time:{" "}
                                                    {moment(
                                                        car.parkEndTime
                                                    ).format("HH:mm:ss")}
                                                </div>
                                                <div>
                                                    Total cost: ₱
                                                    {car.totalPayment}
                                                </div>
                                            </div>
                                        ) : (
                                            "Ready to park!"
                                        )}
                                    </Card.Text>
                                    <Button
                                        data-testid={`car-${i}`}
                                        onClick={() => handleSelectCar(car.id)}
                                        variant='primary'
                                    >
                                        Select Car
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    );
                } else {
                    return <div key={i} />;
                }
            })}
        </div>
    );
};

export default CarsList;
