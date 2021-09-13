
import styled from 'styled-components';
import '../../assets/fonts.css'

const linkDefault = styled.a(props => ({
    fontFamily: props.fontFamily || 'Roboto',
    margin: props.margin || '0px',
    fontSize: props.fontSize || '1rem',
    lineHeight: props.lineHeight || '18px',
    fontWeight: props.fontWeight || 'normal',
    transition: "all 0.2s ease-out",
    color: "#393791",
    "&:hover": props.hover && {
        ...props.hover
    },
    ...props
}))

export {
    linkDefault as LinkDefault,
}