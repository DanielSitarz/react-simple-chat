const state = {
    userName: "Dan",
    usersInRoom: ["Mery", "Joey", "Chandler", "Rachel", "Phoebe"],
    currentRoomId: "DogsLovers",
    messages: [
        {
            id: 0,            
            sender: null,
            content: "Dan enters",
            power: 0
        },
        {
            id: 1,
            sender: "Dan",
            content: "Hello all!",
            power: 2.12
        },
        {
            id: 2,
            sender: "Phoebe",
            content: "Hiii Dan!",
            power: 3.5
        },
        {
            id: 3,            
            sender: null,
            content: "Joey leaves",
            power: 0
        }
    ]
};

const actions = [
    /**
     * USER actions
     */
    //"dieow changed name to Dan""
    //or nothing if previous is empty 
    {
        type: "USER_SET_NAME",
        previousName: "dieow",
        newName: "Dan"
    },
    {
        type: "USER_SENDS_MESSAGE",
        msg: {
            id: 83928323,
            sender: "Joey",
            content: "Hey Dan!",
            power: 1.0
        }
    },
    /**
     * ROOM actions
     */    
    //"Joey enters."
    {
        type: "USER_ENTERS_ROOM",
        userName: "Joey"
    },
    //"Joey leaves."
    {
        type: "USER_LEAVES_ROOM",
        userName: "Joey"
    },
];