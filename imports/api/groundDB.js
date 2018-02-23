import {AdminSettings} from "./adminSettings.js";
import {Cards} from "./cards.js";
import {Cardsets} from "./cardsets.js";
import {CollegesCourses} from "./colleges_courses.js";
import {Courses} from "./courses.js";
import {Experience} from "./experience.js";
import {Leitner, Wozniak} from "./learned.js";
import {Notifications} from "./notifications.js";
import {Paid} from "./paid.js";
import {Ratings} from "./ratings.js";
import {Categories} from "./settings.js";
import {Cloud} from "./cloud.js";

Ground.Collection(Meteor.users);
Ground.Collection(AdminSettings);
Ground.Collection(Cards);
Ground.Collection(Cardsets);
Ground.Collection(CollegesCourses);
Ground.Collection(Courses);
Ground.Collection(Experience);
Ground.Collection(Leitner);
Ground.Collection(Wozniak);
Ground.Collection(Notifications);
Ground.Collection(Paid);
Ground.Collection(Ratings);
Ground.Collection(Categories);
Ground.Collection(Cloud);
