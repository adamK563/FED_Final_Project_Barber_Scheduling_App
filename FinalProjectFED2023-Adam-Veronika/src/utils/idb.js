const DB_NAME = "barber_appointments";
const STORE_NAME = "appointments";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true
      });
      store.createIndex("date", "date", { unique: false });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const addAppointment = async (appointment) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.add(appointment);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const getAppointments = async () => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const index = store.index("date");
  const range = IDBKeyRange.lowerBound(new Date(), true);

  return new Promise((resolve, reject) => {
    const request = index.openCursor(range);
    const appointments = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        appointments.push(cursor.value);
        cursor.continue();
      } else {
        resolve(appointments);
      }
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export { addAppointment, getAppointments };
