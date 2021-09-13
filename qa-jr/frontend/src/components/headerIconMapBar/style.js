
import styled from 'styled-components';

const iconMapBarDivDefault = styled.div(props => ({
    display: "flex",
    alignItems: "center",
}))

const iconMapBarContainer = styled(iconMapBarDivDefault)(props => ({
    position: 'absolute', 
    alignItems: 'center', 
    display: 'flex', 
    right: props?.active ? 0 : '-495px', 
    marginTop: '15px', 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    transition: 'all 0.4s ease-out'
}))

const iconMapBarDivMain = styled(iconMapBarDivDefault)(props => ({
    justifyContent: "flex-end",
    padding: "15px",
    float: "right",
    backgroundColor: '#fff', 
    borderBottomLeftRadius: '4px', 
    borderTopLeftRadius: '4px',
}))

const iconMapBarDivContent = styled(iconMapBarDivDefault)(props => ({
    display: 'flex'
}))

const iconMapBarDiv = styled(iconMapBarDivDefault)(props => ({
    flexDirection: "row",
    marginLeft: '15px',
    "& > a": {
        cursor: "pointer",
        marginRight: "9px",
    }
}))

const iconMapBarArrowController = styled(iconMapBarDivDefault)(props => ({
    alignItems: 'center',
    display: 'flex',
    width: '36px', 
    height: '36px', 
    background: '#FFFFFF',
    borderLeft: '1px solid #E5E5E5',
    borderTop: '1px solid #E5E5E5',
    borderBottom: '1px solid #E5E5E5',
    boxSizing: 'border-box',
    borderRadius: '4px 0px 0px 4px',
    justifyContent: 'center',
    cursor: 'pointer'
}))

export {
    iconMapBarContainer as IconMapBarContainer,
    iconMapBarDivContent as IconMapBarDivContent,
    iconMapBarDiv as IconMapBarDiv,
    iconMapBarDivMain as IconMapBarDivMain,
    iconMapBarArrowController as IconMapBarArrowController
}