import Milestone from "../models/Milestone.js";

/**
 * GET /admin/milestones
 */
export const getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ createdAt: -1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /admin/milestones
 */
export const createMilestone = async (req, res) => {
  try {
    const {
      name,
      triggerType,
      threshold,
      rewardTemplate,
    } = req.body;

    // 🔒 Validate rewardTemplate explicitly
    if (
      !rewardTemplate ||
      !rewardTemplate.title ||
      !rewardTemplate.type
    ) {
      return res.status(400).json({
        message: "Reward title and type are required",
      });
    }

    const milestone = await Milestone.create({
      name,
      triggerType,
      threshold,
      rewardTemplate: {
        title: rewardTemplate.title,
        description: rewardTemplate.description || "",
        type: rewardTemplate.type,
        value: rewardTemplate.value || 0,
      },
    });

    res.status(201).json(milestone);
  } catch (err) {
    console.error("Create milestone error:", err);
    res.status(400).json({ message: err.message });
  }
};


/**
 * PUT /admin/milestones/:id
 */
export const updateMilestone = async (req, res) => {
  const milestone = await Milestone.findById(req.params.id);
  if (!milestone) {
    return res.status(404).json({ message: "Milestone not found" });
  }

  const {
    name,
    triggerType,
    threshold,
    rewardTemplate,
    isActive,
  } = req.body;

  milestone.name = name ?? milestone.name;
  milestone.triggerType = triggerType ?? milestone.triggerType;
  milestone.threshold = threshold ?? milestone.threshold;

  if (rewardTemplate) {
    milestone.rewardTemplate.title =
      rewardTemplate.title ?? milestone.rewardTemplate.title;

    milestone.rewardTemplate.description =
      rewardTemplate.description ?? milestone.rewardTemplate.description;

    milestone.rewardTemplate.type =
      rewardTemplate.type ?? milestone.rewardTemplate.type;

    milestone.rewardTemplate.value =
      rewardTemplate.value ?? milestone.rewardTemplate.value;
  }

  milestone.isActive = isActive ?? milestone.isActive;

  await milestone.save();

  res.json(milestone);
};


/**
 * PATCH /admin/milestones/:id/toggle
 */
export const toggleMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    milestone.isActive = !milestone.isActive;
    await milestone.save();

    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /admin/milestones/:id
 */
export const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json({ message: "Milestone deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
