import { Err, ic, Ok, Principal } from "azle/experimental";
import { matchStorage, userStorage } from "../storages/storage";
import { User, CreateUserPayload } from "../datatypes/dataType";



class UserController {
    static createUser = (payload: CreateUserPayload) => {
        try {
            const caller = ic.caller();

            // Check if username exists
            const existingUser = Array.from(userStorage.values()).find(
                (user) => user.username === payload.username
            );
            if (existingUser) {
                return Err({
                    UsernameTaken: `Username ${payload.username} is already taken`,
                });
            }

            const newUser: User = {
                id: caller,
                username: payload.username,
                skills: [],
                rating: 0n,
                completedExchanges: 0n,
                dateJoined: ic.time(),
            };

            userStorage.insert(caller, newUser);
            return Ok({
                message: `User ${payload.username} created successfully`,
                user: newUser,
            })
        } catch (error: any) {
            return Err({ InternalError: `Error occured ${error.message}` })
        }
    }

    static getUserProfile=(userId: Principal)=>{
    try {
        const user = userStorage.get(userId);
        if (!user) {
          return Err({ UserNotFound: "User not found" });
        }
        return Ok(user);
    }catch(error:any) {
      return Err({InternalError: `Error occured ${error.message}`})
    }
    }

    static getUserMatches=(userId:Principal)=>{
        return matchStorage
        .values()
        .filter(
          (match) => match.offererId === userId || match.accepterId === userId
        );
    }
}

export default UserController