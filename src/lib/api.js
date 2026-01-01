import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

const PROJECTS_COLLECTION = "projects";
const REGISTRATIONS_COLLECTION = "registrations";

// --- Projects CRUD ---

export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      created_at: serverTimestamp(),
      active: true
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const getProject = async (id) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Project not found");
    }
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
};

export const updateProject = async (id, data) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(docRef, { ...data, updated_at: serverTimestamp() });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const batch = writeBatch(db);
    
    // 1. Get all registrations for this project
    const q = query(collection(db, REGISTRATIONS_COLLECTION), where("project_id", "==", id));
    const regSnapshot = await getDocs(q);
    
    // 2. Add registration deletions to batch
    regSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // 3. Add project deletion to batch
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    batch.delete(projectRef);
    
    // 4. Commit batch
    await batch.commit();
  } catch (error) {
    console.error("Error deleting project and registrations:", error);
    throw error;
  }
};

// --- Registrations ---

export const registerParticipant = async (projectId, registrationData) => {
  try {
    // 1. Check if max participants reached (This is a soft check, for strict check use transactions)
    // For this app size, a standard read-then-write is acceptable, or use a simpler counter approach.
    // However, to strictly follow "if limit >= max", we should check count first.
    
    // Check current count
    const q = query(collection(db, REGISTRATIONS_COLLECTION), where("project_id", "==", projectId));
    const countSnapshot = await getDocs(q); // NOTE: This is expensive if thousands, but okay for small scale.
    // Optimization: Store registration_count on project document and use increment.
    
    // Get project settings
    const project = await getProject(projectId);
    if (!project) throw new Error("Project not found");
    
    if (countSnapshot.size >= parseInt(project.max_participants)) {
      throw new Error("Registration Full (名額已滿)");
    }

    // 2. Add registration
    // Find name field for search indexing
    const nameField = project.fields?.find(f => f.label === "姓名" || f.label === "Name") || project.fields?.[0]
    const searchName = nameField ? (registrationData[nameField.id] || "") : ""

    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
      project_id: projectId,
      data: registrationData,
      created_at: serverTimestamp(),
      search_name: searchName
    });
    return docRef.id;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const getRegistrations = async (projectId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION), 
      where("project_id", "==", projectId),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting registrations:", error);
    throw error;
  }
};

// Check for duplicate registration by Name (and maybe phone if available, but spec says Name)
export const checkDuplicate = async (projectId, name) => {
  try {
    // Note: This requires an index on [project_id, data.Name] or similar.
    // Since 'data' is a map, querying 'data.Name' works if the field key is 'Name'.
    // To be safer, we should ensure the name field is consistently named or store it at top level.
    // I added 'search_name' to the write operation for this purpose.
    
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where("project_id", "==", projectId),
      where("search_name", "==", name)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert timestamp to date string
      const date = data.created_at ? data.created_at.toDate().toLocaleString() : "Unknown";
      return {
        name: data.search_name,
        registered_at: date
      };
    });
  } catch (error) {
    console.error("Error checking duplicate:", error);
    throw error;
  }
};
