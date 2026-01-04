import { styled } from 'baseui';
import { NavLink } from 'react-router-dom';

const Menu = styled('ul', {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
});

const MenuItem = styled('li', {
    listStyle: 'none',
    marginRight: '25px',
    ':last-child': {
        marginRight: 0,
    },
});

const MenuLink = styled(NavLink, ({ $theme }) => ({
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    color: $theme.colors.contentSecondary,
    transition: 'color 0.2s ease',
    ':hover': {
        color: $theme.colors.contentPrimary,
    },
    '&.active': {
        color: $theme.colors.primary,
    },
}));

const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'Leads', path: '/leads' },
    { label: 'Settings', path: '/settings' },
];

export default function MainMenu() {
    return (
        <Menu>
            {menuItems.map((item) => (
                <MenuItem key={item.path}>
                    <MenuLink to={item.path}>
                        {item.label}
                    </MenuLink>
                </MenuItem>
            ))}
        </Menu>
    );
}
