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
    // Revert to ordering by created_at to ensure we get ALL projects (even those without sort_order)
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    
    let projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side Sort:
    // If sort_order exists, use it. If not, push to end (or keep relative time order).
    // Using a large number for missing order ensures they append at the end initially, 
    // or we can treat them as 0 if we want them at top.
    
    projects.sort((a, b) => {
        const orderA = a.sort_order !== undefined ? a.sort_order : Number.MAX_SAFE_INTEGER;
        const orderB = b.sort_order !== undefined ? b.sort_order : Number.MAX_SAFE_INTEGER;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        // Secondary sort: created_at desc (if sort_order is same or both missing)
        // created_at is a Firestore timestamp { seconds, nanoseconds }
        const timeA = a.created_at?.seconds || 0;
        const timeB = b.created_at?.seconds || 0;
        return timeB - timeA;
    });
    
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const updateProjectOrder = async (projects) => {
  try {
    const batch = writeBatch(db);
    projects.forEach((project, index) => {
      const ref = doc(db, PROJECTS_COLLECTION, project.id);
      batch.update(ref, { sort_order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error updating project order:", error);
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
    
    if (parseInt(project.max_participants) !== 0 && countSnapshot.size >= parseInt(project.max_participants)) {
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
