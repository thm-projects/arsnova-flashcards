import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UserPermissions } from '../../util/permissions';
import { CollegesCourses } from '../subscriptions/collegesCourses.js';

Meteor.methods({
  'updateCollegesCoursess'(college, course) {
    if (Meteor.settings.public.university.singleUniversity) {
      college = Meteor.settings.public.university.default;
    }
    check(college, String);
    check(course, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }
    CollegesCourses.insert({
      college,
      course,

    });
  },
  'deleteCollegesCourses'(college, course) {
    if (Meteor.settings.public.university.singleUniversity) {
      college = Meteor.settings.public.university.default;
    }
    check(college, String);
    check(course, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }
    CollegesCourses.remove({
      college,
      course,

    });
  },
  'editCollegesCourses'(college, course, newCollege, newCourse) {
    if (Meteor.settings.public.university.singleUniversity) {
      college = Meteor.settings.public.university.default;
    }
    check(college, String);
    check(course, String);
    check(newCollege, String);
    check(newCourse, String);

    if (!UserPermissions.gotBackendAccess()) {
      throw new Meteor.Error('not-authorized');
    }
    CollegesCourses.update({
      college,
      course,
    }, {
      $set: {
        'college': newCollege,
        'course': newCourse,
      },
    });
  },

});
