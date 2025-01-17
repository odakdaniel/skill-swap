import { StableBTreeMap } from "azle";
import { Principal } from "azle/experimental";
import { Match, SkillOffer, User } from "../datatypes/dataType";

// Storage
const userStorage = StableBTreeMap<Principal, User>(0);
const offerStorage = StableBTreeMap<Principal, SkillOffer>(1);
const matchStorage = StableBTreeMap<Principal, Match>(2);


export {
    userStorage,
    offerStorage,
    matchStorage
}