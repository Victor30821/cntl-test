
import styled from 'styled-components';

const iconBarDivDefault = styled.div(props => ({
    display: "flex",
    alignItems: "center",
}))

const iconBarDivMain = styled(iconBarDivDefault)(props => ({
    justifyContent: "flex-end",
    padding: "15px",
    float: "right",
}))
const iconBarDiv = styled(iconBarDivDefault)(props => ({
    flexDirection: "row",
    marginLeft: "25px",
    "& > a": {
        cursor: "pointer",
        marginRight: "9px",
    }
}))

export {
    iconBarDiv as IconBarDiv,
    iconBarDivMain as IconBarDivMain
}