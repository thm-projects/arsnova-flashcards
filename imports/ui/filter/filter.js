//------------------------ IMPORTS
import "./index/index.js";
import "../markdeep/editor/navigation/navigation.js";
import "../markdeep/editor/content/content.js";
import "../main/modal/arsnovaLite.js";
import "../main/modal/arsnovaClick.js";
import "../cardset/info/modal/license.js";
import "../learningStatistics/modal/history.js";
import "../learningStatistics/modal/cardStatus.js";
import "../cardset/labels/labels.js";
import "../cardset/info/box/cardset.js";
import "./navigation/navigation.js";
import "../forms/cardsetFormAdmin.js";
import {Session} from "meteor/session";

Session.setDefault('useRepForm', false);
