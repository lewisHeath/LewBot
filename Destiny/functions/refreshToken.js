const { bungieAPIKEY, bungieClientID } = require('../../config.json');

/*
This function uses the auth code from a user and their refresh token and returns a new access token
*/

async function refreshAccessToken (refreshToken, authCode) {
    // Using the refresh token, get a new access token
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&client_id=${bungieClientID}&client_secret=${bungieAPIKEY}&refresh_token=${refreshToken}`
    };

    // Get the new access token and overwrite the old one in the csv file
    const response = await fetch('https://www.bungie.net/platform/app/oauth/token/', requestOptions);
    const data = await response.json();
    const accessToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    
    // return the new access token and refresh token
    return accessToken;
}

module.exports = refreshAccessToken;