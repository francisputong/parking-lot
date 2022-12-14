import { useEffect, useState } from "react";
import LotSpace from "./components/LotSpace/LotSpace";
import CarsList from "./components/CarsList/CarsList";
import {
    sliceIntoChunks,
    sortByDistance,
    createMap,
    createCars,
    createCarLabel,
    computePayment,
} from "./utils/helpers";
import { TIME_TO_RESET } from "./utils/constants";
import Sidebar from "./components/Sidebar/Sidebar";
import AppTabs from "./components/Tabs/Tabs";
import "./App.css";

function App() {
    const [parkingLotData, setParkingLotData] = useState([]);
    const [mappedPaths, setMappedPaths] = useState({});
    const [parkingLotDimensions, setParkingLotDimensions] = useState({
        rows: 5,
        columns: 5,
    });
    const [manuallySelectedSize, setManuallySelectedSize] = useState(null);

    const [selectedCar, setSelectedCar] = useState(null);
    const [cars, setCars] = useState([]);

    useEffect(() => {
        setSelectedCar(null);

        handleCreateMap(
            parkingLotDimensions.rows,
            parkingLotDimensions.columns
        );
    }, [parkingLotDimensions]);

    const handleCreateMap = (rows, columns) => {
        const map = createMap(rows, columns);
        setParkingLotData(map);

        const carsList = createCars((rows - 2) * (columns - 2) + 4);
        setCars(carsList);
    };

    const handleClickEntrance = (lot) => {
        let parkingLotDataCopy = [...parkingLotData];
        let carsCopy = [...cars];

        if (lot.isActiveEntrance) {
            if (!selectedCar) return;

            const mapping = mappedPaths[lot.id];

            // loop through the mapped path for an entrance and check if empty or not
            for (const key in mapping) {
                const lotIndex = parkingLotDataCopy.findIndex(
                    (data) => data.id === mapping[key]
                );

                const carIndex = carsCopy.findIndex(
                    (data) => data.id === selectedCar
                );

                const parkingSize = parkingLotDataCopy[lotIndex].size;
                const carSize = carsCopy[carIndex].size;

                if (
                    !parkingLotDataCopy[lotIndex].parkedCarId &&
                    carSize <= parkingSize
                ) {
                    parkingLotDataCopy[lotIndex].parkedCarId = selectedCar;
                    carsCopy[carIndex].isParked = true;

                    // Assign park start time based on the grace period of 1 hour
                    carsCopy[carIndex].parkStartTime =
                        carsCopy[carIndex].parkEndTime &&
                        (new Date() - carsCopy[carIndex].parkEndTime) / 1000 <
                            TIME_TO_RESET
                            ? carsCopy[carIndex].parkStartTime
                            : new Date();

                    setCars(carsCopy);
                    setSelectedCar(null);

                    return;
                }
            }

            alert("No available parking slot.");
        } else {
            parkingLotDataCopy = [...parkingLotDataCopy].map((el) =>
                el.id === lot.id ? { ...el, isActiveEntrance: true } : el
            );

            const sortedCoordinates = sortByDistance([...parkingLotData], {
                x: lot.x,
                y: lot.y,
            });

            setMappedPaths({ ...mappedPaths, [lot.id]: sortedCoordinates });
        }

        setParkingLotData(parkingLotDataCopy);
    };

    const handleClickParking = (lot) => {
        let parkingLotDataCopy = [...parkingLotData];
        const lotIndex = parkingLotDataCopy.findIndex(
            (data) => data.id === lot.id
        );

        if (!lot.parkedCarId && manuallySelectedSize) {
            parkingLotDataCopy[lotIndex].size = manuallySelectedSize;
            setParkingLotData(parkingLotDataCopy);

            return;
        } else if (lot.parkedCarId && manuallySelectedSize) {
            alert("Cannot change size of an occupied parking slot.");

            return;
        } else if (!manuallySelectedSize && !lot.parkedCarId) return;

        let carsCopy = [...cars];

        const carIndex = carsCopy.findIndex(
            (data) => data.id === lot.parkedCarId
        );

        carsCopy[carIndex].isParked = false;
        carsCopy[carIndex].parkEndTime = new Date();
        parkingLotDataCopy[lotIndex].parkedCarId = null;

        const { numberOfDays, numberOfHours, cost } = computePayment(
            lot.size,
            carsCopy[carIndex].parkStartTime,
            carsCopy[carIndex].parkEndTime
        );

        carsCopy[carIndex].totalPayment = cost;

        setCars(carsCopy);
        setParkingLotData(parkingLotDataCopy);

        alert(
            `Days: ${numberOfDays}\nHours: ${numberOfHours}\n\nCost: ???${cost}`
        );
    };

    const handleSelectCar = (carId) => {
        setSelectedCar(carId);
        setManuallySelectedSize(null);
    };

    const handleSelectSize = (size) => {
        setManuallySelectedSize(size === manuallySelectedSize ? null : size);
        setSelectedCar(null);
    };

    return (
        <div className='app'>
            <div className='dashboard'>
                <Sidebar
                    parkingLotDimensions={parkingLotDimensions}
                    setParkingLotDimensions={setParkingLotDimensions}
                />
                <div className='d-flex flex-column align-items-center justify-content-center w-100'>
                    <div className='parking-container'>
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <div className='selected-car'>
                                <span>Selected Car</span>
                                <span>
                                    {selectedCar
                                        ? createCarLabel(
                                              cars.find(
                                                  (car) =>
                                                      car.id === selectedCar
                                              )
                                          )
                                        : "-"}
                                </span>
                            </div>
                            <div className='flex-column'>
                                <span>Manually assign parking size</span>
                                <AppTabs
                                    activeKey={manuallySelectedSize}
                                    onSelect={handleSelectSize}
                                    tabsList={[
                                        { key: 1, value: "S" },
                                        { key: 2, value: "M" },
                                        { key: 3, value: "L" },
                                    ]}
                                />
                            </div>
                        </div>
                        {parkingLotData.length &&
                            // Slice parking lot data into chunks to render it as a matrix
                            sliceIntoChunks(
                                parkingLotData,
                                parkingLotDimensions.columns
                            ).map((lotChunk, i) => {
                                return (
                                    <div key={i} className='d-flex'>
                                        {lotChunk.map((lot, j) => {
                                            return (
                                                <LotSpace
                                                    key={lot.id}
                                                    lot={lot}
                                                    cars={cars}
                                                    handleClickEntrance={
                                                        handleClickEntrance
                                                    }
                                                    handleClickParking={
                                                        handleClickParking
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                );
                            })}
                    </div>
                </div>
                {cars.length && (
                    <CarsList
                        handleSelectCar={handleSelectCar}
                        carsList={cars}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
