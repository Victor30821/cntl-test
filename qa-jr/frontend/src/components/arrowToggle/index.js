import React, { forwardRef } from 'react';
import { Icon } from '../../components'
import {
    LinkMenuHeader,
} from './style.js';

function arrowToggle({ width, height, ...options }, ref) {
    return (
        <LinkMenuHeader style={options.style} ref={ref}>
            <Icon icon={'arrow-down'} width={'12px'} height={'6px'} color='#ccc' {...options} />
        </LinkMenuHeader>
    );
}
const forwardArrowToggle = forwardRef(arrowToggle);
export default forwardArrowToggle;