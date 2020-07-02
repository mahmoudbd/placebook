import React from 'react';
import AccountPlaces from './AccountPlaces';
import AccountSettings from './AccountSettings';

import './UserProfile.css';

export default function UserProfile() {
    return (
        <React.Fragment>
            <div className="ShowUserProfile">
                <AccountPlaces />
                <AccountSettings />
            </div>
        </React.Fragment>
    );
}
