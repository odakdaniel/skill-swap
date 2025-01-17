import {
  Canister,
  Err,
  Ok,
  Principal,
  Result,
  Vec,
  ic,
  query,
  update,
  text,
} from "azle/experimental";
import UserController from "./controllers/UserController";
import { AcceptOfferPayload, AddSkillPayload, CompleteLessonPayload, CreateOfferPayload, CreateOfferResponse, CreateUserPayload, CreateUserResponse, Errors, Match, MatchResponse, SkillOffer, SkillResponse, User } from "./datatypes/dataType";
import OfferController from "./controllers/OfferController";
import { offerStorage } from "./storages/storage";
import SkillController from "./controllers/SkillController";

export default Canister({
  // User Management
  createUser: update(
    [CreateUserPayload],
    Result(CreateUserResponse, Errors),
    (payload) => {
      return UserController.createUser(payload)
    }
  ),

  // Skill Management
  addSkill: update(
    [AddSkillPayload],
    Result(SkillResponse, Errors),
    (payload) => {
      return SkillController.addSkill(payload)
    }
  ),

  // Offer Management
  createOffer: update(
    [CreateOfferPayload],
    Result(CreateOfferResponse, Errors),
    (payload) => {
      return OfferController.createOffer(payload)
    }
  ),

  // Match Management
  acceptOffer: update(
    [AcceptOfferPayload],
    Result(MatchResponse, Errors),
    (payload) => {
      return OfferController.acceptOffer(payload)
    }
  ),

  // Completion and Rating
  completeLesson: update(
    [CompleteLessonPayload],
    Result(text, Errors),
    (payload) => {
      return SkillController.completeLesson(payload)
    }
  ),

  // Queries
  getActiveOffers: query([], Vec(SkillOffer), () => {
    return OfferController.getActiveOffers()
  }),

  getUserProfile: query([Principal], Result(User, Errors), (userId) => {
    return UserController.getUserProfile(userId)
  }),

  getUserMatches: query([Principal], Vec(Match), (userId) => {
    return UserController.getUserMatches(userId)
  }),
});

// Helper function

