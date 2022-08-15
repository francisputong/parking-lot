import React from "react";
import { createCarLabel } from "../../utils/helpers";
import { CAR_SIZE } from "../../utils/constants";
import "./parking.css";

const Parking = ({ onClick, lot, cars }) => {
    const currentCar = cars.find((car) => car.id === lot.parkedCarId);

    return (
        <div onClick={onClick} className='parking'>
            {currentCar ? (
                <div className='d-flex flex-column'>
                    <div>{CAR_SIZE[lot.size][0]} Parking</div>
                    <div>{createCarLabel(currentCar)}</div>
                </div>
            ) : (
                <div>{CAR_SIZE[lot.size][0]} Parking</div>
            )}
        </div>
    );
};

export default Parking;
