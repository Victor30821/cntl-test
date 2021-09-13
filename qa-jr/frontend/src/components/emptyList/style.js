import styled from 'styled-components';

const emptyListErrorBox = styled.div(props => ({
    padding: '50px',
    textAlign: 'center',
    ...props.style
}));

export {
    emptyListErrorBox as EmptyListErrorBox
}