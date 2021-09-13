
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const containerWrapper = styled.div(props => ({
    height: 'inherit',
    display: 'flex',
    flexDirection: 'row',
}))
const scrollableContainer = styled.div(props => ({
    flex: "1",
    backgroundColor: "#F8F8FB",
    overflowY: "auto"
}))
const buttonRow = styled.div(props => ({
    display: "flex", flexDirection: "row",
}))

const columnHeaderWrapper = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    paddingLeft: '16px',
    paddingRight: '16px',
    position: 'relative',
    "& div": {
        // padding: " 0 16px 0 0",
        right: "10px",
        justifyContent: "center",
        display: "flex", flexDirection: "column",
    },
    ...props
}))

const ButtonMenu = styled(Button).attrs({
    "aria-controls":"simple-menu",
    "aria-haspopup":"true"
})`;
    background: #FFFFFF !important;
    border: 1px solid #E5E5E5 !important;
    box-sizing: border-box !important;
    border-radius: 4px !important;
    margin-right: 10px !important;
    height: 32px !important;
    min-width: 40px !important;
    margin-left: 5px !important;
`;
const BoxTitleMenu = styled.div`
    padding: 10px !important;
`;

export {
    containerWrapper as ContainerWrapper,
    scrollableContainer as ScrollableContainer,
    buttonRow as ButtonRow,
    columnHeaderWrapper as ColumnHeaderWrapper,
    ButtonMenu,
    BoxTitleMenu,
}
