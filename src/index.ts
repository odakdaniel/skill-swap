import {
  Canister,
  Err,
  Ok,
  Principal,
  Record,
  Result,
  StableBTreeMap,
  Variant,
  Vec,
  ic,
  nat64,
  query,
  update,
  text,
} from "azle/experimental";

// Define core types
const Skill = Record({
  name: text,
  category: text,
  experienceLevel: text, // "beginner", "intermediate", "expert"
  description: text,
});

type Skill = typeof Skill.tsType;

// Skill response type
const SkillResponse = Record({
  message: text,
  skill: Skill,
});

const SkillOffer = Record({
  id: Principal,
  teacher: Principal,
  skillOffered: Skill,
  skillWanted: Skill,
  status: text, // "active", "matched", "completed"
  createdAt: nat64,
});

type SkillOffer = typeof SkillOffer.tsType;

// Skill Offer response type
const CreateOfferResponse = Record({
  message: text,
  offer: SkillOffer,
});

const Match = Record({
  id: Principal,
  offererId: Principal,
  accepterId: Principal,
  skillOffererId: Principal,
  status: text, // "ongoing", "completed", "cancelled"
  rating: nat64,
  feedback: text,
  createdAt: nat64,
});

type Match = typeof Match.tsType;

// Match response type
const MatchResponse = Record({
  message: text,
  match: Match,
});

const User = Record({
  id: Principal,
  username: text,
  skills: Vec(Skill),
  rating: nat64,
  completedExchanges: nat64,
  dateJoined: nat64,
});

type User = typeof User.tsType;

// User response type
const CreateUserResponse = Record({
  message: text,
  user: User,
});

// Define payload types
const CreateUserPayload = Record({
  username: text,
});

const AddSkillPayload = Record({
  name: text,
  category: text,
  experienceLevel: text,
  description: text,
});

const CreateOfferPayload = Record({
  skillOfferedName: text,
  skillOfferedCategory: text,
  skillOfferedLevel: text,
  skillOfferedDescription: text,
  skillWantedName: text,
  skillWantedCategory: text,
  skillWantedLevel: text,
  skillWantedDescription: text,
});

const AcceptOfferPayload = Record({
  offerId: Principal,
});

const CompleteLessonPayload = Record({
  matchId: Principal,
  rating: nat64,
  feedback: text,
});

// Error variants
const Errors = Variant({
  UserNotFound: text,
  OfferNotFound: text,
  MatchNotFound: text,
  InvalidRating: text,
  UsernameTaken: text,
  UnauthorizedAction: text,
  OfferAlreadyMatched: text,
  InvalidSkillLevel: text,
});

type Errors = typeof Errors.tsType;

// Storage
const userStorage = StableBTreeMap<Principal, typeof User.tsType>(0);
const offerStorage = StableBTreeMap<Principal, typeof SkillOffer.tsType>(1);
const matchStorage = StableBTreeMap<Principal, typeof Match.tsType>(2);

