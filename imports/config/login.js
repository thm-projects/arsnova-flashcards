//Login redirect page priority. Defaults to Pool if none of the conditions are met.
//0 All Cardsets (Admin only)
//1 Workload (If workload exists)
//2 My Cardsets (If user created at least one cardset
let loginRedirectPriority = [1, 2];

let showUseCasesOnLoginForAdmin = true;

module.exports = {
	loginRedirectPriority,
	showUseCasesOnLoginForAdmin
};
