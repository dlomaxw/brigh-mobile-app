import { styled } from 'baseui';

const ContainerArea = styled('div', {
    width: '100%',
    maxWidth: '1280px', /* Increased max-width for better use of space */
    paddingLeft: '15px',
    paddingRight: '15px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,

    '@media screen and (max-width: 1135px)': {
        maxWidth: '920px',
    },
});

export default ContainerArea;
