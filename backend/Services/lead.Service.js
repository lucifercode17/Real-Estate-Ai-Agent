const Lead = require("../Models/leads");

async function saveLead(data){

    return await Lead.create(data);

}

module.exports={
    saveLead
}