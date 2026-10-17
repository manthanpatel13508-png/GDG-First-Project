const BASE_URL = '/api';

export const api = {
  async getStatus() {
    const res = await fetch(`${BASE_URL}/status`);
    return res.json();
  },

  async getConstants() {
    const res = await fetch(`${BASE_URL}/timetable/constants`);
    return res.json();
  },

  async getCollegeData() {
    const res = await fetch(`${BASE_URL}/data`);
    return res.json();
  },

  async resetSampleData() {
    const res = await fetch(`${BASE_URL}/reset-sample`, { method: 'POST' });
    return res.json();
  },

  async getLatestTimetable() {
    const res = await fetch(`${BASE_URL}/timetable/latest`);
    return res.json();
  },

  async optimize(params = {}) {
    const res = await fetch(`${BASE_URL}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async getDiagnostics() {
    const res = await fetch(`${BASE_URL}/diagnostics`);
    return res.json();
  },

  async saveFaculty(faculty) {
    const res = await fetch(`${BASE_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faculty),
    });
    return res.json();
  },

  async deleteFaculty(id) {
    const res = await fetch(`${BASE_URL}/faculty/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async saveClassroom(classroom) {
    const res = await fetch(`${BASE_URL}/classrooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classroom),
    });
    return res.json();
  },

  async deleteClassroom(id) {
    const res = await fetch(`${BASE_URL}/classrooms/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async saveBatch(batch) {
    const res = await fetch(`${BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    return res.json();
  },

  async deleteBatch(id) {
    const res = await fetch(`${BASE_URL}/batches/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async saveCourse(course) {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return res.json();
  },

  async deleteCourse(id) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });
    return res.json();
  },
};
