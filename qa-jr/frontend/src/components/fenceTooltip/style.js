
import styled from 'styled-components';

export const FenceTooltipStyle = styled.div(props => ({
    position: "absolute",
    top: props.positionY - 90,
    left: props.positionX - 35,
    background: "#fff",
    padding: "10px 8px",
    borderRadius: "5px",
    border: "1px solid #00000050"
}))
