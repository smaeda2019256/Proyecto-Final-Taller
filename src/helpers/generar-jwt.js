import jwt from "jsonwebtoken";

export const generateJWT = (uid = '', name = '', cart = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name, cart };
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Could not generate TOKEN');
                } else {
                    resolve(token);
                }

            })

    });

}