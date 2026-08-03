const Lead = require("../models/leads");

async function saveLead(data){

    return await Lead.create(data);

}

module.exports={
    saveLead
}