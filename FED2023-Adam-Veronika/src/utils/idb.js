// Define the database and store names
const DB_NAME = "barber_appointments";
const STORE_NAME = "appointments";

// Function to open the IndexedDB database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    // Event handler for database upgrade (schema changes)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true
      });

      // Create an index for searching by date
      store.createIndex("date", "date", { unique: false });
    };

    // Event handler for successful database opening
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    // Event handler for errors during database opening
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Function to add an appointment to the IndexedDB
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

// Function to retrieve appointments from the IndexedDB
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
