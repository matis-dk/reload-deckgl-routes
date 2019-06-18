import React from 'react'
import Checkbox from 'rc-checkbox';
import Switch from 'rc-switch';

import styled from '@emotion/styled'
import Slider from './slider'


import Cogwheel from '../../img/cogwheel-outline.js'
import PlayPause from '../../img/play-pause.js'

import { TRANSPORT } from '../app'

import { H2, H3, Span } from './headers'

import { getStoreColor } from '../app'

const primaryDark = '#1D1D23'
const secondaryDark = '#2A2B30'
const purple = '#5c5edc'
const purpleLight = '#BDBEF1'

const paddingContainer = "20px 20px"

const Div = styled.div({})

const MOBILE = `@media (max-width: 600px)`

const cogwheelStyled = {
    width: "45px",
    height: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.3s"
}

const B = {
    border: "1px solid red"
}

const checkboxStyle = {
    zIndex: 5, 
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    backgroundColor: 'white',
    right: 0
}

const Container = styled.div(({active}) => {
        return {
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: primaryDark,
            height: active ? '100vh' : "86px",
            width: "400px",
            zIndex: 3,
            transition: "0.2s",
            overflow: "hidden",
            boxShadow: '-12px 0px 100px 0px rgba(92,94,220,0.08)',
            [MOBILE]: {
                width: "100vw"
            }
        }
    }
)

const TopbarContainer = styled.div({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "50px",
    padding: paddingContainer,
    borderBottom: `1px solid ${secondaryDark}`
})


const PropertyContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: paddingContainer,
    borderBottom: `1px solid ${secondaryDark}`
})

const TripsContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: paddingContainer,
    borderBottom: `1px solid ${secondaryDark}`
})

const TripsItems = styled(Span)((props) => {
    return {
        ...props,
        flex: 1
    }
})

const OptionContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: paddingContainer,
    borderBottom: `1px solid ${secondaryDark}`
})

const OptionItems = styled(Span)(() => {
    return {
        marginBottom: "10px"
    }
})

const TransportItems = styled.div(() => {
    return {
        width: "100%",
        display: "flex",
        padding: "5px 0px",
    }
})

const BottomContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    padding: paddingContainer,
    borderBottom: `1px solid ${secondaryDark}`
})

const BottomItems = styled.div(({active}) => {
    return {
        cursor: 'pointer',
        display: "flex",
        justifyContent: "center",
        padding: "5px",
        width: "60px",
        border: `1px solid ${secondaryDark}`,
        backgroundColor: active ? `rgb(${getStoreColor(active)})` : "inherit",
    }
})

const GuideContainer = styled.div({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "500px",
    padding: paddingContainer
})
 

class Topbar extends React.Component {
    render () {
        const { active, onToggleMenuActive } = this.props
        return (
            <TopbarContainer>
                <H2>MENU</H2>
                <Div 
                    css={{...cogwheelStyled, transform: `rotateZ(${active ? 320 : 0}deg)`}} 
                    onClick={onToggleMenuActive}>
                    <Cogwheel fill={active ? purple : purpleLight} />
                </Div>
            </TopbarContainer>
        )
    }
}

class Property extends React.Component {
    render () {
        const { selectedPoint } = this.props.overview
        if (!selectedPoint) { return null }

        return (
            <PropertyContainer>
                <H3>Property</H3>
                <Div css={{display: "flex", justifyContent: "space-between", marginTop: "8px"}}>
                    <Span>
                        Bolig ID:
                    </Span>
                    <Span>
                        {selectedPoint.properties.id}
                    </Span>
                </Div>
                <Div css={{display: "flex", justifyContent: "space-between", marginTop: "8px"}}>
                    <Span>
                        Bolig coordinate:
                    </Span>
                    <Span>
                        {selectedPoint.geometry.coordinates.join(" ")}
                    </Span>
                </Div>
            </PropertyContainer>
        )
    }
}

class Trips extends React.Component {
    render () {
        const { closestStoresToOrigin } = this.props.overview

        if (!closestStoresToOrigin || Object.entries(closestStoresToOrigin).length === 0) {
            return null
        }

        return (
            <TripsContainer>
                <H3>Trips</H3>
                <Div css={{ display: 'flex',  marginTop: "8px"}}>
                    {
                        ["Stores", "Distance (meter)", "Duration(min)"]
                            .map(i => <TripsItems 
                                key={i}
                                fontWeight={500}>
                                {i}
                                </TripsItems>)
                    }
                </Div>
                <Div >
                    <Div>
                        {
                            Object.entries(closestStoresToOrigin)
                                .map(trip => {
                                    const [storeName, storeRoute] = trip
                                    const { distance, duration, weight_name } = storeRoute.trip.routes[0]
                                    return (
                                        <Div key={storeName} css={{display: 'flex', marginTop: "8px"}}>
                                            <TripsItems>{ storeName }</TripsItems>
                                            <TripsItems>{ distance.toFixed(0) }</TripsItems>
                                            <TripsItems>{ (duration / 60).toFixed(2) }</TripsItems>
                                        </Div>
                                    )
                                })
                        }
                    </Div>
                </Div>
            </TripsContainer>
        )
    }
}

