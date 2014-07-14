var f="./entry.xml";
//var f="./allergy_entry.xml";

//var bb = require("blue-button");
var bb = require("../../../amida-tech/blue-button/index.js");

var fs=require("fs");

/*
    ccda_ccd: require("./ccda/ccd").CCD,
    ccda_demographics: require("./ccda/demographics").patient,
    ccda_vitals: require("./ccda/sections/vitals").vitalSignsSection,
    ccda_medications: require("./ccda/sections/medications").medicationsSection,
    ccda_problems: require("./ccda/sections/problems").problemsSection,
    ccda_immunizations: require("./ccda/sections/immunizations").immunizationsSection,
    ccda_results: require("./ccda/sections/results").resultsSection,
    ccda_allergies: require("./ccda/sections/allergies").allergiesSection,
    ccda_encounters: require("./ccda/sections/encounters").encountersSection,
    ccda_procedures: require("./ccda/sections/procedures").proceduresSection,
    ccda_socialHistory: require("./ccda/sections/socialHistory").socialHistorySection
*/

var data = fs.readFileSync(f).toString();

var j=bb.parseString(data, {component:"ccda_results_entry"});
//var j=bb.parseString(data, {component:"ccda_allergies_entry"});

console.log(j);

console.log(JSON.stringify(j, null, 4));