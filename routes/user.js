const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UsersModel = require('../models/UsersModel.js');

router.post(
    '/add',
    (req, res) => {

        const formData = {
            "userName": req.body.userName,
            "password": req.body.password,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phoneNumber": req.body.phoneNumber,
            "address":req.body.address
        }

        // (2) Create instance of UsersModel
        const newUsersModel = new UsersModel(formData);

        // (3) Check if email exists
        UsersModel
        .findOne(
            { email: formData.email}
        )
        .then(
            (dbDocument) => {
                if(dbDocument) {
                    res.send("Sorry. An account with that email already exists");
                }
                else {
                    const theFiles = Object.values(req.files);
                    if( theFiles.length > 0 ) {
                        
                       await cloudinary.uploader.upload(
                            theFiles[0].path,
                            (cloudinaryErr, cloudinaryResult) => {
                                if(cloudinaryErr) {
                                    console.log(cloudinaryErr)
                                }
                                else {
                                    newUsersModel.avatar = cloudinaryResult.url
                                }
                            }
                        )
                    }
                    bcryptjs.genSalt(
                        (err, theSalt) => {
                            bcryptjs.hash(
                                formData.password,
                                theSalt,
                                (err, hashedPassword) => {
                                    newUsersModel.password = hashedPassword;
                                    newUsersModel
                                    .save()
                                    .then( 
                                        (dbDocument) => {
                                            res.send(dbDocument)
                                        }
                                    )
                                    .catch( 
                                        (error) => {
                                            res.send(error)
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            }
        )
        .catch(
            (error) => {
                console.log('error', error);
                res.send('error')
            }
        )
    }
);

router.post(
    '/update-user',
    (req, res) => {
        UserModel
        .findOneAndUpdate(
            { 'firstName': 'John'},
            {
                $set: {
                    'firstName':'Jonathan'
                }
            }
        )
        .then(
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        .catch(
            (error) => {
                res.send("error", error)
            }
        )
    }
);

module.exports = router;