//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import { Cardsets } from '../../api/cardsets.js';
import { Categories } from '../../api/categories.js';
import { Ratings } from '../../api/ratings.js';

import './pool.html';


Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Session.setDefault('poolSortTopic', {name: -1});
Session.setDefault('poolFilterAutor', "/.*.*/");
Session.setDefault('poolFilterModule',  "/.*.*/");
Session.setDefault('poolFilterCourse',  "/.*.*/");
Session.setDefault('poolFilterDepartment',  "/.*.*/");
Session.setDefault('poolFilterStudyType',  "/.*.*/");
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * category
 * ############################################################################
 */

function getCollection () {
    return Cardsets.find({
        visible: true,
        /*kind: {$in: Session.get('poolFilter')},
         lastName: {$in: Session.get('poolFilterAutor')},
         moduleShort: {$in: Session.get('poolFilterModule')},
         academicCourse: {$in: Session.get('poolFilterCourse')},
         department: {$in: Session.get('poolFilterDepartment')},
         studyType: {$in: Session.get('poolFilterStudyType')}*/
    }, {
        sort: Session.get('poolSortTopic', 'poolSortAutor')
    });
}

Template.category.helpers({
    getDecks: function() {
        return getCollection();
    },
    getModules: function() {
        var Array = getCollection();
        var distinctArray = _.uniq(Array, false, function(d) {return d.moduleLong});
        var disctinctValues = _.pluck(distinctArray, 'moduleLong');
        console.log(disctinctValues);
        return disctinctValues;
    },
    getCourse: function() {
        var Array = getCollection();
        var distinctArray = _.uniq(Array, false, function(d) {return d.academicCourse});
        return disctinctValues = _.pluck(distinctArray, 'academicCourse');
    },
    getDepartments: function() {
        var Array = getCollection();
        var distinctArray = _.uniq(Array, false, function(d) {return d.department});
        return disctinctValues = _.pluck(distinctArray, 'department');
    },
    getTypes: function() {
        var Array = getCollection();
        var distinctArray = _.uniq(Array, false, function(d) {return d.studyType});
        return disctinctValues = _.pluck(distinctArray, 'studyType');
    },
    getAverage: function() {
        var ratings = Ratings.find({
            cardset_id: this._id
        });
        var count = ratings.count();
        if (count !== 0) {
            var amount = 0;
            ratings.forEach(function(rate) {
                amount = amount + rate.rating;
            });
            var result = (amount / count).toFixed(2);
            return result;
        } else {
            return 0;
        }
    },
    getSortUserIcon: function(val) {
        var sort = Session.get('poolSort');
        if (sort.username === 1) {
            return '<i class="fa fa-sort-asc"></i>';
        } else if (sort.username === -1){
            return '<i class="fa fa-sort-desc"></i>';
        }
    },
    getSortNameIcon: function() {
        var sort = Session.get('poolSort');
        if (sort.name === 1) {
            return '<i class="fa fa-sort-asc"></i>';
        } else if (sort.name === -1){
            return '<i class="fa fa-sort-desc"></i>';
        }
    },
    getSortRelevanceIcon: function() {
        var sort = Session.get('poolSort');
        if (sort.relevance === 1) {
            return '<i class="fa fa-sort-asc"></i>';
        } else if (sort.relevance === -1){
            return '<i class="fa fa-sort-desc"></i>';
        }
    },

    getAuthor: function() {
        return Meteor.users.findOne(this.owner).profile.name;
    },
    getLicense: function() {
        var licenseString = "";

        if (this.license.length > 0) {
            if (this.license.includes('by')) { licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" />'); }
            if (this.license.includes('nc')) {
                licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" />');
            }
            if (this.license.includes('nd')) { licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" />'); }
            if (this.license.includes('sa')) { licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" />'); }

            return new Spacebars.SafeString(licenseString)
        } else {
            return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" />');
        }
    }
});

Template.poolCardsetRow.helpers({
    getKind: function() {
        switch (this.kind) {
            case "free":
                return '<span class="label label-default">Free</span>';
            case "edu":
                return '<span class="label label-success">Edu</span>';
            case "pro":
                return '<span class="label label-info">Pro</span>';
            default:
                return '<span class="label label-danger">Undefined!</span>';
        }
    }
});
Template.category.events({
    'click .sortTopic': function() {
        var sort = Session.get('poolSortTopic');
        if (sort.name === 1) {
            Session.set('poolSortTopic', {name: -1});
        }
        else {
            Session.set('poolSortTopic', {name: 1});
        }
    },
    'click .filterAutor': function() {
        Session.set('poolFilterAutor', "");
    },
    'click .filterModule': function() {
        Session.set('poolFilterModule', "");
    },
    'click .filterStudy': function() {
        Session.set('poolFilterCourse', "");
    },
    'click .filterDepartment': function() {
        Session.set('poolFilterDepartment', "");
    },
    'click .filterType': function() {
        Session.set('poolFilterStudyType', "");
    },
    'change #filterCheckbox': function() {
        var filter = [];
        $("#filterCheckbox input:checkbox:checked").each(function(){
            filter.push($(this).val());
        });
        Session.set('poolFilter', filter);
    }
});

Template.category.onDestroyed(function() {
    Session.set('poolSort', {relevance: -1});
});
