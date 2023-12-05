export type HumanServerEvent = "welcome" | "offer" | "answer" | "candidate" | "roomFull" | "userExit" | "hostExit" | "roomCreated" | "joinRoomFailed" | "joinRoomSuccess" | "createRoomFailed" | "createRoomSuccess";
export type HumanClientEvent = "offer" | "answer" | "candidate" | "joinRoom" | "createRoom";
