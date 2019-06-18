import React from 'react'

import Slider, { createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);
const Handle = Slider.Handle;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
};

export default  class SliderEnhanced extends React.Component {
    render () {
        return  <SliderWithTooltip handle={handle} {...this.props}/>
    }
}