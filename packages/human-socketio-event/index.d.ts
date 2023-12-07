export type HumanServerEvent = "welcome" | "offer" | "answer" | "candidate" | "roomFull" | "userExit" | "hostExit" | "roomCreated" | "joinRoomFailed" | "joinRoomSuccess" | "createRoomFailed" | "createRoomSuccess" | "roomNameGenerated" | "roomExist" | "roomNotExist";
export type HumanClientEvent = "offer" | "answer" | "candidate" | "joinRoom" | "createRoom" | "generateRoomName" | "checkRoomExist";
