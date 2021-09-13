
import styled from 'styled-components';
import { darken } from 'polished';

const clickableMenuItem = styled.div`
    display: flex;
    background-color: ${props => props.backgroundColor || "transparent"};
    justify-content:  ${props => props.justifyContent || null};
    flex-direction: ${props => props.flexDirection || "row"};
    align-items: center;
    width: 100%;
    position: ${props => props.position || "relative"};
    padding-top: ${props => props.paddingTop || "8px"};
    padding-bottom: ${props => props.paddingBottom || "8px"};
    cursor: pointer;
    &:hover {
        background-color: ${props => darken(0.1, props.disableHover || props.backgroundColor || "#1D1B84")};
        color: #fff
    }
    ${props => props}
`;

const linkItemMenu = styled.div(props => ({
    fontFamily: props.fontFamily || "Roboto",
    color: `${props.color} !important` || "#000",
    margin: props.margin || "0px",
    fontSize: props.fontSize || "12px",
    lineHeight: props.lineHeight || "18px",
    fontWeight: props.fontWeight || "normal",
    cursor: props.cursor || "normal",
    letterSpacing: props.letterSpacing,
    "& a": props.withLink && {
        color: "#1A237A",
        cursor: "pointer",
        ...props.linkProps
    }
}));

const divArrowToggle = styled.div(props => ({
    transform: props.isActive ? "rotate(180deg)" : "rotate(0deg)",
    transition: "all 0.5s ease 0s",
    position: 'absolute',
    right: '24px',
    top: props.top ? props.top : '-20%'
}))
const divMenuSubitens = styled.div(props => ({
    padding: "8px",
    paddingLeft: props.paddingLeft || "72px",
    position: 'relative',
    flexDirection: 'column',
    display: "flex",
    flex: "1",
    width: "100%",
    "&:hover": {
        backgroundColor: "#101b40",
    },
    "&:hover a": {
        color: "#fff !important"
    },
    ...props
}))
const divCircle = styled.div(props => ({
    position: 'absolute',
    right: "11%",
}))

const listSubitem = styled.div(props => ({
    display: 'flex',
    backgroundColor: props.backgroundColor || null,
    flexDirection: 'column',
    width: "100%"
}))
const listSubitemDepth = styled(listSubitem)(props => ({
    display: props.display || 'flex',
    backgroundColor: props.backgroundColor || null,
    flexDirection: 'row'
}))


const textMenuItem = styled.p(props => ({
    fontSize: '14px',
    color: '#fff',
    margin: '0px',
    fontWeight: 'bold'
}))
const circle = styled.div(props => ({
    width: "8px",
    height: "8px",
    borderRadius: "35px",
    backgroundColor: '#24B3A4',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))


export {
    textMenuItem as TextMenuItem,
    clickableMenuItem as ClickableMenuItem,
    divArrowToggle as DivArrowToggle,
    circle as Circle,
    divCircle as DivCircle,
    divMenuSubitens as DivMenuSubitens,
    listSubitem as ListSubitem,
    listSubitemDepth as ListSubitemDepth,
    linkItemMenu as LinkItemMenu
}
