'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please enter a first name'
                },
            },
        },
        lastName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please enter a last name'
                },
            },
        },
        emailAddress: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please enter an email address'
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please enter a password'
                },
            },
        },

    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'course',
            foreignKey: {
                fieldName: 'courseId',
                allowNull: false,
            },
        });
    };

    return User;
}