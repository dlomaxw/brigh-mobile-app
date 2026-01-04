import { styled } from 'baseui';

const Wrapper = styled('div', ({ $theme }) => ({
    backgroundColor: $theme.colors.backgroundPrimary,
    boxShadow: $theme.lighting.shadow400,
    borderRadius: $theme.borders.radius200,
    marginBottom: '20px',
}));

export const Content = styled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: $theme.sizing.scale700,
}));

// Using 'any' for the component type assertion to bypass strict Base Web type definition capability issues
// This ensures the component accepts the $color prop without build errors
export const Icon = styled('div', (props: any) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: props.$color ? props.$color : '#FF0080',
    color: '#ffffff',
})) as any;

export const Info = styled('div', {
    width: 'calc(100% - 68px)',
});

export const Title = styled('h4', ({ $theme }) => ({
    ...$theme.typography.font450,
    color: $theme.colors.contentPrimary,
    marginBottom: $theme.sizing.scale0,
    marginTop: 0,
}));

export const Action = styled('div', ({ $theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `18px 20px 17px`,
    borderTop: `1px dashed ${$theme.borders.border200}`,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderBottomLeftRadius: $theme.borders.radius200,
    borderBottomRightRadius: $theme.borders.radius200,
}));

// Using 'any' to bypass strict prop checks
export const Button = styled('button', (props: any) => ({
    color: props.$color ? props.$color : '#FF0080',
    border: 0,
    boxShadow: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    ...props.$theme.typography.font200,
    padding: 0,
    transition: 'all 0.3s ease',
    ':hover': {
        opacity: '0.7',
    },
    ':focus': {
        outline: 'none',
    },
})) as any;

export const Label = styled('span', ({ $theme }) => ({
    color: $theme.colors.contentSecondary,
    ...$theme.typography.font200,
}));

export default Wrapper;
