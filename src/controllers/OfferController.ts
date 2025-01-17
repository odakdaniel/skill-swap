import { Err, ic, Ok } from "azle/experimental"
import { AcceptOfferPayload, CreateOfferPayload, Match } from "../datatypes/dataType"
import { matchStorage, offerStorage, userStorage } from "../storages/storage";
import { generateId } from "../utils/generateId";



class OfferController {
    static createOffer = (payload: CreateOfferPayload) => {
        try {

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
        } catch (error: any) {
            return Err({ InternalError: `Error occured ${error.message}` })
        }

    }

    static acceptOffer = (payload: AcceptOfferPayload) => {
        try {
            const caller = ic.caller();
            const offer = offerStorage.get(payload.offerId);

            if (!offer) {
                return Err({ OfferNotFound: "Offer not found" });
            }

            if (offer.status !== "active") {
                return Err({ OfferAlreadyMatched: "This offer is no longer active" });
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
        } catch (error: any) {
            return Err({ InternalError: `Error occured ${error.message}` })
        }
    }

    static getActiveOffers = () => {
        return offerStorage.values().filter((offer) => offer.status === "active");
    }
}

export default OfferController