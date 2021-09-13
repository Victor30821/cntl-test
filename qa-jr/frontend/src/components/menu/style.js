
import { IS_PRD } from 'constants/environment';
import styled from 'styled-components';

const divMenuRow = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    alignItems: props.alignItems || "center",
    padding: props.padding || "8px",
    paddingBottom: props.paddingBottom || null,
    background: props.background || IS_PRD ? "linear-gradient(270deg, #3B3992 0%, #1D1B84 100%)" : "#1F1F33",
    justifyContent: props.justifyContent || null,
    maxWidth: props.maxWidth || null,
    ...props,
}))

const divMenuColumn = styled(divMenuRow)(props => ({
    flexDirection: "column",
    marginLeft: "0px",
    padding: props.padding || "0px",
    position: props.position || null,
    height: props.height || null,
    width: props.width || null,
}))
const divMenu = styled(divMenuColumn)(props => ({
    flexDirection: "column",
    height: "100%",
    marginLeft: "0px",
    display: 'inline-flex',
    padding: props.padding || "0px",
    width: props.width || "230px",
    "& a:hover": {
        textDecoration: "none",
    },
}))

const footerMenu = styled.div(props => ({
    background: IS_PRD ? "linear-gradient(270deg, #3B3992 0%, #1D1B84 100%)" : "#1F1F33",
    minHeight: "36px",
}))
const listItemsMenu = styled.div(props => ({

    scrollbarWidth: "0px",
    overflowY: 'auto',
    width: "100%",
    '&::-webkit-scrollbar': {
        width: "0px"
    },
}))

const imageMenuHeader = styled.img(props => ({
    width: '250px',
}))
const profileCircle = styled.div(props => ({
    width: "60px",
    height: "60px",
    borderRadius: "35px",
    backgroundColor: '#ffffff',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))
const profileDefaultText = styled.p(props => ({
    margin: "0px",
    color: '#FFF',
}))
const profileImageText = styled(profileDefaultText)(props => ({
    color: '#000',
    fontSize: '16px',
}))

const profileName = styled(profileDefaultText)(props => ({
    fontWeight: 'bold',
}))

export {
    divMenuRow as DivMenuRow,
    divMenuColumn as DivMenuColumn,
    divMenu as DivMenu,
    imageMenuHeader as ImageMenuHeader,
    profileCircle as ProfileCircle,
    profileImageText as ProfileImageText,
    profileName as ProfileName,
    profileDefaultText as ProfileDefaultText,
    footerMenu as FooterMenu,
    listItemsMenu as ListItemsMenu,
}
