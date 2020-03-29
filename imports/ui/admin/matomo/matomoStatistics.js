// jscs:disable disallowTrailingWhitespace
// jscs:disable validateIndentation
//------------------------ IMPORTS

import "./matomoStatistics.html";
import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';

const piwikDomain = Meteor.settings.public.matomo.MATOMO_URL;
const idSite = Meteor.settings.public.matomo.MATOMO_SITE_ID;
const tokenAuth = Meteor.settings.public.matomo.MATOMO_TOKEN;

function buildGraph(result) {
    //todo controlle graph once real api results are available
    var ctx = document.getElementById('uniqueVisitors');
    var uniqueVisitors = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'visitors',
                data: result,
                borderWidth: 1,
                xAxisID: 'day',
                yAxisID: 'count'
            }],
            general: [{
                xAxisID: 'date',
                yAxisID: 'value'
            }]
        }
    });
}

 HTTP.call('GET',
     'http://' + piwikDomain +
     '/?module=API' +
     '&method=VisitSummary.getVisits' +
     '&idSite=' + idSite +
     '&period=day' +
     '&date=last7' +
     '&rec=1&' +
     '&format=json' +
     '&token_auth=' + tokenAuth,
     (error, result) => {
     if (!error) {
         buildGraph(result);
     } else {
         throw new Meteor.Error('http call failed(matomo)');
         //todo propper error handling
     }
 });


