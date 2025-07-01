import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box>
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 3, textAlign: "center", color: "#888" }}
        >
          Last updated: July 2024
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SorboNexus is committed to protecting your privacy. This policy
          explains how we handle your data when you use our site, in accordance
          with the General Data Protection Regulation (GDPR) and French law.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          1. Data Controller
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The data controller for SorboNexus is Seth Aguila
          (sethaguila@icloud.com), based in France.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          2. No Cookies or Tracking
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SorboNexus does not use cookies for tracking, analytics, or
          advertising. We do not use third-party trackers or ad networks.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          3. Authentication and Local Storage
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Authentication tokens are stored in your browser's localStorage to
          keep you logged in. No sensitive information is stored in localStorage
          beyond what is necessary for authentication.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          4. Data You Provide
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          When you create or update your alumni profile, you provide information
          such as your name, degree, email, and professional details. This
          information is only used to display your profile to other users and is
          not shared with third parties.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          5. Legal Basis for Processing
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The legal basis for processing your data is your consent and the
          legitimate interest of providing a community platform for alumni and
          students.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          6. Data Subject Rights (GDPR)
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Under the GDPR, you have the right to access, rectify, erase,
          restrict, or object to the processing of your personal data. You may
          also request a copy of your data or withdraw your consent at any time.
          To exercise these rights, contact sethaguila@icloud.com.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          7. Data Security
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We take reasonable measures to protect your data, but no website can
          guarantee absolute security. Please use a strong password and do not
          share your login credentials.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          8. Data Retention
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your data is retained only as long as necessary to provide the service
          or as required by law. You may request deletion of your profile at any
          time.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          9. International Data Transfers
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your data is stored in the European Union. We do not transfer your
          data outside the EU.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          10. Not an Official Sorbonne Université Site
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SorboNexus is an independent, non-official platform and is not
          affiliated with or endorsed by Sorbonne Université.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          11. Changes to This Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This policy may be updated at any time. Continued use of the site
          constitutes acceptance of the new policy.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          12. Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          For any questions or requests regarding your data, contact:
          sethaguila@icloud.com
        </Typography>
      </Box>
    </Container>
  );
}
