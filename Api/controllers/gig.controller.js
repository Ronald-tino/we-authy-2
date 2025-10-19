import Gig from "../models/gig.model.js";
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
