/* global window */
import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import DeckGL, { ScatterplotLayer, TripsLayer } from "deck.gl";
import axios from "axios";

import Navigation from "./components/navigation";

import featurePointStore from "./stores/stores.json";
import featurePointPropertiesAll from "./stores/dump.json";
import featurePointPropertiesLokalbolig from "./stores/properties.json";

import { getClosestStores, api_mapbox_direction } from "./utilities/helpers";

export function getStoreColor(store) {
  switch (store) {
    case "fakta":
      return [255, 111, 105];
    case "netto":
      return [255, 140, 0];
    case "rema":
      return [123, 192, 67];
    case "irma":
      return [99, 172, 229];
    default:
      return [200, 200, 200];
  }
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibG9rYWxib2xpZyIsImEiOiJjamU5eHF4bWYwdWtvMndtOXpkdnQ5M2ViIn0.Am3iwWhfscH-Uy9XLartxA";
const INITIAL_VIEW_STATE = {
  latitude: 56.08167,
  longitude: 11.535632,
  zoom: 7,
  maxZoom: 16,
  minZoom: 7,
  bearing: 0
};

export const TRANSPORT = {
  driving: "driving",
  cycling: "cycling",
  walking: "walking"
};

class App extends Component {
  _animationFrame = null;
  animateStarted = false;
  animationSpeed = 80; // unit time per second
  loopLength = 400; // unit corresponds to the timestamp in source data
  loopTime = this.loopLength / this.animationSpeed; // seconds to run through the whole loop

  state = {
    transport: TRANSPORT.cycling,
    overview: {},
    stores: {
      fakta: false,
      netto: false,
      rema: false,
      irma: false
    },
    properties: true,
    trip: [],
    maxTravelDistance: 5,
    pathWithScale: 5,
    time: 0,
    currentTime: 0,
    startTime: 0,
    widthMinPixels: 5,
    opacityBlending: 0.3
  };

  _renderLayers() {
    function getPositionFromFeaturePoint(fp) {
      const [lat, lon] = fp.geometry.coordinates;
      return [Number(lon), Number(lat)];
    }

    const scatterplotOptions = {
      pickable: true,
      radiusScale: 10,
      radiusMinPixels: 3,
      radiusMaxPixels: 12,
      pickable: true,
      getRadius: 8
    };

    const pathLayer = new TripsLayer({
      id: "path-layer",
      data: this.state.overview.routes ? this.state.overview.routes : [[]],
      getPath: d => (d.trip ? d.trip.routes[0]["geometry"]["coordinates"] : d),
      getColor: d => getStoreColor(d.point ? d.point.properties.name : ""),
      opacity: 0.3,
      widthMinPixels: this.state.widthMinPixels,
      rounded: true,
      currentTime: this.state.time,
      trailLength: 220
    });

    let storesdata = featurePointStore.filter(i => {
      const { stores, overview } = this.state;
      const storeName = i.properties.name;
      if (stores[storeName]) {
        return true;
      }

      if (
        overview.closestStoresToOrigin &&
        overview.closestStoresToOrigin[storeName] &&
        overview.closestStoresToOrigin[storeName].point.properties.id ===
          i.properties.id
      ) {
        return true;
      }

      return false;
    });

    const scatterplotLayerStores = new ScatterplotLayer({
      id: "scatterplot-layer-stores",
      data: storesdata,
      ...scatterplotOptions,
      getRadius: 5,
      getPosition: d => getPositionFromFeaturePoint(d),
      getColor: d => getStoreColor(d.properties.name),
      opacity: 0.3
    });

    const scatterplotLayerProperties = new ScatterplotLayer({
      id: "scatterplot-layer-properties",
      data: this.state.properties
        ? featurePointPropertiesLokalbolig
        : featurePointPropertiesAll,
      ...scatterplotOptions,
      getColor: [200, 200, 200],
      getPosition: d => getPositionFromFeaturePoint(d),
      onClick: e => this.handlePropertyClick(e),
      opacity: this.state.opacityBlending
    });

    return [scatterplotLayerProperties, scatterplotLayerStores, pathLayer];
  }

  handlePropertyClick(e) {
    if (!e) {
      return;
    }
    const { maxTravelDistance, transport } = this.state;
    const selectedPoint = e.object;

    const closestStoresToOrigin = getClosestStores(
      featurePointStore,
      selectedPoint,
      maxTravelDistance
    );
    const fetchDirectionsToStore = Object.values(closestStoresToOrigin).map(
      store => {
        return axios
          .get(api_mapbox_direction(transport, store.coordinateSet))
          .then(res => {
            store.trip = res.data;
            return store;
          });
      }
    );

    Promise.all(fetchDirectionsToStore)
      .then(res => {
        return res
          .filter(res => res.trip.code === "Ok")
          .map(i => {
            const tripCoordinates = i.trip.routes[0]["geometry"]["coordinates"];
            const data = tripCoordinates.map((coords, index) =>
              coords.concat((300 / tripCoordinates.length) * index)
            );
            i.trip.routes[0]["geometry"]["coordinates"] = data;
            return i;
          });
      })
      .then(res => {
        const overview = {
          selectedPoint: selectedPoint,
          closestStoresToOrigin: closestStoresToOrigin,
          routes: res,
          event: e
        };
        // We need startTime to start from 0 in _animate
        // console.log(overview)
        this.setState({ overview, startTime: Date.now() / 1000 });
        this.handleStartAnimation();
      });
  }

  _animate() {
    const timestamp = Date.now() / 1000;
    const timestampBeginning = timestamp - this.state.startTime;
    const loopPercentageCompleted =
      (timestampBeginning % this.loopTime) / this.loopTime;

    this.setState({
      time: loopPercentageCompleted * this.loopLength
    });

    if (this.animateStarted) {
      this.handleStartAnimation();
    }
  }

  handleStartAnimation() {
    this.animateStarted = true;
    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this)
    );
  }

  handleStopAnimation() {
    this.animateStarted = false;
    cancelAnimationFrame(this._animationFrame);
    this.setState({});
  }

  handleToggleAnimate() {
    this.animateStarted
      ? this.handleStopAnimation()
      : this.handleStartAnimation();
  }

  render() {
    const { stores, overview, transport } = this.state;
    return (
      <div>
        <Navigation
          appState={{ overview, stores, transport }}
          overview={overview}
          stores={stores}
          transport={transport}
          animateStarted={this.animateStarted}
          onToggleTransport={e => {
            this.setState({ transport: e });
            this.handlePropertyClick(overview.event);
          }}
          onToggleStore={e =>
            this.setState({ stores: { ...stores, [e]: !stores[e] } })
          }
          onToggleProperties={e =>
            this.setState({ properties: !this.props.properties })
          }
          onToggleAnimate={() => this.handleToggleAnimate()}
          handleUpdatePathScale={e => this.setState({ widthMinPixels: e })}
          handleUpdateTravelDistance={e =>
            this.setState({ maxTravelDistance: e })
          }
          handleUpdateAnimationTime={e => {
            this.loopLength = e;
          }}
          handleChangeDataset={e =>
            this.setState({ properties: !this.state.properties })
          }
          handleUpdateOpacityBlending={e =>
            this.setState({ opacityBlending: e })
          }
        />
        <DeckGL
          layers={this._renderLayers()}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={this.props.viewState}
          controller={true}
          ref={deck => {
            this.deckGL = deck;
          }}
        >
          <ReactMapGL
            reuseMaps
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle={"mapbox://styles/mapbox/dark-v10"}
          />
        </DeckGL>
      </div>
    );
  }
}

export default App;
