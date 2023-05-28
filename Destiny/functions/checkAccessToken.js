const refreshToken = require('./refreshToken.js');
const getDetails = require('../getDetails.js');
const setDetails = require('../setDetails.js');

/*
This function takes a username and updates the access token from the csv file
*/
async function checkAccessToken (username) {
    // Based on the username, get the auth code from Authorization.csv and the refresh token from Tokens.csv
    const { authCode, refreshToken, accessToken, membershipId } = getDetails(username);
    // check for error
    if(authCode == '' || refreshToken == '' || accessToken == '' || membershipId == '') {
        return false;
    }
    // refresh the access token
    const newAccessToken = await refreshToken(refreshToken, authCode);
    // write the new access token to the file
    setDetails(username, authCode, refreshToken, newAccessToken, membershipId);
    return true;
}

module.exports = checkAccessToken;