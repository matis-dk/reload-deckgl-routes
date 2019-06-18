import * as turf from '@turf/turf'

const MAPBOX_TOKEN = "pk.eyJ1IjoibG9rYWxib2xpZyIsImEiOiJjamxucHdoN2ExZ2piM3FwYnIwZXgzYWdkIn0.ROZdSFAC3IHNQ1yiJzNHVg";

function createCoordinateSet (from, to) {
    const coordTransform = coord => turf.getCoord(coord).slice().reverse().join(",")
    return `${coordTransform(from)};${coordTransform(to)}`
}

export function getClosestStores (stores, origin, maxTravelDistance) {
    return stores.reduce((acc, i) => {

        const distance = Number(turf.distance(origin, i))
        const name = i.properties.name

        if (distance > maxTravelDistance) {
          return acc
        }
  
        if (!acc[name] || distance < acc[name]["distance"]) {
          acc[name] = {
            distance: distance,
            point: i,
            coordinateSet: createCoordinateSet(origin, i)
          }
        }
  
        return acc
      },{})
}


export function api_mapbox_direction (transport, coordinateSet) {
  return `https://api.mapbox.com/directions/v5/mapbox/${transport}/${coordinateSet}?access_token=${MAPBOX_TOKEN}&geometries=geojson`
} 