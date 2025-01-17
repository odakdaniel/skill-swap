import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'acceptOffer' : ActorMethod<
    [{ 'offerId' : Principal }],
    {
        'Ok' : {
          'match' : {
            'id' : Principal,
            'status' : string,
            'offererId' : Principal,
            'createdAt' : bigint,
            'feedback' : string,
            'rating' : bigint,
            'accepterId' : Principal,
            'skillOffererId' : Principal,
          },
          'message' : string,
        }
      } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
  'addSkill' : ActorMethod<
    [
      {
        'experienceLevel' : string,
        'name' : string,
        'description' : string,
        'category' : string,
      },
    ],
    {
        'Ok' : {
          'skill' : {
            'experienceLevel' : string,
            'name' : string,
            'description' : string,
            'category' : string,
          },
          'message' : string,
        }
      } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
  'completeLesson' : ActorMethod<
    [{ 'feedback' : string, 'matchId' : Principal, 'rating' : bigint }],
    { 'Ok' : string } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
  'createOffer' : ActorMethod<
    [
      {
        'skillWantedDescription' : string,
        'skillOfferedLevel' : string,
        'skillOfferedCategory' : string,
        'skillWantedLevel' : string,
        'skillOfferedName' : string,
        'skillWantedCategory' : string,
        'skillWantedName' : string,
        'skillOfferedDescription' : string,
      },
    ],
    {
        'Ok' : {
          'offer' : {
            'id' : Principal,
            'status' : string,
            'createdAt' : bigint,
            'teacher' : Principal,
            'skillWanted' : {
              'experienceLevel' : string,
              'name' : string,
              'description' : string,
              'category' : string,
            },
            'skillOffered' : {
              'experienceLevel' : string,
              'name' : string,
              'description' : string,
              'category' : string,
            },
          },
          'message' : string,
        }
      } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
  'createUser' : ActorMethod<
    [{ 'username' : string }],
    {
        'Ok' : {
          'user' : {
            'id' : Principal,
            'username' : string,
            'dateJoined' : bigint,
            'rating' : bigint,
            'completedExchanges' : bigint,
            'skills' : Array<
              {
                'experienceLevel' : string,
                'name' : string,
                'description' : string,
                'category' : string,
              }
            >,
          },
          'message' : string,
        }
      } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
  'getActiveOffers' : ActorMethod<
    [],
    Array<
      {
        'id' : Principal,
        'status' : string,
        'createdAt' : bigint,
        'teacher' : Principal,
        'skillWanted' : {
          'experienceLevel' : string,
          'name' : string,
          'description' : string,
          'category' : string,
        },
        'skillOffered' : {
          'experienceLevel' : string,
          'name' : string,
          'description' : string,
          'category' : string,
        },
      }
    >
  >,
  'getUserMatches' : ActorMethod<
    [Principal],
    Array<
      {
        'id' : Principal,
        'status' : string,
        'offererId' : Principal,
        'createdAt' : bigint,
        'feedback' : string,
        'rating' : bigint,
        'accepterId' : Principal,
        'skillOffererId' : Principal,
      }
    >
  >,
  'getUserProfile' : ActorMethod<
    [Principal],
    {
        'Ok' : {
          'id' : Principal,
          'username' : string,
          'dateJoined' : bigint,
          'rating' : bigint,
          'completedExchanges' : bigint,
          'skills' : Array<
            {
              'experienceLevel' : string,
              'name' : string,
              'description' : string,
              'category' : string,
            }
          >,
        }
      } |
      {
        'Err' : { 'InvalidRating' : string } |
          { 'UsernameTaken' : string } |
          { 'OfferNotFound' : string } |
          { 'OfferAlreadyMatched' : string } |
          { 'MatchNotFound' : string } |
          { 'InvalidSkillLevel' : string } |
          { 'InternalError' : string } |
          { 'UnauthorizedAction' : string } |
          { 'UserNotFound' : string }
      }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
