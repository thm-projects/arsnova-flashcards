import {Route} from "./route.js";
import {Session} from "meteor/session";
import {Filter} from "./filter";
import * as config from "../config/filter.js";
import {NavigatorCheck} from "./navigatorCheck";

export let FilterNavigation = class FilterNavigation {
	static gotAuthorFilter (filterType) {
		return config.filtersWithAuthor.includes(filterType);
	}

	static gotCardTypeFilter (filterType) {
		return config.filtersWithCardType.includes(filterType);
	}

	static gotTargetAudienceFilter (filterType) {
		return config.filtersWithTargetAudience.includes(filterType);
	}

	static gotSemesterFilter (filterType) {
		return config.filtersWithSemester.includes(filterType);
	}

	static gotCollegeFilter (filterType) {
		return config.filtersWithCollege.includes(filterType);
	}

	static gotCourseFilter (filterType) {
		return config.filtersWithCourse.includes(filterType);
	}

	static gotModuleFilter (filterType) {
		return config.filtersWithModule.includes(filterType);
	}

	static gotDifficultyFilter (filterType) {
		return config.filtersWithDifficulty.includes(filterType);
	}

	static gotBonusFilter (filterType) {
		return config.filtersWithBonus.includes(filterType);
	}

	static gotWordCloudFilter (filterType) {
		return config.filtersWithWordcloud.includes(filterType);
	}

	static gotKindFilter (filterType) {
		return config.filtersWithKind.includes(filterType);
	}

	static gotPersonalKindFilter (filterType) {
		return config.filtersWithPersonalKind.includes(filterType);
	}

	static gotFreeKindFilter (filterType) {
		return config.filtersWithFreeKind.includes(filterType);
	}

	static gotEduKindFilter (filterType) {
		return config.filtersWithEduKind.includes(filterType);
	}

	static gotProKindFilter (filterType) {
		return config.filtersWithProKind.includes(filterType);
	}

	static gotSortButton (filterType) {
		if (this.isDisplayWordcloudActive(filterType)) {
			return false;
		} else {
			return config.filtersWithSortButton.includes(filterType);
		}
	}

	static isDisplayWordcloudActive (filterType) {
		return this.gotDisplayModeButton(filterType) && Session.get('filterDisplayWordcloud');
	}

	static gotDefaultSortName (filterType) {
		return config.filtersWithDefaultSortName.includes(filterType);
	}

	static gotDefaultSortDateUpdated (filterType) {
		return config.filtersWithDefaultSortDateUpdated.includes(filterType);
	}

	static gotDefaultSortDateCreated (filterType) {
		return config.filtersWithDefaultSortDateCreated.includes(filterType);
	}

	static gotResetButton (filterType) {
		return config.filtersWithResetButton.includes(filterType);
	}

	static gotDisplayModeButton (filterType) {
		return config.filtersWithDisplayModeButton.includes(filterType);
	}

	static getRouteId () {
		if (Route.isPool()) {
			return 0;
		}
		if (Route.isMyCardsets()) {
			return 1;
		}
		if (Route.isRepetitorium()) {
			return 2;
		}
		if (Route.isWorkload()) {
			return 3;
		}
		if (Route.isAllCardsets()) {
			return 4;
		}
		if (Route.isShuffle() || Route.isEditShuffle()) {
			return 5;
		}
		if (Route.isAllRepetitorien()) {
			return 6;
		}
		if (Route.isPersonalRepetitorien()) {
			return 7;
		}
	}

	static getFilterButton () {
		let activeFilter = Filter.getActiveFilter();
		let defaultFilter = Filter.getDefaultFilter();
		if (JSON.stringify(activeFilter) === JSON.stringify(defaultFilter)) {
			$('.resetBtn').removeClass('btn-warning').addClass('btn-default');
			$('.toggle-filter-dropdown').removeClass('active');
			return {disabled: 'disabled'};
		} else {
			$('.resetBtn').removeClass('btn-default').addClass('btn-warning');
			$('.toggle-filter-dropdown').addClass('active');
			return {};
		}
	}

	static setMaxDropdownHeight () {
		if (NavigatorCheck.isSmartphone()) {
			let filterNavigationCollapse = $('.navbar-cards-filter-collapse');
			let navigationHeader = $('.navbar-header:visible');
			if (filterNavigationCollapse.length && navigationHeader.length) {
				filterNavigationCollapse.css('max-height', $(window).height() - navigationHeader.height());
			}
		} else {
			let navigationHeader = $('.navbar-fixed-top.navbar-cards:visible');
			let filterDropdown = $('.navbar-cards-filter-dropdown:visible');
			if (filterDropdown.length && navigationHeader.length) {
				$('.navbar-cards-filter-dropdown .filter-bottom-row > li > ul').css('max-height', $(window).height() - navigationHeader.height() - filterDropdown.height());
			}
		}
	}
};
