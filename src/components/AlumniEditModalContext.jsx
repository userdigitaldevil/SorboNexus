import React, { createContext, useContext, useState, useCallback } from "react";
import AlumniEditModal from "./AlumniEditModal";
import { jwtDecode } from "jwt-decode";

const AlumniEditModalContext = createContext();

export function useAlumniEditModal() {
  return useContext(AlumniEditModalContext);
}

export function AlumniEditModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [isAdmin, setIsAdmin] = useState(
    typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true"
  );

  // Open modal for a specific alumni
  const openEditModal = useCallback((alumni) => {
    setEditAlumni(alumni);
    setOpen(true);
  }, []);

  // Open modal for the current user
  const openEditSelfModal = useCallback(async (alumniList) => {
    console.log("openEditSelfModal called with:", alumniList);
    const token = localStorage.getItem("token");
    if (token && alumniList) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        const myAlumni = alumniList.find(
          (a) =>
            String(a._id) === String(decoded.alumniId) ||
            String(a.id) === String(decoded.alumniId)
        );
        console.log("Found myAlumni:", myAlumni);
        if (myAlumni) {
          setEditAlumni(myAlumni);
          setOpen(true);
          console.log("Modal opened successfully");
        } else {
          console.error("Could not find myAlumni in the list");
        }
      } catch (e) {
        console.error("Error in openEditSelfModal:", e);
      }
    } else {
      console.error("No token or alumniList provided");
    }
  }, []);

  const closeEditModal = useCallback(() => {
    setOpen(false);
    setEditAlumni(null);
  }, []);

  return (
    <AlumniEditModalContext.Provider
      value={{
        open,
        editAlumni,
        openEditModal,
        openEditSelfModal,
        closeEditModal,
        setEditAlumni,
        setOpen,
      }}
    >
      {children}
      <AlumniEditModal
        open={open}
        onClose={closeEditModal}
        alumni={editAlumni}
        setAlumni={setEditAlumni}
        isAdmin={isAdmin}
      />
    </AlumniEditModalContext.Provider>
  );
}
