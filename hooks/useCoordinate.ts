import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;



const lat = parseFloat(centroid.latitude);
const lng = parseFloat(centroid.longitude);
const northeastLat = parseFloat(boundingBox.northEast.latitude);
const southwestLat = parseFloat(boundingBox.southWest.latitude);
const latDelta = northeastLat - southwestLat;
const lngDelta = latDelta * ASPECT_RATIO;