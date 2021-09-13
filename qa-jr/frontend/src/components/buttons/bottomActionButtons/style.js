
import styled from 'styled-components';

const actionButtonsDiv = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "10px",
    marginBottom: "80px",
    "& > button": {
        margin: "4px",
    },
    ...props
}))

export {
    actionButtonsDiv as ActionButtonsDiv
}
