
import styled from 'styled-components';

const failStateWrapper = styled.div(props => ({
    height: props.height || "100px",
    display: props.display || "flex",
    justifyContent: props.justifyContent || "center",
    alignItems: props.alignItems || "center",
    flexDirection: props.flexDirection || "column",
    "& div": {
        display: "flex", flexDirection: "row"
    },
    "& div svg": {
        transform: " rotate(45deg)"
    },
    ...props
}))

export {
    failStateWrapper as FailStateWrapper,

}