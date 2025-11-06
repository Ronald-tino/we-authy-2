import Container from "../models/container.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const createContainer = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a container!"));

  // Validate required fields
  const {
    title,
    about,
    containerType,
    cargoType,
    taxClearance,
    locationCountry,
    locationCity,
    availableSpaceCBM,
    priceRMB,
    departureDate,
    arrivalDate,
    expirationDays,
  } = req.body;

  if (
    !title ||
    !about ||
    !containerType ||
    !cargoType ||
    !taxClearance ||
    !locationCountry ||
    !locationCity ||
    !availableSpaceCBM ||
    !priceRMB ||
    !departureDate ||
    !arrivalDate ||
    !expirationDays
  ) {
    return next(
      createError(
        400,
        "Missing required fields: title, about, containerType, cargoType, taxClearance, locationCountry, locationCity, availableSpaceCBM, priceRMB, departureDate, arrivalDate, expirationDays"
      )
    );
  }

  // Validate enum values
  if (!["20ft", "40ft", "40ft-HC"].includes(containerType)) {
    return next(
      createError(400, "containerType must be '20ft', '40ft', or '40ft-HC'")
    );
  }

  if (!["handled_by_courier", "paid_separately"].includes(taxClearance)) {
    return next(
      createError(
        400,
        "taxClearance must be 'handled_by_courier' or 'paid_separately'"
      )
    );
  }

  // Validate numeric fields
  if (
    isNaN(availableSpaceCBM) ||
    isNaN(priceRMB) ||
    isNaN(expirationDays) ||
    availableSpaceCBM <= 0 ||
    priceRMB <= 0 ||
    expirationDays <= 0
  ) {
    return next(
      createError(
        400,
        "availableSpaceCBM, priceRMB, and expirationDays must be positive numbers"
      )
    );
  }

  // Validate dates
  const departure = new Date(departureDate);
  const arrival = new Date(arrivalDate);
  if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
    return next(createError(400, "Invalid date format"));
  }
  if (arrival <= departure) {
    return next(createError(400, "Arrival date must be after departure date"));
  }

  const newContainer = new Container({
    ...req.body,
    userId: req.userId, // Set after spread to ensure it's not overwritten
  });

  try {
    const savedContainer = await newContainer.save();
    res.status(201).json(savedContainer);
  } catch (err) {
    next(err);
  }
};

export const updateContainer = async (req, res, next) => {
  try {
    const container = await Container.findById(req.params.id);

    if (!container) {
      return next(createError(404, "Container not found!"));
    }

    if (container.userId.toString() !== req.userId) {
      return next(createError(403, "You can update only your container!"));
    }

    // Validate numeric fields if they're being updated
    const { availableSpaceCBM, priceRMB, expirationDays } = req.body;

    if (availableSpaceCBM !== undefined) {
      if (isNaN(availableSpaceCBM) || availableSpaceCBM <= 0) {
        return next(
          createError(400, "availableSpaceCBM must be a positive number")
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

    // Validate dates if being updated
    if (req.body.departureDate && req.body.arrivalDate) {
      const departure = new Date(req.body.departureDate);
      const arrival = new Date(req.body.arrivalDate);
      if (arrival <= departure) {
        return next(
          createError(400, "Arrival date must be after departure date")
        );
      }
    }

    const updatedContainer = await Container.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedContainer);
  } catch (err) {
    next(err);
  }
};

export const deleteContainer = async (req, res, next) => {
  try {
    const container = await Container.findById(req.params.id);
    if (container.userId.toString() !== req.userId)
      return next(createError(403, "You can delete only your container!"));

    await Container.findByIdAndDelete(req.params.id);
    res.status(200).send("Container has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getContainer = async (req, res, next) => {
  try {
    const container = await Container.findById(req.params.id);
    if (!container) next(createError(404, "Container not found!"));
    res.status(200).send(container);
  } catch (err) {
    next(err);
  }
};

export const getContainers = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.containerType && { containerType: q.containerType }),
    ...(q.taxClearance && { taxClearance: q.taxClearance }),
    ...((q.min || q.max) && {
      priceRMB: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    ...(q.locationCountry && { locationCountry: q.locationCountry }),
  };
  try {
    const containers = await Container.find(filters).sort({
      [q.sort || "createdAt"]: -1,
    });
    res.status(200).send(containers);
  } catch (err) {
    next(err);
  }
};

export const completeContainer = async (req, res, next) => {
  try {
    const container = await Container.findById(req.params.id);

    if (!container) {
      return next(createError(404, "Container not found!"));
    }

    if (container.userId.toString() !== req.userId) {
      return next(
        createError(403, "You can only complete your own container!")
      );
    }

    if (container.isCompleted) {
      return next(createError(400, "Container is already completed!"));
    }

    // Calculate days remaining
    const creationDate = new Date(container.createdAt);
    const currentDate = new Date();
    const expirationDate = new Date(creationDate);
    expirationDate.setDate(expirationDate.getDate() + container.expirationDays);
    const timeDiff = expirationDate - currentDate;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Only mark as completed if expired (days remaining <= 0)
    if (daysRemaining > 0) {
      return next(
        createError(400, "Container can only be completed when it has expired!")
      );
    }

    // Mark container as completed
    container.isCompleted = true;
    await container.save();

    // Increment user's trips completed
    await User.findByIdAndUpdate(req.userId, {
      $inc: { tripsCompleted: 1 },
    });

    res
      .status(200)
      .json({ message: "Container marked as completed!", container });
  } catch (err) {
    next(err);
  }
};

// Toggle current user interest in a container
export const toggleInterest = async (req, res, next) => {
  try {
    const containerId = req.params.id;
    const userId = req.userId;

    const container = await Container.findById(containerId);
    if (!container) {
      return next(createError(404, "Container not found!"));
    }

    const alreadyInterested = (container.interestedUsers || []).some(
      (u) => u.toString() === userId
    );

    let updated;
    if (alreadyInterested) {
      updated = await Container.findByIdAndUpdate(
        containerId,
        { $pull: { interestedUsers: userId } },
        { new: true }
      ).populate("interestedUsers", "username img");
    } else {
      updated = await Container.findByIdAndUpdate(
        containerId,
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

// Get list of interested users for a container
export const getInterestedUsers = async (req, res, next) => {
  try {
    const container = await Container.findById(req.params.id).populate(
      "interestedUsers",
      "username img"
    );
    if (!container) return next(createError(404, "Container not found!"));

    res.status(200).json({
      interestedCount: container.interestedUsers?.length || 0,
      interestedUsers: container.interestedUsers || [],
    });
  } catch (err) {
    next(err);
  }
};
