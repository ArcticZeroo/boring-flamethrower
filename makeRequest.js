const request = require('request');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36',
    'Content-Type': 'application/json',
    'accept': '*/*'
};

const COLLECTION_ID = '5a614ecb0d9297aa9d8aa763';

let crumb = null;

module.exports = function checkPassword (password) {
    console.log(crumb);

    return new Promise((resolve, reject) => {
        request({
            uri: `https://null:null@www.boringcompany.com/api/auth/visitor/collection?crumb=${crumb}`,
            method: 'post',
            headers: HEADERS,
            json: {
                collectionId: COLLECTION_ID,
                password
            }
        }, (req, res, body) => {
            console.log(res.statusCode);
            console.log(body);

            if (res.statusCode.toString()[0] !== '2' || body.error) {
                if (body.crumbFail) {
                    if (!body.crumb) {
                        return reject('Crumb was rejected but no new crumb was provided');
                    }

                    crumb = body.crumb;

                    console.log(crumb);
                    //return checkPassword(password);
                    return reject('Invalid crumb.');
                }

                if (body.errors && body.errors.password && body.errors.password.toLowerCase().includes('invalid')) {
                    return reject('Invalid password.');
                }

                return reject('An unknown error has occurred: ' + body);
            }

            resolve(password);
        });
    });
};