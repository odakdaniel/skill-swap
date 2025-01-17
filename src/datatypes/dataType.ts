import {
    Principal,
    Record,
    Variant,
    Vec,
    nat64,
    text,
} from "azle/experimental";

// Define core types
export const Skill = Record({
    name: text,
    category: text,
    experienceLevel: text, // "beginner", "intermediate", "expert"
    description: text,
});

export type Skill = typeof Skill.tsType;

// Skill response type
export const SkillResponse = Record({
    message: text,
    skill: Skill,
});
export type SkillResponse = typeof SkillResponse.tsType
export const SkillOffer = Record({
    id: Principal,
    teacher: Principal,
    skillOffered: Skill,
    skillWanted: Skill,
    status: text, // "active", "matched", "completed"
    createdAt: nat64,
});

export type SkillOffer = typeof SkillOffer.tsType;

// Skill Offer response type
export const CreateOfferResponse = Record({
    message: text,
    offer: SkillOffer,
});

export const Match = Record({
    id: Principal,
    offererId: Principal,
    accepterId: Principal,
    skillOffererId: Principal,
    status: text, // "ongoing", "completed", "cancelled"
    rating: nat64,
    feedback: text,
    createdAt: nat64,
});

export type Match = typeof Match.tsType;

// Match response type
export const MatchResponse = Record({
    message: text,
    match: Match,
});
export type MatchResponse = typeof MatchResponse.tsType

export const User = Record({
    id: Principal,
    username: text,
    skills: Vec(Skill),
    rating: nat64,
    completedExchanges: nat64,
    dateJoined: nat64,
});

export type User = typeof User.tsType;

// User response type
export const CreateUserResponse = Record({
    message: text,
    user: User,
});
export type CreateUserResponse = typeof CreateUserResponse.tsType
// Define payload types
export const CreateUserPayload = Record({
    username: text,
});
export type CreateUserPayload = typeof CreateUserPayload.tsType
export const AddSkillPayload = Record({
    name: text,
    category: text,
    experienceLevel: text,
    description: text,
});
export type AddSkillPayload = typeof AddSkillPayload.tsType
export const CreateOfferPayload = Record({
    skillOfferedName: text,
    skillOfferedCategory: text,
    skillOfferedLevel: text,
    skillOfferedDescription: text,
    skillWantedName: text,
    skillWantedCategory: text,
    skillWantedLevel: text,
    skillWantedDescription: text,
});
export type CreateOfferPayload = typeof CreateOfferPayload.tsType

export const AcceptOfferPayload = Record({
    offerId: Principal,
});
export type AcceptOfferPayload = typeof AcceptOfferPayload.tsType
export const CompleteLessonPayload = Record({
    matchId: Principal,
    rating: nat64,
    feedback: text,
});

export type CompleteLessonPayload = typeof CompleteLessonPayload.tsType

// Error variants
export const Errors = Variant({
    UserNotFound: text,
    OfferNotFound: text,
    MatchNotFound: text,
    InvalidRating: text,
    UsernameTaken: text,
    UnauthorizedAction: text,
    OfferAlreadyMatched: text,
    InvalidSkillLevel: text,
    InternalError: text
});

export type Errors = typeof Errors.tsType;