export default Canister({
  // User Management
  createUser: update(
    [CreateUserPayload],
    Result(CreateUserResponse, Errors),
    (payload) => {
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
      });
    }
  ),

  // Skill Management
  addSkill: update(
    [AddSkillPayload],
    Result(SkillResponse, Errors),
    (payload) => {
      const caller = ic.caller();
      const user = userStorage.get(caller);

      if (!user) {
        return Err({ UserNotFound: "User not found" });
      }

      const validLevels = ["beginner", "intermediate", "expert"];
      if (!validLevels.includes(payload.experienceLevel.toLowerCase())) {
        return Err({
          InvalidSkillLevel:
            "Invalid skill level. Use: beginner, intermediate, or expert",
        });
      }

      const newSkill = {
        name: payload.name,
        category: payload.category,
        experienceLevel: payload.experienceLevel.toLowerCase(),
        description: payload.description,
      };

      const updatedUser = {
        ...user,
        skills: [...user.skills, newSkill],
      };

      userStorage.insert(caller, updatedUser);
      return Ok({
        message: `Skill ${payload.name} added successfully`,
        skill: newSkill,
      });
    }
  ),

  // Offer Management
  createOffer: update(
    [CreateOfferPayload],
    Result(CreateOfferResponse, Errors),
    (payload) => {
      const caller = ic.caller();
      const user = userStorage.get(caller);

      if (!user) {
        return Err({ UserNotFound: "User not found" });
      }

      const skillOffered = {
        name: payload.skillOfferedName,
        category: payload.skillOfferedCategory,
        experienceLevel: payload.skillOfferedLevel,
        description: payload.skillOfferedDescription,
      };

      const skillWanted = {
        name: payload.skillWantedName,
        category: payload.skillWantedCategory,
        experienceLevel: payload.skillWantedLevel,
        description: payload.skillWantedDescription,
      };

      const newOffer = {
        id: generateId(),
        teacher: caller,
        skillOffered,
        skillWanted,
        status: "active",
        createdAt: ic.time(),
      };

      offerStorage.insert(newOffer.id, newOffer);
      return Ok({
        message: `Offer created successfully`,
        offer: newOffer,
      });
    }
  ),

  // Match Management
  acceptOffer: update(
  [AcceptOfferPayload],
  Result(MatchResponse, Errors),
  (payload) => {
    const caller = ic.caller();

    // Validate if offerId is a valid Principal
    if (!Principal.isValid(payload.offerId.toText())) {
      return Err({ OfferNotFound: "Invalid offer ID" });
    }

    const offer = offerStorage.get(payload.offerId);

    if (!offer) {
      return Err({ OfferNotFound: "Offer not found" });
    }

    if (offer.status !== "active") {
      return Err({ OfferAlreadyMatched: "This offer is no longer active" });
    }

    // Prevent duplicate matches for the same offer
    const existingMatch = Array.from(matchStorage.values()).find(
      (match) => match.skillOffererId === payload.offerId && match.accepterId === caller
    );
    if (existingMatch) {
      return Err({ OfferAlreadyMatched: "You have already accepted this offer" });
    }

    const match: Match = {
      id: generateId(),
      offererId: offer.teacher,
      accepterId: caller,
      skillOffererId: payload.offerId,
      status: "ongoing",
      rating: 0n,
      feedback: "",
      createdAt: ic.time(),
    };

    // Update offer status
    const updatedOffer = {
      ...offer,
      status: "matched",
    };

    matchStorage.insert(match.id, match);
    offerStorage.insert(payload.offerId, updatedOffer);

    return Ok({
      message: `Offer accepted successfully`,
      match,
    });
  }
),


  // Completion and Rating
  completeLesson: update(
  [CompleteLessonPayload],
  Result(text, Errors),
  (payload) => {
    const caller = ic.caller();

    // Validate if matchId is a valid Principal
    if (!Principal.isValid(payload.matchId.toText())) {
      return Err({ MatchNotFound: "Invalid match ID" });
    }

    const match = matchStorage.get(payload.matchId);

    if (!match) {
      return Err({ MatchNotFound: "Match not found" });
    }

    if (payload.rating < 1 || payload.rating > 5) {
      return Err({ InvalidRating: "Rating must be between 1 and 5" });
    }

    if (payload.feedback.length > 500) {
      return Err({ InvalidFeedback: "Feedback must be under 500 characters" });
    }

    const updatedMatch = {
      ...match,
      status: "completed",
      rating: payload.rating,
      feedback: payload.feedback,
    };

    // Update user stats
    const teacher = userStorage.get(match.offererId);
    if (teacher) {
      const updatedTeacher = {
        ...teacher,
        rating: (teacher.rating * teacher.completedExchanges + payload.rating) /
          (teacher.completedExchanges + 1n),
        completedExchanges: teacher.completedExchanges + 1n,
      };
      userStorage.insert(match.offererId, updatedTeacher);
    }

    matchStorage.insert(payload.matchId, updatedMatch);
    return Ok("Lesson completed and rated successfully");
  }
),


  // Queries
  getActiveOffers: query([], Vec(SkillOffer), () => {
    return offerStorage.values().filter((offer) => offer.status === "active");
  }),

  getUserProfile: query([Principal], Result(User, Errors), (userId) => {
  // Validate if userId is a valid Principal
  if (!Principal.isValid(userId.toText())) {
    return Err({ UserNotFound: "Invalid user ID" });
  }

  const user = userStorage.get(userId);

  if (!user) {
    return Err({ UserNotFound: "User not found" });
  }

  return Ok(user);
}),

  }),

  getUserMatches: query([Principal], Vec(Match), (userId) => {
    return matchStorage
      .values()
      .filter(
        (match) => match.offererId === userId || match.accepterId === userId
      );
  }),
});

// Helper function
function generateId(): Principal {
  const time = BigInt(ic.time()).toString(); // Get the current time as a BigInt and convert it to a string
  const caller = ic.caller().toText(); // Get the caller's Principal as a string
  const uniqueId = `${caller}-${time}`; // Combine the caller and time to create a unique ID
  return Principal.fromText(uniqueId); // Convert the unique ID back to a Principal
}

}
