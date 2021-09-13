
import styled from 'styled-components';
import { ButtonDefault } from '../buttonDefault/style'

export const ButtonWithIconStyle = styled(ButtonDefault)(props => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "10px",
    "& > button": {
        margin: "4px",
        cursor: "pointer",
    },
    ...props
}))
