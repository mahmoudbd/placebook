import React, { useState, useContext } from 'react';
import './DropDownMenu.css';
import Switch from '../FormElements/SwitchView';
import { AuthContext } from '../../context/auth-context';

import onClickOutside from 'react-onclickoutside';

function Dropdown({ title, userId, exit, friendCount }) {
    const auth = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    Dropdown.handleClickOutside = () => setOpen(false);

    return (
        <React.Fragment>
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => setOpen(!open)}>
                    {title}
                </div>
                <div className="dd-list-container">
                    {open && (
                        <ul className="dd-list" onClick={exit}>
                            <Switch
                                to={`/${userId}/places`}
                                onClick={() => setOpen(false)}
                                white
                            >
                                 PLACES
                            </Switch>
                            <Switch
                                to={`/${userId}/bucketlist`}
                                onClick={() => setOpen(false)}
                                white
                            >
                                 BUCKET LIST
                            </Switch>
                            <Switch
                                to={`/${userId}/profile`}
                                onClick={() => setOpen(false)}
                                white
                            >
                                PROFILE
                            </Switch>
                            <Switch
                                to={`/${userId}/FriendsList`}
                                onClick={() => setOpen(false)}
                                white
                            >
                                {friendCount === 1 ? 'FRIEND' : 'FRIENDS'}
                            </Switch>
                            <Switch onClick={auth.logout} white>
                                LOGOUT
                            </Switch>
                        </ul>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);
