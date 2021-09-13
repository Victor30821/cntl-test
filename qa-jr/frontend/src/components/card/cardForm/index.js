import React  from 'react';
import { CardFormStyle } from './style'
export default function CardForm({ children, onSubmit, id, ...options }) {
    return (
        <CardFormStyle
            id={id}
            onSubmit={onSubmit} {...options}>
            {children}
        </CardFormStyle>
    )
}