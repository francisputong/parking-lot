import { LOT_TYPE, CAR_SIZE, RATES, FLAT_RATE_HOURS } from "./constants";
import { v4 as uuidv4 } from "uuid";

/**
 * Create an array of chunked arrays based on chunk size
 * @param {array} arr
 * @param {number} chunkSize
 * @returns {array}
 */
export const sliceIntoChunks = (arr, chunkSize) => {
    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);

        chunks.push(chunk);
    }

    return chunks;
};

/**
 * Sort parking distance
 * @param {array} parkLot
 * @param {object} point
 * @returns {array}
 */
export const sortByDistance = (parkLot, point) => {
    const filteredCoordinates = parkLot.filter(
        (lot) => lot.type === LOT_TYPE.PARKING
    );

    const sortedCoordinates = filteredCoordinates
        .sort((a, b) => distance(a, point) - distance(b, point))
        .map((lot) => lot.id);
    return sortedCoordinates;
};

/**
 * Create map of parking lot based on number of rows and columns
 * @param {number} rowCount
 * @param {number} columnCount
 * @returns {array}
 */
export const createMap = (rowCount, columnCount) => {
    const map = [];

    for (let x = 0; x < rowCount; x++) {
        for (let y = 0; y < columnCount; y++) {
            map.push({
                x,
                y,
                id: uuidv4(),
                isActiveEntrance: false,
                parkedCarId: null,
                size: getRandomInt(1, 3),
                type:
                    x === 0 ||
                    y === 0 ||
                    (x > 0 && y === columnCount - 1) ||
                    x === rowCount - 1
                        ? LOT_TYPE.ENTRANCE
                        : LOT_TYPE.PARKING,
            });
        }
    }

    return map;
};

/**
 * Create list of cars
 * @param {number} numberOfCars
 * @returns {array} array of cars
 */
export const createCars = (numberOfCars) => {
    return [...Array(numberOfCars).keys()].map(() => ({
        id: uuidv4(),
        parkStartTime: null,
        parkEndTime: null,
        isParked: false,
        totalPayment: 0,
        size: getRandomInt(1, 3),
    }));
};

/**
 * Create list of cars
 * @param {object} car
 * @returns {string}
 */
export const createCarLabel = (car) => {
    return `${CAR_SIZE[car.size][0]} Car ${car.id.substring(0, 5)}`;
};

/**
 * Compute car payment
 * @param {number} lotSize
 * @param {date} parkStartTime
 * @param {date} parkEndTime
 * @returns {object}
 */
export const computePayment = (lotSize, parkStartTime, parkEndTime) => {
    const consumedTimeInHours = Math.ceil(
        (parkEndTime - parkStartTime) / 1000 / 60 / 60 // convert date difference in hours
    );

    let cost = 0,
        numberOfDays = 0,
        numberOfHours = 0;

    if (consumedTimeInHours <= FLAT_RATE_HOURS) {
        // Flat rate cost
        cost = 40;
        numberOfHours = consumedTimeInHours;
    } else if (
        consumedTimeInHours > FLAT_RATE_HOURS &&
        consumedTimeInHours < 24
    ) {
        // More than 3 hours but less than 24 hours
        numberOfHours = consumedTimeInHours;

        cost = (numberOfHours - FLAT_RATE_HOURS) * RATES[lotSize] + 40;
    } else if (consumedTimeInHours > 24) {
        // More than 24 hours
        numberOfDays = consumedTimeInHours / 24;
        numberOfHours = parseFloat(
            ((numberOfDays - Math.floor(numberOfDays)) * 24).toFixed(2)
        );

        cost =
            Math.floor(numberOfDays) * 5000 +
            Math.ceil(numberOfHours) * RATES[lotSize];
    }

    return {
        cost,
        numberOfDays: Math.floor(numberOfDays),
        numberOfHours: Math.ceil(numberOfHours),
    };
};

/**
 * Returns distance of point x from point y
 * @param {object} coor1
 * @param {object} coor2
 * @returns {number}
 */
const distance = (coor1, coor2) => {
    const x = coor2.x - coor1.x;
    const y = coor2.y - coor1.y;

    return Math.sqrt(x * x + y * y);
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};
