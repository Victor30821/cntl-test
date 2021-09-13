import React from 'react';
import { LinkDefault } from './style';

export default function Link({ href = "", ...options }) {
    return (
        <LinkDefault {...options} rel={"noopener noreferrer"} href={href}>
            {options.children}
        </LinkDefault>
    );
}
