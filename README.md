# SkillSwap

A decentralized peer-to-peer skill exchange platform built on the Internet Computer Protocol (ICP).

## Features

- Create user profiles with skill portfolios
- Offer skill exchanges
- Match with other users
- Track completed exchanges
- Rating and feedback system

## Prerequisites

- Node.js 16+
- DFX 0.14.1+
- TypeScript 4.9+

## Installation

```bash
git clone https://github.com/odakdaniel/skill-swap.git
cd skill-swap
npm install
```

## Local Development

1. Start local network:
```bash
dfx start --clean --background
```

2. Deploy canister:
```bash
dfx deploy
```

## API Reference

### User Management

```typescript
createUser(payload: { username: text }): Result<text, Errors>
```

### Skill Management

```typescript
addSkill(payload: {
    name: text,
    category: text,
    experienceLevel: text,
    description: text
}): Result<text, Errors>
```

### Offer Management

```typescript
createOffer(payload: {
    skillOfferedName: text,
    skillOfferedCategory: text,
    skillOfferedLevel: text,
    skillOfferedDescription: text,
    skillWantedName: text,
    skillWantedCategory: text,
    skillWantedLevel: text,
    skillWantedDescription: text
}): Result<text, Errors>
```

### Match Management

```typescript
acceptOffer(payload: { offerId: Principal }): Result<text, Errors>
completeLesson(payload: {
    matchId: Principal,
    rating: nat64,
    feedback: text
}): Result<text, Errors>
```

### Queries

```typescript
getActiveOffers(): Vec<SkillOffer>
getUserProfile(userId: Principal): Result<User, Errors>
getUserMatches(userId: Principal): Vec<Match>
```

## Data Types

### User
```typescript
{
    id: Principal
    username: text
    skills: Vec<Skill>
    rating: nat64
    completedExchanges: nat64
    dateJoined: nat64
}
```

### Skill
```typescript
{
    name: text
    category: text
    experienceLevel: text
    description: text
}
```

### SkillOffer
```typescript
{
    id: Principal
    teacher: Principal
    skillOffered: Skill
    skillWanted: Skill
    status: Status
    createdAt: nat64
}
```

## Error Handling

The system uses a Result type that returns either a success message or one of these errors:
- UserNotFound
- OfferNotFound
- MatchNotFound
- InvalidRating
- UsernameTaken
- UnauthorizedAction
- OfferAlreadyMatched
- InvalidSkillLevel

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE.md for details