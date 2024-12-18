import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { forwardRef } from 'react';

// Combine Next.js Link props with MUI Link props
type Props = NextLinkProps & MuiLinkProps;

// Create a Link component that forwards refs
const NextMuiLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    const { href, ...other } = props;
    return (
        <NextLink href={href} passHref legacyBehavior>
            <MuiLink ref={ref} {...other} />
        </NextLink>
    );
});

export default NextMuiLink;