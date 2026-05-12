const { randomUUID } = require("crypto");
const { AppError } = require("../utils/AppError");

const tasks = [];

exports.list = () => tasks;

exports.findById = (id) => tasks.find((t) => t.id === id);

exports.create = ({ title }) => {
  //  Validasi Soal No 1 
  const cleanTitle = String(title || "").trim();
  if (!cleanTitle) throw new AppError(400, "title wajib diisi");
  if (cleanTitle.length > 120) throw new AppError(400, "title maksimal 120 karakter");
  // 
  const task = { id: randomUUID(), title: cleanTitle, done: false, createdAt: Date.now() };
  tasks.unshift(task);
  return task;
};

exports.update = (id, payload) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) return null;

  if (payload.title !== undefined) {
    //  Validasi Soal No 1 
    const cleanTitle = String(payload.title).trim();
    if (!cleanTitle) throw new AppError(400, "title wajib diisi");
    if (cleanTitle.length > 120) throw new AppError(400, "title maksimal 120 karakter");
    
    task.title = cleanTitle;
  }

  if (payload.done !== undefined) {
    task.done = payload.done;
  }

  return task;
};

exports.remove = (id) => {
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return tasks.splice(index, 1)[0];
};