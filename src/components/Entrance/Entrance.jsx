import React from "react";
import "./entrance.css";

const Entrance = ({ isActiveEntrance, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`entrance ${
                !isActiveEntrance ? "-inactive" : "-active"
            }`}
        >
            <div>Entrance</div>
            <div>{isActiveEntrance ? "Open" : "Closed"}</div>
        </div>
    );
};

export default Entrance;