class Options extends React.Component {
    render () {
        const { onToggleAnimate, animateStarted, handleUpdatePathScale, handleUpdateTravelDistance, handleUpdateAnimationTime, handleChangeDataset, handleUpdateOpacityBlending } = this.props
        return (
            <OptionContainer>
                <H3>Options</H3>
                <Div css={{display: "flex", padding: "10px 0px" }}>
                    <Div css={{display: 'flex', flexDirection: "column"}}>
                        <Span css={{ marginBottom: "5px" }}>Play / Pause</Span>
                        <Switch onClick={onToggleAnimate} defaultChecked />
                    </Div>
                    <Div css={{display: 'flex', flexDirection: "column", marginLeft: "20px"}}>
                        <Span css={{ marginBottom: "5px" }}>Switch dataset</Span>
                        <Switch onClick={handleChangeDataset} defaultChecked />
                    </Div>
                </Div>
                <Div css={{display: "flex", flexDirection: "column"}}>
                    <OptionItems>
                        <Span>Pathwidth</Span>
                        <Slider min={1} max={10} defaultValue={5} onChange={(e) => handleUpdatePathScale(e)} />
                    </OptionItems>
                    <OptionItems>
                        <Span>Max travel distance</Span>
                        <Slider min={0} max={20} defaultValue={3} onChange={(e) => handleUpdateTravelDistance(e)} />
                    </OptionItems>
                    <OptionItems>
                        <Span>Animation time</Span>
                        <Slider min={100} max={1000} defaultValue={400} onChange={(e) => handleUpdateAnimationTime(e)} />
                    </OptionItems>
                    <OptionItems>
                        <Span>Opacity blending</Span>
                        <Slider min={1} max={100} defaultValue={30} onChange={(e) => handleUpdateOpacityBlending(e/100)} />
                    </OptionItems>
                </Div>
            </OptionContainer>
        )
    }
}

class Transportbar extends React.Component {
    render () {
        const { transport, onToggleTransport } = this.props
        return (
            <BottomContainer>
                <H3>Select transport</H3>
                <Div css={{display: "flex" }}>
                    { Object.entries(TRANSPORT).map((i) => {
                        return <TransportItems key={i[0]}>
                        <Checkbox 
                            checked={transport === i[0]} 
                            onChange={() => onToggleTransport(i[0])} 
                        />
                        <Div css={{marginLeft: "10px", display: 'flex', alignItems: 'center'}}>
                        <Span>{i[0]}</Span>
                        </Div>
                    </TransportItems>
                    }) }
                </Div>
            </BottomContainer>
        )
    }
}

class Bottombar extends React.Component {
    render () {
        const { stores, onToggleStore } = this.props
        return (
            <BottomContainer>
                <H3>Show stores</H3>
                <Div css={{display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    { Object.entries(stores).map((i) => <BottomItems 
                        onClick={() => onToggleStore(i[0])}
                        key={i[0]} 
                        active={i[1] && i[0]}>
                        <Span css={{fontWeight: i[1] ? 900 : 'inherit'}}>{i[0]}</Span>
                    </BottomItems>) }
                </Div>
            </BottomContainer>
        )
    }
}

class Guide extends React.Component {
    render () {
        return (
            <GuideContainer >
                <H3>Please select a property on the map</H3>
            </GuideContainer>
        )
    }
}

class MenuSlider extends React.Component {
    state = {
        menuActive: true
    }

    shouldComponentUpdate(nextProps, nextState) {
        const prevProps = this.props

        if (this.state.menuActive !== nextState.menuActive) {
            return true
        }

        const prevId = prevProps.overview.event && prevProps.overview.event.index
        const nextId = nextProps.overview.event && nextProps.overview.event.index

        if ( prevProps.animateStarted !== nextProps.animateStarted ||
            prevProps.transport !== nextProps.transport ||
            prevId !== nextId ||
            JSON.stringify(prevProps.stores) !== JSON.stringify(nextProps.stores)) {
            return true
        }
        return false
    }

    toggleMenuActive() {
        this.setState({menuActive: !this.state.menuActive})
    }

    render () {
        const { menuActive } = this.state
        const { onToggleStore, onToggleTransport, onToggleAnimate, animateStarted, handleUpdatePathScale, handleUpdateTravelDistance, handleUpdateAnimationTime, handleChangeDataset, handleUpdateOpacityBlending, appState } = this.props
        const { stores, overview, transport } = appState
        const ready = Boolean(Object.keys(overview).length)
        return (
            <Container active={menuActive}>
                <Topbar active={menuActive} onToggleMenuActive={() => this.toggleMenuActive()} />
                <Bottombar stores={stores} onToggleStore={onToggleStore} />
                {
                    ready && <Property overview={overview} />
                }
                {
                    ready && <Trips overview={overview} />
                }
                {
                    ready && <Options 
                        onToggleAnimate={onToggleAnimate} 
                        animateStarted={animateStarted} 
                        handleUpdatePathScale={handleUpdatePathScale}
                        handleUpdateTravelDistance={handleUpdateTravelDistance}
                        handleUpdateAnimationTime={handleUpdateAnimationTime}
                        handleChangeDataset={handleChangeDataset}
                        handleUpdateOpacityBlending={handleUpdateOpacityBlending}
                        />
                }
                {
                    ready && <Transportbar transport={transport} onToggleTransport={onToggleTransport} />
                }
                {
                    !ready && <Guide />
                }
            </Container>
        )
    }
}

export default MenuSlider