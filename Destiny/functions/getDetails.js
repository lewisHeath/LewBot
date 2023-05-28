const fs = require('fs');
const path = require('path');

/*
This function returns the data from the csv file based on the username
*/
function getDetails(username) {
    // based on the username, return the csv row from ../Authorization.csv
    let authCode = '';
    let refreshToken = '';
    let accessToken = '';
    let membershipId = '';
    
    const csvFile = fs.readFileSync(path.join(__dirname, '../Authorization.csv'), 'utf8');
    const lines = csvFile.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(',');
        if (values[0] === username) {
            authCode = values[1];
            refreshToken = values[2];
            accessToken = values[3];
            membershipId = values[4];
            break;
        }
    }

    if(authCode === '' || refreshToken === '' || accessToken === '' || membershipId === '') {
        throw new Error('There was an error getting the details from the csv file!');
    }

    return { authCode, refreshToken, accessToken, membershipId };
}

module.exports = getDetails;