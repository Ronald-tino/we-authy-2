import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  // Validate required fields
  const {
    title,
    about,
    departureCountry,
    departureCity,
    destinationCountry,
    destinationCity,
    availableSpace,
    priceRMB,
    expirationDays,
  } = req.body;

  if (
    !title ||
    !about ||
    !departureCountry ||
    !departureCity ||
    !destinationCountry ||
    !destinationCity ||
    !availableSpace ||
    !priceRMB ||
    !expirationDays
  ) {
    return next(
      createError(
        400,
        "Missing required fields: title, about, departureCountry, departureCity, destinationCountry, destinationCity, availableSpace, priceRMB, expirationDays"
      )
    );
  }

  // Validate numeric fields
  if (
    isNaN(availableSpace) ||
    isNaN(priceRMB) ||
    isNaN(expirationDays) ||
    availableSpace <= 0 ||
    priceRMB <= 0 ||
    expirationDays <= 0
  ) {
    return next(
      createError(
        400,
        "availableSpace, priceRMB, and expirationDays must be positive numbers"
      )
    );
  }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};
export const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    if (gig.userId.toString() !== req.userId) {
      return next(createError(403, "You can update only your gig!"));
    }

    // Validate numeric fields if they're being updated
    const { availableSpace, priceRMB, expirationDays } = req.body;

    if (availableSpace !== undefined) {
      if (isNaN(availableSpace) || availableSpace <= 0) {
        return next(
          createError(400, "availableSpace must be a positive number")
        );
      }
    }

    if (priceRMB !== undefined) {
      if (isNaN(priceRMB) || priceRMB <= 0) {
        return next(createError(400, "priceRMB must be a positive number"));
      }
    }

    if (expirationDays !== undefined) {
      if (isNaN(expirationDays) || expirationDays <= 0) {
        return next(
          createError(400, "expirationDays must be a positive number")
        );
      }
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId.toString() !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};

export const completeGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    if (gig.userId.toString() !== req.userId) {
      return next(createError(403, "You can only complete your own gig!"));
    }

    if (gig.isCompleted) {
      return next(createError(400, "Gig is already completed!"));
    }

    // Calculate days remaining
    const creationDate = new Date(gig.createdAt);
    const currentDate = new Date();
    const expirationDate = new Date(creationDate);
    expirationDate.setDate(expirationDate.getDate() + gig.expirationDays);
    const timeDiff = expirationDate - currentDate;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Only mark as completed if expired (days remaining <= 0)
    if (daysRemaining > 0) {
      return next(
        createError(400, "Gig can only be completed when it has expired!")
      );
    }

    // Mark gig as completed
    gig.isCompleted = true;
    await gig.save();

    // Increment user's trips completed
    await User.findByIdAndUpdate(req.userId, {
      $inc: { tripsCompleted: 1 },
    });

    res.status(200).json({ message: "Gig marked as completed!", gig });
  } catch (err) {
    next(err);
  }
};

// Toggle current user interest in a gig
export const toggleInterest = async (req, res, next) => {
  try {
    const gigId = req.params.id;
    const userId = req.userId;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    const alreadyInterested = (gig.interestedUsers || []).some(
      (u) => u.toString() === userId
    );

    let updated;
    if (alreadyInterested) {
      updated = await Gig.findByIdAndUpdate(
        gigId,
        { $pull: { interestedUsers: userId } },
        { new: true }
      ).populate("interestedUsers", "username img");
    } else {
      updated = await Gig.findByIdAndUpdate(
        gigId,
        { $addToSet: { interestedUsers: userId } },
        { new: true }
      ).populate("interestedUsers", "username img");
    }

    res.status(200).json({
      interestedCount: updated.interestedUsers?.length || 0,
      interestedUsers: updated.interestedUsers || [],
      interested: !alreadyInterested,
    });
  } catch (err) {
    next(err);
  }
};

// Get list of interested users for a gig
export const getInterestedUsers = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "interestedUsers",
      "username img"
    );
    if (!gig) return next(createError(404, "Gig not found!"));

    res.status(200).json({
      interestedCount: gig.interestedUsers?.length || 0,
      interestedUsers: gig.interestedUsers || [],
    });
  } catch (err) {
    next(err);
  }
};
