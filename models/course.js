'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Course title is required"
                },
            },
        },
        description: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: {
                    msg: 'A description is required'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
        },
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
};