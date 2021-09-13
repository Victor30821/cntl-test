import React from 'react';
import { ContainerWrapper, Container } from './style.js'

export default function TableHeader({ children, ...props }) {
    return (
        <ContainerWrapper {...props}>
            <Container {...props.container}>
                {children}
            </Container>
        </ContainerWrapper>
    );
}
