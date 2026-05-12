const taskService = require("../services/taskService");
const { AppError } = require("../utils/AppError");

exports.list = (req, res, next) => {
  try {
    const tasks = taskService.list();
    res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.detail = (req, res, next) => {
  try {
    const task = taskService.findById(req.params.id);
    if (!task) throw new AppError(404, "Task tidak ditemukan");
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const task = taskService.create({ title });
    res.status(201).json({ message: "Task dibuat", data: task });
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const payload = {};

    if (req.body.title !== undefined) {
      payload.title = req.body.title;
    }

    if (req.body.done !== undefined) {
      if (typeof req.body.done !== "boolean") {
        throw new AppError(400, "done harus boolean");
      }
      payload.done = req.body.done;
    }

    if (Object.keys(payload).length === 0) {
      throw new AppError(400, "Tidak ada data yang diupdate");
    }

    const task = taskService.update(req.params.id, payload);
    if (!task) throw new AppError(404, "Task tidak ditemukan");

    res.json({ message: "Task diupdate", data: task });
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res, next) => {
  try {
    const task = taskService.remove(req.params.id);
    if (!task) throw new AppError(404, "Task tidak ditemukan");

    res.json({ message: "Task dihapus", data: task });
  } catch (err) {
    next(err);
  }
};