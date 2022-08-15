import React from "react";
import Entrance from "../Entrance/Entrance";
import Parking from "../Parking/Parking";

import { LOT_TYPE } from "../../utils/constants";
import "./lot-space.css";

const LotSpace = ({ lot, cars, handleClickEntrance, handleClickParking }) => {
    return (
        <div className='lot-space'>
            {lot.type === LOT_TYPE.ENTRANCE ? (
                <Entrance
                    isActiveEntrance={lot.isActiveEntrance}
                    onClick={() => handleClickEntrance(lot)}
                />
            ) : (
                <Parking
                    lot={lot}
                    cars={cars}
                    onClick={() => handleClickParking(lot)}
                />
            )}
        </div>
    );
};

export default LotSpace;
