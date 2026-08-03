const leadStore = new Map();

function getLead(sessionId){

    if(!leadStore.has(sessionId)){

        leadStore.set(sessionId,{

            name:"",
            phone:"",
            email:"",
            budget:"",
            location:"",
            propertyType:"",
            purpose:"",
            timeline:"",
            conversation:[]

        });

    }

    return leadStore.get(sessionId);

}

function deleteLead(sessionId){

    leadStore.delete(sessionId);

}

module.exports={

    getLead,

    deleteLead

}