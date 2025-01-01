export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'acceptOffer' : IDL.Func(
        [IDL.Record({ 'offerId' : IDL.Principal })],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'match' : IDL.Record({
                'id' : IDL.Principal,
                'status' : IDL.Text,
                'offererId' : IDL.Principal,
                'createdAt' : IDL.Nat64,
                'feedback' : IDL.Text,
                'rating' : IDL.Nat64,
                'accepterId' : IDL.Principal,
                'skillOffererId' : IDL.Principal,
              }),
              'message' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'addSkill' : IDL.Func(
        [
          IDL.Record({
            'experienceLevel' : IDL.Text,
            'name' : IDL.Text,
            'description' : IDL.Text,
            'category' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'skill' : IDL.Record({
                'experienceLevel' : IDL.Text,
                'name' : IDL.Text,
                'description' : IDL.Text,
                'category' : IDL.Text,
              }),
              'message' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'completeLesson' : IDL.Func(
        [
          IDL.Record({
            'feedback' : IDL.Text,
            'matchId' : IDL.Principal,
            'rating' : IDL.Nat64,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'createOffer' : IDL.Func(
        [
          IDL.Record({
            'skillWantedDescription' : IDL.Text,
            'skillOfferedLevel' : IDL.Text,
            'skillOfferedCategory' : IDL.Text,
            'skillWantedLevel' : IDL.Text,
            'skillOfferedName' : IDL.Text,
            'skillWantedCategory' : IDL.Text,
            'skillWantedName' : IDL.Text,
            'skillOfferedDescription' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'offer' : IDL.Record({
                'id' : IDL.Principal,
                'status' : IDL.Text,
                'createdAt' : IDL.Nat64,
                'teacher' : IDL.Principal,
                'skillWanted' : IDL.Record({
                  'experienceLevel' : IDL.Text,
                  'name' : IDL.Text,
                  'description' : IDL.Text,
                  'category' : IDL.Text,
                }),
                'skillOffered' : IDL.Record({
                  'experienceLevel' : IDL.Text,
                  'name' : IDL.Text,
                  'description' : IDL.Text,
                  'category' : IDL.Text,
                }),
              }),
              'message' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'createUser' : IDL.Func(
        [IDL.Record({ 'username' : IDL.Text })],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'user' : IDL.Record({
                'id' : IDL.Principal,
                'username' : IDL.Text,
                'dateJoined' : IDL.Nat64,
                'rating' : IDL.Nat64,
                'completedExchanges' : IDL.Nat64,
                'skills' : IDL.Vec(
                  IDL.Record({
                    'experienceLevel' : IDL.Text,
                    'name' : IDL.Text,
                    'description' : IDL.Text,
                    'category' : IDL.Text,
                  })
                ),
              }),
              'message' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'getActiveOffers' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'status' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'teacher' : IDL.Principal,
              'skillWanted' : IDL.Record({
                'experienceLevel' : IDL.Text,
                'name' : IDL.Text,
                'description' : IDL.Text,
                'category' : IDL.Text,
              }),
              'skillOffered' : IDL.Record({
                'experienceLevel' : IDL.Text,
                'name' : IDL.Text,
                'description' : IDL.Text,
                'category' : IDL.Text,
              }),
            })
          ),
        ],
        ['query'],
      ),
    'getUserMatches' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'status' : IDL.Text,
              'offererId' : IDL.Principal,
              'createdAt' : IDL.Nat64,
              'feedback' : IDL.Text,
              'rating' : IDL.Nat64,
              'accepterId' : IDL.Principal,
              'skillOffererId' : IDL.Principal,
            })
          ),
        ],
        ['query'],
      ),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'username' : IDL.Text,
              'dateJoined' : IDL.Nat64,
              'rating' : IDL.Nat64,
              'completedExchanges' : IDL.Nat64,
              'skills' : IDL.Vec(
                IDL.Record({
                  'experienceLevel' : IDL.Text,
                  'name' : IDL.Text,
                  'description' : IDL.Text,
                  'category' : IDL.Text,
                })
              ),
            }),
            'Err' : IDL.Variant({
              'InvalidRating' : IDL.Text,
              'UsernameTaken' : IDL.Text,
              'OfferNotFound' : IDL.Text,
              'OfferAlreadyMatched' : IDL.Text,
              'MatchNotFound' : IDL.Text,
              'InvalidSkillLevel' : IDL.Text,
              'UnauthorizedAction' : IDL.Text,
              'UserNotFound' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
