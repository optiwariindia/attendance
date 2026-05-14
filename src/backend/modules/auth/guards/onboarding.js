import { HttpError, asyncHandler } from "express-web-tools";

/**
 * Onboarding Guard
 * Ensures the user has completed their profile.
 * Redirects or blocks access to core ESS features until onboardingStatus is 'Completed'.
 */
const onboarding = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new HttpError(401, "Authentication required");
    }

    // Skip onboarding check for superadmins or specific roles if needed
    // But generally, all employees should complete it.
    if (req.user.onboardingStatus !== "Completed") {
        throw new HttpError(403, "Profile completion required");
    }

    next();
});

export default onboarding;
