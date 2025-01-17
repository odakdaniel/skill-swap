import { Err, ic, Ok } from "azle/experimental"
import { matchStorage, userStorage } from "../storages/storage";
import { AddSkillPayload, CompleteLessonPayload } from "../datatypes/dataType";



class SkillController {
    static addSkill = (payload: AddSkillPayload) => {
        try {
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
        } catch (error: any) {
            return Err({ InternalError: `Error occured ${error.message}` })
        }
    }

    static completeLesson = (payload: CompleteLessonPayload) => {
        try {
            const caller = ic.caller();
            const match = matchStorage.get(payload.matchId);

            if (!match) {
                return Err({ MatchNotFound: "Match not found" });
            }

            if (payload.rating < 1 || payload.rating > 5) {
                return Err({ InvalidRating: "Rating must be between 1 and 5" });
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
                    rating: (teacher.rating + payload.rating) / 2n,
                    completedExchanges: teacher.completedExchanges + 1n,
                };
                userStorage.insert(match.offererId, updatedTeacher);
            }

            matchStorage.insert(payload.matchId, updatedMatch);
            return Ok("Lesson completed and rated successfully");
        } catch (error: any) {
            return Err({ InternalError: `Error occured ${error.message}` })
        }
    }
}

export default SkillController